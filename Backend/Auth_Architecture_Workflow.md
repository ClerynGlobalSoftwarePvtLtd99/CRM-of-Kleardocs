# Authentication Data Flow Architecture

This document maps the exact, step-by-step journey of an Authentication request (e.g., Login or Register) from the moment it hits your server until it interacts with your MongoDB database.

---

## The Journey of an API Request (`POST /api/v1/auth/login`)

### 1️⃣ Entry Point: `server.js`
When the server starts, `server.js` immediately does two things:
1. Connects to MongoDB via `connectDB()`.
2. Starts the Node.js server to listen for incoming traffic on your `PORT`.
*Every incoming HTTP request first arrives here.*

### 2️⃣ Global Express Pipeline: `src/app.js`
The request is handed over to your Express application where it passes through a gauntlet of global security middlewares:
- **`helmet()`**: Sets secure HTTP headers automatically.
- **`rateLimit()`**: Checks if the IP is spamming requests (blocks if > 100 requests / 15 mins).
- **`express.json()`**: Parses the incoming JSON body (with a strict `10kb` limit).
- **`securityMiddleware()`**: Recursively scrubs the body to prevent NoSQL injections and XSS (Cross-Site Scripting).
- **Router Match**: `app.js` sees the `/api/v1/auth` prefix and routes the request to your `AuthRoutes`.

### 3️⃣ Router: `src/routes/auth.routes.js`
The router receives the request and matches the exact endpoint (e.g., `/login`). 
Before hitting the controller, it pushes the request through the **Zod Validation Middleware**.

### 4️⃣ Validation: `src/middleware/validate.middleware.js` & `src/validations/auth.validation.js`
- The `validate()` middleware executes the Zod `loginSchema`.
- It checks if `email` is a valid email format and `password` is at least 6 characters.
- **If it fails**: Throws a `400 Bad Request` with exact missing fields formatted cleanly.
- **If it passes**: Proceeds to the Controller via `next()`.

### 5️⃣ Controller: `src/controllers/auth.controller.js`
The Controller acts as the traffic director. It shouldn't contain heavy logic.
- It extracts the clean `req.body` and passes it immediately to the Service layer (`authService.loginUser`).
- It waits for the Service layer to do the heavy lifting.
- When the Service returns the `user` and `token`, the Controller attaches the token to an `HttpOnly` cookie and formats the final JSON response using the `ApiResponse` utility class.

### 6️⃣ Business Logic: `src/services/auth.service.js`
This is where the actual authentication magic happens:
1. **DB Query**: Calls `User.findOne({ email })`.
2. **Status Check**: Verifies `user.active` is true and `deletedAt` is null. Throws standard `ApiError(403)` otherwise.
3. **Password Comparison**: Uses `bcrypt.compare()` to hash the incoming password and check it against the stored hash. Throws `ApiError(401)` if they don't match.
4. **Token Generation**: Signs a new JSON Web Token (`jwt.sign()`) containing the user's `id` and `role`.
5. **Returns**: Hands the user object and token back directly up to the Controller.

### 7️⃣ Database Model: `src/models/User.model.js`
Whenever the Service layer calls `User.findOne()` or `User.create()`, Mongoose relies on this schema to ensure the data strictly follows your Database rules (e.g., confirming `role` belongs to the `"admin", "agent", "accountant", "customer"` enum list).

### 8️⃣ MongoDB (Database)
The actual MongoDB cluster executes the search or insert commands, processes the Index constraints (like `email: unique`), and returns the raw BSON document back to Mongoose.

### 9️⃣ Error Catching Playground: `src/middleware/error.middleware.js`
If absolutely **anything** goes wrong during Steps 3 through 8 (e.g. Mongoose throws a duplicate email error, JWT expires, or the Service intentionally throws an `ApiError`), the Express 5 framework automatically catches the crash and shoots the request straight to your global Error Middleware.
- The Error Handler formats the crashed logic into a safe `{ success: false, message, errors }` object and returns it to the user without bringing down your live server!
