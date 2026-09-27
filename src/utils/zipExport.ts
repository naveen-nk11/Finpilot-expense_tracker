import JSZip from 'jszip';
import { FINPILOT_POM_XML, FINPILOT_SQL, JAVA_SOURCE_FILES } from '../data/javaSourceFiles';
import { FRONTEND_FILES } from '../data/frontendSourceFiles';

const README_CONTENT = `# FinPilot – Smart Expense Tracker
> Full-Stack Personal Expense Tracker built with **Core Java (com.sun.net.httpserver.HttpServer)**, **JDBC**, **MySQL**, and **Vanilla HTML5/CSS3/JavaScript**.

## 📌 Technology Stack
- **Backend:** Core Java with JDK built-in \`com.sun.net.httpserver.HttpServer\` (No Tomcat, No Spring Boot)
- **Database:** MySQL 8.0+
- **Connectivity:** JDBC with \`PreparedStatement\` (Connection pool / DriverManager)
- **JSON Processing:** Google Gson 2.10.1
- **Password Security:** BCrypt (jBCrypt 0.4)
- **Frontend:** Responsive HTML5, CSS3 (Black & Blue theme), Vanilla JavaScript, Chart.js
- **Build System:** Apache Maven (JDK 17+)

---

## 🚀 Quick Setup Instructions

### 1. Prerequisites
- JDK 17 or later installed (\`java -version\`)
- Apache Maven installed (\`mvn -version\`)
- MySQL 8.0+ server installed and running (\`mysql -u root -p\`)

### 2. Setup MySQL Database
1. Open your terminal or MySQL Workbench:
\`\`\`bash
mysql -u root -p < finpilot.sql
\`\`\`
2. This creates the \`finpilot\` database, creates \`users\`, \`transactions\`, and \`budgets\` tables with foreign keys and indexes, and inserts sample demo data.

### 3. Configure Database Credentials (Optional)
By default, \`DBConnection.java\` connects to:
- **Host:** \`localhost\`
- **Port:** \`3306\`
- **Database:** \`finpilot\`
- **User:** \`root\`
- **Password:** \`root\`

If your credentials differ, export environment variables:
\`\`\`bash
export DB_USER=your_username
export DB_PASSWORD=your_password
export DB_PORT=3306
export DB_NAME=finpilot
\`\`\`

### 4. Build and Run Standalone Server
Run with Maven:
\`\`\`bash
mvn clean compile exec:java
\`\`\`

Or package as a standalone Fat JAR:
\`\`\`bash
mvn clean package
java -jar target/finpilot-expense-tracker-1.0.0.jar
\`\`\`

### 5. Access Application
Open your web browser and navigate to:
\`\`\`
http://localhost:8080
\`\`\`

**Demo Login Credentials:**
- Email: \`alex@finpilot.dev\`
- Password: \`Password@123\`

---

## 🏛️ Architecture Overview
\`\`\`text
Browser (Vanilla JS + fetch()) 
    ↓ HTTP/1.1 JSON (Port 8080)
com.sun.net.httpserver.HttpServer (Worker Thread Pool)
    ↓
Server Layer (HttpHandler: AuthHandler, TransactionHandler, BudgetHandler, DashboardHandler)
    ↓
Service Layer (AuthService, TransactionService, BudgetService)
    ↓
DAO Layer (UserDAO, TransactionDAO, BudgetDAO via PreparedStatement)
    ↓ JDBC Driver
MySQL Database (finpilot: users, transactions, budgets)
\`\`\`

---

## 📋 API Endpoints
| Method | Endpoint | Description |
|---|---|---|
| POST | \`/api/auth/register\` | Register user |
| POST | \`/api/auth/login\` | Authenticate and issue HTTP-only cookie / token |
| POST | \`/api/auth/logout\` | Invalidate session |
| GET | \`/api/auth/me\` | Current authenticated user |
| GET | \`/api/transactions\` | Filtered transactions (type, category, search) |
| POST | \`/api/transactions\` | Create transaction |
| PUT | \`/api/transactions/{id}\` | Update transaction |
| DELETE | \`/api/transactions/{id}\` | Delete transaction |
| GET | \`/api/dashboard\` | Total income, expense, balance, savings rate |
| GET | \`/api/budgets\` | Monthly budgets with actual spent & warning status |
| POST | \`/api/budgets\` | Upsert category budget limit |
| DELETE | \`/api/budgets/{id}\` | Remove category budget |
| GET | \`/api/reports\` | 6-month trend and category breakdown |
`;

export async function generateProjectZip(): Promise<Blob> {
  const zip = new JSZip();

  // Root configuration files
  zip.file('pom.xml', FINPILOT_POM_XML);
  zip.file('finpilot.sql', FINPILOT_SQL);
  zip.file('README.md', README_CONTENT);
  zip.file('.gitignore', `target/\n*.class\n.idea/\n*.iml\n.vscode/\n.DS_Store\n`);

  // Java source files
  const javaFolder = zip.folder('src/main/java');
  if (javaFolder) {
    for (const file of JAVA_SOURCE_FILES) {
      javaFolder.file(file.path, file.code);
    }
  }

  // Frontend resources
  const staticFolder = zip.folder('src/main/resources/static');
  if (staticFolder) {
    for (const file of FRONTEND_FILES) {
      const cleanPath = file.path.replace(/^static\//, '');
      staticFolder.file(cleanPath, file.code);
    }
  }

  return await zip.generateAsync({ type: 'blob' });
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
