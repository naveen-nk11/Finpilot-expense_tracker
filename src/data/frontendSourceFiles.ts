// Standalone Vanilla Frontend Files (HTML5, CSS3, Vanilla JS) for FinPilot

export interface FrontendFileItem {
  path: string;
  name: string;
  category: 'html' | 'css' | 'js';
  description: string;
  code: string;
}

export const FRONTEND_FILES: FrontendFileItem[] = [
  // 1. index.html (SPA shell / Landing page)
  {
    path: 'static/index.html',
    name: 'index.html',
    category: 'html',
    description: 'Main single-page app shell with modern dark charcoal and emerald styling, responsive sidebar, navigation, and modal forms',
    code: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>FinPilot – Smart Personal Expense Tracker</title>
  <link rel="stylesheet" href="/css/style.css">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet">
  <!-- Chart.js for interactive analytics -->
  <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.1/dist/chart.umd.min.js"></script>
</head>
<body class="bg-black text-slate-100 min-h-screen font-sans flex flex-col md:flex-row antialiased">

  <!-- Sidebar Navigation -->
  <aside id="sidebar" class="w-full md:w-64 bg-[#080808] border-r border-zinc-900 flex flex-col justify-between shrink-0 p-5">
    <div>
      <!-- Brand Logo -->
      <div class="flex items-center space-x-3 mb-8">
        <div class="w-10 h-10 rounded-xl bg-emerald-950/40 text-emerald-400 flex items-center justify-center border border-emerald-800/40">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
        </div>
        <div>
          <span class="text-xl font-bold tracking-tight text-white font-display">Fin<span class="text-emerald-400">Pilot</span></span>
          <span class="block text-xs text-zinc-400 font-medium">Core Java + MySQL Edition</span>
        </div>
      </div>

      <!-- Navigation Links -->
      <nav class="space-y-1.5" id="nav-links">
        <button data-view="dashboard" class="nav-btn active">
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
          Dashboard
        </button>
        <button data-view="transactions" class="nav-btn">
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>
          Transactions
        </button>
        <button data-view="budgets" class="nav-btn">
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z"></path></svg>
          Budgets & Alerts
        </button>
        <button data-view="reports" class="nav-btn">
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
          Monthly Reports
        </button>
        <button data-view="profile" class="nav-btn">
          <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
          Profile
        </button>
      </nav>
    </div>

    <!-- User Mini Badge & Logout -->
    <div class="pt-6 border-t border-navy-800">
      <div id="user-info-badge" class="flex items-center justify-between">
        <div class="flex items-center space-x-3">
          <div class="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-sm" id="user-avatar">
            U
          </div>
          <div class="overflow-hidden">
            <p class="text-sm font-medium text-white truncate" id="user-display-name">Alex Morgan</p>
            <p class="text-xs text-slate-400 truncate" id="user-display-email">alex@finpilot.dev</p>
          </div>
        </div>
        <button id="btn-logout" title="Sign out" class="text-slate-400 hover:text-rose-400 p-1.5 transition">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
        </button>
      </div>
    </div>
  </aside>

  <!-- Main Content Container -->
  <main class="flex-1 flex flex-col min-w-0 overflow-y-auto">
    <!-- Top Header -->
    <header class="bg-navy-900/60 backdrop-blur border-b border-navy-800 px-6 py-4 flex items-center justify-between sticky top-0 z-20">
      <div>
        <h1 id="page-title" class="text-xl font-bold text-white">Dashboard Overview</h1>
        <p id="page-subtitle" class="text-xs text-slate-400">Real-time financial telemetry from MySQL database</p>
      </div>
      <div class="flex items-center space-x-3">
        <button id="btn-quick-expense" class="btn-primary flex items-center space-x-2">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
          <span>Add Transaction</span>
        </button>
      </div>
    </header>

    <!-- Notification Toast Container -->
    <div id="toast-container" class="fixed top-5 right-5 z-50 space-y-2 pointer-events-none"></div>

    <!-- View: Dashboard -->
    <section id="view-dashboard" class="p-6 space-y-6 view-section">
      <!-- 4 Summary KPI Cards -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div class="stat-card">
          <span class="text-xs uppercase font-semibold text-slate-400 tracking-wider">Total Income (Sep)</span>
          <div class="text-2xl font-bold text-emerald-400 mt-1" id="kpi-income">$0.00</div>
          <span class="text-xs text-emerald-500/80 flex items-center mt-2">↑ Monthly Inflow</span>
        </div>
        <div class="stat-card">
          <span class="text-xs uppercase font-semibold text-slate-400 tracking-wider">Total Expenses (Sep)</span>
          <div class="text-2xl font-bold text-rose-400 mt-1" id="kpi-expense">$0.00</div>
          <span class="text-xs text-rose-500/80 flex items-center mt-2">↓ Monthly Outflow</span>
        </div>
        <div class="stat-card">
          <span class="text-xs uppercase font-semibold text-slate-400 tracking-wider">Net Savings</span>
          <div class="text-2xl font-bold text-cyan-400 mt-1" id="kpi-net">$0.00</div>
          <span class="text-xs text-slate-400 flex items-center mt-2">Income minus Expenses</span>
        </div>
        <div class="stat-card">
          <span class="text-xs uppercase font-semibold text-slate-400 tracking-wider">Savings Rate</span>
          <div class="text-2xl font-bold text-amber-400 mt-1" id="kpi-savings-rate">0.0%</div>
          <div class="w-full bg-navy-800 h-1.5 rounded-full mt-3 overflow-hidden">
            <div id="kpi-rate-bar" class="bg-amber-400 h-full rounded-full" style="width: 0%"></div>
          </div>
        </div>
      </div>

      <!-- Charts Row -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="card lg:col-span-2">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-white text-base">Income vs Expense (6-Month Trend)</h3>
            <span class="text-xs px-2.5 py-1 rounded bg-navy-800 text-slate-300">MySQL Aggregated</span>
          </div>
          <div class="h-64 relative">
            <canvas id="chart-monthly-trend"></canvas>
          </div>
        </div>
        <div class="card">
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-bold text-white text-base">Expense Breakdown</h3>
            <span class="text-xs px-2.5 py-1 rounded bg-navy-800 text-slate-300">By Category</span>
          </div>
          <div class="h-64 relative flex items-center justify-center">
            <canvas id="chart-category-doughnut"></canvas>
          </div>
        </div>
      </div>

      <!-- Recent Transactions Table Preview -->
      <div class="card">
        <div class="flex items-center justify-between mb-4">
          <h3 class="font-bold text-white text-base">Recent Transactions</h3>
          <button data-view="transactions" class="text-xs font-semibold text-emerald-400 hover:text-emerald-300 transition">View All →</button>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="text-slate-400 border-b border-navy-800 text-xs uppercase">
                <th class="pb-3">Title & Category</th>
                <th class="pb-3">Date</th>
                <th class="pb-3">Method</th>
                <th class="pb-3 text-right">Amount</th>
              </tr>
            </thead>
            <tbody id="recent-transactions-tbody" class="divide-y divide-navy-800/60"></tbody>
          </table>
        </div>
      </div>
    </section>

    <!-- View: Transactions -->
    <section id="view-transactions" class="p-6 space-y-6 view-section hidden">
      <!-- Filter Toolbar -->
      <div class="card flex flex-col md:flex-row gap-4 justify-between items-center">
        <div class="flex flex-wrap gap-3 w-full md:w-auto items-center">
          <input type="text" id="filter-search" placeholder="Search title or description..." class="input-field max-w-xs text-sm">
          <select id="filter-type" class="input-field text-sm">
            <option value="ALL">All Types</option>
            <option value="INCOME">Income Only</option>
            <option value="EXPENSE">Expense Only</option>
          </select>
          <select id="filter-category" class="input-field text-sm">
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
          </select>
        </div>
        <button id="btn-add-transaction" class="btn-primary shrink-0 w-full md:w-auto">
          + Add Transaction
        </button>
      </div>

      <!-- Transaction List -->
      <div class="card overflow-x-auto">
        <table class="w-full text-left text-sm">
          <thead>
            <tr class="text-slate-400 border-b border-navy-800 text-xs uppercase">
              <th class="pb-3">Transaction</th>
              <th class="pb-3">Category</th>
              <th class="pb-3">Date</th>
              <th class="pb-3">Payment</th>
              <th class="pb-3 text-right">Amount</th>
              <th class="pb-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody id="transactions-table-body" class="divide-y divide-navy-800"></tbody>
        </table>
      </div>
    </section>

    <!-- View: Budgets -->
    <section id="view-budgets" class="p-6 space-y-6 view-section hidden">
      <div class="flex justify-between items-center">
        <div>
          <h2 class="text-lg font-bold text-white">Monthly Budgets & Alerts</h2>
          <p class="text-xs text-slate-400">Automated spending threshold warnings (80% Warning, 100% Exceeded)</p>
        </div>
        <button id="btn-add-budget" class="btn-primary">+ Set Category Budget</button>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" id="budgets-container"></div>
    </section>

    <!-- View: Reports -->
    <section id="view-reports" class="p-6 space-y-6 view-section hidden">
      <div class="card">
        <h2 class="text-lg font-bold text-white mb-2">Monthly Cash Flow & Performance Analysis</h2>
        <p class="text-xs text-slate-400 mb-6">Generated on-the-fly via Java TransactionService aggregations</p>
        <div class="h-80">
          <canvas id="chart-reports-flow"></canvas>
        </div>
      </div>
    </section>

    <!-- View: Profile -->
    <section id="view-profile" class="p-6 space-y-6 view-section hidden">
      <div class="max-w-2xl mx-auto card space-y-6">
        <div class="flex items-center space-x-4">
          <div class="w-16 h-16 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center text-2xl font-bold">
            U
          </div>
          <div>
            <h3 class="text-xl font-bold text-white" id="profile-name">Alex Morgan</h3>
            <p class="text-sm text-slate-400" id="profile-email">alex@finpilot.dev</p>
            <span class="inline-block mt-1 text-xs bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded">
              Active MySQL Session
            </span>
          </div>
        </div>

        <div class="border-t border-navy-800 pt-6 space-y-4">
          <h4 class="font-semibold text-white">Security & Environment Info</h4>
          <div class="bg-navy-950 p-4 rounded-xl space-y-2 text-xs text-slate-300 font-mono">
            <p><strong>Backend:</strong> com.sun.net.httpserver.HttpServer (JDK 17+)</p>
            <p><strong>Persistence:</strong> MySQL 8.0 via JDBC PreparedStatement</p>
            <p><strong>Auth:</strong> BCrypt salted hashing + HttpOnly session cookies</p>
            <p><strong>JSON Engine:</strong> Google Gson 2.10.1</p>
          </div>
        </div>
      </div>
    </section>
  </main>

  <!-- Add/Edit Transaction Modal -->
  <div id="modal-transaction" class="modal-backdrop hidden">
    <div class="modal-card">
      <div class="flex justify-between items-center mb-5">
        <h3 id="modal-tx-title" class="text-lg font-bold text-white">Add Transaction</h3>
        <button id="modal-tx-close" class="text-slate-400 hover:text-white">✕</button>
      </div>
      <form id="form-transaction" class="space-y-4">
        <input type="hidden" id="tx-id">
        <div>
          <label class="label">Transaction Title</label>
          <input type="text" id="tx-title" class="input-field" placeholder="e.g. Grocery Store, Paycheck" required>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="label">Amount ($)</label>
            <input type="number" step="0.01" min="0.01" id="tx-amount" class="input-field" placeholder="0.00" required>
          </div>
          <div>
            <label class="label">Type</label>
            <select id="tx-type" class="input-field">
              <option value="EXPENSE">Expense</option>
              <option value="INCOME">Income</option>
            </select>
          </div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="label">Category</label>
            <select id="tx-category" class="input-field" required>
              <option value="Food & Dining">Food & Dining</option>
              <option value="Housing & Rent">Housing & Rent</option>
              <option value="Transportation">Transportation</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Utilities">Utilities</option>
              <option value="Shopping">Shopping</option>
              <option value="Salary">Salary</option>
              <option value="Freelance">Freelance</option>
              <option value="Investments">Investments</option>
            </select>
          </div>
          <div>
            <label class="label">Date</label>
            <input type="date" id="tx-date" class="input-field" required>
          </div>
        </div>
        <div>
          <label class="label">Payment Method</label>
          <select id="tx-payment" class="input-field">
            <option value="Credit Card">Credit Card</option>
            <option value="Debit Card">Debit Card</option>
            <option value="Bank Transfer">Bank Transfer</option>
            <option value="Cash">Cash</option>
            <option value="PayPal">PayPal</option>
            <option value="Apple Pay">Apple Pay</option>
          </select>
        </div>
        <div>
          <label class="label">Notes / Description (Optional)</label>
          <textarea id="tx-desc" rows="2" class="input-field" placeholder="Additional details..."></textarea>
        </div>
        <div class="flex justify-end space-x-3 pt-3">
          <button type="button" id="modal-tx-cancel" class="btn-secondary">Cancel</button>
          <button type="submit" class="btn-primary">Save to MySQL</button>
        </div>
      </form>
    </div>
  </div>

  <script src="/js/api.js"></script>
  <script src="/js/charts.js"></script>
  <script src="/js/app.js"></script>
</body>
</html>`
  },

  // 2. CSS File (Modern Black & Emerald palette with tabular numbers)
  {
    path: 'static/css/style.css',
    name: 'style.css',
    category: 'css',
    description: 'Custom CSS rules providing sleek black and emerald theme, cards, modals, and responsive layout',
    code: `@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:ital,wght@0,300..800;1,300..800&family=JetBrains+Mono:wght@400;500;600&display=swap');

:root {
  --bg-black: #000000;
  --bg-card: #0a0a0a;
  --bg-surface: #080808;
  --border-emerald: #1e1e1e;
  --emerald-primary: #10b981;
  --emerald-light: #34d399;
  --emerald-accent: #6ee7b7;
}

body {
  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
  background-color: var(--bg-black);
  color: #f8fafc;
}

.font-num {
  font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  font-feature-settings: 'tnum' on, 'lnum' on;
}

.font-mono-num {
  font-family: 'JetBrains Mono', monospace;
  font-feature-settings: 'tnum' on;
}

/* Navigation buttons */
.nav-btn {
  display: flex;
  align-items: center;
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 600;
  color: #94a3b8;
  transition: all 0.15s ease-in-out;
  cursor: pointer;
  border: none;
  background: transparent;
}
.nav-btn:hover {
  background-color: rgba(16, 185, 129, 0.12);
  color: #ffffff;
}
.nav-btn.active {
  background-color: rgba(16, 185, 129, 0.15);
  color: var(--emerald-light);
  border: 1px solid rgba(16, 185, 129, 0.35);
}

/* Card components */
.card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-emerald);
  border-radius: 1rem;
  padding: 1.5rem;
  box-shadow: 0 4px 20px -2px rgba(0, 0, 0, 0.6);
}

