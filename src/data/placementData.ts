// Beginner explanations, Placement & Technical Interview Preparation for FinPilot

export interface TopicItem {
  id: string;
  title: string;
  category: 'core' | 'architecture' | 'database' | 'security' | 'oop' | 'interview';
  summary: string;
  explanation: string;
  codeSnippet?: string;
  keyTakeaway: string;
}

export interface InterviewQA {
  id: number;
  question: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  topic: string;
  answer: string;
  sampleCode?: string;
  interviewerInsight: string;
}

export const TOPICS: TopicItem[] = [
  {
    id: 'http-server-role',
    title: '1. What an HTTP Server Does & How HttpServer Works',
    category: 'architecture',
    summary: 'Understanding the web server as a daemon listening on a TCP socket',
    keyTakeaway: 'The JDK HttpServer binds to an IP/port, parses raw HTTP/1.1 byte streams into HttpExchange objects, dispatches them to registered HttpHandlers, and streams bytes back.',
    explanation: `An HTTP server is a persistent background program that binds to a network TCP port (such as 8080 or 80) and waits for incoming network connections from clients (like web browsers or mobile apps).

When a browser navigates to \`http://localhost:8080/api/transactions\`:
1. **TCP Handshake:** The browser opens a TCP socket connection with our Java process.
2. **Raw Stream Parsing:** The browser sends ASCII text containing the HTTP request (Method, Path, Headers, Body).
3. **Dispatching via \`HttpServer.createContext()\`: FinPilot registers routing patterns like \`/api/transactions\` bound to \`TransactionHandler\`. The server inspects the requested URI path and passes the connection to the corresponding \`HttpHandler.handle(HttpExchange exchange)\`.
4. **Thread Pool Execution:** Using \`server.setExecutor(Executors.newFixedThreadPool(20))\`, incoming requests are processed concurrently by worker threads, preventing one slow database query from blocking other users.
5. **Response Delivery:** The handler calls \`exchange.sendResponseHeaders(status, length)\` and writes bytes into \`exchange.getResponseBody()\`. The server flushes the TCP stream and either closes or reuses the connection (Keep-Alive).`
  },
  {
    id: 'request-response-cycle',
    title: '2. Structure of an HTTP Request and Response',
    category: 'core',
    summary: 'The exact byte protocol transmitted between browser and Java backend',
    keyTakeaway: 'An HTTP transaction is a stateless exchange of headers, status codes, and optional payload bodies.',
    explanation: `Both requests and responses follow strict RFC standards:

### An HTTP Request looks like this:
\`\`\`http
POST /api/transactions HTTP/1.1
Host: localhost:8080
Content-Type: application/json
Authorization: Bearer dGVzdC1zZXNzaW9uLXRva2Vu
Content-Length: 142

{
  "title": "Grocery Shopping",
  "amount": 75.50,
  "type": "EXPENSE",
  "category": "Food & Dining",
  "transactionDate": "2026-09-25"
}
\`\`\`

### The Java Server's Response looks like this:
\`\`\`http
HTTP/1.1 201 Created
Content-Type: application/json; charset=UTF-8
Content-Length: 188
Connection: keep-alive

{
  "success": true,
  "message": "Transaction recorded successfully",
  "transaction": {
    "id": 14,
    "title": "Grocery Shopping",
    "amount": 75.50,
    "type": "EXPENSE"
  }
}
\`\`\`

In Java, \`HttpExchange\` provides convenient methods to interact with this:
- \`exchange.getRequestMethod()\`: retrieves "POST"
- \`exchange.getRequestHeaders()\`: retrieves incoming headers
- \`exchange.getRequestBody()\`: returns an \`InputStream\` to read JSON bytes
- \`exchange.sendResponseHeaders(201, length)\`: writes the status line and headers
- \`exchange.getResponseBody()\`: returns an \`OutputStream\` to write response bytes`
  },
  {
    id: 'fetch-to-java',
    title: '3. How JavaScript fetch() Communicates with Java',
    category: 'core',
    summary: 'Bridging client-side asynchronous JS with server-side synchronous Java threads',
    keyTakeaway: 'fetch() serializes a JS object to a JSON string over HTTP; Java deserializes it via Gson into a POJO, executes business logic, and returns JSON.',
    explanation: `JavaScript in the browser cannot directly access Java objects or MySQL databases. Communication happens over standard HTTP:

1. **Frontend (Browser):**
   \`\`\`javascript
   // Client serializes JavaScript object into JSON string
   const response = await fetch('/api/transactions', {
     method: 'POST',
     headers: { 'Content-Type': 'application/json' },
     body: JSON.stringify({ title: 'Coffee', amount: 4.50, type: 'EXPENSE', category: 'Food' })
   });
   const data = await response.json();
   \`\`\`

2. **Network Layer:** The JSON string is encoded into UTF-8 bytes and transmitted over the TCP socket.

3. **Backend (Java):**
   \`\`\`java
   // In TransactionHandler.java:
   InputStreamReader reader = new InputStreamReader(exchange.getRequestBody(), StandardCharsets.UTF_8);
   JsonObject body = JsonUtil.fromJson(reader, JsonObject.class);
   String title = body.get("title").getAsString();
   BigDecimal amount = BigDecimal.valueOf(body.get("amount").getAsDouble());
   \`\`\`

4. **Response:** Java serializes the newly saved Java model back to JSON with \`JsonUtil.toJson(created)\`, sets \`Content-Type: application/json\`, and writes to the output stream.`
  },
  {
    id: 'handler-vs-servlet',
    title: '4. HttpHandler vs Java Servlets (Tomcat / Jetty)',
    category: 'architecture',
    summary: 'Why built-in HttpServer is lighter and simpler than Java Servlet containers',
    keyTakeaway: 'HttpHandler is part of the standard JDK (com.sun.net.httpserver). It requires zero external dependencies, no WAR packaging, and boots in under 100 milliseconds.',
    explanation: `Many enterprise Java applications rely on Java Servlets (packaged into \`.war\` files deployed on Apache Tomcat). Here is the contrast:

| Aspect | Built-in JDK HttpServer (\`HttpHandler\`) | Java Servlet (\`HttpServlet\` on Tomcat) |
|---|---|---|
| **Dependency** | Built into standard JDK 17+ (No jars needed) | Requires external Servlet API & Tomcat server |
| **Startup Time** | ~50 milliseconds | ~2 to 5 seconds |
| **Packaging** | Executable standalone JAR (\`java -jar finpilot.jar\`) | Often requires WAR file or embedded container |
| **Memory Footprint** | Extremely minimal (< 30 MB) | Moderate to High (> 150 MB) |
| **Interface** | Single method: \`handle(HttpExchange exchange)\` | Lifecycle methods: \`init()\`, \`doGet()\`, \`doPost()\`, \`destroy()\` |
| **Learning Curve** | Direct, transparent, great for understanding raw HTTP | Abstracted behind web.xml, filters, and container magic |

In FinPilot, using \`HttpHandler\` demonstrates mastery of core network programming without hiding behind framework magic.`
  },
  {
    id: 'jdbc-connection',
    title: '5. How JDBC Connects Java to MySQL',
    category: 'database',
    summary: 'The 4 essential steps of Java Database Connectivity and SQL Injection defense',
    keyTakeaway: 'Always use PreparedStatement with placeholders (?) to prevent SQL injection and let the database compile the execution plan once.',
    explanation: `JDBC (Java Database Connectivity) is Java's standard API for communicating with relational databases:

### The 4 Steps of JDBC:
1. **Load Driver:** \`Class.forName("com.mysql.cj.jdbc.Driver");\` registers the MySQL Connector with the DriverManager.
2. **Obtain Connection:** \`DriverManager.getConnection(url, user, password);\` establishes a stateful TCP connection to MySQL port 3306.
3. **Execute SQL with PreparedStatement:**
   \`\`\`java
   String sql = "SELECT * FROM transactions WHERE user_id = ? AND category = ?";
   try (PreparedStatement ps = conn.prepareStatement(sql)) {
       ps.setLong(1, userId);
       ps.setString(2, "Food & Dining");
       try (ResultSet rs = ps.executeQuery()) {
           while (rs.next()) { ... }
       }
   }
   \`\`\`
4. **Resource Management:** Using Java's **try-with-resources** ensures \`Connection\`, \`PreparedStatement\`, and \`ResultSet\` are automatically closed, preventing database connection leaks.

### Why PreparedStatement Prevents SQL Injection:
If we concatenated strings:
\`"SELECT * FROM users WHERE email = '" + email + "'"\`
An attacker could pass: \`admin@finpilot.dev' OR '1'='1\` and bypass authentication!
With \`PreparedStatement\`, the database pre-compiles the SQL template. The user input is treated strictly as literal data parameter, never executable SQL.`
  },
  {
    id: 'dao-service-pattern',
    title: '6. Layered Architecture: Handlers vs Services vs DAOs',
    category: 'architecture',
    summary: 'Separation of concerns (Single Responsibility Principle)',
    keyTakeaway: 'Handlers handle HTTP, Services enforce business calculations, DAOs execute database queries, and Models hold state.',
    explanation: `A common anti-pattern for beginners is writing SQL queries directly inside HTTP handlers. FinPilot uses a strict **3-Tier Layered Architecture**:

1. **Presentation / Server Layer (\`*Handler.java\`):**
   - Responsibilities: Parse HTTP headers, validate HTTP methods, authenticate session, parse JSON body, and return status codes (200, 201, 400, 401).
   - Knows nothing about SQL or database tables.

2. **Business Service Layer (\`*Service.java\`):**
   - Responsibilities: Calculate net savings, compute savings rates, calculate budget threshold alerts (>80%, >100%), hash passwords with BCrypt, coordinate multiple DAOs.
   - Knows nothing about HTTP headers, cookies, or JSON parsing.

3. **Data Access Layer (\`*DAO.java\`):**
   - Responsibilities: Connect to MySQL via JDBC, prepare SQL statements, map \`ResultSet\` rows into Model POJOs, handle SQL exceptions.
   - Knows nothing about HTTP, sessions, or frontend views.

4. **Model Layer (\`User\`, \`Transaction\`, \`Budget\`):**
   - Pure POJOs representing database entities.`
  },
  {
    id: 'oop-in-finpilot',
    title: '7. Encapsulation, Inheritance & Polymorphism in FinPilot',
    category: 'oop',
    summary: 'Real-world OOP principles demonstrated across the FinPilot codebase',
    keyTakeaway: 'OOP in FinPilot is not theoretical—it secures user data, standardizes HTTP contracts, and simplifies entity representation.',
    explanation: `### 1. Encapsulation
In \`User.java\` and \`Transaction.java\`:
- All fields (\`id\`, \`title\`, \`amount\`, \`passwordHash\`) are marked \`private\`.
- Controlled access is provided via getters and setters.
- Sensitive fields like \`passwordHash\` are marked \`transient\` so Gson will never serialize them to the browser:
\`\`\`java
public class User {
    private Long id;
    private String email;
    private transient String passwordHash; // Encapsulated & protected!
}
\`\`\`

### 2. Polymorphism (Interface Implementation)
Java's built-in \`com.sun.net.httpserver.HttpHandler\` is a functional interface:
\`\`\`java
@FunctionalInterface
public interface HttpHandler {
    void handle(HttpExchange exchange) throws IOException;
}
\`\`\`
\`AuthHandler\`, \`TransactionHandler\`, \`BudgetHandler\`, and \`DashboardHandler\` all implement this interface polymorphically. The \`HttpServer\` engine invokes \`handler.handle(exchange)\` without needing to know which specific handler class is executing!

### 3. Abstraction
\`DBConnection.getConnection()\` abstracts away socket handshakes, URL formatting, credentials retrieval from environment variables, and driver registration. Calling code simply asks for a \`Connection\`.`
  },
  {
    id: 'collections-in-finpilot',
    title: '8. How Java Collections are Used in FinPilot',
    category: 'core',
    summary: 'Practical applications of List, Map, and ConcurrentHashMap',
    keyTakeaway: 'We choose data structures based on access patterns: Lists for ordered histories, Maps for key-value lookups, and ConcurrentHashMap for multi-threaded session storage.',
    explanation: `FinPilot uses different Java Collections strategically:

1. **\`List<Transaction>\` (ArrayList):**
   - Used when fetching transaction history ordered by date.
   - Fast random access (\`O(1)\`) and easy iteration for computing dashboard totals.

2. **\`Map<String, BigDecimal>\` (LinkedHashMap):**
   - Used in \`TransactionDAO.getCategoryTotals()\`.
   - Preserves descending order of spending categories (\`Food -> Housing -> Transport\`) while allowing instant lookup by category name.

3. **\`Map<String, SessionEntry>\` (ConcurrentHashMap):**
   - Used in \`SessionManager.java\` to store active user sessions.
   - Crucial because the JDK \`HttpServer\` executes requests on a multi-threaded pool (\`newFixedThreadPool(20)\`). A standard \`HashMap\` would suffer race conditions and corruption under concurrent logins; \`ConcurrentHashMap\` provides lock-free, thread-safe reads and segmented writes!`
  },
  {
    id: 'step-by-step-trace',
    title: '9. Complete Step-by-Step Flow: Adding an Expense',
    category: 'architecture',
    summary: 'End-to-end journey from user button click to MySQL disk and DOM update',
    keyTakeaway: 'Trace: Browser Form -> JSON fetch() -> TCP Socket -> HttpServer Worker Thread -> TransactionHandler -> Session Validation -> TransactionService Validation -> TransactionDAO PreparedStatement -> MySQL InnoDB Table -> HTTP 201 Response -> DOM & Chart.js Refresh.',
    explanation: `Here is the comprehensive lifecycle when a user submits an expense of $42.50 for "Coffee Roasters":

1. **User Action:** The user fills the modal form in \`index.html\` (Title: "Coffee Roasters", Amount: 42.50, Type: "EXPENSE", Category: "Food & Dining") and clicks "Save to MySQL".
2. **Client Validation & Fetch:** \`app.js\` checks fields are non-empty and calls:
   \`API.createTransaction({ title, amount: 42.50, type: 'EXPENSE', category: 'Food & Dining' })\`.
3. **HTTP Transmission:** Browser dispatches \`POST /api/transactions\` with JSON payload and session header.
4. **HttpServer Dispatches:** Java's \`HttpServer\` allocates a worker thread from its fixed pool and routes the URI to \`TransactionHandler.handle(exchange)\`.
5. **Session Verification:** Handler calls \`SessionManager.getAuthenticatedUser(exchange)\`. If valid, it extracts the authenticated user's ID (\`userId = 1\`). Note: We NEVER trust the client for user_id!
6. **Deserialization:** Gson parses the input stream into a \`Transaction\` entity.
7. **Service Rules:** \`TransactionService.createTransaction(tx)\` verifies \`amount > 0\` and sets current date if omitted.
8. **DAO Execution:** \`TransactionDAO.save(tx)\` opens a JDBC connection, prepares the \`INSERT INTO transactions ...\` statement, binds variables with \`ps.setBigDecimal()\` and \`ps.setString()\`, and executes \`ps.executeUpdate()\`.
9. **MySQL Persistence:** MySQL writes the row to the \`transactions\` table on disk and returns the auto-generated primary key (\`id = 15\`).
10. **HTTP Response:** Java serializes the created transaction into JSON and calls \`exchange.sendResponseHeaders(201, jsonLength)\`.
11. **Frontend Update:** Browser receives 201 Created. \`app.js\` closes the modal, triggers a success toast, refreshes the transactions list, recalculates KPI cards, and re-renders the Chart.js charts!`
  }
];

