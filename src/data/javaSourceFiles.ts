// Complete Java source files and project files for FinPilot

export interface JavaFileItem {
  path: string;
  name: string;
  package: string;
  category: 'server' | 'model' | 'dao' | 'service' | 'util' | 'config' | 'sql' | 'frontend';
  description: string;
  code: string;
}

export const FINPILOT_POM_XML = `<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.finpilot</groupId>
    <artifactId>finpilot-expense-tracker</artifactId>
    <version>1.0.0</version>
    <packaging>jar</packaging>

    <name>FinPilot - Smart Expense Tracker</name>
    <description>Core Java HttpServer &amp; JDBC standalone expense management backend</description>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <gson.version>2.10.1</gson.version>
        <mysql.version>8.3.0</mysql.version>
        <jbcrypt.version>0.4</jbcrypt.version>
    </properties>

    <dependencies>
        <!-- Google Gson for JSON serialization/deserialization -->
        <dependency>
            <groupId>com.google.code.gson</groupId>
            <artifactId>gson</artifactId>
            <version>\${gson.version}</version>
        </dependency>

        <!-- Official MySQL Connector/J for JDBC connectivity -->
        <dependency>
            <groupId>com.mysql</groupId>
            <artifactId>mysql-connector-j</artifactId>
            <version>\${mysql.version}</version>
        </dependency>

        <!-- jBCrypt for secure password hashing -->
        <dependency>
            <groupId>org.mindrot</groupId>
            <artifactId>jbcrypt</artifactId>
            <version>\${jbcrypt.version}</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <!-- Maven Compiler Plugin targeting JDK 17+ -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.11.0</version>
                <configuration>
                    <source>17</source>
                    <target>17</target>
                </configuration>
            </plugin>

            <!-- Exec Maven Plugin to run FinPilotServer easily via 'mvn exec:java' -->
            <plugin>
                <groupId>org.codehaus.mojo</groupId>
                <artifactId>exec-maven-plugin</artifactId>
                <version>3.1.0</version>
                <configuration>
                    <mainClass>com.finpilot.server.FinPilotServer</mainClass>
                </configuration>
            </plugin>

            <!-- Maven Shade Plugin to create a standalone runnable Fat JAR -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-shade-plugin</artifactId>
                <version>3.5.0</version>
                <executions>
                    <execution>
                        <phase>package</phase>
                        <goals>
                            <goal>shade</goal>
                        </goals>
                        <configuration>
                            <transformers>
                                <transformer implementation="org.apache.maven.plugins.shade.resource.ManifestResourceTransformer">
                                    <mainClass>com.finpilot.server.FinPilotServer</mainClass>
                                </transformer>
                            </transformers>
                        </configuration>
                    </execution>
                </executions>
            </plugin>
        </plugins>
    </build>
</project>`;

export const FINPILOT_SQL = `-- ========================================================
-- FinPilot – Smart Expense Tracker Database Schema
-- Database: MySQL 8.0+
-- ========================================================

CREATE DATABASE IF NOT EXISTS finpilot
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE finpilot;

-- --------------------------------------------------------
-- 1. Table structure for table 'users'
-- --------------------------------------------------------
DROP TABLE IF EXISTS budgets;
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_users_email UNIQUE (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- 2. Table structure for table 'transactions'
-- --------------------------------------------------------
CREATE TABLE transactions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    title VARCHAR(150) NOT NULL,
    amount DECIMAL(12, 2) NOT NULL,
    type ENUM('INCOME', 'EXPENSE') NOT NULL,
    category VARCHAR(50) NOT NULL,
    transaction_date DATE NOT NULL,
    payment_method VARCHAR(50) DEFAULT 'Card',
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_transactions_user FOREIGN KEY (user_id) 
        REFERENCES users (id) ON DELETE CASCADE,
    INDEX idx_user_date (user_id, transaction_date),
    INDEX idx_user_category (user_id, category),
    INDEX idx_user_type (user_id, type)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------
-- 3. Table structure for table 'budgets'
-- --------------------------------------------------------
CREATE TABLE budgets (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    user_id BIGINT NOT NULL,
    category VARCHAR(50) NOT NULL,
    budget_amount DECIMAL(12, 2) NOT NULL,
    budget_month INT NOT NULL CHECK (budget_month BETWEEN 1 AND 12),
    budget_year INT NOT NULL CHECK (budget_year >= 2020),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_budgets_user FOREIGN KEY (user_id) 
        REFERENCES users (id) ON DELETE CASCADE,
    CONSTRAINT uq_user_category_period UNIQUE (user_id, category, budget_month, budget_year),
    INDEX idx_budget_lookup (user_id, budget_year, budget_month)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ========================================================
-- Sample Seed Data for Testing & Demonstration
-- Note: Default demo user password is: Password@123
-- BCrypt Hash: $2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
-- ========================================================

INSERT INTO users (id, full_name, email, password_hash) VALUES
(1, 'Alex Morgan', 'alex@finpilot.dev', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'),
(2, 'Sarah Jenkins', 'sarah@finpilot.dev', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi');

-- Sample Budgets for Current Period
INSERT INTO budgets (user_id, category, budget_amount, budget_month, budget_year) VALUES
(1, 'Food & Dining', 600.00, 9, 2026),
(1, 'Housing & Rent', 1200.00, 9, 2026),
(1, 'Transportation', 250.00, 9, 2026),
(1, 'Entertainment', 200.00, 9, 2026),
(1, 'Shopping', 300.00, 9, 2026),
(1, 'Utilities', 180.00, 9, 2026);

-- Sample Transactions
INSERT INTO transactions (user_id, title, amount, type, category, transaction_date, payment_method, description) VALUES
(1, 'Monthly Salary Deposit', 4850.00, 'INCOME', 'Salary', '2026-09-01', 'Bank Transfer', 'Primary tech company salary direct deposit'),
(1, 'Apartment Monthly Rent', 1200.00, 'EXPENSE', 'Housing & Rent', '2026-09-02', 'Bank Transfer', 'Downtown 1-bedroom apartment lease'),
(1, 'Freelance UI Design', 850.00, 'INCOME', 'Freelance', '2026-09-05', 'PayPal', 'Mobile app mockups & prototype milestone'),
(1, 'Supermarket Groceries', 142.50, 'EXPENSE', 'Food & Dining', '2026-09-07', 'Credit Card', 'Whole Foods weekly groceries'),
(1, 'Electric & Fiber Internet', 135.00, 'EXPENSE', 'Utilities', '2026-09-10', 'Direct Debit', 'Monthly electricity and 1Gbps fiber internet'),
(1, 'Metro Subway Card Reload', 60.00, 'EXPENSE', 'Transportation', '2026-09-12', 'Debit Card', 'Monthly transit pass reload'),
(1, 'Weekend Dinner & Bistro', 84.20, 'EXPENSE', 'Food & Dining', '2026-09-15', 'Credit Card', 'Dinner with college friends'),
(1, 'Cinema & Concert Tickets', 75.00, 'EXPENSE', 'Entertainment', '2026-09-18', 'Credit Card', 'Movie night and live jazz tickets'),
(1, 'Running Shoes & Apparel', 129.99, 'EXPENSE', 'Shopping', '2026-09-20', 'Credit Card', 'Nike running shoes from outlet'),
(1, 'Consulting Advisory Call', 400.00, 'INCOME', 'Investments', '2026-09-22', 'Bank Wire', 'Fintech architecture advisory session'),
(1, 'Artisan Coffee Roasters', 32.50, 'EXPENSE', 'Food & Dining', '2026-09-24', 'Apple Pay', 'Specialty beans & cold brew');
`;

