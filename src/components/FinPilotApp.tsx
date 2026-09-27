import React, { useState, useEffect, useMemo } from 'react';
import { 
  IndianRupee, TrendingUp, TrendingDown, PiggyBank, 
  Plus, Search, Filter, Trash2, Edit2, AlertTriangle, 
  CheckCircle2, AlertCircle, ArrowUpRight, ArrowDownLeft,
  Calendar, CreditCard, Tag, FileText, RefreshCw, LogOut,
  Terminal, ShieldCheck, Database, Layers, Download, X,
  ChevronRight, Sparkles, SlidersHorizontal, Check
} from 'lucide-react';
import { 
  FinPilotStore, Transaction, BudgetStatus, DashboardSummary, RequestLog 
} from '../services/apiEmulator';

interface Props {
  onOpenFlowLog?: () => void;
  onNavigateToCode?: (filename?: string) => void;
}

// Indian Rupee Currency Formatter
export const formatINR = (val: number, withDecimals: boolean = true) => {
  const num = Number(val || 0);
  return '₹' + num.toLocaleString('en-IN', {
    minimumFractionDigits: withDecimals ? 2 : 0,
    maximumFractionDigits: withDecimals ? 2 : 0,
  });
};

export const FinPilotApp: React.FC<Props> = ({ onOpenFlowLog, onNavigateToCode }) => {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'transactions' | 'budgets' | 'reports' | 'profile'>('dashboard');
  
  // Data state
  const [summary, setSummary] = useState<DashboardSummary>(FinPilotStore.getDashboardSummary());
  const [transactions, setTransactions] = useState<Transaction[]>(FinPilotStore.getTransactions());
  const [budgets, setBudgets] = useState<BudgetStatus[]>(FinPilotStore.getBudgetStatuses());
  const [monthlyTrend, setMonthlyTrend] = useState(FinPilotStore.getMonthlyTrend());
  const [categoryBreakdown, setCategoryBreakdown] = useState(FinPilotStore.getCategoryBreakdown());
  const [latestLog, setLatestLog] = useState<RequestLog | null>(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'INCOME' | 'EXPENSE'>('ALL');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  // Modals
  const [isTxModalOpen, setIsTxModalOpen] = useState(false);
  const [isBudgetModalOpen, setIsBudgetModalOpen] = useState(false);
  const [editingTx, setEditingTx] = useState<Transaction | null>(null);

  // Form states
  const [txForm, setTxForm] = useState({
    title: '',
    amount: '',
    type: 'EXPENSE' as 'INCOME' | 'EXPENSE',
    category: 'Food & Dining',
    transactionDate: new Date().toISOString().substring(0, 10),
    paymentMethod: 'UPI (Google Pay)',
    description: ''
  });

  const [budgetForm, setBudgetForm] = useState({
    category: 'Food & Dining',
    amount: '15000'
  });

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  const refreshAll = () => {
    setSummary(FinPilotStore.getDashboardSummary());
    setTransactions(FinPilotStore.getTransactions());
    setBudgets(FinPilotStore.getBudgetStatuses());
    setMonthlyTrend(FinPilotStore.getMonthlyTrend());
    setCategoryBreakdown(FinPilotStore.getCategoryBreakdown());
    const logs = FinPilotStore.getLogs();
    if (logs.length > 0) setLatestLog(logs[0]);
  };

  useEffect(() => {
    refreshAll();
    const unsub = FinPilotStore.subscribe(refreshAll);
    return unsub;
  }, []);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = q === '' || 
        t.title.toLowerCase().includes(q) || 
        t.description.toLowerCase().includes(q) ||
        t.category.toLowerCase().includes(q) ||
        t.paymentMethod.toLowerCase().includes(q);
      const matchesType = typeFilter === 'ALL' || t.type === typeFilter;
      const matchesCat = categoryFilter === 'ALL' || t.category === categoryFilter;
      return matchesSearch && matchesType && matchesCat;
    });
  }, [transactions, searchQuery, typeFilter, categoryFilter]);

  // Aggregate sums of filtered transactions
  const { filteredInflow, filteredOutflow, filteredNet } = useMemo(() => {
    let inflow = 0;
    let outflow = 0;
    for (const t of filteredTransactions) {
      if (t.type === 'INCOME') inflow += t.amount;
      else outflow += t.amount;
    }
    return {
      filteredInflow: inflow,
      filteredOutflow: outflow,
      filteredNet: inflow - outflow
    };
  }, [filteredTransactions]);

  const hasActiveFilters = searchQuery !== '' || typeFilter !== 'ALL' || categoryFilter !== 'ALL';

  const resetFilters = () => {
    setSearchQuery('');
    setTypeFilter('ALL');
    setCategoryFilter('ALL');
  };

  const handleOpenAddTx = (defaultType: 'INCOME' | 'EXPENSE' = 'EXPENSE') => {
    setEditingTx(null);
    setTxForm({
      title: '',
      amount: '',
      type: defaultType,
      category: defaultType === 'INCOME' ? 'Salary' : 'Food & Dining',
      transactionDate: new Date().toISOString().substring(0, 10),
      paymentMethod: defaultType === 'INCOME' ? 'Net Banking / NEFT' : 'UPI (Google Pay)',
      description: ''
    });
    setIsTxModalOpen(true);
  };

  const handleOpenEditTx = (tx: Transaction) => {
    setEditingTx(tx);
    setTxForm({
      title: tx.title,
      amount: tx.amount.toString(),
      type: tx.type,
      category: tx.category,
      transactionDate: tx.transactionDate,
      paymentMethod: tx.paymentMethod,
      description: tx.description
    });
    setIsTxModalOpen(true);
  };

  const handleSaveTransaction = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(txForm.amount);
    if (isNaN(amountVal) || amountVal <= 0) {
      showToast('Please enter a valid positive amount in Rupees (₹)', 'error');
      return;
    }
    if (!txForm.title.trim()) {
      showToast('Transaction title cannot be empty', 'error');
      return;
    }

    if (editingTx) {
      FinPilotStore.updateTransaction(editingTx.id, {
        title: txForm.title,
        amount: amountVal,
        type: txForm.type,
        category: txForm.category,
        transactionDate: txForm.transactionDate,
        paymentMethod: txForm.paymentMethod,
        description: txForm.description
      });
      showToast(`Updated "${txForm.title}" in MySQL`);
    } else {
      FinPilotStore.addTransaction({
        title: txForm.title,
        amount: amountVal,
        type: txForm.type,
        category: txForm.category,
        transactionDate: txForm.transactionDate,
        paymentMethod: txForm.paymentMethod,
        description: txForm.description
      });
      showToast(`Saved "${txForm.title}" (${formatINR(amountVal)}) to MySQL`);
    }

    setIsTxModalOpen(false);
  };

  const handleDeleteTransaction = (id: number, title: string) => {
    FinPilotStore.deleteTransaction(id);
    showToast(`Deleted "${title}" from database`);
  };

  const handleSaveBudget = (e: React.FormEvent) => {
    e.preventDefault();
    const amountVal = parseFloat(budgetForm.amount);
    if (isNaN(amountVal) || amountVal <= 0) {
      showToast('Please enter a valid positive budget amount in Rupees (₹)', 'error');
      return;
    }
    FinPilotStore.upsertBudget(budgetForm.category, amountVal);
    showToast(`Budget for ${budgetForm.category} set to ${formatINR(amountVal, false)}`);
    setIsBudgetModalOpen(false);
  };

  const handleDeleteBudget = (id: number, cat: string) => {
    FinPilotStore.deleteBudget(id);
    showToast(`Budget for ${cat} removed`);
  };

  // CSV Export
  const handleExportCSV = () => {
    if (transactions.length === 0) {
      showToast('No transactions to export', 'error');
      return;
    }
    const headers = ['ID', 'Title', 'Type', 'Amount (INR)', 'Category', 'Date', 'Payment Method', 'Description'];
    const rows = transactions.map(t => [
      t.id,
      `"${t.title.replace(/"/g, '""')}"`,
      t.type,
      t.amount.toFixed(2),
      `"${t.category.replace(/"/g, '""')}"`,
      t.transactionDate,
      `"${t.paymentMethod.replace(/"/g, '""')}"`,
      `"${(t.description || '').replace(/"/g, '""')}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `finpilot_transactions_INR_${new Date().toISOString().substring(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Exported transactions to CSV in Rupees (₹)');
  };

  // Find maximum trend value for scale
  const maxTrendVal = Math.max(...monthlyTrend.map(t => Math.max(t.income, t.expense, 5000)));

  // Critical budget alert check
  const warningBudgets = budgets.filter(b => b.status === 'OVERBUDGET' || b.status === 'WARNING');

  // Total allocated vs total spent in current month
  const totalBudgetLimit = budgets.reduce((acc, b) => acc + b.budgetAmount, 0);
  const totalBudgetSpent = budgets.reduce((acc, b) => acc + b.actualSpent, 0);

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-black text-slate-100 overflow-hidden font-sans">
      {/* Top Banner indicating Core Java & MySQL Engine */}
      <div className="bg-[#080808] border-b border-zinc-900 px-4 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-3">
          <span className="flex items-center text-emerald-400 font-semibold gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            FinPilot Backend: Core Java (com.sun.net.httpserver)
          </span>
          <span className="text-zinc-800">|</span>
          <span className="text-zinc-400 font-mono-num hidden sm:inline">
            JDBC Driver: MySQL Connector/J 8.3 • Port 8080
          </span>
          <span className="text-zinc-800 hidden md:inline">|</span>
          <span className="hidden md:inline-flex items-center text-emerald-400/90 font-mono-num bg-emerald-950/40 border border-emerald-800/40 px-2 py-0.5 rounded text-[11px]">
            Currency: Indian Rupee (₹ INR)
          </span>
        </div>

        <div className="flex items-center space-x-2">
          {latestLog && (
            <button
              onClick={onOpenFlowLog}
              className="flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-[#111111] hover:bg-[#1a1a1a] text-zinc-300 border border-zinc-800 transition"
              title="Inspect latest HTTP/SQL request flow"
            >
              <Terminal className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-mono-num text-[11px] truncate max-w-[180px]">
                {latestLog.method} {latestLog.endpoint}
              </span>
              <span className="bg-emerald-950/50 text-emerald-400 border border-emerald-800/40 px-1 rounded text-[10px] font-mono-num">
                {latestLog.status}
              </span>
            </button>
          )}

          <button
            onClick={() => {
              FinPilotStore.resetToDefaults();
              showToast('Sample dataset reloaded into MySQL schema');
            }}
            className="flex items-center space-x-1 text-zinc-400 hover:text-emerald-400 px-2.5 py-1 rounded-lg bg-[#111111] border border-zinc-800/60 transition text-xs"
            title="Reset to default seed data"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Seed Data</span>
          </button>
        </div>
      </div>

      {/* Main App Layout */}
      <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
        {/* Navigation Sidebar */}
        <aside className="w-full md:w-64 bg-[#080808] border-r border-zinc-900 flex flex-col justify-between shrink-0 p-4">
          <div className="space-y-6">
            {/* Logo */}
            <div className="flex items-center space-x-3 px-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-950/40 text-emerald-400 flex items-center justify-center border border-emerald-800/40 shadow-inner shadow-emerald-950">
                <PiggyBank className="w-6 h-6" />
              </div>
              <div>
                <div className="text-lg font-bold text-white tracking-tight flex items-center gap-1">
                  Fin<span className="text-emerald-400">Pilot</span>
                </div>
                <div className="text-[11px] text-zinc-400 font-mono-num">INR ₹ • Java + MySQL</div>
              </div>
            </div>

            {/* Nav tabs */}
            <nav className="space-y-1">
              <button
                onClick={() => setActiveTab('dashboard')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition ${
                  activeTab === 'dashboard'
                    ? 'bg-[#0d1e16] text-emerald-400 border border-emerald-800/60 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-[#121212]'
                }`}
              >
                <Layers className="w-4 h-4 text-emerald-400" />
                <span>Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab('transactions')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition ${
                  activeTab === 'transactions'
                    ? 'bg-[#0d1e16] text-emerald-400 border border-emerald-800/60 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-[#121212]'
                }`}
              >
                <FileText className="w-4 h-4 text-emerald-400" />
                <span>Transactions</span>
                <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-black text-emerald-400 font-mono-num border border-zinc-800">
                  {transactions.length}
                </span>
              </button>

              <button
                onClick={() => setActiveTab('budgets')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition ${
                  activeTab === 'budgets'
                    ? 'bg-[#0d1e16] text-emerald-400 border border-emerald-800/60 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-[#121212]'
                }`}
              >
                <AlertTriangle className="w-4 h-4 text-emerald-400" />
                <span>Budgets & Alerts</span>
                {budgets.some(b => b.status === 'OVERBUDGET') && (
                  <span className="ml-auto w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                )}
              </button>

              <button
                onClick={() => setActiveTab('reports')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition ${
                  activeTab === 'reports'
                    ? 'bg-[#0d1e16] text-emerald-400 border border-emerald-800/60 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-[#121212]'
                }`}
              >
                <TrendingUp className="w-4 h-4 text-emerald-400" />
                <span>Monthly Reports</span>
              </button>

              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center space-x-3 px-3.5 py-2.5 rounded-xl font-medium text-sm transition ${
                  activeTab === 'profile'
                    ? 'bg-[#0d1e16] text-emerald-400 border border-emerald-800/60 shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-100 hover:bg-[#121212]'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Profile & Stack</span>
              </button>
            </nav>
          </div>

          {/* User footer badge */}
          <div className="pt-4 border-t border-zinc-900">
            <div className="flex items-center justify-between px-2.5 py-2 rounded-xl bg-[#0f0f0f] border border-zinc-800/80">
              <div className="flex items-center space-x-2.5 overflow-hidden">
                <div className="w-8 h-8 rounded-full bg-emerald-950/40 text-emerald-400 flex items-center justify-center font-bold text-xs shrink-0 border border-emerald-800/40">
                  AM
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs font-semibold text-white truncate">Arjun Mehta</p>
                  <p className="text-[10px] text-zinc-400 truncate font-mono-num">arjun@finpilot.dev</p>
                </div>
              </div>
              <button
                onClick={() => showToast('Session active (FINPILOT_SESSION with Core Java BCrypt auth)')}
                className="text-zinc-400 hover:text-emerald-400 p-1 transition"
                title="Active Session"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </aside>

        {/* Content View Area */}
        <main className="flex-1 flex flex-col min-h-0 overflow-y-auto bg-black">
          {/* Header Action Bar */}
          <header className="bg-black/95 backdrop-blur border-b border-zinc-900 px-6 py-4 flex flex-col sm:flex-row gap-3 sm:items-center justify-between sticky top-0 z-10 shadow-xl shadow-black/80">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-white capitalize tracking-tight">
                  {activeTab === 'dashboard' && 'Financial Overview'}
                  {activeTab === 'transactions' && 'All Transactions'}
                  {activeTab === 'budgets' && 'Spending Budgets & Limits'}
                  {activeTab === 'reports' && 'Income vs Expense Analytics'}
                  {activeTab === 'profile' && 'User Account & System Architecture'}
                </h2>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-950/50 text-emerald-400 border border-emerald-800/40 font-mono-num">
                  ₹ INR
                </span>
              </div>
              <p className="text-xs text-zinc-400 mt-0.5">
                September 2026 • Real-time JDBC MySQL aggregation in Indian Rupees
              </p>
            </div>

            <div className="flex items-center space-x-2.5">
              <button
                onClick={handleExportCSV}
                className="flex items-center space-x-1.5 bg-[#111111] hover:bg-[#181818] text-zinc-300 hover:text-white border border-zinc-800 font-medium text-xs px-3 py-2 rounded-xl transition"
                title="Download CSV of all transactions"
              >
                <Download className="w-3.5 h-3.5 text-zinc-400" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>

              <button
                onClick={() => handleOpenAddTx('INCOME')}
                className="flex items-center space-x-1.5 bg-emerald-950/40 hover:bg-emerald-900/50 text-emerald-300 border border-emerald-800/50 font-semibold text-xs px-3 py-2 rounded-xl transition"
                title="Quick add income"
              >
                <Plus className="w-3.5 h-3.5 text-emerald-400" />
                <span>+ Income</span>
              </button>

              <button
                onClick={() => handleOpenAddTx('EXPENSE')}
                className="flex items-center space-x-1.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-lg shadow-emerald-950/50"
                title="Quick add expense"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>+ Expense</span>
              </button>
            </div>
          </header>

          {/* Toast Notification */}
          {toast && (
            <div className="fixed top-14 right-6 z-50 animate-bounce">
              <div className={`px-4 py-3 rounded-xl shadow-2xl flex items-center space-x-2 text-sm font-medium border ${
                toast.type === 'success' 
                  ? 'bg-[#111111] border-emerald-600/50 text-emerald-300' 
                  : 'bg-[#111111] border-rose-600/50 text-rose-300'
              }`}>
                {toast.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <AlertCircle className="w-4 h-4 text-rose-400" />}
                <span>{toast.message}</span>
              </div>
            </div>
          )}

          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <div className="p-6 space-y-6">
              {/* Friendly Budget Warning Banner if any category crossed 80% */}
              {warningBudgets.length > 0 && (
                <div className="bg-[#120d08] border border-amber-900/50 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 shadow-xl">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-xl bg-amber-950/60 border border-amber-800/50 text-amber-400 flex items-center justify-center shrink-0">
                      <AlertTriangle className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-amber-300">
                        Budget Attention Needed ({warningBudgets.length} Category{warningBudgets.length > 1 ? 'ies' : ''})
                      </h4>
                      <p className="text-xs text-amber-200/70">
                        {warningBudgets[0].category}: Spent {formatINR(warningBudgets[0].actualSpent)} of {formatINR(warningBudgets[0].budgetAmount)} limit ({warningBudgets[0].percentageUsed}%).
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setActiveTab('budgets')}
                    className="text-xs font-bold px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-700/50 transition whitespace-nowrap"
                  >
                    Manage Budgets →
                  </button>
                </div>
              )}

              {/* 4 Summary Metric Cards in Rupees */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Total Income */}
                <div className="bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl p-5 relative overflow-hidden shadow-2xl shadow-black/80 hover:border-zinc-700 transition">
                  <div className="flex items-center justify-between text-zinc-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Total Income</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-950/40 text-emerald-400 flex items-center justify-center border border-emerald-800/40">
                      <ArrowUpRight className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-emerald-400 font-num">
                    {formatINR(summary.totalIncome)}
                  </div>
                  <div className="text-xs text-zinc-400 mt-2 flex items-center gap-1 font-mono-num">
                    <span className="text-emerald-400 font-medium">↑ Current Month</span>
                    <span>deposit inflow</span>
                  </div>
                </div>

                {/* Total Expense */}
                <div className="bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl p-5 relative overflow-hidden shadow-2xl shadow-black/80 hover:border-zinc-700 transition">
                  <div className="flex items-center justify-between text-zinc-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Total Expenses</span>
                    <div className="w-8 h-8 rounded-lg bg-rose-950/40 text-rose-400 flex items-center justify-center border border-rose-900/40">
                      <ArrowDownLeft className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-rose-400 font-num">
                    {formatINR(summary.totalExpense)}
                  </div>
                  <div className="text-xs text-zinc-400 mt-2 flex items-center gap-1 font-mono-num">
                    <span className="text-rose-400 font-medium">↓ Current Month</span>
                    <span>outflows recorded</span>
                  </div>
                </div>

                {/* Net Savings */}
                <div className="bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl p-5 relative overflow-hidden shadow-2xl shadow-black/80 hover:border-zinc-700 transition">
                  <div className="flex items-center justify-between text-zinc-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Net Savings</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-950/40 text-emerald-400 flex items-center justify-center border border-emerald-800/40">
                      <IndianRupee className="w-4 h-4" />
                    </div>
                  </div>
                  <div className={`text-3xl font-bold font-num ${summary.netBalance >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {formatINR(summary.netBalance)}
                  </div>
                  <div className="text-xs text-zinc-400 mt-2 flex items-center gap-1 font-mono-num">
                    <span>Cumulative All-Time: </span>
                    <span className="text-zinc-200 font-medium font-num">{formatINR(summary.allTimeBalance, false)}</span>
                  </div>
                </div>

                {/* Savings Rate */}
                <div className="bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl p-5 relative overflow-hidden shadow-2xl shadow-black/80 hover:border-zinc-700 transition">
                  <div className="flex items-center justify-between text-zinc-400 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Savings Rate</span>
                    <div className="w-8 h-8 rounded-lg bg-emerald-950/40 text-emerald-300 flex items-center justify-center border border-emerald-800/40">
                      <PiggyBank className="w-4 h-4" />
                    </div>
                  </div>
                  <div className="text-3xl font-bold text-emerald-300 font-num">
                    {summary.savingsRate.toFixed(1)}%
                  </div>
                  {/* Progress bar */}
                  <div className="w-full bg-black h-2 rounded-full mt-3 overflow-hidden border border-zinc-800">
                    <div
                      className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-400 h-full rounded-full transition-all duration-500 shadow-sm"
                      style={{ width: `${Math.min(100, Math.max(0, summary.savingsRate))}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Quick Actions Row */}
              <div className="bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl p-4 flex flex-wrap items-center justify-between gap-3 shadow-xl">
                <div className="flex items-center space-x-2 text-xs font-semibold text-zinc-400">
                  <Sparkles className="w-4 h-4 text-emerald-400" />
                  <span>Quick Actions:</span>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={() => handleOpenAddTx('EXPENSE')}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-black hover:bg-[#141414] text-xs font-semibold text-rose-300 border border-rose-900/40 transition"
                  >
                    <span>+ Log Expense</span>
                  </button>
                  <button
                    onClick={() => handleOpenAddTx('INCOME')}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-black hover:bg-[#141414] text-xs font-semibold text-emerald-300 border border-emerald-900/40 transition"
                  >
                    <span>+ Log Income</span>
                  </button>
                  <button
                    onClick={() => setIsBudgetModalOpen(true)}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-black hover:bg-[#141414] text-xs font-semibold text-zinc-300 border border-zinc-800 transition"
                  >
                    <span>🎯 Set Category Budget</span>
                  </button>
                  <button
                    onClick={handleExportCSV}
                    className="flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-black hover:bg-[#141414] text-xs font-semibold text-zinc-300 border border-zinc-800 transition"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download CSV</span>
                  </button>
                </div>
              </div>

              {/* Visual Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* 6-Month Income vs Expense Bar Chart */}
                <div className="bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl p-5 lg:col-span-2 shadow-2xl shadow-black/80">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h3 className="font-bold text-white text-base">Cash Flow Trend (6 Months in ₹)</h3>
                      <p className="text-xs text-zinc-400">Monthly Income vs. Expense aggregated from MySQL</p>
                    </div>
                    <div className="flex items-center space-x-3 text-xs">
                      <span className="flex items-center gap-1.5 text-zinc-400">
                        <span className="w-3 h-3 rounded bg-emerald-500"></span> Income
                      </span>
                      <span className="flex items-center gap-1.5 text-zinc-400">
                        <span className="w-3 h-3 rounded bg-rose-500"></span> Expense
                      </span>
                    </div>
                  </div>

                  {/* SVG Bar Chart with Tooltips */}
                  <div className="h-64 flex items-end justify-between gap-3 pt-6 pb-2 px-2 border-b border-zinc-800">
                    {monthlyTrend.map((m, idx) => {
                      const incHeight = Math.round((m.income / maxTrendVal) * 190);
                      const expHeight = Math.round((m.expense / maxTrendVal) * 190);
                      return (
                        <div key={idx} className="flex-1 flex flex-col items-center group relative h-full justify-end">
                          {/* Tooltip on hover */}
                          <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition pointer-events-none bg-black border border-zinc-700 px-2.5 py-1 rounded-lg text-[11px] whitespace-nowrap z-20 shadow-2xl font-num">
                            <div>+{formatINR(m.income, false)} / -{formatINR(m.expense, false)}</div>
                            <div className="text-emerald-400 font-semibold">Net: {formatINR(m.net, false)}</div>
                          </div>

                          <div className="flex items-end space-x-1.5 w-full justify-center">
                            {/* Income bar (Emerald) */}
                            <div
                              style={{ height: `${incHeight}px` }}
                              className="w-4 sm:w-6 bg-emerald-500 rounded-t transition-all duration-300 hover:bg-emerald-400 shadow-sm shadow-emerald-500/30"
                            />
                            {/* Expense bar */}
                            <div
                              style={{ height: `${expHeight}px` }}
                              className="w-4 sm:w-6 bg-rose-500 rounded-t transition-all duration-300 hover:bg-rose-400"
                            />
                          </div>

                          <span className="text-[11px] font-mono-num text-zinc-400 mt-2 truncate w-full text-center">
                            {m.monthName.split(' ')[0]}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Expense by Category Breakdown */}
                <div className="bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl p-5 flex flex-col justify-between shadow-2xl shadow-black/80">
                  <div>
                    <h3 className="font-bold text-white text-base">Expense Distribution</h3>
                    <p className="text-xs text-zinc-400 mb-4">Category totals for September in ₹</p>

                    <div className="space-y-3">
                      {Object.entries(categoryBreakdown).slice(0, 5).map(([cat, amt], idx) => {
                        const pct = summary.totalExpense > 0 ? (amt / summary.totalExpense) * 100 : 0;
                        const colors = ['bg-emerald-500', 'bg-teal-400', 'bg-emerald-400', 'bg-emerald-600', 'bg-cyan-500'];
                        const color = colors[idx % colors.length];

                        return (
                          <div key={cat} className="space-y-1">
                            <div className="flex justify-between text-xs font-medium">
                              <span className="text-zinc-400 truncate max-w-[130px]">{cat}</span>
                              <span className="text-white font-num font-semibold">{formatINR(amt)} ({pct.toFixed(0)}%)</span>
                            </div>
                            <div className="w-full bg-black h-1.5 rounded-full overflow-hidden border border-zinc-800">
                              <div className={`${color} h-full rounded-full`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  <button
                    onClick={() => setActiveTab('reports')}
                    className="w-full mt-4 text-xs font-semibold py-2 rounded-xl bg-black hover:bg-[#141414] text-emerald-400 border border-zinc-800 transition text-center flex items-center justify-center gap-1.5"
                  >
                    <span>View Complete Report</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Recent Transactions Preview */}
              <div className="bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl p-5 shadow-2xl shadow-black/80">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-bold text-white text-base">Recent Transactions</h3>
                    <p className="text-xs text-zinc-400 font-mono-num">Queried via TransactionDAO.findFiltered()</p>
                  </div>
                  <button
                    onClick={() => setActiveTab('transactions')}
                    className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition flex items-center gap-1"
                  >
                    <span>View All ({transactions.length})</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="text-zinc-400 border-b border-zinc-800 text-xs uppercase font-medium">
                        <th className="pb-3">Title</th>
                        <th className="pb-3">Category</th>
                        <th className="pb-3">Date</th>
                        <th className="pb-3">Payment Method</th>
                        <th className="pb-3 text-right">Amount (₹)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/80 font-medium">
                      {summary.recentTransactions.map(tx => (
                        <tr key={tx.id} className="hover:bg-[#121212] transition">
                          <td className="py-3 text-white flex items-center gap-2">
                            <span className={`w-2 h-2 rounded-full ${tx.type === 'INCOME' ? 'bg-emerald-400' : 'bg-rose-400'}`} />
                            <span className="font-semibold">{tx.title}</span>
                          </td>
                          <td className="py-3 text-zinc-400 text-xs">
                            <span className="px-2 py-0.5 rounded-full bg-black text-emerald-400 border border-zinc-800">
                              {tx.category}
                            </span>
                          </td>
                          <td className="py-3 text-zinc-400 text-xs font-mono-num">{tx.transactionDate}</td>
                          <td className="py-3 text-zinc-400 text-xs">{tx.paymentMethod}</td>
                          <td className={`py-3 text-right font-num font-bold text-base ${tx.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'}`}>
                            {tx.type === 'INCOME' ? '+' : '-'}{formatINR(tx.amount)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: TRANSACTIONS (CRUD, SEARCH, FILTER, EXPORT) */}
          {activeTab === 'transactions' && (
            <div className="p-6 space-y-6">
              {/* Filter bar */}
              <div className="bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl p-4 flex flex-col md:flex-row gap-3 justify-between items-stretch md:items-center shadow-2xl shadow-black/80">
                <div className="flex flex-wrap gap-2.5 flex-1 items-center">
                  <div className="relative flex-1 min-w-[200px] max-w-md">
                    <Search className="w-4 h-4 absolute left-3 top-3 text-zinc-500" />
                    <input
                      type="text"
                      placeholder="Search title, category, method..."
                      value={searchQuery}
                      onChange={e => setSearchQuery(e.target.value)}
                      className="w-full bg-black border border-zinc-800 rounded-xl pl-9 pr-8 py-2 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500 transition"
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-2.5 text-zinc-500 hover:text-zinc-300"
                        title="Clear search"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <select
                    value={typeFilter}
                    onChange={e => setTypeFilter(e.target.value as any)}
                    className="bg-black border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
                  >
                    <option value="ALL">All Types</option>
                    <option value="INCOME">Income Only</option>
                    <option value="EXPENSE">Expense Only</option>
                  </select>

                  <select
                    value={categoryFilter}
                    onChange={e => setCategoryFilter(e.target.value)}
                    className="bg-black border border-zinc-800 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-emerald-500 transition"
                  >
                    <option value="ALL">All Categories</option>
                    <option value="Food & Dining">Food & Dining</option>
                    <option value="Housing & Rent">Housing & Rent</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Salary">Salary</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Investments">Investments</option>
                    <option value="Healthcare">Healthcare</option>
                  </select>

                  {hasActiveFilters && (
                    <button
                      onClick={resetFilters}
                      className="text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 transition"
                      title="Reset all active filters"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-between md:justify-end gap-3">
                  <button
                    onClick={handleExportCSV}
                    className="flex items-center space-x-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-black hover:bg-[#141414] text-zinc-300 border border-zinc-800 transition"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Export CSV</span>
                  </button>

                  <button
                    onClick={() => handleOpenAddTx('EXPENSE')}
                    className="flex items-center space-x-1.5 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-xs px-3.5 py-2 rounded-xl transition shadow-lg shadow-emerald-950/50"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Transaction</span>
                  </button>
                </div>
              </div>

              {/* Filtered Totals Summary Strip */}
              <div className="bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2 text-zinc-400 font-mono-num">
                  <span>Filtered: <strong className="text-white">{filteredTransactions.length}</strong> of {transactions.length} items</span>
                </div>
                <div className="flex items-center gap-4 font-mono-num">
                  <span className="text-emerald-400 font-semibold">
                    Inflow: +{formatINR(filteredInflow)}
                  </span>
                  <span className="text-rose-400 font-semibold">
                    Outflow: -{formatINR(filteredOutflow)}
                  </span>
                  <span className={`font-bold px-2 py-0.5 rounded border ${filteredNet >= 0 ? 'bg-emerald-950/40 text-emerald-300 border-emerald-800/40' : 'bg-rose-950/40 text-rose-300 border-rose-800/40'}`}>
                    Net: {formatINR(filteredNet)}
                  </span>
                </div>
              </div>

              {/* Transactions Table */}
              <div className="bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl shadow-black/80">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="bg-[#080808] text-zinc-400 border-b border-zinc-800 text-xs uppercase font-medium">
                        <th className="py-3.5 px-4">Transaction Details</th>
                        <th className="py-3.5 px-4">Type</th>
                        <th className="py-3.5 px-4">Category</th>
                        <th className="py-3.5 px-4">Date</th>
                        <th className="py-3.5 px-4">Payment Method</th>
                        <th className="py-3.5 px-4 text-right">Amount (₹)</th>
                        <th className="py-3.5 px-4 text-center">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/80 font-medium">
                      {filteredTransactions.length === 0 ? (
                        <tr>
                          <td colSpan={7} className="py-12 text-center text-zinc-500">
                            <div className="flex flex-col items-center justify-center space-y-2">
                              <FileText className="w-8 h-8 text-zinc-700" />
                              <p className="text-sm font-semibold text-zinc-400">No transactions match your criteria</p>
                              {hasActiveFilters && (
                                <button
                                  onClick={resetFilters}
                                  className="mt-2 text-xs font-semibold px-3 py-1.5 rounded-lg bg-black text-emerald-400 border border-zinc-800 hover:bg-[#141414] transition"
                                >
                                  Clear Filters
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ) : (
                        filteredTransactions.map(tx => (
                          <tr key={tx.id} className="hover:bg-[#121212] transition">
                            <td className="py-3 px-4">
                              <div className="font-semibold text-white tracking-tight">{tx.title}</div>
                              {tx.description && (
                                <div className="text-xs text-zinc-400 truncate max-w-xs">{tx.description}</div>
                              )}
                            </td>
                            <td className="py-3 px-4">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                                tx.type === 'INCOME' 
                                  ? 'bg-emerald-950/40 text-emerald-400 border border-emerald-800/40' 
                                  : 'bg-rose-950/40 text-rose-400 border border-rose-900/40'
                              }`}>
                                {tx.type}
                              </span>
                            </td>
                            <td className="py-3 px-4">
                              <span className="px-2 py-0.5 rounded-md bg-black text-zinc-300 border border-zinc-800 text-xs">
                                {tx.category}
                              </span>
                            </td>
                            <td className="py-3 px-4 text-xs font-mono-num text-zinc-400">{tx.transactionDate}</td>
                            <td className="py-3 px-4 text-xs text-zinc-400">{tx.paymentMethod}</td>
                            <td className={`py-3 px-4 text-right font-num font-bold tracking-tight text-base ${
                              tx.type === 'INCOME' ? 'text-emerald-400' : 'text-rose-400'
                            }`}>
                              {tx.type === 'INCOME' ? '+' : '-'}{formatINR(tx.amount)}
                            </td>
                            <td className="py-3 px-4 text-center">
                              <div className="flex items-center justify-center space-x-1">
                                <button
                                  onClick={() => handleOpenEditTx(tx)}
                                  className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-[#181818] transition"
                                  title="Edit Transaction"
                                >
                                  <Edit2 className="w-3.5 h-3.5" />
                                </button>
                                <button
                                  onClick={() => handleDeleteTransaction(tx.id, tx.title)}
                                  className="p-1.5 rounded-lg text-zinc-400 hover:text-rose-400 hover:bg-[#181818] transition"
                                  title="Delete Transaction"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: BUDGETS & ALERTS */}
          {activeTab === 'budgets' && (
            <div className="p-6 space-y-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <h3 className="text-xl font-bold text-white tracking-tight">Monthly Budgets & Alerts</h3>
                  <p className="text-xs text-zinc-400 mt-1">
                    Calculated by BudgetService: <span className="text-emerald-400 font-medium">Safe (&lt;80%)</span>, <span className="text-amber-400 font-medium">Warning (80-100%)</span>, <span className="text-rose-400 font-medium">Overbudget (&gt;100%)</span>
                  </p>
                </div>
                <button
                  onClick={() => setIsBudgetModalOpen(true)}
                  className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-bold text-sm px-4 py-2.5 rounded-xl transition flex items-center space-x-2 shadow-lg shadow-emerald-950/50"
                >
                  <Plus className="w-4 h-4" />
                  <span>Set Category Budget</span>
                </button>
              </div>

              {/* Budget Overview Strip */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl p-4 shadow-xl">
                  <div className="text-xs text-zinc-400 mb-1 font-semibold uppercase">Total Allocated Budget</div>
                  <div className="text-2xl font-bold text-white font-num">{formatINR(totalBudgetLimit, false)}</div>
                  <div className="text-xs text-zinc-500 mt-1">Across {budgets.length} active categories</div>
                </div>
                <div className="bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl p-4 shadow-xl">
                  <div className="text-xs text-zinc-400 mb-1 font-semibold uppercase">Total Spent So Far</div>
                  <div className="text-2xl font-bold text-rose-400 font-num">{formatINR(totalBudgetSpent, false)}</div>
                  <div className="text-xs text-zinc-500 mt-1">{totalBudgetLimit > 0 ? ((totalBudgetSpent / totalBudgetLimit) * 100).toFixed(0) : 0}% of budget spent</div>
                </div>
                <div className="bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl p-4 shadow-xl">
                  <div className="text-xs text-zinc-400 mb-1 font-semibold uppercase">Remaining Allowance</div>
                  <div className={`text-2xl font-bold font-num ${totalBudgetLimit - totalBudgetSpent >= 0 ? 'text-emerald-400' : 'text-rose-400'}`}>
                    {formatINR(Math.max(0, totalBudgetLimit - totalBudgetSpent), false)}
                  </div>
                  <div className="text-xs text-zinc-500 mt-1">Available for remainder of month</div>
                </div>
              </div>

              {/* Budgets Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {budgets.map(b => {
                  let statusBg = 'border-zinc-800/80 bg-[#0a0a0a]';
                  let badge = (
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 font-mono-num">
                      Normal ({b.percentageUsed}%)
                    </span>
                  );
                  let barColor = 'bg-gradient-to-r from-emerald-600 to-teal-400';

                  if (b.status === 'OVERBUDGET') {
                    statusBg = 'border-rose-950/80 bg-[#0a0a0a]';
                    badge = (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-rose-950/40 text-rose-400 border border-rose-900/40 flex items-center gap-1 font-mono-num">
                        <AlertCircle className="w-3 h-3" /> Exceeded! ({b.percentageUsed}%)
                      </span>
                    );
                    barColor = 'bg-gradient-to-r from-rose-600 to-rose-400';
                  } else if (b.status === 'WARNING') {
                    statusBg = 'border-amber-950/80 bg-[#0a0a0a]';
                    badge = (
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-amber-950/40 text-amber-400 border border-amber-900/40 flex items-center gap-1 font-mono-num">
                        <AlertTriangle className="w-3 h-3" /> Warning ({b.percentageUsed}%)
                      </span>
                    );
                    barColor = 'bg-gradient-to-r from-amber-600 to-amber-400';
                  }

                  return (
                    <div key={b.id} className={`border ${statusBg} rounded-2xl p-5 relative flex flex-col justify-between transition-all shadow-2xl shadow-black/80 hover:border-zinc-700`}>
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h4 className="font-bold text-white text-base tracking-tight">{b.category}</h4>
                          {badge}
                        </div>

                        <div className="flex justify-between items-baseline mb-2">
                          <span className="text-2xl font-bold text-white font-num tracking-tight">
                            {formatINR(b.actualSpent)}
                          </span>
                          <span className="text-xs text-zinc-400 font-mono-num">
                            limit: {formatINR(b.budgetAmount, false)}
                          </span>
                        </div>

                        {/* Progress bar */}
                        <div className="w-full bg-black h-2.5 rounded-full overflow-hidden mb-3 border border-zinc-800">
                          <div
                            className={`${barColor} h-full rounded-full transition-all duration-500 shadow-sm`}
                            style={{ width: `${Math.min(100, b.percentageUsed)}%` }}
                          />
                        </div>

                        <div className="flex justify-between text-xs text-zinc-400">
                          <span>Remaining:</span>
                          <span className={`font-mono-num font-semibold ${b.remaining === 0 ? 'text-rose-400' : 'text-zinc-200'}`}>
                            {formatINR(b.remaining)}
                          </span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-zinc-800/80 flex justify-between items-center">
                        <span className="text-[11px] text-zinc-500 font-mono-num">Sep 2026</span>
                        <button
                          onClick={() => handleDeleteBudget(b.id, b.category)}
                          className="text-xs text-zinc-400 hover:text-rose-400 p-1 transition"
                          title="Remove budget"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* TAB 4: REPORTS */}
          {activeTab === 'reports' && (
            <div className="p-6 space-y-6">
              <div className="bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl p-6 shadow-2xl shadow-black/80">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">Monthly Cash Flow Breakdown</h3>
                    <p className="text-xs text-zinc-400 mt-1">Calculated via TransactionService.getDetailedReports() in Indian Rupees (₹)</p>
                  </div>
                  <button
                    onClick={handleExportCSV}
                    className="flex items-center space-x-1.5 text-xs font-semibold px-3 py-2 rounded-xl bg-black hover:bg-[#141414] text-zinc-300 border border-zinc-800 transition"
                  >
                    <Download className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Download Report CSV</span>
                  </button>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-zinc-800 text-xs uppercase text-zinc-400 font-medium">
                        <th className="pb-3.5">Month</th>
                        <th className="pb-3.5 text-right">Total Income (₹)</th>
                        <th className="pb-3.5 text-right">Total Expenses (₹)</th>
                        <th className="pb-3.5 text-right">Net Savings (₹)</th>
                        <th className="pb-3.5 text-right">Savings Rate</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-800/80 font-num">
                      {monthlyTrend.map((m, idx) => {
                        const rate = m.income > 0 ? ((m.income - m.expense) / m.income) * 100 : 0;
                        return (
                          <tr key={idx} className="hover:bg-[#121212] transition">
                            <td className="py-3.5 font-semibold text-white font-sans">{m.monthName}</td>
                            <td className="py-3.5 text-right text-emerald-400 font-semibold">+{formatINR(m.income)}</td>
                            <td className="py-3.5 text-right text-rose-400 font-semibold">-{formatINR(m.expense)}</td>
                            <td className={`py-3.5 text-right font-bold text-base ${m.net >= 0 ? 'text-emerald-300' : 'text-rose-400'}`}>
                              {formatINR(m.net)}
                            </td>
                            <td className="py-3.5 text-right text-zinc-400 font-mono-num font-semibold">{rate.toFixed(1)}%</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PROFILE & STACK */}
          {activeTab === 'profile' && (
            <div className="p-6 max-w-3xl mx-auto space-y-6">
              <div className="bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl p-6 space-y-6 shadow-2xl shadow-black/80">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 rounded-2xl bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 flex items-center justify-center text-2xl font-bold shadow-inner">
                    AM
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white tracking-tight">Arjun Mehta</h3>
                    <p className="text-sm text-zinc-400 font-mono-num">arjun@finpilot.dev</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="inline-block text-[11px] bg-black text-emerald-400 border border-zinc-800 px-2.5 py-0.5 rounded font-mono-num">
                        Currency: INR (₹) • Indian Numbering Format
                      </span>
                    </div>
                  </div>
                </div>

                <div className="border-t border-zinc-800 pt-5 space-y-3">
                  <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">
                    Quick Reset & Seed Controls
                  </h4>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => {
                        FinPilotStore.resetToDefaults();
                        showToast('Reset sample data with Indian Rupees (₹) seed values');
                      }}
                      className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-black hover:bg-[#141414] text-emerald-400 border border-emerald-800/50 text-xs font-semibold transition"
                    >
                      <RefreshCw className="w-3.5 h-3.5" />
                      <span>Reset Sample Seed Data (₹)</span>
                    </button>

                    <button
                      onClick={handleExportCSV}
                      className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-black hover:bg-[#141414] text-zinc-300 border border-zinc-800 text-xs font-semibold transition"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Transaction Backup (CSV)</span>
                    </button>
                  </div>
                </div>

                <div className="border-t border-zinc-800 pt-5 space-y-3">
                  <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-widest">
                    System Architecture Specification
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                    <div className="bg-black border border-zinc-800 p-3.5 rounded-xl">
                      <span className="text-zinc-400 block mb-1">HTTP Server Container:</span>
                      <span className="text-emerald-400 font-mono-num font-semibold">
                        com.sun.net.httpserver.HttpServer
                      </span>
                    </div>
                    <div className="bg-black border border-zinc-800 p-3.5 rounded-xl">
                      <span className="text-zinc-400 block mb-1">Database Connectivity:</span>
                      <span className="text-emerald-400 font-mono-num font-semibold">
                        JDBC Driver (mysql-connector-j 8.3)
                      </span>
                    </div>
                    <div className="bg-black border border-zinc-800 p-3.5 rounded-xl">
                      <span className="text-zinc-400 block mb-1">JSON Parser:</span>
                      <span className="text-emerald-400 font-mono-num font-semibold">Google Gson 2.10.1</span>
                    </div>
                    <div className="bg-black border border-zinc-800 p-3.5 rounded-xl">
                      <span className="text-zinc-400 block mb-1">Password Hashing:</span>
                      <span className="text-emerald-400 font-mono-num font-semibold">BCrypt (Cost Factor 10)</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>

      {/* Transaction Modal (User-Friendly with Preset Chips & UPI) */}
      {isTxModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl w-full max-w-lg p-6 shadow-2xl shadow-black space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-lg tracking-tight">
                  {editingTx ? 'Edit Transaction' : 'Record New Transaction'}
                </h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 font-mono-num">
                  ₹ INR
                </span>
              </div>
              <button
                onClick={() => setIsTxModalOpen(false)}
                className="text-zinc-400 hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveTransaction} className="space-y-4">
              {/* Type Switcher Pills */}
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1.5">
                  Transaction Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setTxForm({ ...txForm, type: 'EXPENSE', category: txForm.category === 'Salary' ? 'Food & Dining' : txForm.category })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                      txForm.type === 'EXPENSE'
                        ? 'bg-rose-950/50 text-rose-300 border-rose-700/60 shadow-inner'
                        : 'bg-black text-zinc-400 border-zinc-800 hover:text-white'
                    }`}
                  >
                    <span>Expense Outflow (-)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setTxForm({ ...txForm, type: 'INCOME', category: txForm.category === 'Food & Dining' ? 'Salary' : txForm.category })}
                    className={`py-2 px-3 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border ${
                      txForm.type === 'INCOME'
                        ? 'bg-emerald-950/50 text-emerald-300 border-emerald-700/60 shadow-inner'
                        : 'bg-black text-zinc-400 border-zinc-800 hover:text-white'
                    }`}
                  >
                    <span>Income Inflow (+)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  placeholder={txForm.type === 'INCOME' ? 'e.g. Monthly Salary, Freelance project' : 'e.g. Grocery Store, Rent payment'}
                  value={txForm.title}
                  onChange={e => setTxForm({ ...txForm, title: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                    Amount in Rupees (₹)
                  </label>
                  <span className="text-[11px] text-zinc-500 font-mono-num">Format: INR ₹</span>
                </div>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-zinc-400 font-bold text-base">₹</span>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    required
                    placeholder="0.00"
                    value={txForm.amount}
                    onChange={e => setTxForm({ ...txForm, amount: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-xl pl-8 pr-3.5 py-2.5 text-sm text-white font-num font-bold placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Quick Preset Amount Chips */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[10px] text-zinc-500 font-semibold">Quick Add:</span>
                  {[500, 1000, 2000, 5000, 10000].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => {
                        const cur = parseFloat(txForm.amount) || 0;
                        setTxForm({ ...txForm, amount: (cur === 0 ? val : cur + val).toString() });
                      }}
                      className="text-[11px] px-2 py-0.5 rounded-lg bg-black hover:bg-[#181818] text-emerald-400 border border-zinc-800 font-mono-num transition"
                    >
                      +₹{val.toLocaleString('en-IN')}
                    </button>
                  ))}
                  {txForm.amount && (
                    <button
                      type="button"
                      onClick={() => setTxForm({ ...txForm, amount: '' })}
                      className="text-[10px] text-zinc-500 hover:text-zinc-300 ml-auto"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                    Category
                  </label>
                  <select
                    value={txForm.category}
                    onChange={e => setTxForm({ ...txForm, category: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Food & Dining">Food & Dining</option>
                    <option value="Housing & Rent">Housing & Rent</option>
                    <option value="Transportation">Transportation</option>
                    <option value="Entertainment">Entertainment</option>
                    <option value="Utilities">Utilities</option>
                    <option value="Shopping">Shopping</option>
                    <option value="Salary">Salary</option>
                    <option value="Freelance">Freelance</option>
                    <option value="Investments">Investments</option>
                    <option value="Healthcare">Healthcare</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    required
                    value={txForm.transactionDate}
                    onChange={e => setTxForm({ ...txForm, transactionDate: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono-num focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Payment Method
                </label>
                <select
                  value={txForm.paymentMethod}
                  onChange={e => setTxForm({ ...txForm, paymentMethod: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="UPI (Google Pay)">UPI (Google Pay)</option>
                  <option value="UPI (PhonePe)">UPI (PhonePe)</option>
                  <option value="UPI (Paytm)">UPI (Paytm)</option>
                  <option value="Credit Card">Credit Card</option>
                  <option value="Debit Card">Debit Card</option>
                  <option value="Net Banking / NEFT">Net Banking / NEFT</option>
                  <option value="Cash">Cash</option>
                  <option value="Apple Pay">Apple Pay</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Description / Notes
                </label>
                <textarea
                  rows={2}
                  placeholder="Optional details or remarks..."
                  value={txForm.description}
                  onChange={e => setTxForm({ ...txForm, description: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-zinc-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsTxModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-[#141414] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-sm font-bold px-5 py-2.5 rounded-xl transition shadow-lg shadow-emerald-950/50"
                >
                  {editingTx ? 'Save Changes' : 'Save to MySQL'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Budget Modal */}
      {isBudgetModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-zinc-800 rounded-2xl w-full max-w-md p-6 shadow-2xl shadow-black space-y-4">
            <div className="flex justify-between items-center border-b border-zinc-800 pb-3">
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-white text-lg tracking-tight">Set Monthly Budget</h3>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-md bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 font-mono-num">
                  ₹ INR
                </span>
              </div>
              <button
                onClick={() => setIsBudgetModalOpen(false)}
                className="text-zinc-400 hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveBudget} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  value={budgetForm.category}
                  onChange={e => setBudgetForm({ ...budgetForm, category: e.target.value })}
                  className="w-full bg-black border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="Food & Dining">Food & Dining</option>
                  <option value="Housing & Rent">Housing & Rent</option>
                  <option value="Transportation">Transportation</option>
                  <option value="Entertainment">Entertainment</option>
                  <option value="Utilities">Utilities</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Health & Medical">Health & Medical</option>
                  <option value="Education">Education</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
                  Monthly Limit (₹ Rupees)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-2.5 text-zinc-400 font-bold text-base">₹</span>
                  <input
                    type="number"
                    step="500"
                    min="100"
                    required
                    value={budgetForm.amount}
                    onChange={e => setBudgetForm({ ...budgetForm, amount: e.target.value })}
                    className="w-full bg-black border border-zinc-800 rounded-xl pl-8 pr-3.5 py-2.5 text-sm text-white font-num font-bold focus:outline-none focus:border-emerald-500"
                  />
                </div>

                {/* Preset Chips for Budgets */}
                <div className="flex flex-wrap items-center gap-1.5 mt-2">
                  <span className="text-[10px] text-zinc-500 font-semibold">Presets:</span>
                  {[5000, 10000, 15000, 25000, 50000].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setBudgetForm({ ...budgetForm, amount: val.toString() })}
                      className="text-[11px] px-2 py-0.5 rounded-lg bg-black hover:bg-[#181818] text-emerald-400 border border-zinc-800 font-mono-num transition"
                    >
                      ₹{val.toLocaleString('en-IN')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-3 border-t border-zinc-800">
                <button
                  type="button"
                  onClick={() => setIsBudgetModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl text-sm font-semibold text-zinc-400 hover:text-zinc-200 hover:bg-[#141414] transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-emerald-500 hover:bg-emerald-400 text-zinc-950 text-sm font-bold px-5 py-2.5 rounded-xl transition shadow-lg shadow-emerald-950/50"
                >
                  Save Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
