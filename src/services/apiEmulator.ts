// FinPilot Client-Side Storage & API Emulation Engine
// Mirrors 100% of the Java HttpServer / DAO business logic so the web app is immediately interactive!

export interface User {
  id: number;
  fullName: string;
  email: string;
  createdAt: string;
}

export interface Transaction {
  id: number;
  userId: number;
  title: string;
  amount: number;
  type: 'INCOME' | 'EXPENSE';
  category: string;
  transactionDate: string;
  paymentMethod: string;
  description: string;
  createdAt: string;
}

export interface Budget {
  id: number;
  userId: number;
  category: string;
  budgetAmount: number;
  budgetMonth: number;
  budgetYear: number;
  createdAt: string;
}

export interface BudgetStatus {
  id: number;
  category: string;
  budgetAmount: number;
  actualSpent: number;
  remaining: number;
  percentageUsed: number;
  status: 'SAFE' | 'WARNING' | 'OVERBUDGET';
  month: number;
  year: number;
}

export interface DashboardSummary {
  totalIncome: number;
  totalExpense: number;
  netBalance: number;
  allTimeBalance: number;
  savingsRate: number;
  month: number;
  year: number;
  recentTransactions: Transaction[];
}

export interface RequestLog {
  id: string;
  timestamp: string;
  method: string;
  endpoint: string;
  status: number;
  javaHandler: string;
  sqlExecuted: string;
  requestPayload?: any;
  responsePayload?: any;
}

const DEFAULT_USER: User = {
  id: 1,
  fullName: 'Arjun Mehta',
  email: 'arjun@finpilot.dev',
  createdAt: '2026-09-01 09:00:00'
};

const DEFAULT_BUDGETS: Budget[] = [
  { id: 1, userId: 1, category: 'Food & Dining', budgetAmount: 18000, budgetMonth: 9, budgetYear: 2026, createdAt: '2026-09-01' },
  { id: 2, userId: 1, category: 'Housing & Rent', budgetAmount: 25000, budgetMonth: 9, budgetYear: 2026, createdAt: '2026-09-01' },
  { id: 3, userId: 1, category: 'Transportation', budgetAmount: 6000, budgetMonth: 9, budgetYear: 2026, createdAt: '2026-09-01' },
  { id: 4, userId: 1, category: 'Entertainment', budgetAmount: 5000, budgetMonth: 9, budgetYear: 2026, createdAt: '2026-09-01' },
  { id: 5, userId: 1, category: 'Shopping', budgetAmount: 10000, budgetMonth: 9, budgetYear: 2026, createdAt: '2026-09-01' },
  { id: 6, userId: 1, category: 'Utilities', budgetAmount: 4500, budgetMonth: 9, budgetYear: 2026, createdAt: '2026-09-01' }
];

