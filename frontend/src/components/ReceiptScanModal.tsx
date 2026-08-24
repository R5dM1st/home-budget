import { useEffect, useMemo, useState } from "react";
import { createWorker } from "tesseract.js";

import Modal from "./Modal";

import type {
  Account,
  Category,
  TransactionPayload,
} from "../types/finance";


type Props = {
  open: boolean;
  accounts: Account[];
  categories: Category[];
  onClose: () => void;
  onSubmit: (payload: TransactionPayload) => Promise<void>;
};


const inputClass =
  "mt-1.5 w-full rounded-2xl border border-slate-200 bg-white px-3.5 py-3 text-sm font-medium text-slate-900 outline-none transition focus:border-[var(--accent)] dark:border-slate-700 dark:bg-slate-950 dark:text-white";

const labelClass =
  "text-xs font-bold uppercase tracking-[0.12em] text-slate-400";


function extractAmount(text: string): string {
  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);

  const totalKeywords = [
    "TOTAL",
    "TOTAL TTC",
    "NET A PAYER",
    "NET À PAYER",
    "A PAYER",
    "À PAYER",
    "MONTANT",
  ];

  for (const line of lines.reverse()) {
    const upper = line.toUpperCase();

    if (!totalKeywords.some((keyword) => upper.includes(keyword))) {
      continue;
    }

    const matches = line.match(/\d+[.,]\d{2}/g);

    if (matches && matches.length > 0) {
      return matches[matches.length - 1].replace(",", ".");
    }
  }

  const fallbackMatches = text.match(/\d+[.,]\d{2}/g);

  if (!fallbackMatches) {
    return "";
  }

  const values = fallbackMatches
    .map((value) => Number(value.replace(",", ".")))
    .filter((value) => Number.isFinite(value) && value > 0 && value < 100000);

  if (values.length === 0) {
    return "";
  }

  return Math.max(...values).toFixed(2);
}


function extractDate(text: string): string {
  const match = text.match(
    /\b(\d{1,2})[\/.\-](\d{1,2})[\/.\-](\d{2,4})\b/,
  );

  if (!match) {
    return new Date().toISOString().slice(0, 10);
  }

  const day = match[1].padStart(2, "0");
  const month = match[2].padStart(2, "0");

  let year = match[3];

  if (year.length === 2) {
    year = `20${year}`;
  }

  return `${year}-${month}-${day}`;
}


