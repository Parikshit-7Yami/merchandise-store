# MongoDB & notifications setup (Backend)

Backend lives in the **Backend/** folder. Use **Backend/.env** for these variables.

## 1. Create a MongoDB cluster (free)

1. Go to [MongoDB Atlas](https://cloud.mongodb.com) and sign in or create an account.
2. **Create a free cluster**: Click **Build a Database** → choose **M0 Free** → pick a region → Create.
3. **Create a database user**: Security → Database Access → Add New User. Choose username/password, save the password.
4. **Allow network access**: Security → Network Access → Add IP Address → **Allow Access from Anywhere** (or add your IP).
5. **Get connection string**: Database → Connect → **Drivers** → copy the connection string. It looks like:
   ```text
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
   Replace `<username>` and `<password>` with your DB user. Add a database name before the `?`:
   ```text
   mongodb+srv://user:pass@cluster0.xxxxx.mongodb.net/campus-threads?retryWrites=true&w=majority
   ```

## 2. Configure environment

1. Copy **Backend/.env.example** to **Backend/.env**.
2. Set in **Backend/.env**:
   - **MONGODB_URI**: your Atlas connection string (from step 1).
   - **ADMIN_KEY**: same key you use to log in to Admin (default `admin123`).
   - **SMTP_*** (optional):** to send real emails when a new product is added.
     - For Gmail: use an [App Password](https://support.google.com/accounts/answer/185833). Set `SMTP_HOST=smtp.gmail.com`, `SMTP_PORT=587`, `SMTP_USER` and `SMTP_PASS`.
   - **APP_URL** (optional): e.g. `http://localhost:8080` for links in emails.

If SMTP is not set, the server still runs and “sends” are only logged (no real emails).

## 3. Run the app

From the **project root**:

- **Backend:** `npm run server` (runs Backend on port 3001). Ensure **Backend/.env** has `MONGODB_URI` and optionally SMTP.
- **Frontend:** `npm run dev` (runs Frontend; Vite proxies `/api` to http://localhost:3001).
- **Both:** run in two terminals: `npm run server` and `npm run dev`.

First time: run `npm run install:all` (or `npm install` in **Frontend** and **Backend**).

## 4. How it works

- **Admin → New Product:** Only logged-in admin can add a product. On add, the app sends one email per student in the database (if SMTP is configured).
- **Admin → Student Emails:** Add college student email IDs (and optional name). These receive the “new product” emails.
- **Database:** Minimal – two collections: `products` (admin-added products), `students` (email + optional name).