const DEFAULT_TRANSACTIONS: Transaction[] = [
  { id: 1, userId: 1, title: 'Monthly Salary Credit', amount: 85000.00, type: 'INCOME', category: 'Salary', transactionDate: '2026-09-01', paymentMethod: 'Net Banking / NEFT', description: 'Tech company software engineer salary credit', createdAt: '2026-09-01' },
  { id: 2, userId: 1, title: 'Apartment Monthly Rent', amount: 22000.00, type: 'EXPENSE', category: 'Housing & Rent', transactionDate: '2026-09-02', paymentMethod: 'UPI', description: 'Monthly 2BHK apartment rent', createdAt: '2026-09-02' },
  { id: 3, userId: 1, title: 'Freelance UI/UX Project', amount: 28000.00, type: 'INCOME', category: 'Freelance', transactionDate: '2026-09-05', paymentMethod: 'UPI / IMPS', description: 'Design system & prototype deliverable', createdAt: '2026-09-05' },
  { id: 4, userId: 1, title: 'Supermarket Groceries', amount: 4650.00, type: 'EXPENSE', category: 'Food & Dining', transactionDate: '2026-09-07', paymentMethod: 'UPI (Google Pay)', description: 'Weekly groceries & household staples', createdAt: '2026-09-07' },
  { id: 5, userId: 1, title: 'Electricity & Fiber Broadband', amount: 2850.00, type: 'EXPENSE', category: 'Utilities', transactionDate: '2026-09-10', paymentMethod: 'Net Banking', description: 'Power bill and high-speed broadband', createdAt: '2026-09-10' },
  { id: 6, userId: 1, title: 'Metro Smart Card & Fuel', amount: 1800.00, type: 'EXPENSE', category: 'Transportation', transactionDate: '2026-09-12', paymentMethod: 'UPI (PhonePe)', description: 'Monthly metro pass recharge & fuel', createdAt: '2026-09-12' },
  { id: 7, userId: 1, title: 'Weekend Family Dinner', amount: 2950.00, type: 'EXPENSE', category: 'Food & Dining', transactionDate: '2026-09-15', paymentMethod: 'Credit Card', description: 'Dinner with family at local restaurant', createdAt: '2026-09-15' },
  { id: 8, userId: 1, title: 'Cinema & Movie Tickets', amount: 1200.00, type: 'EXPENSE', category: 'Entertainment', transactionDate: '2026-09-18', paymentMethod: 'UPI (Paytm)', description: 'Weekend movie tickets & snacks', createdAt: '2026-09-18' },
  { id: 9, userId: 1, title: 'Festive Shopping & Apparel', amount: 5400.00, type: 'EXPENSE', category: 'Shopping', transactionDate: '2026-09-20', paymentMethod: 'Credit Card', description: 'Festive ethnic wear purchase', createdAt: '2026-09-20' },
  { id: 10, userId: 1, title: 'Technical Consulting Session', amount: 12500.00, type: 'INCOME', category: 'Investments', transactionDate: '2026-09-22', paymentMethod: 'Net Banking', description: 'Fintech architecture advisory session', createdAt: '2026-09-22' },
  { id: 11, userId: 1, title: 'Artisan Cafe & Coffee', amount: 620.00, type: 'EXPENSE', category: 'Food & Dining', transactionDate: '2026-09-24', paymentMethod: 'UPI', description: 'Specialty coffee roastery beans & snacks', createdAt: '2026-09-24' },
  // Historical data for 6-month trend in INR
  { id: 12, userId: 1, title: 'August Salary', amount: 85000.00, type: 'INCOME', category: 'Salary', transactionDate: '2026-08-01', paymentMethod: 'Bank Transfer', description: 'Salary', createdAt: '2026-08-01' },
  { id: 13, userId: 1, title: 'August Expenses', amount: 41200.00, type: 'EXPENSE', category: 'Housing & Rent', transactionDate: '2026-08-15', paymentMethod: 'Card', description: 'Rent + Misc', createdAt: '2026-08-15' },
  { id: 14, userId: 1, title: 'July Salary', amount: 85000.00, type: 'INCOME', category: 'Salary', transactionDate: '2026-07-01', paymentMethod: 'Bank Transfer', description: 'Salary', createdAt: '2026-07-01' },
  { id: 15, userId: 1, title: 'July Expenses', amount: 39500.00, type: 'EXPENSE', category: 'Housing & Rent', transactionDate: '2026-07-15', paymentMethod: 'Card', description: 'Rent + Food', createdAt: '2026-07-15' },
  { id: 16, userId: 1, title: 'June Salary', amount: 82000.00, type: 'INCOME', category: 'Salary', transactionDate: '2026-06-01', paymentMethod: 'Bank Transfer', description: 'Salary', createdAt: '2026-06-01' },
  { id: 17, userId: 1, title: 'June Expenses', amount: 45000.00, type: 'EXPENSE', category: 'Shopping', transactionDate: '2026-06-20', paymentMethod: 'Card', description: 'Vacation travel', createdAt: '2026-06-20' },
  { id: 18, userId: 1, title: 'May Salary', amount: 82000.00, type: 'INCOME', category: 'Salary', transactionDate: '2026-05-01', paymentMethod: 'Bank Transfer', description: 'Salary', createdAt: '2026-05-01' },
  { id: 19, userId: 1, title: 'May Expenses', amount: 36800.00, type: 'EXPENSE', category: 'Utilities', transactionDate: '2026-05-18', paymentMethod: 'Card', description: 'Utilities + Living', createdAt: '2026-05-18' },
  { id: 20, userId: 1, title: 'April Salary', amount: 82000.00, type: 'INCOME', category: 'Salary', transactionDate: '2026-04-01', paymentMethod: 'Bank Transfer', description: 'Salary', createdAt: '2026-04-01' },
  { id: 21, userId: 1, title: 'April Expenses', amount: 38400.00, type: 'EXPENSE', category: 'Food & Dining', transactionDate: '2026-04-20', paymentMethod: 'Card', description: 'Expenses', createdAt: '2026-04-20' }
];

