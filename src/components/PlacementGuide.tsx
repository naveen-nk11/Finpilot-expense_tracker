import React, { useState } from 'react';
import { 
  BookOpen, HelpCircle, Layers, Server, Shield, 
  Database, GitBranch, CheckCircle2, ChevronDown, ChevronRight,
  Code2, ArrowRight, Lightbulb
} from 'lucide-react';
import { TOPICS, INTERVIEW_QUESTIONS, TopicItem, InterviewQA } from '../data/placementData';

export const PlacementGuide: React.FC = () => {
  const [activeSection, setActiveSection] = useState<'concepts' | 'flow' | 'interview'>('concepts');
  const [selectedTopic, setSelectedTopic] = useState<TopicItem>(TOPICS[0]);
  const [searchQuestion, setSearchQuestion] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState<'ALL' | 'Beginner' | 'Intermediate' | 'Advanced'>('ALL');
  const [expandedQA, setExpandedQA] = useState<number | null>(1);

  const filteredQuestions = INTERVIEW_QUESTIONS.filter(q => {
    const matchesDiff = difficultyFilter === 'ALL' || q.difficulty === difficultyFilter;
    const matchesSearch = q.question.toLowerCase().includes(searchQuestion.toLowerCase()) ||
                          q.answer.toLowerCase().includes(searchQuestion.toLowerCase()) ||
                          q.topic.toLowerCase().includes(searchQuestion.toLowerCase());
    return matchesDiff && matchesSearch;
  });

  return (
    <div className="flex-1 flex flex-col min-h-0 bg-black text-slate-100 overflow-hidden font-sans">
      {/* Top Navigation */}
      <div className="bg-[#080808] border-b border-zinc-900 px-6 py-3 flex items-center justify-between shadow-xl shadow-black/80">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-lg bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 flex items-center justify-center font-bold">
            <BookOpen className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2 tracking-tight">
              Placement Preparation & Architecture Guide
              <span className="text-[10px] bg-black text-emerald-400 border border-zinc-800 px-2 py-0.5 rounded font-mono-num">
                Campus Interview Ready
              </span>
            </h2>
            <p className="text-xs text-zinc-400">
              In-depth explanations of Core Java, HttpServer, JDBC, OOP patterns, and 25+ interview answers
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-1.5 bg-[#0a0a0a] border border-zinc-800/80 p-1 rounded-xl">
          <button
            onClick={() => setActiveSection('concepts')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSection === 'concepts'
                ? 'bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-950/50'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-[#141414]'
            }`}
          >
            Core Concepts (1–9)
          </button>
          <button
            onClick={() => setActiveSection('flow')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSection === 'flow'
                ? 'bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-950/50'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-[#141414]'
            }`}
          >
            "Add Expense" End-to-End Flow
          </button>
          <button
            onClick={() => setActiveSection('interview')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
              activeSection === 'interview'
                ? 'bg-emerald-500 text-zinc-950 font-bold shadow-md shadow-emerald-950/50'
                : 'text-zinc-400 hover:text-zinc-100 hover:bg-[#141414]'
            }`}
          >
            Technical Interview Q&A
          </button>
        </div>
      </div>

      {/* SECTION 1: CORE CONCEPTS */}
      {activeSection === 'concepts' && (
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* Left topics list */}
          <aside className="w-full md:w-80 bg-[#080808] border-r border-zinc-900 p-3 overflow-y-auto space-y-1.5 shrink-0">
            <div className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400 px-2 mb-2 font-mono-num">
              Topic Breakdown
            </div>
            {TOPICS.map(topic => {
              const isSelected = selectedTopic.id === topic.id;
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedTopic(topic)}
                  className={`w-full text-left p-3 rounded-xl transition ${
                    isSelected
                      ? 'bg-[#0d1e16] border border-emerald-800/40 text-white shadow-sm'
                      : 'hover:bg-[#121212] text-zinc-400 hover:text-zinc-200'
                  }`}
                >
                  <div className="text-xs font-bold truncate text-white">{topic.title}</div>
                  <div className="text-[11px] text-zinc-400 line-clamp-2 mt-1">{topic.summary}</div>
                </button>
              );
            })}
          </aside>

          {/* Right Topic Detailed Explanation */}
          <main className="flex-1 overflow-y-auto p-6 space-y-6 bg-black">
            <div className="bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl p-6 space-y-4 shadow-2xl shadow-black/80">
              <h3 className="text-xl font-bold text-white tracking-tight">{selectedTopic.title}</h3>
              
              {/* Key Takeaway Card */}
              <div className="bg-black border border-emerald-900/50 rounded-xl p-4 flex items-start space-x-3">
                <Lightbulb className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono-num">Interview Key Takeaway</div>
                  <p className="text-sm text-zinc-300 mt-0.5">{selectedTopic.keyTakeaway}</p>
                </div>
              </div>

              {/* In-depth content formatted */}
              <div className="prose prose-invert max-w-none text-zinc-300 text-sm leading-relaxed space-y-4">
                {selectedTopic.explanation.split('\n\n').map((paragraph, idx) => {
                  if (paragraph.startsWith('### ')) {
                    return (
                      <h4 key={idx} className="text-base font-bold text-white pt-2 border-b border-zinc-800 pb-1">
                        {paragraph.replace('### ', '')}
                      </h4>
                    );
                  }
                  if (paragraph.startsWith('```')) {
                    const code = paragraph.replace(/```[a-z]*\n?/g, '');
                    return (
                      <div key={idx} className="bg-black p-4 rounded-xl border border-zinc-800 font-mono-num text-xs overflow-x-auto text-emerald-300">
                        <pre><code>{code}</code></pre>
                      </div>
                    );
                  }
                  return <p key={idx}>{paragraph}</p>;
                })}
              </div>
            </div>
          </main>
        </div>
      )}

      {/* SECTION 2: END-TO-END FLOW (STEP-BY-STEP TRACE) */}
      {activeSection === 'flow' && (
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-black">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="text-center space-y-2">
              <h3 className="text-2xl font-bold text-white tracking-tight">End-to-End "Add Expense" Execution Lifecycle</h3>
              <p className="text-sm text-zinc-400">
                Detailed journey of an HTTP request from browser DOM submission down to MySQL InnoDB block storage and back.
              </p>
            </div>

            {/* Visual Process Flow */}
            <div className="space-y-4">
              {[
                {
                  step: 1,
                  badge: 'Frontend (Browser DOM)',
                  title: '1. User Submits Transaction Form',
                  desc: 'User enters title "Supermarket Groceries", amount ₹4,650.00, category "Food & Dining", and clicks "Save to MySQL".',
                  sub: 'app.js performs client-side validation (non-empty fields, positive numbers).'
                },
                {
                  step: 2,
                  badge: 'Browser Network / fetch()',
                  title: '2. fetch() Dispatches HTTP POST Request',
                  desc: 'JavaScript calls window.fetch("/api/transactions", { method: "POST", headers: { "Content-Type": "application/json", "Authorization": "Bearer <sessionId>" }, body: JSON.stringify({...}) }).',
                  sub: 'Browser formats TCP packet containing HTTP request line, headers, and UTF-8 JSON payload.'
                },
                {
                  step: 3,
                  badge: 'Core Java HttpServer',
                  title: '3. HttpServer Receives TCP Packet & Dispatches Worker Thread',
                  desc: 'com.sun.net.httpserver.HttpServer accepts connection on port 8080 and allocates a worker thread from its fixed pool (Executors.newFixedThreadPool(20)).',
                  sub: 'Server inspects request path "/api/transactions" and routes to registered TransactionHandler.handle(exchange).'
                },
                {
                  step: 4,
                  badge: 'Security / SessionManager',
                  title: '4. Session Authentication Check',
                  desc: 'TransactionHandler calls SessionManager.getAuthenticatedUser(exchange). SessionManager verifies token against ConcurrentHashMap and checks 24-hour expiration.',
                  sub: 'Crucial: Authenticated user ID (e.g. userId = 1) is extracted strictly from server session, never trusting client parameters.'
                },
                {
                  step: 5,
                  badge: 'Serialization / Gson',
                  title: '5. JSON Deserialization to POJO',
                  desc: 'Google Gson parses the raw InputStream from exchange.getRequestBody() into a Transaction model instance, converting types (String to BigDecimal, LocalDate).',
                  sub: 'Prevents numeric precision errors by using BigDecimal for currency.'
                },
                {
                  step: 6,
                  badge: 'Business Service Layer',
                  title: '6. TransactionService Business Validation',
                  desc: 'TransactionService.createTransaction(tx) asserts tx.amount > 0 and assigns the current transaction date if left blank.',
                  sub: 'Encapsulates business rules independently of HTTP or database specifics.'
                },
                {
                  step: 7,
                  badge: 'DAO / JDBC',
                  title: '7. TransactionDAO Prepares SQL via PreparedStatement',
                  desc: 'DBConnection.getConnection() provides JDBC connection. TransactionDAO prepares SQL: "INSERT INTO transactions (user_id, title, amount, type, category, transaction_date) VALUES (?, ?, ?, ?, ?, ?)".',
                  sub: 'Positional parameters are bound using ps.setBigDecimal(3, amount) etc. Safe against SQL Injection.'
                },
                {
                  step: 8,
                  badge: 'MySQL Database',
                  title: '8. MySQL Executes INSERT & Returns Generated Primary Key',
                  desc: 'MySQL InnoDB storage engine writes the row to the transactions table, updates foreign key references to users, and indexes on (user_id, transaction_date).',
                  sub: 'Auto-increment primary key (id = 15) is returned via ps.getGeneratedKeys().'
                },
                {
                  step: 9,
                  badge: 'HTTP Response Delivery',
                  title: '9. Java HttpServer Streams 201 Created Response',
                  desc: 'TransactionHandler converts the saved entity into JSON, sets Content-Type: application/json, calls exchange.sendResponseHeaders(201, length), and writes bytes.',
                  sub: 'Connection is kept alive or gracefully released back to thread pool.'
                },
                {
                  step: 10,
                  badge: 'Frontend DOM & Charts',
                  title: '10. Frontend Receives JSON & Re-renders View',
                  desc: 'Browser promise resolves. app.js shows success notification, updates KPI cards, refreshes transaction table, and redraws Chart.js visual charts!',
                  sub: 'Budget alerts automatically recalculate with the new expense included.'
                }
              ].map(item => (
                <div key={item.step} className="bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl p-5 flex items-start space-x-4 shadow-2xl shadow-black/80">
                  <div className="w-9 h-9 rounded-xl bg-emerald-950/40 text-emerald-400 border border-emerald-800/40 flex items-center justify-center font-bold text-sm shrink-0 font-num">
                    {item.step}
                  </div>
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold text-white text-base tracking-tight">{item.title}</h4>
                      <span className="text-[10px] font-mono-num px-2 py-0.5 rounded bg-black text-emerald-400 border border-zinc-800">
                        {item.badge}
                      </span>
                    </div>
                    <p className="text-sm text-zinc-300">{item.desc}</p>
                    <p className="text-xs text-zinc-400 font-mono-num pt-1">💡 {item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* SECTION 3: TECHNICAL INTERVIEW Q&A */}
      {activeSection === 'interview' && (
        <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-black">
          <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <h3 className="text-2xl font-bold text-white tracking-tight">Technical Placement Interview Questions</h3>
                <p className="text-xs text-zinc-400">
                  Comprehensive questions asked by top tech interviewers for Core Java, JDBC, and Web Systems
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <select
                  value={difficultyFilter}
                  onChange={e => setDifficultyFilter(e.target.value as any)}
                  className="bg-black border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500"
                >
                  <option value="ALL">All Difficulties</option>
                  <option value="Beginner">Beginner</option>
                  <option value="Intermediate">Intermediate</option>
                  <option value="Advanced">Advanced</option>
                </select>
              </div>
            </div>

            {/* Q&A List */}
            <div className="space-y-4">
              {filteredQuestions.map(qa => {
                const isExpanded = expandedQA === qa.id;
                let diffBadge = 'bg-emerald-950/40 text-emerald-400 border-emerald-800/40';
                if (qa.difficulty === 'Intermediate') diffBadge = 'bg-teal-950/40 text-teal-400 border-teal-800/40';
                if (qa.difficulty === 'Advanced') diffBadge = 'bg-cyan-950/40 text-cyan-400 border-cyan-800/40';

                return (
                  <div
                    key={qa.id}
                    className="bg-[#0a0a0a] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-2xl shadow-black/80 transition"
                  >
                    <button
                      onClick={() => setExpandedQA(isExpanded ? null : qa.id)}
                      className="w-full text-left p-5 flex items-start justify-between gap-4 hover:bg-[#121212] transition"
                    >
                      <div className="space-y-1.5 flex-1">
                        <div className="flex items-center space-x-2">
                          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded border font-mono-num ${diffBadge}`}>
                            {qa.difficulty}
                          </span>
                          <span className="text-[10px] text-zinc-400 font-mono-num uppercase tracking-wider">
                            {qa.topic}
                          </span>
                        </div>
                        <h4 className="text-base font-bold text-white tracking-tight">
                          Q{qa.id}: {qa.question}
                        </h4>
                      </div>
                      <div className="text-zinc-400 mt-1">
                        {isExpanded ? <ChevronDown className="w-5 h-5 text-emerald-400" /> : <ChevronRight className="w-5 h-5" />}
                      </div>
                    </button>

                    {isExpanded && (
                      <div className="px-5 pb-5 pt-2 border-t border-zinc-800/80 space-y-4 text-sm">
                        <div className="bg-black border border-zinc-800 p-4 rounded-xl space-y-2">
                          <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono-num">
                            Model Answer for Interviewer:
                          </div>
                          <p className="text-zinc-300 leading-relaxed whitespace-pre-line">
                            {qa.answer}
                          </p>
                        </div>

                        {qa.sampleCode && (
                          <div className="bg-black border border-zinc-800 p-3 rounded-xl font-mono-num text-xs overflow-x-auto text-emerald-300">
                            <pre><code>{qa.sampleCode}</code></pre>
                          </div>
                        )}

                        <div className="bg-black border border-emerald-900/40 p-3 rounded-xl flex items-start space-x-2 text-xs text-emerald-300">
                          <Lightbulb className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                          <div>
                            <strong>Why the interviewer asks this:</strong> {qa.interviewerInsight}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