function extractMerchant(text: string): string {
  const ignoredWords = [
    "TICKET",
    "RECU",
    "REÇU",
    "MERCI",
    "TVA",
    "TOTAL",
    "CARTE",
    "CB",
    "EUR",
  ];

  const lines = text
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line.length >= 3);

  for (const line of lines.slice(0, 10)) {
    const upper = line.toUpperCase();

    const hasLetters = /[A-ZÀ-ÿ]{3,}/i.test(line);

    const ignored = ignoredWords.some((word) =>
      upper.includes(word),
    );

    if (hasLetters && !ignored) {
      return line
        .replace(/[^\p{L}\p{N}\s&'.-]/gu, "")
        .trim()
        .slice(0, 255);
    }
  }

  return "Ticket scanné";
}


function findCategory(
  merchant: string,
  text: string,
  categories: Category[],
): number | null {
  const normalized = `${merchant} ${text}`.toLowerCase();

  const rules: Array<{
    category: string;
    keywords: string[];
  }> = [
    {
      category: "Courses",
      keywords: [
        "carrefour",
        "auchan",
        "leclerc",
        "intermarch",
        "monoprix",
        "lidl",
        "aldi",
        "casino",
        "franprix",
        "super u",
      ],
    },
    {
      category: "Transport",
      keywords: [
        "totalenergies",
        "total energies",
        "shell",
        "esso",
        "bp ",
        "sncf",
        "ratp",
        "uber",
        "bolt",
      ],
    },
    {
      category: "Santé",
      keywords: [
        "pharmacie",
        "pharmacy",
        "docteur",
        "medical",
      ],
    },
    {
      category: "Abonnements",
      keywords: [
        "netflix",
        "spotify",
        "disney",
        "canal+",
        "youtube premium",
      ],
    },
    {
      category: "Shopping",
      keywords: [
        "amazon",
        "fnac",
        "darty",
        "ikea",
        "zara",
        "uniqlo",
        "decathlon",
      ],
    },
    {
      category: "Loisirs",
      keywords: [
        "cinema",
        "cinéma",
        "restaurant",
        "mcdonald",
        "burger king",
        "kfc",
        "bar ",
      ],
    },
    {
      category: "Factures",
      keywords: [
        "edf",
        "engie",
        "orange",
        "sfr",
        "bouygues",
        "free mobile",
      ],
    },
  ];

  for (const rule of rules) {
    if (
      rule.keywords.some((keyword) =>
        normalized.includes(keyword),
      )
    ) {
      const category = categories.find(
        (item) =>
          item.type === "expense" &&
          item.name.toLowerCase() === rule.category.toLowerCase(),
      );

      if (category) {
        return category.id;
      }
    }
  }

  const other = categories.find(
    (category) =>
      category.type === "expense" &&
      category.name.toLowerCase() === "autre",
  );

  return other?.id ?? null;
}


export default function ReceiptScanModal({
  open,
  accounts,
  categories,
  onClose,
  onSubmit,
}: Props) {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);

  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [amount, setAmount] = useState("");
  const [accountId, setAccountId] = useState("");
  const [categoryId, setCategoryId] = useState("");

  const [progress, setProgress] = useState(0);
  const [scanning, setScanning] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const expenseCategories = useMemo(
    () =>
      categories.filter(
        (category) => category.type === "expense",
      ),
    [categories],
  );


  useEffect(() => {
    if (!open) {
      return;
    }

    setFile(null);
    setPreview(null);
    setDescription("");
    setDate(new Date().toISOString().slice(0, 10));
    setAmount("");
    setCategoryId("");
    setProgress(0);
    setError(null);

    if (accounts.length > 0) {
      setAccountId(String(accounts[0].id));
    }
  }, [open, accounts]);


  function selectFile(selectedFile: File | null) {
    if (!selectedFile) {
      return;
    }

    setFile(selectedFile);

    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setPreview(URL.createObjectURL(selectedFile));
  }


  async function scanReceipt() {
    if (!file) {
      return;
    }

    setScanning(true);
    setProgress(0);
    setError(null);

    try {
      const worker = await createWorker("fra", 1, {
        logger(message) {
          if (
            message.status === "recognizing text" &&
            typeof message.progress === "number"
          ) {
            setProgress(
              Math.round(message.progress * 100),
            );
          }
        },
      });

      const result = await worker.recognize(file);

      await worker.terminate();

      const text = result.data.text;

      const merchant = extractMerchant(text);
      const detectedDate = extractDate(text);
      const detectedAmount = extractAmount(text);

      const detectedCategory = findCategory(
        merchant,
        text,
        categories,
      );

      setDescription(merchant);
      setDate(detectedDate);
      setAmount(detectedAmount);

      if (detectedCategory !== null) {
        setCategoryId(String(detectedCategory));
      }

      if (!detectedAmount) {
        setError(
          "Le ticket a été lu, mais le montant total n'a pas été reconnu. Tu peux le saisir manuellement.",
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible d'analyser le ticket.",
      );
    } finally {
      setScanning(false);
    }
  }


  async function submit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setSaving(true);
    setError(null);

    try {
      await onSubmit({
        date,
        description,
        type: "expense",
        amount,
        source_account_id: Number(accountId),
        destination_account_id: null,
        category_id: categoryId
          ? Number(categoryId)
          : null,
        notes: "Ajoutée depuis un ticket scanné",
      });

      onClose();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Impossible d'ajouter la transaction.",
      );
    } finally {
      setSaving(false);
    }
  }


  return (
    <Modal
      open={open}
      title="Scanner un ticket"
      subtitle="Prends une photo et Home Budget prépare automatiquement la dépense."
      onClose={onClose}
      size="lg"
    >
      <div className="space-y-5">

        <label className="block cursor-pointer rounded-3xl border-2 border-dashed border-slate-200 p-6 text-center transition hover:border-[var(--accent)] dark:border-slate-700">
          <input
            type="file"
            accept="image/*"
            capture="environment"
            className="hidden"
            onChange={(event) =>
              selectFile(
                event.target.files?.[0] ?? null,
              )
            }
          />

          <div className="text-4xl">
            📷
          </div>

          <p className="mt-3 font-black text-slate-900 dark:text-white">
            Prendre une photo
          </p>

          <p className="mt-1 text-sm text-slate-500">
            ou sélectionner une image du ticket
          </p>
        </label>


        {preview ? (
          <img
            src={preview}
            alt="Ticket à analyser"
            className="max-h-72 w-full rounded-3xl bg-slate-100 object-contain"
          />
        ) : null}


        {file ? (
          <button
            type="button"
            disabled={scanning}
            onClick={() => void scanReceipt()}
            className="w-full rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-black text-white disabled:opacity-60"
          >
            {scanning
              ? `Analyse du ticket… ${progress}%`
              : "Analyser le ticket"}
          </button>
        ) : null}


        {error ? (
          <div className="rounded-2xl bg-amber-50 p-4 text-sm font-semibold text-amber-800 dark:bg-amber-950/30 dark:text-amber-200">
            {error}
          </div>
        ) : null}


        {description || amount ? (
          <form
            onSubmit={submit}
            className="space-y-5 border-t border-slate-200 pt-5 dark:border-slate-800"
          >
            <div className="grid gap-4 sm:grid-cols-2">

              <label>
                <span className={labelClass}>
                  Date
                </span>

                <input
                  type="date"
                  className={inputClass}
                  required
                  value={date}
                  onChange={(event) =>
                    setDate(event.target.value)
                  }
                />
              </label>


              <label>
                <span className={labelClass}>
                  Montant
                </span>

                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  className={inputClass}
                  required
                  value={amount}
                  onChange={(event) =>
                    setAmount(event.target.value)
                  }
                />
              </label>

            </div>


            <label className="block">
              <span className={labelClass}>
                Commerçant
              </span>

              <input
                className={inputClass}
                required
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
              />
            </label>


            <div className="grid gap-4 sm:grid-cols-2">

              <label>
                <span className={labelClass}>
                  Compte utilisé
                </span>

                <select
                  className={inputClass}
                  required
                  value={accountId}
                  onChange={(event) =>
                    setAccountId(event.target.value)
                  }
                >
                  <option value="">
                    Choisir…
                  </option>

                  {accounts.map((account) => (
                    <option
                      key={account.id}
                      value={account.id}
                    >
                      {account.name}
                    </option>
                  ))}
                </select>
              </label>


              <label>
                <span className={labelClass}>
                  Catégorie
                </span>

                <select
                  className={inputClass}
                  value={categoryId}
                  onChange={(event) =>
                    setCategoryId(event.target.value)
                  }
                >
                  <option value="">
                    Sans catégorie
                  </option>

                  {expenseCategories.map(
                    (category) => (
                      <option
                        key={category.id}
                        value={category.id}
                      >
                        {category.name}
                      </option>
                    ),
                  )}
                </select>
              </label>

            </div>


            <div className="flex justify-end gap-2">

              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl px-4 py-3 text-sm font-bold text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                Annuler
              </button>

              <button
                disabled={saving || !accountId}
                className="rounded-2xl bg-[var(--accent)] px-5 py-3 text-sm font-black text-white disabled:opacity-60"
              >
                {saving
                  ? "Ajout…"
                  : "Ajouter la dépense"}
              </button>

            </div>
          </form>
        ) : null}
      </div>
    </Modal>
  );
}