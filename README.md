# SENGAANTHAL (செங்காந்தள்) — Full-Stack Poetry & Haiku Platform

SENGAANTHAL is an antique, vintage interactive poetry & haiku reader built with React, backed by a Node.js/Express REST API and MySQL database.

---

## 1. Architecture

```text
React Frontend (Vite)
      ↓ HTTP REST API
Node.js + Express (Port 5000)
      ↓ Connection Pool (mysql2)
MySQL Database (sengaanthal_db)
```

- **Frontend:** React 19, Vite, React PageFlip, Framer Motion, Vanilla CSS (preserving the vintage book aesthetic).
- **Backend:** Node.js, Express.js, JWT, bcryptjs, CORS, connection pooling with `mysql2`.
- **Database:** MySQL / MariaDB (`sengaanthal_db`).
- **Security:** Parameterized SQL queries, bcrypt-hashed passwords, JWT authorization, protected admin endpoints.

---

## 2. Prerequisites

- **Node.js** (v18 or higher)
- **MySQL Server** (e.g. MySQL Community Server or XAMPP on port 3306)

---

## 3. Database Setup

1. Make sure your MySQL server is running on `localhost:3306`.
2. The database schema is located at [database/schema.sql](file:///c:/Users/Lakshana%20R/OneDrive/Desktop/sengaanthal/database/schema.sql).
3. Execute the schema in MySQL:
   ```powershell
   # In PowerShell / Command Prompt
   Get-Content database/schema.sql -Raw | mysql -u root -p
   ```
   Or open [database/schema.sql](file:///c:/Users/Lakshana%20R/OneDrive/Desktop/sengaanthal/database/schema.sql) inside phpMyAdmin / MySQL Workbench and execute it.

### Database Tables:
- `users`: `id`, `name`, `email`, `password`, `role` (`'admin'`, `'reader'`), `created_at`.
- `poems`: `id`, `title`, `language` (`'tamil'`, `'english'`), `type` (`'poem'`, `'haiku'`), `content`, `published`, `created_at`, `updated_at`.
- `bookmarks`: `id`, `user_id`, `poem_id`, `created_at` (with `ON DELETE CASCADE` and `UNIQUE(user_id, poem_id)`).

*(Note: Text only, zero image columns).*

---

## 4. Environment Variables

In the `server/` directory, create a `.env` file based on [server/.env.example](file:///c:/Users/Lakshana%20R/OneDrive/Desktop/sengaanthal/server/.env.example):

```env
PORT=5000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=sengaanthal_db
JWT_SECRET=sengaanthal_vintage_quill_jwt_secret_2026_secure
```

> **Note:** `.env` is already included in `.gitignore` and is never committed to Git.

---

## 5. Seed Initial Admin & Poems

To safely populate the initial admin account (with a bcrypt-hashed password) and all 18 initial Tamil and English poems/haikus:

```bash
# From the root directory:
npm run seed

# Or from the server directory:
cd server
npm run seed
```

### Default Admin Credentials:
- **Email:** `admin@sengaanthal.com`
- **Password:** `admin123`

---

## 6. Running the Application

### A. Start the Backend API (Port 5000)
```bash
# In one terminal:
npm run server

# Or with automatic reload during development:
npm run server:dev
```

Health check endpoint: `http://localhost:5000/api/health`

### B. Start the React Frontend (Port 5173)
```bash
# In a second terminal:
npm run dev
```

Open your browser to: **`http://localhost:5173`**

---

## 7. Administrator Portal

1. Scroll to the very bottom of the public website.
2. Click the small, subtle **`Admin`** link at the footer (or navigate directly to `http://localhost:5173/admin/login`).
3. Log in with:
   - **Email:** `admin@sengaanthal.com`
   - **Password:** `admin123`
4. Access the **Admin Dashboard** (`/admin`):
   - View overview statistics: Total Poems, Published Poems, Draft Poems, Total Bookmarks.
   - Search poems by title.
   - Filter by Language (Tamil / English), Type (Poem / Haiku), and Status (Published / Draft).
   - **+ Add New Poem**: Create new poems and haikus with immediate publish or draft options.
   - **Edit**: Modify title, language, type, content, and publication status.
   - **Publish / Unpublish**: Instantly toggle reader visibility.
   - **Delete**: Remove poems with instant confirmation (associated bookmarks automatically cascade delete in MySQL).

---

## 8. REST API Reference

### Authentication (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Public | Log in with email and password, returns JWT token. |
| `GET` | `/api/auth/me` | Authenticated | Retrieve current user profile. |
| `POST` | `/api/auth/reader-session` | Public | Initialize/retrieve reader session for bookmarking. |

### Poems (`/api/poems`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/poems` | Public (Reader) | Fetch published poems. Supports `?language=tamil&type=poem`. |
| `GET` | `/api/poems/:id` | Public (Reader) | Fetch a single published poem. |
| `GET` | `/api/poems/all` | Admin Only | Fetch all poems including drafts with search/filters. |
| `GET` | `/api/poems/stats` | Admin Only | Fetch statistics for dashboard cards. |
| `POST` | `/api/poems` | Admin Only | Create a new poem/haiku. |
| `PUT` | `/api/poems/:id` | Admin Only | Edit an existing poem/haiku. |
| `DELETE`| `/api/poems/:id` | Admin Only | Delete a poem (cascades bookmarks). |
| `PATCH`| `/api/poems/:id/publish` | Admin Only | Set `published = true`. |
| `PATCH`| `/api/poems/:id/unpublish`| Admin Only | Set `published = false`. |

### Bookmarks (`/api/bookmarks`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/bookmarks` | Authenticated | Fetch bookmarks for authenticated user. |
| `POST` | `/api/bookmarks` | Authenticated | Add a bookmark (`{ poemId }`). Prevents duplicates. |
| `DELETE`| `/api/bookmarks/:poemId` | Authenticated | Remove a bookmark. |
