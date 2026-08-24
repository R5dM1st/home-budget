import { useState } from "react";
import ReceiptScanModal from "./components/ReceiptScanModal";
import AccountModal from "./components/AccountModal";
import BudgetLimitModal from "./components/BudgetLimitModal";
import BudgetModal from "./components/BudgetModal";
import ErrorBanner from "./components/ErrorBanner";
import GoalModal from "./components/GoalModal";
import LoadingScreen from "./components/LoadingScreen";
import MobileNav from "./components/MobileNav";
import RecurringModal from "./components/RecurringModal";
import Sidebar, { type AppView } from "./components/Sidebar";
import Topbar from "./components/Topbar";
import TransactionModal from "./components/TransactionModal";
import { useFinance } from "./hooks/useFinance";
import { useTheme } from "./hooks/useTheme";
import AccountsPage from "./pages/AccountsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import BudgetsPage from "./pages/BudgetsPage";
import DashboardPage from "./pages/DashboardPage";
import GoalsPage from "./pages/GoalsPage";
import RecurringPage from "./pages/RecurringPage";
import SettingsPage from "./pages/SettingsPage";
import TransactionsPage from "./pages/TransactionsPage";
import type { Account, RecurringTransaction, SavingGoal, Transaction } from "./types/finance";

function App() {
  const [activeView, setActiveView] = useState<AppView>("dashboard");
  const [transactionOpen, setTransactionOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [accountOpen, setAccountOpen] = useState(false);
  const [editingAccount, setEditingAccount] = useState<Account | null>(null);
  const [budgetOpen, setBudgetOpen] = useState(false);
  const [limitOpen, setLimitOpen] = useState(false);
  const [recurringOpen, setRecurringOpen] = useState(false);
  const [editingRecurring, setEditingRecurring] = useState<RecurringTransaction | null>(null);
  const [goalOpen, setGoalOpen] = useState(false);
  const [editingGoal, setEditingGoal] = useState<SavingGoal | null>(null);
  const [receiptScanOpen, setReceiptScanOpen] =
  useState(false);

  const finance = useFinance();
  const theme = useTheme();

  function openNewTransaction() { setEditingTransaction(null); setTransactionOpen(true); }
  function openEditTransaction(transaction: Transaction) { setEditingTransaction(transaction); setTransactionOpen(true); }
  function openNewAccount() { setEditingAccount(null); setAccountOpen(true); }
  function openEditAccount(account: Account) { setEditingAccount(account); setAccountOpen(true); }
  function openNewRecurring() { setEditingRecurring(null); setRecurringOpen(true); }
  function openEditRecurring(item: RecurringTransaction) { setEditingRecurring(item); setRecurringOpen(true); }
  function openNewGoal() { setEditingGoal(null); setGoalOpen(true); }
  function openEditGoal(goal: SavingGoal) { setEditingGoal(goal); setGoalOpen(true); }

  async function safeAction(action: () => Promise<void>) {
    try { await action(); }
    catch (err) { finance.setError(err instanceof Error ? err.message : "Une opération a échoué."); }
  }

  function renderPage() {
    if (!finance.summary) return null;
    switch (activeView) {
      case "transactions":
        return <TransactionsPage transactions={finance.transactions} accounts={finance.accounts} categories={finance.categories} onAdd={openNewTransaction} onEdit={openEditTransaction} onDelete={(transaction)=>void safeAction(async()=>{if(window.confirm(`Supprimer « ${transaction.description} » ?`)) await finance.removeTransaction(transaction);})}/>;
      case "accounts":
        return <AccountsPage accounts={finance.accounts} onAdd={openNewAccount} onEdit={openEditAccount} onArchive={(account)=>void safeAction(async()=>{if(window.confirm(`Archiver le compte « ${account.name} » ?`)) await finance.archiveAccount(account);})}/>;
      case "budgets":
        return <BudgetsPage year={finance.year} month={finance.month} summary={finance.summary} limits={finance.budgetLimits} expenseCategories={finance.expenseCategories} onEditBudget={()=>setBudgetOpen(true)} onAddLimit={()=>setLimitOpen(true)} onDeleteLimit={(categoryId)=>void safeAction(()=>finance.removeBudgetLimit(categoryId))}/>;
      case "analytics":
        return <AnalyticsPage summary={finance.summary} categories={finance.categorySpending} daily={finance.daily} history={finance.history}/>;
      case "recurring":
        return <RecurringPage items={finance.recurring} onAdd={openNewRecurring} onEdit={openEditRecurring} onDelete={(item)=>void safeAction(async()=>{if(window.confirm(`Supprimer la récurrence « ${item.name} » ?`)) await finance.removeRecurring(item);})} onGenerate={()=>void safeAction(async()=>{const count=await finance.generateDue();window.alert(`${count} transaction(s) générée(s).`);})}/>;
      case "goals":
        return <GoalsPage goals={finance.goals} onAdd={openNewGoal} onEdit={openEditGoal} onDelete={(goal)=>void safeAction(async()=>{if(window.confirm(`Supprimer l’objectif « ${goal.name} » ?`)) await finance.removeGoal(goal);})}/>;
      case "settings":
        return <SettingsPage theme={theme.theme} accent={theme.accent} onThemeChange={theme.setTheme} onAccentChange={theme.setAccent} onNavigate={setActiveView}/>;
      default:
        return <DashboardPage year={finance.year} month={finance.month} summary={finance.summary} accounts={finance.accounts} transactions={finance.transactions} categorySpending={finance.categorySpending} daily={finance.daily} goals={finance.goals} onAddTransaction={openNewTransaction} onOpenAccounts={()=>setActiveView("accounts")} onEditTransaction={openEditTransaction}/>;
    }
  }

  return (
    <div className="min-h-screen bg-[#f7f8fb] text-slate-900 transition-colors dark:bg-slate-950 dark:text-slate-100">
      <Sidebar activeView={activeView} onNavigate={setActiveView}/>
      <div className="lg:pl-72">
        <Topbar
  year={finance.year}
  month={finance.month}
  onYearChange={finance.setYear}
  onMonthChange={finance.setMonth}
  onPrevious={finance.previousMonth}
  onNext={finance.nextMonth}
  onAddTransaction={openNewTransaction}
  onScanReceipt={() => setReceiptScanOpen(true)}
/>
        <main className="mx-auto max-w-[1560px] px-4 pb-28 pt-7 sm:px-6 lg:px-8 lg:pb-10 lg:pt-9">
          {finance.error ? <ErrorBanner message={finance.error} onRetry={()=>void finance.refresh()}/> : null}
          {finance.isLoading && !finance.summary ? <LoadingScreen/> : renderPage()}
        </main>
      </div>
      <MobileNav activeView={activeView} onNavigate={setActiveView}/>

      <TransactionModal open={transactionOpen} transaction={editingTransaction} accounts={finance.accounts} categories={finance.categories} year={finance.year} month={finance.month} onClose={()=>{setTransactionOpen(false);setEditingTransaction(null);}} onSubmit={(payload)=>finance.saveTransaction(payload,editingTransaction)}/>
      <AccountModal open={accountOpen} account={editingAccount} onClose={()=>{setAccountOpen(false);setEditingAccount(null);}} onSubmit={(payload)=>finance.saveAccount(payload,editingAccount)}/>
      <BudgetModal open={budgetOpen} currentAmount={finance.summary?.budget??null} onClose={()=>setBudgetOpen(false)} onSubmit={finance.saveBudget}/>
      <BudgetLimitModal open={limitOpen} categories={finance.expenseCategories} onClose={()=>setLimitOpen(false)} onSubmit={finance.saveBudgetLimit}/>
      <RecurringModal open={recurringOpen} item={editingRecurring} accounts={finance.accounts} categories={finance.categories} onClose={()=>{setRecurringOpen(false);setEditingRecurring(null);}} onSubmit={(payload)=>finance.saveRecurring(payload,editingRecurring)}/>
      <GoalModal open={goalOpen} goal={editingGoal} accounts={finance.accounts} onClose={()=>{setGoalOpen(false);setEditingGoal(null);}} onSubmit={(payload)=>finance.saveGoal(payload,editingGoal)}/>
      <ReceiptScanModal open={receiptScanOpen} accounts={finance.accounts} categories={finance.categories}  onClose={() => setReceiptScanOpen(false)}onSubmit={(payload) =>finance.saveTransaction(payload, null) }
/>

    </div>
  );
}

export default App;
