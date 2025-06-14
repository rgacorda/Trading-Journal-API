# 📈 Trading Journal API

A powerful and secure RESTful API built with **Express.js** and **MySQL (Sequelize ORM)** to serve as the backend for a trading journal platform. Designed for use with a **Next.js** frontend, this API helps traders track their performance, upload trades from supported platforms, and view insightful statistics.

---

## 🚀 Features

- 🔐 **JWT Authentication**
  - Secure login system with role-based access control (RBAC)
- 📂 **CSV / Excel File Upload**
  - Upload trades directly from supported brokers or platforms
- 📊 **Trading Statistics**
  - Get performance summaries and metrics for visualization in frontend
- 🧾 **Journal Management**
  - Create, update, and delete individual trades
- 💼 **Broker Account Management**
  - Manage broker/platform accounts and update balances
- 📁 **RESTful API**
  - Clean, scalable, and version-ready structure using Express.js

---

## 🛠 Tech Stack

- **Node.js / Express.js**
- **MySQL** (via **Sequelize** ORM)
- **JWT** (JSON Web Tokens) for auth
- **Multer / XLSX / csv-parser** (for file uploads and parsing)
- **Role-Based Access Control** for secured feature management

---

## 📦 Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- MySQL database

### Installation

```bash
git clone https://github.com/your-username/trading-journal-api.git
cd trading-journal-api
npm install
```

Setup
Create a .env file in the root with the following environment variables:
```bash
PORT=3000
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourpassword
DB_NAME=trading_journal
JWT_SECRET=your_jwt_secret
```
Make sure your MySQL server is running and the database specified in DB_NAME exists (or use Sequelize sync options to create it).

Run in Development
npm run dev
The API should now be running at http://localhost:3000

📁 Folder Structure
```bash
src/
├── config/            # DB & JWT config
├── controllers/       # Route logic
├── middlewares/       # Auth & role check
├── models/            # Sequelize models
├── routes/            # API routes
├── utils/             # Helpers (CSV/XLS parsing, token, etc.)
└── index.js           # Entry point
```
📌 Available Endpoints

All endpoints require JWT access tokens unless otherwise specified.
🔐 Auth
👤 User & Role
📈 Trades
💼 Accounts
📊 Statistics
🔐 Role-Based Access

Role	Capabilities
Free	View own trades, upload manually
Silver	CSV/XLSX upload, access to stats
Gold	All features, multi-platform management
📤 Frontend Integration

This API is intended to be consumed by a frontend via HTTP calls with JWT-based session tokens (stored as HTTP-only cookies or Authorization headers).

🧪 TODO / Roadmap

 Swagger/OpenAPI documentation
 Import mapping templates per broker/platform
 Advanced filtering and search
 Tagging system for trades (e.g., strategy-based)
 Multi-user team sharing (premium tier)
📄 License


🤝 Contributing

PRs are welcome! Please open an issue first to discuss what you’d like to change.

📬 Contact

For questions, issues, or feature requests, feel free to contact:
📧 rgacorda.the2nd@gmail.com