export class FinPilotStore {
  private static STORAGE_KEY_TX = 'finpilot_tx_data_inr_v2';
  private static STORAGE_KEY_BUDGET = 'finpilot_budget_data_inr_v2';
  private static STORAGE_KEY_USER = 'finpilot_user_data_inr_v2';
  private static logs: RequestLog[] = [];
  private static listeners: (() => void)[] = [];

  public static subscribe(listener: () => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private static notify() {
    this.listeners.forEach(fn => fn());
  }

  public static getLogs(): RequestLog[] {
    return this.logs;
  }

  public static clearLogs() {
    this.logs = [];
    this.notify();
  }

  public static logRequest(entry: Omit<RequestLog, 'id' | 'timestamp'>) {
    const log: RequestLog = {
      ...entry,
      id: Math.random().toString(36).substring(2, 9),
      timestamp: new Date().toLocaleTimeString()
    };
    this.logs.unshift(log);
    if (this.logs.length > 30) this.logs.pop();
    this.notify();
  }

  public static getUser(): User | null {
    const raw = localStorage.getItem(this.STORAGE_KEY_USER);
    if (!raw) return DEFAULT_USER;
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_USER;
    }
  }

  public static setUser(user: User | null) {
    if (user) {
      localStorage.setItem(this.STORAGE_KEY_USER, JSON.stringify(user));
    } else {
      localStorage.removeItem(this.STORAGE_KEY_USER);
    }
    this.notify();
  }

  public static getTransactions(): Transaction[] {
    const raw = localStorage.getItem(this.STORAGE_KEY_TX);
    if (!raw) {
      localStorage.setItem(this.STORAGE_KEY_TX, JSON.stringify(DEFAULT_TRANSACTIONS));
      return DEFAULT_TRANSACTIONS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_TRANSACTIONS;
    }
  }

  public static setTransactions(txs: Transaction[]) {
    localStorage.setItem(this.STORAGE_KEY_TX, JSON.stringify(txs));
    this.notify();
  }

  public static getBudgets(): Budget[] {
    const raw = localStorage.getItem(this.STORAGE_KEY_BUDGET);
    if (!raw) {
      localStorage.setItem(this.STORAGE_KEY_BUDGET, JSON.stringify(DEFAULT_BUDGETS));
      return DEFAULT_BUDGETS;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return DEFAULT_BUDGETS;
    }
  }

  public static setBudgets(budgets: Budget[]) {
    localStorage.setItem(this.STORAGE_KEY_BUDGET, JSON.stringify(budgets));
    this.notify();
  }

  public static resetToDefaults() {
    localStorage.setItem(this.STORAGE_KEY_TX, JSON.stringify(DEFAULT_TRANSACTIONS));
    localStorage.setItem(this.STORAGE_KEY_BUDGET, JSON.stringify(DEFAULT_BUDGETS));
    localStorage.setItem(this.STORAGE_KEY_USER, JSON.stringify(DEFAULT_USER));
    this.notify();
  }

  // Business Logic Methods
  public static addTransaction(tx: Omit<Transaction, 'id' | 'createdAt' | 'userId'>): Transaction {
    const list = this.getTransactions();
    const newId = list.length > 0 ? Math.max(...list.map(t => t.id)) + 1 : 1;
    const item: Transaction = {
      ...tx,
      id: newId,
      userId: 1,
      createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19)
    };
    list.unshift(item);
    this.setTransactions(list);