export const JAVA_SOURCE_FILES: JavaFileItem[] = [
  // 1. FINPILOT SERVER
  {
    path: 'com/finpilot/server/FinPilotServer.java',
    name: 'FinPilotServer.java',
    package: 'com.finpilot.server',
    category: 'server',
    description: 'Standalone HTTP Server entry point using built-in JDK HttpServer on port 8080 with route registrations',
    code: `package com.finpilot.server;

import com.finpilot.util.DBConnection;
import com.sun.net.httpserver.HttpServer;

import java.io.IOException;
import java.net.InetSocketAddress;
import java.util.concurrent.Executors;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * FinPilotServer is the main entry point for the FinPilot application.
 * It boots the lightweight, built-in JDK {@link com.sun.net.httpserver.HttpServer}
 * without needing Tomcat, Spring Boot, or external servlet containers.
 */
public class FinPilotServer {

    private static final Logger LOGGER = Logger.getLogger(FinPilotServer.class.getName());
    private static final int DEFAULT_PORT = 8080;

    public static void main(String[] args) {
        int port = DEFAULT_PORT;
        String portEnv = System.getenv("PORT");
        if (portEnv != null && !portEnv.trim().isEmpty()) {
            try {
                port = Integer.parseInt(portEnv.trim());
            } catch (NumberFormatException e) {
                LOGGER.warning("Invalid PORT environment variable. Falling back to default: " + DEFAULT_PORT);
            }
        }

        try {
            // Verify MySQL database connectivity before accepting HTTP traffic
            LOGGER.info("Verifying MySQL database connection...");
            if (DBConnection.testConnection()) {
                LOGGER.info("MySQL connection established successfully.");
            } else {
                LOGGER.warning("Unable to connect to MySQL database! Please verify your DB credentials.");
            }

            // Create standalone JDK HttpServer on specified port
            HttpServer server = HttpServer.create(new InetSocketAddress(port), 0);

            // Register API Handlers
            server.createContext("/api/auth", new AuthHandler());
            server.createContext("/api/transactions", new TransactionHandler());
            server.createContext("/api/budgets", new BudgetHandler());
            server.createContext("/api/dashboard", new DashboardHandler());
            server.createContext("/api/reports", new DashboardHandler());

            // Register Static File Handler for Frontend HTML/CSS/JS (SPA routing)
            server.createContext("/", new StaticFileHandler());

            // Multi-threaded executor to handle concurrent HTTP requests smoothly
            server.setExecutor(Executors.newFixedThreadPool(20));

            server.start();
            LOGGER.info("=================================================================");
            LOGGER.info(" FinPilot - Smart Expense Tracker is running!");
            LOGGER.info(" Access Web UI: http://localhost:" + port);
            LOGGER.info(" API Endpoints: http://localhost:" + port + "/api/");
            LOGGER.info(" Powered by JDK 17+ Built-in com.sun.net.httpserver.HttpServer");
            LOGGER.info("=================================================================");

            // Graceful shutdown hook
            Runtime.getRuntime().addShutdownHook(new Thread(() -> {
                LOGGER.info("Shutting down FinPilot HTTP server...");
                server.stop(2);
                LOGGER.info("Server stopped.");
            }));

        } catch (IOException e) {
            LOGGER.log(Level.SEVERE, "Failed to start FinPilot HTTP server", e);
            System.exit(1);
        }
    }
}`
  },

  // 2. STATIC FILE HANDLER
  {
    path: 'com/finpilot/server/StaticFileHandler.java',
    name: 'StaticFileHandler.java',
    package: 'com.finpilot.server',
    category: 'server',
    description: 'Serves static HTML, CSS, JS, and image assets from classpath or filesystem with MIME types',
    code: `package com.finpilot.server;

import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.*;
import java.net.URI;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.Map;
import java.util.logging.Logger;

/**
 * StaticFileHandler serves static frontend assets (HTML, CSS, JS, SVG, images)
 * to the browser, acting as the web server for our vanilla single-page UI.
 */
public class StaticFileHandler implements HttpHandler {

    private static final Logger LOGGER = Logger.getLogger(StaticFileHandler.class.getName());
    private static final String STATIC_DIR = "src/main/resources/static";
    private static final Map<String, String> MIME_TYPES = new HashMap<>();

    static {
        MIME_TYPES.put("html", "text/html; charset=UTF-8");
        MIME_TYPES.put("htm", "text/html; charset=UTF-8");
        MIME_TYPES.put("css", "text/css; charset=UTF-8");
        MIME_TYPES.put("js", "application/javascript; charset=UTF-8");
        MIME_TYPES.put("json", "application/json; charset=UTF-8");
        MIME_TYPES.put("png", "image/png");
        MIME_TYPES.put("jpg", "image/jpeg");
        MIME_TYPES.put("jpeg", "image/jpeg");
        MIME_TYPES.put("svg", "image/svg+xml");
        MIME_TYPES.put("ico", "image/x-icon");
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        String method = exchange.getRequestMethod();
        if (!"GET".equalsIgnoreCase(method) && !"HEAD".equalsIgnoreCase(method)) {
            sendResponse(exchange, 405, "Method Not Allowed".getBytes(), "text/plain");
            return;
        }

        URI requestURI = exchange.getRequestURI();
        String path = requestURI.getPath();

        // Default root maps to index.html
        if (path == null || path.equals("/") || path.trim().isEmpty()) {
            path = "/index.html";
        }

        // Prevent path traversal attacks (e.g. /../etc/passwd)
        if (path.contains("..")) {
            sendResponse(exchange, 403, "Access Denied".getBytes(), "text/plain");
            return;
        }

        // Try reading from file system first, then from ClassLoader resources
        byte[] content = loadFileBytes(path);

        if (content == null) {
            // SPA fallback: return index.html for browser routes
            content = loadFileBytes("/index.html");
            if (content == null) {
                sendResponse(exchange, 404, "404 - File Not Found".getBytes(), "text/plain");
                return;
            }
            path = "/index.html";
        }

        String extension = getFileExtension(path);
        String contentType = MIME_TYPES.getOrDefault(extension.toLowerCase(), "application/octet-stream");

        // Send cache headers for static assets
        exchange.getResponseHeaders().set("Content-Type", contentType);
        exchange.getResponseHeaders().set("X-Content-Type-Options", "nosniff");
        exchange.sendResponseHeaders(200, content.length);

        try (OutputStream os = exchange.getResponseBody()) {
            os.write(content);
            os.flush();
        }
    }

    private byte[] loadFileBytes(String relativePath) {
        // Strip leading slash
        String sanitized = relativePath.startsWith("/") ? relativePath.substring(1) : relativePath;

        // 1. Try local filesystem path
        Path diskPath = Paths.get(STATIC_DIR, sanitized);
        if (Files.exists(diskPath) && !Files.isDirectory(diskPath)) {
            try {
                return Files.readAllBytes(diskPath);
            } catch (IOException ignored) {}
        }

        // 2. Try ClassLoader resources (when packaged in a JAR)
        try (InputStream is = getClass().getResourceAsStream("/static/" + sanitized)) {
            if (is != null) {
                return is.readAllBytes();
            }
        } catch (IOException ignored) {}

        return null;
    }

    private String getFileExtension(String path) {
        int dot = path.lastIndexOf('.');
        if (dot > 0 && dot < path.length() - 1) {
            return path.substring(dot + 1);
        }
        return "";
    }

    private void sendResponse(HttpExchange exchange, int statusCode, byte[] data, String contentType) throws IOException {
        exchange.getResponseHeaders().set("Content-Type", contentType);
        exchange.sendResponseHeaders(statusCode, data.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(data);
            os.flush();
        }
    }
}`
  },

  // 3. AUTH HANDLER
  {
    path: 'com/finpilot/server/AuthHandler.java',
    name: 'AuthHandler.java',
    package: 'com.finpilot.server',
    category: 'server',
    description: 'Handles user registration, login with HTTP-only cookies, logout, and current user validation',
    code: `package com.finpilot.server;

import com.finpilot.model.User;
import com.finpilot.service.AuthService;
import com.finpilot.util.JsonUtil;
import com.finpilot.util.SessionManager;
import com.google.gson.JsonObject;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Map;

/**
 * AuthHandler handles authentication routes:
 * POST /api/auth/register
 * POST /api/auth/login
 * POST /api/auth/logout
 * GET  /api/auth/me
 */
public class AuthHandler implements HttpHandler {

    private final AuthService authService = new AuthService();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        // Enable CORS for development
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie");
        exchange.getResponseHeaders().set("Access-Control-Allow-Credentials", "true");

        String method = exchange.getRequestMethod();
        if ("OPTIONS".equalsIgnoreCase(method)) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        String path = exchange.getRequestURI().getPath();

        try {
            switch (path) {
                case "/api/auth/register":
                    if ("POST".equalsIgnoreCase(method)) {
                        handleRegister(exchange);
                    } else {
                        sendError(exchange, 405, "Method Not Allowed");
                    }
                    break;

                case "/api/auth/login":
                    if ("POST".equalsIgnoreCase(method)) {
                        handleLogin(exchange);
                    } else {
                        sendError(exchange, 405, "Method Not Allowed");
                    }
                    break;

                case "/api/auth/logout":
                    if ("POST".equalsIgnoreCase(method)) {
                        handleLogout(exchange);
                    } else {
                        sendError(exchange, 405, "Method Not Allowed");
                    }
                    break;

                case "/api/auth/me":
                    if ("GET".equalsIgnoreCase(method)) {
                        handleMe(exchange);
                    } else {
                        sendError(exchange, 405, "Method Not Allowed");
                    }
                    break;

                default:
                    sendError(exchange, 404, "Endpoint not found");
                    break;
            }
        } catch (Exception e) {
            sendError(exchange, 500, "Internal Server Error: " + e.getMessage());
        }
    }

    private void handleRegister(HttpExchange exchange) throws IOException {
        JsonObject body = parseRequestBody(exchange);
        if (body == null || !body.has("email") || !body.has("password") || !body.has("fullName")) {
            sendError(exchange, 400, "Missing required fields: fullName, email, password");
            return;
        }

        String fullName = body.get("fullName").getAsString().trim();
        String email = body.get("email").getAsString().trim().toLowerCase();
        String password = body.get("password").getAsString();

        if (fullName.isEmpty() || email.isEmpty() || password.length() < 6) {
            sendError(exchange, 400, "Password must be at least 6 characters and fields cannot be blank");
            return;
        }

        User newUser = authService.register(fullName, email, password);
        if (newUser == null) {
            sendError(exchange, 409, "An account with this email already exists");
            return;
        }

        // Automatically create a session for the registered user
        String sessionId = SessionManager.createSession(newUser);
        setSessionCookie(exchange, sessionId);

        JsonObject resp = new JsonObject();
        resp.addProperty("success", true);
        resp.addProperty("message", "User registered successfully");
        resp.addProperty("sessionId", sessionId);
        resp.add("user", JsonUtil.toJsonTree(newUser));

        sendJsonResponse(exchange, 201, resp.toString());
    }

    private void handleLogin(HttpExchange exchange) throws IOException {
        JsonObject body = parseRequestBody(exchange);
        if (body == null || !body.has("email") || !body.has("password")) {
            sendError(exchange, 400, "Email and password are required");
            return;
        }

        String email = body.get("email").getAsString().trim().toLowerCase();
        String password = body.get("password").getAsString();

        User user = authService.login(email, password);
        if (user == null) {
            sendError(exchange, 401, "Invalid email or password");
            return;
        }

        String sessionId = SessionManager.createSession(user);
        setSessionCookie(exchange, sessionId);

        JsonObject resp = new JsonObject();
        resp.addProperty("success", true);
        resp.addProperty("message", "Login successful");
        resp.addProperty("sessionId", sessionId);
        resp.add("user", JsonUtil.toJsonTree(user));

        sendJsonResponse(exchange, 200, resp.toString());
    }

    private void handleLogout(HttpExchange exchange) throws IOException {
        String sessionId = getSessionIdFromExchange(exchange);
        if (sessionId != null) {
            SessionManager.invalidateSession(sessionId);
        }

        // Expire cookie
        exchange.getResponseHeaders().add("Set-Cookie", "FINPILOT_SESSION=; Path=/; HttpOnly; Max-Age=0; SameSite=Lax");

        JsonObject resp = new JsonObject();
        resp.addProperty("success", true);
        resp.addProperty("message", "Logged out successfully");
        sendJsonResponse(exchange, 200, resp.toString());
    }

    private void handleMe(HttpExchange exchange) throws IOException {
        User user = SessionManager.getAuthenticatedUser(exchange);
        if (user == null) {
            sendError(exchange, 401, "Unauthorized - please log in");
            return;
        }

        JsonObject resp = new JsonObject();
        resp.addProperty("success", true);
        resp.add("user", JsonUtil.toJsonTree(user));
        sendJsonResponse(exchange, 200, resp.toString());
    }

    private JsonObject parseRequestBody(HttpExchange exchange) {
        try (InputStreamReader reader = new InputStreamReader(exchange.getRequestBody(), StandardCharsets.UTF_8)) {
            return JsonUtil.fromJson(reader, JsonObject.class);
        } catch (Exception e) {
            return null;
        }
    }

    private void setSessionCookie(HttpExchange exchange, String sessionId) {
        exchange.getResponseHeaders().add("Set-Cookie",
                String.format("FINPILOT_SESSION=%s; Path=/; HttpOnly; Max-Age=86400; SameSite=Lax", sessionId));
    }

    private String getSessionIdFromExchange(HttpExchange exchange) {
        String authHeader = exchange.getRequestHeaders().getFirst("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7).trim();
        }
        String cookieHeader = exchange.getRequestHeaders().getFirst("Cookie");
        if (cookieHeader != null) {
            String[] cookies = cookieHeader.split(";");
            for (String cookie : cookies) {
                String[] pair = cookie.trim().split("=", 2);
                if ("FINPILOT_SESSION".equals(pair[0])) {
                    return pair[1];
                }
            }
        }
        return null;
    }

    private void sendJsonResponse(HttpExchange exchange, int statusCode, String json) throws IOException {
        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
            os.flush();
        }
    }

    private void sendError(HttpExchange exchange, int statusCode, String message) throws IOException {
        JsonObject err = new JsonObject();
        err.addProperty("success", false);
        err.addProperty("error", message);
        sendJsonResponse(exchange, statusCode, err.toString());
    }
}`
  },

  // 4. TRANSACTION HANDLER
  {
    path: 'com/finpilot/server/TransactionHandler.java',
    name: 'TransactionHandler.java',
    package: 'com.finpilot.server',
    category: 'server',
    description: 'REST Controller for /api/transactions CRUD operations with ownership verification',
    code: `package com.finpilot.server;

import com.finpilot.model.Transaction;
import com.finpilot.model.User;
import com.finpilot.service.TransactionService;
import com.finpilot.util.JsonUtil;
import com.finpilot.util.SessionManager;
import com.google.gson.JsonObject;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * TransactionHandler provides full CRUD for user transactions:
 * GET    /api/transactions           (Filterable by type, category, date)
 * POST   /api/transactions           (Create new transaction)
 * PUT    /api/transactions/{id}      (Update existing transaction)
 * DELETE /api/transactions/{id}      (Delete existing transaction)
 */
public class TransactionHandler implements HttpHandler {

    private final TransactionService transactionService = new TransactionService();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie");

        String method = exchange.getRequestMethod();
        if ("OPTIONS".equalsIgnoreCase(method)) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        // Session check: Derive user identity solely from server session
        User user = SessionManager.getAuthenticatedUser(exchange);
        if (user == null) {
            sendError(exchange, 401, "Unauthorized - please log in first");
            return;
        }

        String path = exchange.getRequestURI().getPath();
        String[] parts = path.split("/");

        try {
            if (parts.length == 3) {
                // /api/transactions
                if ("GET".equalsIgnoreCase(method)) {
                    handleList(exchange, user);
                } else if ("POST".equalsIgnoreCase(method)) {
                    handleCreate(exchange, user);
                } else {
                    sendError(exchange, 405, "Method Not Allowed");
                }
            } else if (parts.length == 4) {
                // /api/transactions/{id}
                long txId;
                try {
                    txId = Long.parseLong(parts[3]);
                } catch (NumberFormatException e) {
                    sendError(exchange, 400, "Invalid transaction ID format");
                    return;
                }

                if ("GET".equalsIgnoreCase(method)) {
                    handleGetById(exchange, user, txId);
                } else if ("PUT".equalsIgnoreCase(method)) {
                    handleUpdate(exchange, user, txId);
                } else if ("DELETE".equalsIgnoreCase(method)) {
                    handleDelete(exchange, user, txId);
                } else {
                    sendError(exchange, 405, "Method Not Allowed");
                }
            } else {
                sendError(exchange, 404, "Invalid endpoint path");
            }
        } catch (Exception e) {
            sendError(exchange, 500, "Server error: " + e.getMessage());
        }
    }

    private void handleList(HttpExchange exchange, User user) throws IOException {
        String query = exchange.getRequestURI().getQuery();
        Map<String, String> queryParams = JsonUtil.parseQueryParams(query);

        String type = queryParams.get("type");
        String category = queryParams.get("category");
        String search = queryParams.get("search");

        List<Transaction> transactions = transactionService.getTransactions(user.getId(), type, category, search);

        JsonObject resp = new JsonObject();
        resp.addProperty("success", true);
        resp.addProperty("count", transactions.size());
        resp.add("transactions", JsonUtil.toJsonTree(transactions));

        sendJsonResponse(exchange, 200, resp.toString());
    }

    private void handleCreate(HttpExchange exchange, User user) throws IOException {
        JsonObject body = parseRequestBody(exchange);
        if (body == null || !body.has("title") || !body.has("amount") || !body.has("type") || !body.has("category")) {
            sendError(exchange, 400, "Missing required fields: title, amount, type, category");
            return;
        }

        String title = body.get("title").getAsString().trim();
        BigDecimal amount = BigDecimal.valueOf(body.get("amount").getAsDouble());
        String type = body.get("type").getAsString().toUpperCase();
        String category = body.get("category").getAsString().trim();
        String paymentMethod = body.has("paymentMethod") ? body.get("paymentMethod").getAsString() : "Card";
        String description = body.has("description") ? body.get("description").getAsString() : "";
        
        LocalDate date = LocalDate.now();
        if (body.has("transactionDate")) {
            date = LocalDate.parse(body.get("transactionDate").getAsString());
        }

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            sendError(exchange, 400, "Amount must be greater than zero");
            return;
        }

        Transaction tx = new Transaction();
        tx.setUserId(user.getId());
        tx.setTitle(title);
        tx.setAmount(amount);
        tx.setType(type);
        tx.setCategory(category);
        tx.setTransactionDate(date);
        tx.setPaymentMethod(paymentMethod);
        tx.setDescription(description);

        Transaction created = transactionService.createTransaction(tx);
        if (created == null) {
            sendError(exchange, 500, "Failed to save transaction to database");
            return;
        }

        JsonObject resp = new JsonObject();
        resp.addProperty("success", true);
        resp.addProperty("message", "Transaction recorded successfully");
        resp.add("transaction", JsonUtil.toJsonTree(created));

        sendJsonResponse(exchange, 201, resp.toString());
    }

    private void handleGetById(HttpExchange exchange, User user, long id) throws IOException {
        Transaction tx = transactionService.getTransactionById(id, user.getId());
        if (tx == null) {
            sendError(exchange, 404, "Transaction not found or access denied");
            return;
        }

        JsonObject resp = new JsonObject();
        resp.addProperty("success", true);
        resp.add("transaction", JsonUtil.toJsonTree(tx));
        sendJsonResponse(exchange, 200, resp.toString());
    }

    private void handleUpdate(HttpExchange exchange, User user, long id) throws IOException {
        JsonObject body = parseRequestBody(exchange);
        if (body == null) {
            sendError(exchange, 400, "Request body required");
            return;
        }

        Transaction existing = transactionService.getTransactionById(id, user.getId());
        if (existing == null) {
            sendError(exchange, 404, "Transaction not found or access denied");
            return;
        }

        if (body.has("title")) existing.setTitle(body.get("title").getAsString());
        if (body.has("amount")) existing.setAmount(BigDecimal.valueOf(body.get("amount").getAsDouble()));
        if (body.has("type")) existing.setType(body.get("type").getAsString().toUpperCase());
        if (body.has("category")) existing.setCategory(body.get("category").getAsString());
        if (body.has("paymentMethod")) existing.setPaymentMethod(body.get("paymentMethod").getAsString());
        if (body.has("description")) existing.setDescription(body.get("description").getAsString());
        if (body.has("transactionDate")) {
            existing.setTransactionDate(LocalDate.parse(body.get("transactionDate").getAsString()));
        }

        boolean updated = transactionService.updateTransaction(existing);
        if (!updated) {
            sendError(exchange, 500, "Failed to update transaction in database");
            return;
        }

        JsonObject resp = new JsonObject();
        resp.addProperty("success", true);
        resp.addProperty("message", "Transaction updated successfully");
        resp.add("transaction", JsonUtil.toJsonTree(existing));

        sendJsonResponse(exchange, 200, resp.toString());
    }

    private void handleDelete(HttpExchange exchange, User user, long id) throws IOException {
        boolean deleted = transactionService.deleteTransaction(id, user.getId());
        if (!deleted) {
            sendError(exchange, 404, "Transaction not found or could not be deleted");
            return;
        }

        JsonObject resp = new JsonObject();
        resp.addProperty("success", true);
        resp.addProperty("message", "Transaction deleted successfully");
        sendJsonResponse(exchange, 200, resp.toString());
    }

    private JsonObject parseRequestBody(HttpExchange exchange) {
        try (InputStreamReader reader = new InputStreamReader(exchange.getRequestBody(), StandardCharsets.UTF_8)) {
            return JsonUtil.fromJson(reader, JsonObject.class);
        } catch (Exception e) {
            return null;
        }
    }

    private void sendJsonResponse(HttpExchange exchange, int statusCode, String json) throws IOException {
        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
            os.flush();
        }
    }

    private void sendError(HttpExchange exchange, int statusCode, String message) throws IOException {
        JsonObject err = new JsonObject();
        err.addProperty("success", false);
        err.addProperty("error", message);
        sendJsonResponse(exchange, statusCode, err.toString());
    }
}`
  },

  // 5. BUDGET HANDLER
  {
    path: 'com/finpilot/server/BudgetHandler.java',
    name: 'BudgetHandler.java',
    package: 'com.finpilot.server',
    category: 'server',
    description: 'REST Controller for /api/budgets with monthly category limits and spending alert calculations',
    code: `package com.finpilot.server;

import com.finpilot.model.Budget;
import com.finpilot.model.User;
import com.finpilot.service.BudgetService;
import com.finpilot.util.JsonUtil;
import com.finpilot.util.SessionManager;
import com.google.gson.JsonObject;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.math.BigDecimal;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;

/**
 * BudgetHandler manages monthly category budgets and calculates actual spending
 * comparisons for spending alerts.
 */
public class BudgetHandler implements HttpHandler {

    private final BudgetService budgetService = new BudgetService();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie");

        String method = exchange.getRequestMethod();
        if ("OPTIONS".equalsIgnoreCase(method)) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        User user = SessionManager.getAuthenticatedUser(exchange);
        if (user == null) {
            sendError(exchange, 401, "Unauthorized");
            return;
        }

        String path = exchange.getRequestURI().getPath();
        String[] parts = path.split("/");

        try {
            if (parts.length == 3) {
                // /api/budgets
                if ("GET".equalsIgnoreCase(method)) {
                    handleList(exchange, user);
                } else if ("POST".equalsIgnoreCase(method)) {
                    handleCreate(exchange, user);
                } else {
                    sendError(exchange, 405, "Method Not Allowed");
                }
            } else if (parts.length == 4) {
                // /api/budgets/{id}
                long budgetId = Long.parseLong(parts[3]);
                if ("PUT".equalsIgnoreCase(method)) {
                    handleUpdate(exchange, user, budgetId);
                } else if ("DELETE".equalsIgnoreCase(method)) {
                    handleDelete(exchange, user, budgetId);
                } else {
                    sendError(exchange, 405, "Method Not Allowed");
                }
            } else {
                sendError(exchange, 404, "Invalid route");
            }
        } catch (NumberFormatException e) {
            sendError(exchange, 400, "Invalid budget ID format");
        } catch (Exception e) {
            sendError(exchange, 500, "Internal error: " + e.getMessage());
        }
    }

    private void handleList(HttpExchange exchange, User user) throws IOException {
        String query = exchange.getRequestURI().getQuery();
        Map<String, String> params = JsonUtil.parseQueryParams(query);

        int month = LocalDate.now().getMonthValue();
        int year = LocalDate.now().getYear();

        if (params.containsKey("month")) {
            try { month = Integer.parseInt(params.get("month")); } catch (Exception ignored) {}
        }
        if (params.containsKey("year")) {
            try { year = Integer.parseInt(params.get("year")); } catch (Exception ignored) {}
        }

        List<JsonObject> budgetStatuses = budgetService.getBudgetsWithActuals(user.getId(), month, year);

        JsonObject resp = new JsonObject();
        resp.addProperty("success", true);
        resp.addProperty("month", month);
        resp.addProperty("year", year);
        resp.add("budgets", JsonUtil.toJsonTree(budgetStatuses));

        sendJsonResponse(exchange, 200, resp.toString());
    }

    private void handleCreate(HttpExchange exchange, User user) throws IOException {
        JsonObject body = parseRequestBody(exchange);
        if (body == null || !body.has("category") || !body.has("budgetAmount")) {
            sendError(exchange, 400, "category and budgetAmount are required");
            return;
        }

        String category = body.get("category").getAsString().trim();
        BigDecimal amount = BigDecimal.valueOf(body.get("budgetAmount").getAsDouble());
        int month = body.has("budgetMonth") ? body.get("budgetMonth").getAsInt() : LocalDate.now().getMonthValue();
        int year = body.has("budgetYear") ? body.get("budgetYear").getAsInt() : LocalDate.now().getYear();

        if (amount.compareTo(BigDecimal.ZERO) <= 0) {
            sendError(exchange, 400, "Budget amount must be positive");
            return;
        }

        Budget budget = new Budget();
        budget.setUserId(user.getId());
        budget.setCategory(category);
        budget.setBudgetAmount(amount);
        budget.setBudgetMonth(month);
        budget.setBudgetYear(year);

        Budget created = budgetService.createOrUpdateBudget(budget);
        if (created == null) {
            sendError(exchange, 500, "Failed to save budget");
            return;
        }

        JsonObject resp = new JsonObject();
        resp.addProperty("success", true);
        resp.addProperty("message", "Budget configured successfully");
        resp.add("budget", JsonUtil.toJsonTree(created));

        sendJsonResponse(exchange, 201, resp.toString());
    }

    private void handleUpdate(HttpExchange exchange, User user, long id) throws IOException {
        JsonObject body = parseRequestBody(exchange);
        if (body == null || !body.has("budgetAmount")) {
            sendError(exchange, 400, "budgetAmount is required");
            return;
        }

        BigDecimal newAmount = BigDecimal.valueOf(body.get("budgetAmount").getAsDouble());
        boolean ok = budgetService.updateBudgetAmount(id, user.getId(), newAmount);
        if (!ok) {
            sendError(exchange, 404, "Budget not found or not authorized");
            return;
        }

        JsonObject resp = new JsonObject();
        resp.addProperty("success", true);
        resp.addProperty("message", "Budget updated");
        sendJsonResponse(exchange, 200, resp.toString());
    }

    private void handleDelete(HttpExchange exchange, User user, long id) throws IOException {
        boolean ok = budgetService.deleteBudget(id, user.getId());
        if (!ok) {
            sendError(exchange, 404, "Budget not found or not authorized");
            return;
        }

        JsonObject resp = new JsonObject();
        resp.addProperty("success", true);
        resp.addProperty("message", "Budget deleted");
        sendJsonResponse(exchange, 200, resp.toString());
    }

    private JsonObject parseRequestBody(HttpExchange exchange) {
        try (InputStreamReader reader = new InputStreamReader(exchange.getRequestBody(), StandardCharsets.UTF_8)) {
            return JsonUtil.fromJson(reader, JsonObject.class);
        } catch (Exception e) {
            return null;
        }
    }

    private void sendJsonResponse(HttpExchange exchange, int statusCode, String json) throws IOException {
        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
            os.flush();
        }
    }

    private void sendError(HttpExchange exchange, int statusCode, String message) throws IOException {
        JsonObject err = new JsonObject();
        err.addProperty("success", false);
        err.addProperty("error", message);
        sendJsonResponse(exchange, statusCode, err.toString());
    }
}`
  },

  // 6. DASHBOARD & REPORTS HANDLER
  {
    path: 'com/finpilot/server/DashboardHandler.java',
    name: 'DashboardHandler.java',
    package: 'com.finpilot.server',
    category: 'server',
    description: 'Calculates financial KPIs (income, expense, net balance, savings rate) and Chart.js datasets',
    code: `package com.finpilot.server;

import com.finpilot.model.User;
import com.finpilot.service.TransactionService;
import com.finpilot.util.JsonUtil;
import com.finpilot.util.SessionManager;
import com.google.gson.JsonObject;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

import java.io.IOException;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.time.LocalDate;
import java.util.Map;

/**
 * DashboardHandler computes financial summary metrics for:
 * GET /api/dashboard
 * GET /api/reports
 */
public class DashboardHandler implements HttpHandler {

    private final TransactionService transactionService = new TransactionService();

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        exchange.getResponseHeaders().set("Access-Control-Allow-Origin", "*");
        exchange.getResponseHeaders().set("Access-Control-Allow-Methods", "GET, OPTIONS");
        exchange.getResponseHeaders().set("Access-Control-Allow-Headers", "Content-Type, Authorization, Cookie");

        if ("OPTIONS".equalsIgnoreCase(exchange.getRequestMethod())) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        if (!"GET".equalsIgnoreCase(exchange.getRequestMethod())) {
            sendError(exchange, 405, "Method Not Allowed");
            return;
        }

        User user = SessionManager.getAuthenticatedUser(exchange);
        if (user == null) {
            sendError(exchange, 401, "Unauthorized");
            return;
        }

        String path = exchange.getRequestURI().getPath();
        String query = exchange.getRequestURI().getQuery();
        Map<String, String> params = JsonUtil.parseQueryParams(query);

        int month = LocalDate.now().getMonthValue();
        int year = LocalDate.now().getYear();

        if (params.containsKey("month")) {
            try { month = Integer.parseInt(params.get("month")); } catch (Exception ignored) {}
        }
        if (params.containsKey("year")) {
            try { year = Integer.parseInt(params.get("year")); } catch (Exception ignored) {}
        }

        try {
            JsonObject summary;
            if (path.startsWith("/api/reports")) {
                summary = transactionService.getDetailedReports(user.getId(), month, year);
            } else {
                summary = transactionService.getDashboardSummary(user.getId(), month, year);
            }

            JsonObject resp = new JsonObject();
            resp.addProperty("success", true);
            resp.add("data", summary);

            sendJsonResponse(exchange, 200, resp.toString());
        } catch (Exception e) {
            sendError(exchange, 500, "Error generating summary: " + e.getMessage());
        }
    }

    private void sendJsonResponse(HttpExchange exchange, int statusCode, String json) throws IOException {
        byte[] bytes = json.getBytes(StandardCharsets.UTF_8);
        exchange.getResponseHeaders().set("Content-Type", "application/json; charset=UTF-8");
        exchange.sendResponseHeaders(statusCode, bytes.length);
        try (OutputStream os = exchange.getResponseBody()) {
            os.write(bytes);
            os.flush();
        }
    }

    private void sendError(HttpExchange exchange, int statusCode, String message) throws IOException {
        JsonObject err = new JsonObject();
        err.addProperty("success", false);
        err.addProperty("error", message);
        sendJsonResponse(exchange, statusCode, err.toString());
    }
}`
  },

  // 7. USER MODEL
  {
    path: 'com/finpilot/model/User.java',
    name: 'User.java',
    package: 'com.finpilot.model',
    category: 'model',
    description: 'User entity POJO demonstrating encapsulation with private fields, getters/setters, and toString',
    code: `package com.finpilot.model;

import java.sql.Timestamp;

/**
 * User model representing an authenticated user account.
 * Follows strict encapsulation principles: private fields with public getters/setters.
 */
public class User {

    private Long id;
    private String fullName;
    private String email;
    // Transient or excluded from JSON response to prevent password exposure
    private transient String passwordHash;
    private Timestamp createdAt;

    public User() {}

    public User(Long id, String fullName, String email, String passwordHash, Timestamp createdAt) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.passwordHash = passwordHash;
        this.createdAt = createdAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPasswordHash() {
        return passwordHash;
    }

    public void setPasswordHash(String passwordHash) {
        this.passwordHash = passwordHash;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", fullName='" + fullName + '\'' +
                ", email='" + email + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}`
  },

  // 8. TRANSACTION MODEL
  {
    path: 'com/finpilot/model/Transaction.java',
    name: 'Transaction.java',
    package: 'com.finpilot.model',
    category: 'model',
    description: 'Transaction entity POJO for income/expense records with BigDecimal monetary precision',
    code: `package com.finpilot.model;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.time.LocalDate;

/**
 * Transaction entity POJO.
 * Uses BigDecimal for financial amount precision to avoid binary floating-point roundoff errors.
 */
public class Transaction {

    private Long id;
    private Long userId;
    private String title;
    private BigDecimal amount;
    private String type; // 'INCOME' or 'EXPENSE'
    private String category;
    private LocalDate transactionDate;
    private String paymentMethod;
    private String description;
    private Timestamp createdAt;

    public Transaction() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public LocalDate getTransactionDate() {
        return transactionDate;
    }

    public void setTransactionDate(LocalDate transactionDate) {
        this.transactionDate = transactionDate;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    public boolean isExpense() {
        return "EXPENSE".equalsIgnoreCase(this.type);
    }

    public boolean isIncome() {
        return "INCOME".equalsIgnoreCase(this.type);
    }
}`
  },

  // 9. BUDGET MODEL
  {
    path: 'com/finpilot/model/Budget.java',
    name: 'Budget.java',
    package: 'com.finpilot.model',
    category: 'model',
    description: 'Budget entity POJO representing category spending caps per month/year',
    code: `package com.finpilot.model;

import java.math.BigDecimal;
import java.sql.Timestamp;

/**
 * Budget model representing a spending target set by the user
 * for a specific category during a calendar month.
 */
public class Budget {

    private Long id;
    private Long userId;
    private String category;
    private BigDecimal budgetAmount;
    private Integer budgetMonth;
    private Integer budgetYear;
    private Timestamp createdAt;

    public Budget() {}

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public BigDecimal getBudgetAmount() {
        return budgetAmount;
    }

    public void setBudgetAmount(BigDecimal budgetAmount) {
        this.budgetAmount = budgetAmount;
    }

    public Integer getBudgetMonth() {
        return budgetMonth;
    }

    public void setBudgetMonth(Integer budgetMonth) {
        this.budgetMonth = budgetMonth;
    }

    public Integer getBudgetYear() {
        return budgetYear;
    }

    public void setBudgetYear(Integer budgetYear) {
        this.budgetYear = budgetYear;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}`
  },

  // 10. USER DAO
  {
    path: 'com/finpilot/dao/UserDAO.java',
    name: 'UserDAO.java',
    package: 'com.finpilot.dao',
    category: 'dao',
    description: 'Data Access Object for user table executing parameterized SQL via PreparedStatement',
    code: `package com.finpilot.dao;

import com.finpilot.model.User;
import com.finpilot.util.DBConnection;

import java.sql.*;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * UserDAO handles all SQL operations on the 'users' table in MySQL.
 * Strictly uses PreparedStatement to eliminate SQL Injection vulnerabilities.
 */
public class UserDAO {

    private static final Logger LOGGER = Logger.getLogger(UserDAO.class.getName());

    public User save(User user) {
        String sql = "INSERT INTO users (full_name, email, password_hash) VALUES (?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setString(1, user.getFullName());
            ps.setString(2, user.getEmail());
            ps.setString(3, user.getPasswordHash());

            int affectedRows = ps.executeUpdate();
            if (affectedRows == 0) {
                return null;
            }

            try (ResultSet generatedKeys = ps.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    user.setId(generatedKeys.getLong(1));
                    return user;
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error inserting user into MySQL", e);
        }
        return null;
    }

    public User findByEmail(String email) {
        String sql = "SELECT id, full_name, email, password_hash, created_at FROM users WHERE email = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, email);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapRowToUser(rs);
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error querying user by email", e);
        }
        return null;
    }

    public User findById(Long id) {
        String sql = "SELECT id, full_name, email, password_hash, created_at FROM users WHERE id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setLong(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapRowToUser(rs);
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error querying user by id", e);
        }
        return null;
    }

    private User mapRowToUser(ResultSet rs) throws SQLException {
        User u = new User();
        u.setId(rs.getLong("id"));
        u.setFullName(rs.getString("full_name"));
        u.setEmail(rs.getString("email"));
        u.setPasswordHash(rs.getString("password_hash"));
        u.setCreatedAt(rs.getTimestamp("created_at"));
        return u;
    }
}`
  },

  // 11. TRANSACTION DAO
  {
    path: 'com/finpilot/dao/TransactionDAO.java',
    name: 'TransactionDAO.java',
    package: 'com.finpilot.dao',
    category: 'dao',
    description: 'Data Access Object for transactions table with dynamic filtering, batch aggregates, and CRUD',
    code: `package com.finpilot.dao;

import com.finpilot.model.Transaction;
import com.finpilot.util.DBConnection;

import java.math.BigDecimal;
import java.sql.*;
import java.time.LocalDate;
import java.util.*;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * TransactionDAO executes JDBC operations for the 'transactions' table.
 * Demonstrates Java Collections usage (List, Map) and PreparedStatements.
 */
public class TransactionDAO {

    private static final Logger LOGGER = Logger.getLogger(TransactionDAO.class.getName());

    public Transaction save(Transaction tx) {
        String sql = "INSERT INTO transactions (user_id, title, amount, type, category, transaction_date, payment_method, description) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setLong(1, tx.getUserId());
            ps.setString(2, tx.getTitle());
            ps.setBigDecimal(3, tx.getAmount());
            ps.setString(4, tx.getType());
            ps.setString(5, tx.getCategory());
            ps.setDate(6, java.sql.Date.valueOf(tx.getTransactionDate()));
            ps.setString(7, tx.getPaymentMethod());
            ps.setString(8, tx.getDescription());

            int affected = ps.executeUpdate();
            if (affected > 0) {
                try (ResultSet keys = ps.getGeneratedKeys()) {
                    if (keys.next()) {
                        tx.setId(keys.getLong(1));
                        return tx;
                    }
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error inserting transaction into database", e);
        }
        return null;
    }

    public List<Transaction> findFiltered(Long userId, String type, String category, String search) {
        List<Transaction> list = new ArrayList<>();
        StringBuilder sql = new StringBuilder("SELECT * FROM transactions WHERE user_id = ?");
        List<Object> params = new ArrayList<>();
        params.add(userId);

        if (type != null && !type.trim().isEmpty() && !type.equalsIgnoreCase("ALL")) {
            sql.append(" AND type = ?");
            params.add(type.toUpperCase());
        }
        if (category != null && !category.trim().isEmpty() && !category.equalsIgnoreCase("ALL")) {
            sql.append(" AND category = ?");
            params.add(category);
        }
        if (search != null && !search.trim().isEmpty()) {
            sql.append(" AND (title LIKE ? OR description LIKE ?)");
            params.add("%" + search.trim() + "%");
            params.add("%" + search.trim() + "%");
        }

        sql.append(" ORDER BY transaction_date DESC, id DESC");

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql.toString())) {

            for (int i = 0; i < params.size(); i++) {
                ps.setObject(i + 1, params.get(i));
            }

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapRow(rs));
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error fetching transactions", e);
        }
        return list;
    }

    public Transaction findByIdAndUser(Long id, Long userId) {
        String sql = "SELECT * FROM transactions WHERE id = ? AND user_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setLong(1, id);
            ps.setLong(2, userId);

            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapRow(rs);
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error fetching transaction by id", e);
        }
        return null;
    }

    public boolean update(Transaction tx) {
        String sql = "UPDATE transactions SET title = ?, amount = ?, type = ?, category = ?, " +
                     "transaction_date = ?, payment_method = ?, description = ? WHERE id = ? AND user_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setString(1, tx.getTitle());
            ps.setBigDecimal(2, tx.getAmount());
            ps.setString(3, tx.getType());
            ps.setString(4, tx.getCategory());
            ps.setDate(5, java.sql.Date.valueOf(tx.getTransactionDate()));
            ps.setString(6, tx.getPaymentMethod());
            ps.setString(7, tx.getDescription());
            ps.setLong(8, tx.getId());
            ps.setLong(9, tx.getUserId());

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error updating transaction", e);
            return false;
        }
    }

    public boolean delete(Long id, Long userId) {
        String sql = "DELETE FROM transactions WHERE id = ? AND user_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setLong(1, id);
            ps.setLong(2, userId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error deleting transaction", e);
            return false;
        }
    }

    public Map<String, BigDecimal> getCategoryTotals(Long userId, int month, int year, String type) {
        Map<String, BigDecimal> totals = new LinkedHashMap<>();
        String sql = "SELECT category, SUM(amount) AS total FROM transactions " +
                     "WHERE user_id = ? AND type = ? AND MONTH(transaction_date) = ? AND YEAR(transaction_date) = ? " +
                     "GROUP BY category ORDER BY total DESC";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setLong(1, userId);
            ps.setString(2, type);
            ps.setInt(3, month);
            ps.setInt(4, year);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    totals.put(rs.getString("category"), rs.getBigDecimal("total"));
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error getting category totals", e);
        }
        return totals;
    }

    private Transaction mapRow(ResultSet rs) throws SQLException {
        Transaction tx = new Transaction();
        tx.setId(rs.getLong("id"));
        tx.setUserId(rs.getLong("user_id"));
        tx.setTitle(rs.getString("title"));
        tx.setAmount(rs.getBigDecimal("amount"));
        tx.setType(rs.getString("type"));
        tx.setCategory(rs.getString("category"));
        java.sql.Date d = rs.getDate("transaction_date");
        if (d != null) {
            tx.setTransactionDate(d.toLocalDate());
        }
        tx.setPaymentMethod(rs.getString("payment_method"));
        tx.setDescription(rs.getString("description"));
        tx.setCreatedAt(rs.getTimestamp("created_at"));
        return tx;
    }
}`
  },

  // 12. BUDGET DAO
  {
    path: 'com/finpilot/dao/BudgetDAO.java',
    name: 'BudgetDAO.java',
    package: 'com.finpilot.dao',
    category: 'dao',
    description: 'Data Access Object for budgets table handling category limits and monthly upserts',
    code: `package com.finpilot.dao;

import com.finpilot.model.Budget;
import com.finpilot.util.DBConnection;

import java.math.BigDecimal;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * BudgetDAO handles database queries and upserts for category monthly spending budgets.
 */
public class BudgetDAO {

    private static final Logger LOGGER = Logger.getLogger(BudgetDAO.class.getName());

    public Budget upsert(Budget budget) {
        String sql = "INSERT INTO budgets (user_id, category, budget_amount, budget_month, budget_year) " +
                     "VALUES (?, ?, ?, ?, ?) " +
                     "ON DUPLICATE KEY UPDATE budget_amount = VALUES(budget_amount)";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setLong(1, budget.getUserId());
            ps.setString(2, budget.getCategory());
            ps.setBigDecimal(3, budget.getBudgetAmount());
            ps.setInt(4, budget.getBudgetMonth());
            ps.setInt(5, budget.getBudgetYear());

            ps.executeUpdate();
            return budget;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error upserting budget", e);
            return null;
        }
    }

    public List<Budget> findByUserAndPeriod(Long userId, int month, int year) {
        List<Budget> list = new ArrayList<>();
        String sql = "SELECT * FROM budgets WHERE user_id = ? AND budget_month = ? AND budget_year = ? ORDER BY category ASC";

        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setLong(1, userId);
            ps.setInt(2, month);
            ps.setInt(3, year);

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    Budget b = new Budget();
                    b.setId(rs.getLong("id"));
                    b.setUserId(rs.getLong("user_id"));
                    b.setCategory(rs.getString("category"));
                    b.setBudgetAmount(rs.getBigDecimal("budget_amount"));
                    b.setBudgetMonth(rs.getInt("budget_month"));
                    b.setBudgetYear(rs.getInt("budget_year"));
                    b.setCreatedAt(rs.getTimestamp("created_at"));
                    list.add(b);
                }
            }
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error querying budgets for period", e);
        }
        return list;
    }

    public boolean updateAmount(Long id, Long userId, BigDecimal newAmount) {
        String sql = "UPDATE budgets SET budget_amount = ? WHERE id = ? AND user_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setBigDecimal(1, newAmount);
            ps.setLong(2, id);
            ps.setLong(3, userId);

            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error updating budget amount", e);
            return false;
        }
    }

    public boolean delete(Long id, Long userId) {
        String sql = "DELETE FROM budgets WHERE id = ? AND user_id = ?";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setLong(1, id);
            ps.setLong(2, userId);
            return ps.executeUpdate() > 0;
        } catch (SQLException e) {
            LOGGER.log(Level.SEVERE, "Error deleting budget", e);
            return false;
        }
    }
}`
  },

  // 13. AUTH SERVICE
  {
    path: 'com/finpilot/service/AuthService.java',
    name: 'AuthService.java',
    package: 'com.finpilot.service',
    category: 'service',
    description: 'Business logic for authentication: password hashing, email validation, and credential verification',
    code: `package com.finpilot.service;

import com.finpilot.dao.UserDAO;
import com.finpilot.model.User;
import org.mindrot.jbcrypt.BCrypt;

import java.util.logging.Logger;

/**
 * AuthService implements business logic for user security:
 * - BCrypt salted password hashing
 * - Input validation & duplicate checking
 * - Credential verification
 */
public class AuthService {

    private static final Logger LOGGER = Logger.getLogger(AuthService.class.getName());
    private final UserDAO userDAO = new UserDAO();

    public User register(String fullName, String email, String plainPassword) {
        // Business Rule: Email uniqueness
        User existing = userDAO.findByEmail(email);
        if (existing != null) {
            LOGGER.info("Registration rejected: email " + email + " already in use.");
            return null;
        }

        // Salt and hash the password using BCrypt (cost factor 10)
        String hashedPassword = BCrypt.hashpw(plainPassword, BCrypt.gensalt(10));

        User user = new User();
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPasswordHash(hashedPassword);

        return userDAO.save(user);
    }

    public User login(String email, String plainPassword) {
        User user = userDAO.findByEmail(email);
        if (user == null) {
            return null;
        }

        // Compare plain text password against stored BCrypt hash safely
        if (BCrypt.checkpw(plainPassword, user.getPasswordHash())) {
            return user;
        }

        return null;
    }

    public User getUserById(Long id) {
        return userDAO.findById(id);
    }
}`
  },

  // 14. TRANSACTION SERVICE
  {
    path: 'com/finpilot/service/TransactionService.java',
    name: 'TransactionService.java',
    package: 'com.finpilot.service',
    category: 'service',
    description: 'Business logic for transactions, KPI computations, monthly aggregations, and Chart.js datasets',
    code: `package com.finpilot.service;

import com.finpilot.dao.TransactionDAO;
import com.finpilot.model.Transaction;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.*;

/**
 * TransactionService encapsulates business logic and financial calculations
 * including balances, savings percentages, monthly comparisons, and category aggregates.
 */
public class TransactionService {

    private final TransactionDAO transactionDAO = new TransactionDAO();

    public Transaction createTransaction(Transaction tx) {
        // Enforce business validation
        if (tx.getAmount() == null || tx.getAmount().compareTo(BigDecimal.ZERO) <= 0) {
            throw new IllegalArgumentException("Transaction amount must be strictly greater than zero");
        }
        if (tx.getTransactionDate() == null) {
            tx.setTransactionDate(LocalDate.now());
        }
        return transactionDAO.save(tx);
    }

    public List<Transaction> getTransactions(Long userId, String type, String category, String search) {
        return transactionDAO.findFiltered(userId, type, category, search);
    }

    public Transaction getTransactionById(Long id, Long userId) {
        return transactionDAO.findByIdAndUser(id, userId);
    }

    public boolean updateTransaction(Transaction tx) {
        return transactionDAO.update(tx);
    }

    public boolean deleteTransaction(Long id, Long userId) {
        return transactionDAO.delete(id, userId);
    }

    public JsonObject getDashboardSummary(Long userId, int month, int year) {
        List<Transaction> all = transactionDAO.findFiltered(userId, "ALL", "ALL", null);

        BigDecimal currentMonthIncome = BigDecimal.ZERO;
        BigDecimal currentMonthExpense = BigDecimal.ZERO;
        BigDecimal totalAllTimeBalance = BigDecimal.ZERO;

        for (Transaction tx : all) {
            BigDecimal amt = tx.getAmount();
            boolean isCurMonth = (tx.getTransactionDate().getMonthValue() == month &&
                                  tx.getTransactionDate().getYear() == year);

            if (tx.isIncome()) {
                totalAllTimeBalance = totalAllTimeBalance.add(amt);
                if (isCurMonth) {
                    currentMonthIncome = currentMonthIncome.add(amt);
                }
            } else if (tx.isExpense()) {
                totalAllTimeBalance = totalAllTimeBalance.subtract(amt);
                if (isCurMonth) {
                    currentMonthExpense = currentMonthExpense.add(amt);
                }
            }
        }

        BigDecimal netSavings = currentMonthIncome.subtract(currentMonthExpense);
        double savingsRate = 0.0;
        if (currentMonthIncome.compareTo(BigDecimal.ZERO) > 0) {
            savingsRate = netSavings.divide(currentMonthIncome, 4, RoundingMode.HALF_UP)
                                   .multiply(BigDecimal.valueOf(100)).doubleValue();
            if (savingsRate < 0) savingsRate = 0.0;
        }

        JsonObject summary = new JsonObject();
        summary.addProperty("totalIncome", currentMonthIncome);
        summary.addProperty("totalExpense", currentMonthExpense);
        summary.addProperty("netBalance", netSavings);
        summary.addProperty("allTimeBalance", totalAllTimeBalance);
        summary.addProperty("savingsRate", Math.round(savingsRate * 10.0) / 10.0);
        summary.addProperty("month", month);
        summary.addProperty("year", year);

        // Recent 5 transactions
        JsonArray recent = new JsonArray();
        int limit = Math.min(5, all.size());
        for (int i = 0; i < limit; i++) {
            Transaction tx = all.get(i);
            JsonObject item = new JsonObject();
            item.addProperty("id", tx.getId());
            item.addProperty("title", tx.getTitle());
            item.addProperty("amount", tx.getAmount());
            item.addProperty("type", tx.getType());
            item.addProperty("category", tx.getCategory());
            item.addProperty("date", tx.getTransactionDate().toString());
            item.addProperty("paymentMethod", tx.getPaymentMethod());
            recent.add(item);
        }
        summary.add("recentTransactions", recent);

        return summary;
    }

    public JsonObject getDetailedReports(Long userId, int month, int year) {
        JsonObject report = new JsonObject();

        // 1. Category breakdown for expenses
        Map<String, BigDecimal> expenseByCat = transactionDAO.getCategoryTotals(userId, month, year, "EXPENSE");
        JsonObject catJson = new JsonObject();
        for (Map.Entry<String, BigDecimal> entry : expenseByCat.entrySet()) {
            catJson.addProperty(entry.getKey(), entry.getValue());
        }
        report.add("expensesByCategory", catJson);

        // 2. 6-Month Income vs Expense Trend
        JsonArray monthlyTrend = new JsonArray();
        LocalDate now = LocalDate.of(year, month, 1);

        for (int i = 5; i >= 0; i--) {
            LocalDate target = now.minusMonths(i);
            int m = target.getMonthValue();
            int y = target.getYear();

            List<Transaction> mList = transactionDAO.findFiltered(userId, "ALL", "ALL", null);
            BigDecimal inc = BigDecimal.ZERO;
            BigDecimal exp = BigDecimal.ZERO;

            for (Transaction tx : mList) {
                if (tx.getTransactionDate().getMonthValue() == m && tx.getTransactionDate().getYear() == y) {
                    if (tx.isIncome()) inc = inc.add(tx.getAmount());
                    if (tx.isExpense()) exp = exp.add(tx.getAmount());
                }
            }

            JsonObject mObj = new JsonObject();
            mObj.addProperty("monthName", target.getMonth().name().substring(0, 3) + " " + y);
            mObj.addProperty("month", m);
            mObj.addProperty("year", y);
            mObj.addProperty("income", inc);
            mObj.addProperty("expense", exp);
            mObj.addProperty("net", inc.subtract(exp));
            monthlyTrend.add(mObj);
        }
        report.add("monthlyTrend", monthlyTrend);

        return report;
    }
}`
  },

  // 15. BUDGET SERVICE
  {
    path: 'com/finpilot/service/BudgetService.java',
    name: 'BudgetService.java',
    package: 'com.finpilot.service',
    category: 'service',
    description: 'Calculates budget vs actual spending percentages, progress bars, and spending warning alerts',
    code: `package com.finpilot.service;

import com.finpilot.dao.BudgetDAO;
import com.finpilot.dao.TransactionDAO;
import com.finpilot.model.Budget;
import com.google.gson.JsonObject;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * BudgetService manages monthly spending caps and computes actual utilization
 * to generate proactive alerts when spending crosses 80% or 100% threshold.
 */
public class BudgetService {

    private final BudgetDAO budgetDAO = new BudgetDAO();
    private final TransactionDAO transactionDAO = new TransactionDAO();

    public Budget createOrUpdateBudget(Budget budget) {
        return budgetDAO.upsert(budget);
    }

    public boolean updateBudgetAmount(Long id, Long userId, BigDecimal newAmount) {
        return budgetDAO.updateAmount(id, userId, newAmount);
    }

    public boolean deleteBudget(Long id, Long userId) {
        return budgetDAO.delete(id, userId);
    }

    public List<JsonObject> getBudgetsWithActuals(Long userId, int month, int year) {
        List<Budget> budgets = budgetDAO.findByUserAndPeriod(userId, month, year);
        Map<String, BigDecimal> actualSpending = transactionDAO.getCategoryTotals(userId, month, year, "EXPENSE");

        List<JsonObject> results = new ArrayList<>();

        for (Budget b : budgets) {
            BigDecimal actual = actualSpending.getOrDefault(b.getCategory(), BigDecimal.ZERO);
            BigDecimal limit = b.getBudgetAmount();

            double percent = 0.0;
            if (limit.compareTo(BigDecimal.ZERO) > 0) {
                percent = actual.divide(limit, 4, RoundingMode.HALF_UP)
                                .multiply(BigDecimal.valueOf(100)).doubleValue();
            }

            BigDecimal remaining = limit.subtract(actual);
            String status = "SAFE"; // SAFE (< 80%), WARNING (80-100%), OVERBUDGET (> 100%)
            if (percent >= 100.0) {
                status = "OVERBUDGET";
            } else if (percent >= 80.0) {
                status = "WARNING";
            }

            JsonObject item = new JsonObject();
            item.addProperty("id", b.getId());
            item.addProperty("category", b.getCategory());
            item.addProperty("budgetAmount", limit);
            item.addProperty("actualSpent", actual);
            item.addProperty("remaining", remaining);
            item.addProperty("percentageUsed", Math.round(percent * 10.0) / 10.0);
            item.addProperty("status", status);
            item.addProperty("month", b.getBudgetMonth());
            item.addProperty("year", b.getBudgetYear());

            results.add(item);
        }

        return results;
    }
}`
  },

  // 16. DB CONNECTION
  {
    path: 'com/finpilot/util/DBConnection.java',
    name: 'DBConnection.java',
    package: 'com.finpilot.util',
    category: 'util',
    description: 'Singleton JDBC connection manager with environment variable configuration and connection testing',
    code: `package com.finpilot.util;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * DBConnection provides JDBC database connectivity to MySQL.
 * Credentials are securely retrieved from Environment Variables,
 * preventing accidental commitment of passwords to source control.
 */
public class DBConnection {

    private static final Logger LOGGER = Logger.getLogger(DBConnection.class.getName());

    private static final String DEFAULT_HOST = "localhost";
    private static final String DEFAULT_PORT = "3306";
    private static final String DEFAULT_DB   = "finpilot";
    private static final String DEFAULT_USER = "root";
    private static final String DEFAULT_PASS = "root";

    static {
        try {
            // Load MySQL Connector/J driver
            Class.forName("com.mysql.cj.jdbc.Driver");
        } catch (ClassNotFoundException e) {
            LOGGER.log(Level.SEVERE, "MySQL JDBC Driver not found in classpath. Include mysql-connector-j in pom.xml", e);
        }
    }

    public static Connection getConnection() throws SQLException {
        String host = getEnvOrDefault("DB_HOST", DEFAULT_HOST);
        String port = getEnvOrDefault("DB_PORT", DEFAULT_PORT);
        String database = getEnvOrDefault("DB_NAME", DEFAULT_DB);
        String user = getEnvOrDefault("DB_USER", DEFAULT_USER);
        String password = getEnvOrDefault("DB_PASSWORD", DEFAULT_PASS);

        String jdbcUrl = String.format("jdbc:mysql://%s:%s/%s?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=UTC",
                host, port, database);

        return DriverManager.getConnection(jdbcUrl, user, password);
    }

    public static boolean testConnection() {
        try (Connection conn = getConnection()) {
            return conn != null && !conn.isClosed();
        } catch (SQLException e) {
            LOGGER.warning("DBConnection test failed: " + e.getMessage());
            return false;
        }
    }

    private static String getEnvOrDefault(String key, String defaultValue) {
        String val = System.getenv(key);
        if (val != null && !val.trim().isEmpty()) {
            return val.trim();
        }
        return defaultValue;
    }
}`
  },

  // 17. JSON UTIL
  {
    path: 'com/finpilot/util/JsonUtil.java',
    name: 'JsonUtil.java',
    package: 'com.finpilot.util',
    category: 'util',
    description: 'Gson wrapper with custom TypeAdapters for LocalDate/Timestamp and URL query string parsing',
    code: `package com.finpilot.util;

import com.google.gson.*;

import java.io.Reader;
import java.lang.reflect.Type;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;

/**
 * JsonUtil wraps Google Gson with type adapters for Java 8 Time APIs (LocalDate).
 */
public class JsonUtil {

    private static final Gson GSON = new GsonBuilder()
            .registerTypeAdapter(LocalDate.class, (JsonSerializer<LocalDate>) (src, typeOfSrc, context) ->
                    new JsonPrimitive(src.format(DateTimeFormatter.ISO_LOCAL_DATE)))
            .registerTypeAdapter(LocalDate.class, (JsonDeserializer<LocalDate>) (json, typeOfT, context) ->
                    LocalDate.parse(json.getAsString(), DateTimeFormatter.ISO_LOCAL_DATE))
            .setDateFormat("yyyy-MM-dd HH:mm:ss")
            .create();

    public static String toJson(Object obj) {
        return GSON.toJson(obj);
    }

    public static JsonElement toJsonTree(Object obj) {
        return GSON.toJsonTree(obj);
    }

    public static <T> T fromJson(String json, Class<T> classOfT) {
        return GSON.fromJson(json, classOfT);
    }

    public static <T> T fromJson(Reader reader, Class<T> classOfT) {
        return GSON.fromJson(reader, classOfT);
    }

    public static Map<String, String> parseQueryParams(String query) {
        Map<String, String> map = new HashMap<>();
        if (query == null || query.trim().isEmpty()) {
            return map;
        }
        String[] pairs = query.split("&");
        for (String pair : pairs) {
            int idx = pair.indexOf("=");
            if (idx > 0) {
                String key = pair.substring(0, idx);
                String value = pair.substring(idx + 1);
                map.put(key, value);
            } else {
                map.put(pair, "");
            }
        }
        return map;
    }
}`
  },

  // 18. SESSION MANAGER
  {
    path: 'com/finpilot/util/SessionManager.java',
    name: 'SessionManager.java',
    package: 'com.finpilot.util',
    category: 'util',
    description: 'Thread-safe in-memory session store mapping cryptographically secure tokens to authenticated Users',
    code: `package com.finpilot.util;

import com.finpilot.model.User;
import com.sun.net.httpserver.HttpExchange;

import java.security.SecureRandom;
import java.time.Instant;
import java.util.Base64;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

/**
 * SessionManager implements stateful session authentication:
 * - Generates cryptographically secure random session tokens
 * - Tracks user identity on the server side
 * - Automatically expires inactive sessions after 24 hours
 * - Never trusts client-supplied user IDs
 */
public class SessionManager {

    private static final long SESSION_EXPIRY_SECONDS = 86400; // 24 hours
    private static final SecureRandom RANDOM = new SecureRandom();
    private static final Map<String, SessionEntry> SESSIONS = new ConcurrentHashMap<>();

    private static class SessionEntry {
        final User user;
        final Instant expiresAt;

        SessionEntry(User user, Instant expiresAt) {
            this.user = user;
            this.expiresAt = expiresAt;
        }

        boolean isExpired() {
            return Instant.now().isAfter(expiresAt);
        }
    }

    public static String createSession(User user) {
        byte[] bytes = new byte[32];
        RANDOM.nextBytes(bytes);
        String token = Base64.getUrlEncoder().withoutPadding().encodeToString(bytes);

        Instant expiresAt = Instant.now().plusSeconds(SESSION_EXPIRY_SECONDS);
        SESSIONS.put(token, new SessionEntry(user, expiresAt));
        return token;
    }

    public static User getAuthenticatedUser(HttpExchange exchange) {
        String token = extractSessionToken(exchange);
        if (token == null) {
            return null;
        }

        SessionEntry entry = SESSIONS.get(token);
        if (entry == null) {
            return null;
        }

        if (entry.isExpired()) {
            SESSIONS.remove(token);
            return null;
        }

        return entry.user;
    }

    public static void invalidateSession(String token) {
        if (token != null) {
            SESSIONS.remove(token);
        }
    }

    private static String extractSessionToken(HttpExchange exchange) {
        // 1. Check Bearer token header
        String authHeader = exchange.getRequestHeaders().getFirst("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7).trim();
        }

        // 2. Check Cookie header
        String cookieHeader = exchange.getRequestHeaders().getFirst("Cookie");
        if (cookieHeader != null) {
            String[] cookies = cookieHeader.split(";");
            for (String cookie : cookies) {
                String[] pair = cookie.trim().split("=", 2);
                if ("FINPILOT_SESSION".equals(pair[0])) {
                    return pair[1];
                }
            }
        }

        return null;
    }
}`
  }
];