export const INTERVIEW_QUESTIONS: InterviewQA[] = [
  {
    id: 1,
    question: "Why did you build FinPilot using JDK's built-in HttpServer instead of Spring Boot or Tomcat?",
    difficulty: 'Intermediate',
    topic: 'Architecture',
    answer: "Using JDK's com.sun.net.httpserver.HttpServer allowed me to understand the foundational mechanics of web servers—TCP socket listening, raw HTTP request/response headers, manual routing, and multi-threaded request dispatching—without the heavy abstractions of Spring Boot. It starts in milliseconds, requires zero external web server dependencies, and produces a lightweight runnable JAR.",
    interviewerInsight: "Demonstrates that you understand how web frameworks actually work under the hood rather than just copying annotations."
  },
  {
    id: 2,
    question: "How does FinPilot protect against SQL Injection?",
    difficulty: 'Beginner',
    topic: 'Database & Security',
    answer: "We strictly use JDBC PreparedStatement for all SQL queries instead of Statement with string concatenation. With PreparedStatement, the SQL query structure is pre-compiled by the database engine. Dynamic values are bound using positional parameters (e.g. ps.setString(1, email)). The database treats these bound parameters purely as literal values, rendering malicious input like ' OR '1'='1 harmless.",
    sampleCode: `// SECURE (PreparedStatement in UserDAO):
String sql = "SELECT * FROM users WHERE email = ?";
PreparedStatement ps = conn.prepareStatement(sql);
ps.setString(1, email); // Immune to SQL injection`,
    interviewerInsight: "A must-know answer for any software engineering interview involving relational databases."
  },
  {
    id: 3,
    question: "Why should we use BigDecimal instead of double or float for storing financial amounts in Java?",
    difficulty: 'Intermediate',
    topic: 'Core Java',
    answer: "Floats and doubles use binary IEEE 754 floating-point representation. They cannot represent decimal fractions like 0.1 or 0.05 accurately, leading to cumulative roundoff errors (e.g. 0.1 + 0.2 equals 0.30000000000000004 in double arithmetic). In financial systems like FinPilot, even a fraction of a cent discrepancy will corrupt accounting totals. BigDecimal provides arbitrary precision with exact decimal math.",
    interviewerInsight: "Classic Java interview question testing precision, data types, and domain-appropriate choices."
  },
  {
    id: 4,
    question: "How does SessionManager ensure thread safety in a multi-threaded HTTP server?",
    difficulty: 'Advanced',
    topic: 'Concurrency',
    answer: "FinPilotServer uses a fixed thread pool (Executors.newFixedThreadPool(20)), meaning up to 20 requests execute concurrently across worker threads. SessionManager uses ConcurrentHashMap<String, SessionEntry> instead of a standard HashMap. ConcurrentHashMap provides thread-safe operations without synchronizing the entire map, avoiding lock contention and race conditions during concurrent user logins and token lookups.",
    interviewerInsight: "Shows practical understanding of multi-threading and the java.util.concurrent package."
  },
  {
    id: 5,
    question: "Explain the difference between GET, POST, PUT, and DELETE HTTP methods in your REST API.",
    difficulty: 'Beginner',
    topic: 'REST & HTTP',
    answer: "FinPilot follows REST semantics:\n- GET: Idempotent and safe. Retrieves resources without modifying state (e.g. GET /api/transactions).\n- POST: Non-idempotent. Creates a new subordinate resource (e.g. POST /api/transactions to record an expense).\n- PUT: Idempotent. Replaces or updates an existing resource identified by ID (e.g. PUT /api/transactions/5).\n- DELETE: Idempotent. Removes the identified resource (e.g. DELETE /api/transactions/5).",
    interviewerInsight: "Tests fundamental RESTful design conventions and idempotency concepts."
  },
  {
    id: 6,
    question: "How does FinPilot prevent Horizontal Privilege Escalation (Insecure Direct Object Reference - IDOR)?",
    difficulty: 'Intermediate',
    topic: 'Security',
    answer: "FinPilot derives the user's identity exclusively from the authenticated server-side session token, never from client-supplied URL parameters or JSON bodies. When updating or deleting a transaction via PUT/DELETE /api/transactions/{id}, TransactionDAO executes:\n'UPDATE transactions SET ... WHERE id = ? AND user_id = ?'\nBecause user_id is forced from the session, even if User A guesses User B's transaction ID (e.g. id=99), the query matches 0 rows and rejects the unauthorized access.",
    interviewerInsight: "Critical question demonstrating that you think about access control and security vulnerabilities."
  },
  {
    id: 7,
    question: "Why do we use try-with-resources in JDBC operations?",
    difficulty: 'Beginner',
    topic: 'Core Java & JDBC',
    answer: "Connection, PreparedStatement, and ResultSet implement the java.lang.AutoCloseable interface. In older Java versions, forgetting to close them in a finally block caused database connection pool exhaustion. Java 7's try-with-resources statement guarantees that each resource is closed at the end of the statement, even if an exception occurs.",
    sampleCode: `try (Connection conn = DBConnection.getConnection();
     PreparedStatement ps = conn.prepareStatement(sql);
     ResultSet rs = ps.executeQuery()) {
    // Resources are automatically closed in reverse order of creation!
}`,
    interviewerInsight: "Standard clean coding best practice check for Java candidates."
  },
  {
    id: 8,
    question: "How does BCrypt password hashing work, and why is it superior to plain SHA-256?",
    difficulty: 'Intermediate',
    topic: 'Security',
    answer: "Fast hash algorithms like MD5 or SHA-256 are designed for speed (digesting gigabytes of files per second), which makes them vulnerable to brute-force and rainbow table attacks using modern GPUs. BCrypt incorporates a random salt (defeating rainbow tables) and is an intentionally slow, adaptive key derivation function with an adjustable work factor (cost factor). As computers get faster, the cost factor can be increased to keep brute-force attacks computationally infeasible.",
    interviewerInsight: "Demonstrates modern security hygiene regarding password storage."
  },
  {
    id: 9,
    question: "What is CORS (Cross-Origin Resource Sharing) and why does FinPilot configure CORS headers?",
    difficulty: 'Intermediate',
    topic: 'Web Security',
    answer: "CORS is a browser security mechanism that blocks web pages on one origin from making fetch requests to a different origin unless the server explicitly grants permission. In FinPilot's handlers, we set Access-Control-Allow-Origin, Access-Control-Allow-Methods, and respond with HTTP 204 to OPTIONS preflight requests so frontends can communicate seamlessly during local development.",
    interviewerInsight: "Tests web security awareness and browser-server communication rules."
  },
  {
    id: 10,
    question: "How did you design the database schema to ensure relational integrity?",
    difficulty: 'Intermediate',
    topic: 'Database Design',
    answer: "In finpilot.sql:\n1. users has a PRIMARY KEY (id) and a UNIQUE constraint on email.\n2. transactions has a FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE to ensure no orphaned transactions exist if a user is removed.\n3. budgets has a composite UNIQUE constraint (user_id, category, budget_month, budget_year) ensuring a user cannot create duplicate conflicting budgets for the same category and month.\n4. Indexes were created on (user_id, transaction_date) and (user_id, category) to make filtering and aggregation fast.",
    interviewerInsight: "Shows practical understanding of database normalization, constraints, and query indexing."
  },
  {
    id: 11,
    question: "What is the difference between executeQuery(), executeUpdate(), and execute() in JDBC?",
    difficulty: 'Beginner',
    topic: 'JDBC',
    answer: "- executeQuery(): Used strictly for SELECT statements. Returns a ResultSet containing query rows.\n- executeUpdate(): Used for DML statements (INSERT, UPDATE, DELETE) or DDL. Returns an integer representing the number of rows affected (or 0 for DDL).\n- execute(): Generic method used when the SQL type is dynamic or unknown ahead of time. Returns a boolean indicating if the first result is a ResultSet (true) or an update count (false).",
    interviewerInsight: "Fundamental JDBC knowledge test."
  },
  {
    id: 12,
    question: "How do you calculate monthly category budget alerts in FinPilot?",
    difficulty: 'Intermediate',
    topic: 'Business Logic',
    answer: "In BudgetService.java:\n1. Query the user's defined budgets for month M and year Y.\n2. Query the actual aggregated expense totals for the same month and year grouped by category via TransactionDAO.\n3. For each category: calculate percentageUsed = (actualSpent / budgetAmount) * 100.\n4. If percentageUsed >= 100%, status is 'OVERBUDGET'. If >= 80%, status is 'WARNING'. Otherwise 'SAFE'.\nThis powers visual progress bars and proactive spending warnings on the frontend.",
    interviewerInsight: "Tests business logic formulation and ability to explain algorithms clearly."
  }
];