    this.logRequest({
      method: 'POST',
      endpoint: '/api/transactions',
      status: 201,
      javaHandler: 'TransactionHandler.java -> TransactionService.createTransaction()',
      sqlExecuted: `INSERT INTO transactions (user_id, title, amount, type, category, transaction_date, payment_method, description) VALUES (1, '${item.title}', ${item.amount}, '${item.type}', '${item.category}', '${item.transactionDate}', '${item.paymentMethod}', '${item.description}')`,
      requestPayload: tx,
      responsePayload: { success: true, message: 'Transaction recorded successfully', transaction: item }
    });

    return item;
  }

  public static updateTransaction(id: number, data: Partial<Transaction>): boolean {
    const list = this.getTransactions();
    const idx = list.findIndex(t => t.id === id);
    if (idx === -1) return false;

    list[idx] = { ...list[idx], ...data };
    this.setTransactions(list);

    this.logRequest({
      method: 'PUT',
      endpoint: `/api/transactions/${id}`,
      status: 200,
      javaHandler: 'TransactionHandler.java -> TransactionService.updateTransaction()',
      sqlExecuted: `UPDATE transactions SET title = '${list[idx].title}', amount = ${list[idx].amount}, category = '${list[idx].category}' WHERE id = ${id} AND user_id = 1`,
      requestPayload: data,
      responsePayload: { success: true, message: 'Transaction updated successfully', transaction: list[idx] }
    });

    return true;
  }

  public static deleteTransaction(id: number): boolean {
    const list = this.getTransactions();
    const filtered = list.filter(t => t.id !== id);
    if (filtered.length === list.length) return false;

    this.setTransactions(filtered);

    this.logRequest({
      method: 'DELETE',
      endpoint: `/api/transactions/${id}`,
      status: 200,
      javaHandler: 'TransactionHandler.java -> TransactionService.deleteTransaction()',
      sqlExecuted: `DELETE FROM transactions WHERE id = ${id} AND user_id = 1`,
      responsePayload: { success: true, message: 'Transaction deleted successfully' }
    });

    return true;
  }

  public static upsertBudget(category: string, amount: number, month = 9, year = 2026): Budget {
    const list = this.getBudgets();
    const existingIdx = list.findIndex(b => b.category === category && b.budgetMonth === month && b.budgetYear === year);

    let result: Budget;
    if (existingIdx !== -1) {
      list[existingIdx].budgetAmount = amount;
      result = list[existingIdx];
    } else {
      const newId = list.length > 0 ? Math.max(...list.map(b => b.id)) + 1 : 1;
      result = {
        id: newId,
        userId: 1,
        category,
        budgetAmount: amount,
        budgetMonth: month,
        budgetYear: year,
        createdAt: new Date().toISOString().replace('T', ' ').substring(0, 10)
      };
      list.push(result);
    }

    this.setBudgets(list);

    this.logRequest({
      method: 'POST',
      endpoint: '/api/budgets',
      status: 201,
      javaHandler: 'BudgetHandler.java -> BudgetService.createOrUpdateBudget()',
      sqlExecuted: `INSERT INTO budgets (user_id, category, budget_amount, budget_month, budget_year) VALUES (1, '${category}', ${amount}, ${month}, ${year}) ON DUPLICATE KEY UPDATE budget_amount = VALUES(budget_amount)`,
      requestPayload: { category, budgetAmount: amount, budgetMonth: month, budgetYear: year },
      responsePayload: { success: true, budget: result }
    });

    return result;
  }

  public static deleteBudget(id: number): boolean {
    const list = this.getBudgets();
    const filtered = list.filter(b => b.id !== id);
    if (filtered.length === list.length) return false;

    this.setBudgets(filtered);

    this.logRequest({
      method: 'DELETE',
      endpoint: `/api/budgets/${id}`,
      status: 200,
      javaHandler: 'BudgetHandler.java -> BudgetService.deleteBudget()',
      sqlExecuted: `DELETE FROM budgets WHERE id = ${id} AND user_id = 1`,
      responsePayload: { success: true, message: 'Budget deleted' }
    });

    return true;
  }

  public static getDashboardSummary(month = 9, year = 2026): DashboardSummary {
    const all = this.getTransactions();
    let currentMonthIncome = 0;
    let currentMonthExpense = 0;
    let allTimeBalance = 0;

    for (const tx of all) {
      const d = new Date(tx.transactionDate);
      const isCur = (d.getMonth() + 1 === month && d.getFullYear() === year);

      if (tx.type === 'INCOME') {
        allTimeBalance += tx.amount;
        if (isCur) currentMonthIncome += tx.amount;
      } else {
        allTimeBalance -= tx.amount;
        if (isCur) currentMonthExpense += tx.amount;
      }
    }

    const netSavings = currentMonthIncome - currentMonthExpense;
    let savingsRate = 0;
    if (currentMonthIncome > 0) {
      savingsRate = Math.max(0, Math.round((netSavings / currentMonthIncome) * 1000) / 10);
    }

    return {
      totalIncome: currentMonthIncome,
      totalExpense: currentMonthExpense,
      netBalance: netSavings,
      allTimeBalance,
      savingsRate,
      month,
      year,
      recentTransactions: all.slice(0, 5)
    };
  }

  public static getBudgetStatuses(month = 9, year = 2026): BudgetStatus[] {
    const budgets = this.getBudgets().filter(b => b.budgetMonth === month && b.budgetYear === year);
    const txs = this.getTransactions().filter(t => {
      const d = new Date(t.transactionDate);
      return t.type === 'EXPENSE' && d.getMonth() + 1 === month && d.getFullYear() === year;
    });

    // Group actual expenses by category
    const actualMap: Record<string, number> = {};
    for (const tx of txs) {
      actualMap[tx.category] = (actualMap[tx.category] || 0) + tx.amount;
    }

    return budgets.map(b => {
      const actual = actualMap[b.category] || 0;
      const pct = b.budgetAmount > 0 ? (actual / b.budgetAmount) * 100 : 0;
      let status: 'SAFE' | 'WARNING' | 'OVERBUDGET' = 'SAFE';
      if (pct >= 100) status = 'OVERBUDGET';
      else if (pct >= 80) status = 'WARNING';

      return {
        id: b.id,
        category: b.category,
        budgetAmount: b.budgetAmount,
        actualSpent: actual,
        remaining: Math.max(0, b.budgetAmount - actual),
        percentageUsed: Math.round(pct * 10) / 10,
        status,
        month: b.budgetMonth,
        year: b.budgetYear
      };
    });
  }

  public static getCategoryBreakdown(month = 9, year = 2026): Record<string, number> {
    const txs = this.getTransactions().filter(t => {
      const d = new Date(t.transactionDate);
      return t.type === 'EXPENSE' && d.getMonth() + 1 === month && d.getFullYear() === year;
    });

    const breakdown: Record<string, number> = {};
    for (const tx of txs) {
      breakdown[tx.category] = (breakdown[tx.category] || 0) + tx.amount;
    }
    return breakdown;
  }

  public static getMonthlyTrend(): { monthName: string; income: number; expense: number; net: number }[] {
    const months = [
      { name: 'Apr 2026', m: 4, y: 2026 },
      { name: 'May 2026', m: 5, y: 2026 },
      { name: 'Jun 2026', m: 6, y: 2026 },
      { name: 'Jul 2026', m: 7, y: 2026 },
      { name: 'Aug 2026', m: 8, y: 2026 },
      { name: 'Sep 2026', m: 9, y: 2026 }
    ];

    const all = this.getTransactions();

    return months.map(mon => {
      let income = 0;
      let expense = 0;

      for (const t of all) {
        const d = new Date(t.transactionDate);
        if (d.getMonth() + 1 === mon.m && d.getFullYear() === mon.y) {
          if (t.type === 'INCOME') income += t.amount;
          else expense += t.amount;
        }
      }

      return {
        monthName: mon.name,
        income,
        expense,
        net: income - expense
      };
    });
  }
}