.stat-card {
  background-color: var(--bg-card);
  border: 1px solid var(--border-emerald);
  border-radius: 1rem;
  padding: 1.25rem;
  position: relative;
  overflow: hidden;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.stat-card:hover {
  border-color: rgba(16, 185, 129, 0.5);
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.12);
}

/* Form fields */
.input-field {
  width: 100%;
  background-color: var(--bg-surface);
  border: 1px solid var(--border-emerald);
  border-radius: 0.5rem;
  padding: 0.625rem 0.875rem;
  color: #ffffff;
  font-size: 0.875rem;
  outline: none;
  transition: border-color 0.15s;
}
.input-field:focus {
  border-color: var(--emerald-primary);
  box-shadow: 0 0 0 2px rgba(16, 185, 129, 0.25);
}

.label {
  display: block;
  font-size: 0.75rem;
  font-weight: 600;
  color: #6ee7b7;
  margin-bottom: 0.375rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Buttons */
.btn-primary {
  background-color: var(--emerald-primary);
  color: #050807;
  font-weight: 700;
  font-size: 0.875rem;
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
  transition: all 0.15s ease-in-out;
  box-shadow: 0 2px 10px rgba(16, 185, 129, 0.3);
}
.btn-primary:hover {
  background-color: #059669;
  transform: translateY(-1px);
}

.btn-secondary {
  background-color: rgba(30, 58, 138, 0.3);
  color: #e2e8f0;
  font-weight: 600;
  font-size: 0.875rem;
  padding: 0.625rem 1.25rem;
  border-radius: 0.5rem;
  border: 1px solid var(--border-blue);
  cursor: pointer;
  transition: all 0.15s ease-in-out;
}
.btn-secondary:hover {
  background-color: var(--bg-navy-700);
}

/* Modals */
.modal-backdrop {
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 50;
  padding: 1rem;
}
.modal-card {
  background-color: var(--bg-navy-900);
  border: 1px solid var(--bg-navy-800);
  border-radius: 1rem;
  padding: 1.5rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}`
  },

  // 3. API Client (Vanilla JS Fetch wrapper communicating with Java HttpServer)
  {
    path: 'static/js/api.js',
    name: 'api.js',
    category: 'js',
    description: 'Vanilla JavaScript fetch() module handling HTTP communication with Core Java endpoints',
    code: `/**
 * FinPilot API Client
 * Communicates with the standalone Java HttpServer using standard fetch().
 * Sends JSON payloads and handles HTTP status codes.
 */
const API = {
  baseUrl: '/api',

  async request(endpoint, options = {}) {
    const url = \`\${this.baseUrl}\${endpoint}\`;
    const defaultHeaders = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };

    const token = localStorage.getItem('finpilot_token');
    if (token) {
      defaultHeaders['Authorization'] = \`Bearer \${token}\`;
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...defaultHeaders,
          ...options.headers
        }
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        if (response.status === 401) {
          // Trigger re-login if unauthorized
          console.warn('Authentication token expired or invalid');
        }
        throw new Error(data.error || \`HTTP error! status: \${response.status}\`);
      }

      return data;
    } catch (err) {
      console.error(\`API Error at \${endpoint}:\`, err);
      throw err;
    }
  },

  // Auth Endpoints
  register(fullName, email, password) {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ fullName, email, password })
    });
  },

  login(email, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  },

  logout() {
    return this.request('/auth/logout', { method: 'POST' });
  },

  getMe() {
    return this.request('/auth/me', { method: 'GET' });
  },

  // Transactions Endpoints
  getTransactions(params = {}) {
    const qs = new URLSearchParams(params).toString();
    return this.request(\`/transactions\${qs ? '?' + qs : ''}\`, { method: 'GET' });
  },

  createTransaction(txData) {
    return this.request('/transactions', {
      method: 'POST',
      body: JSON.stringify(txData)
    });
  },

  updateTransaction(id, txData) {
    return this.request(\`/transactions/\${id}\`, {
      method: 'PUT',
      body: JSON.stringify(txData)
    });
  },

  deleteTransaction(id) {
    return this.request(\`/transactions/\${id}\`, { method: 'DELETE' });
  },

  // Dashboard & Reports Endpoints
  getDashboard(month, year) {
    const qs = new URLSearchParams({ month, year }).toString();
    return this.request(\`/dashboard?\${qs}\`, { method: 'GET' });
  },

  getReports(month, year) {
    const qs = new URLSearchParams({ month, year }).toString();
    return this.request(\`/reports?\${qs}\`, { method: 'GET' });
  },

  // Budgets Endpoints
  getBudgets(month, year) {
    const qs = new URLSearchParams({ month, year }).toString();
    return this.request(\`/budgets?\${qs}\`, { method: 'GET' });
  },

  createBudget(budgetData) {
    return this.request('/budgets', {
      method: 'POST',
      body: JSON.stringify(budgetData)
    });
  },

  deleteBudget(id) {
    return this.request(\`/budgets/\${id}\`, { method: 'DELETE' });
  }
};`
  },

  // 4. Charts JS (Chart.js integrations)
  {
    path: 'static/js/charts.js',
    name: 'charts.js',
    category: 'js',
    description: 'Chart.js controllers for monthly cash flow trend and category distribution',
    code: `/**
 * FinPilot Visual Analytics via Chart.js
 */
const FinPilotCharts = {
  trendChart: null,
  doughnutChart: null,
  reportsChart: null,

  initTrend(canvasId, monthlyTrend) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    if (this.trendChart) {
      this.trendChart.destroy();
    }

    const labels = monthlyTrend.map(t => t.monthName);
    const incomes = monthlyTrend.map(t => t.income);
    const expenses = monthlyTrend.map(t => t.expense);

    this.trendChart = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Income (₹)',
            data: incomes,
            backgroundColor: '#10b981',
            borderRadius: 4
          },
          {
            label: 'Expense (₹)',
            data: expenses,
            backgroundColor: '#f43f5e',
            borderRadius: 4
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { labels: { color: '#94a3b8' } }
        },
        scales: {
          x: { grid: { color: '#1e293b' }, ticks: { color: '#94a3b8' } },
          y: { grid: { color: '#1e293b' }, ticks: { color: '#94a3b8' } }
        }
      }
    });
  },

  initDoughnut(canvasId, categoryData) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    if (this.doughnutChart) {
      this.doughnutChart.destroy();
    }

    const categories = Object.keys(categoryData);
    const values = Object.values(categoryData);

    const colors = [
      '#10b981', '#3b82f6', '#f59e0b', '#ec4899', 
      '#8b5cf6', '#06b6d4', '#f43f5e', '#64748b'
    ];

    this.doughnutChart = new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: categories,
        datasets: [{
          data: values,
          backgroundColor: colors.slice(0, categories.length),
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#94a3b8', boxWidth: 12 }
          }
        }
      }
    });
  }
};`
  }
];
