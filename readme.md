# MASCO Equipment Request Portal

**MASCO General Contracting** presents a streamlined equipment request portal, featuring an Express.js backend and a responsive, Bootstrap-powered frontend.

---

## 🚀 Features

- **Role-Based Access**: Separate views and permissions for *Employees* and *Admins*.
- **Session Auth**: Secure, session-based login flow.
- **Request Submission**: Employees submit equipment requests with detailed justification.
- **Admin Dashboard**:
  - Key metrics (total, approved, pending, rejected).
  - Interactive charts (status breakdown, trend over time).
  - Pending requests table with in-line approve/reject actions.
- **Responsive Design**: Mobile-first layout, custom blurred header, and modern UI enhancements.

---

## 📋 Prerequisites

- **Node.js** v14+ (LTS recommended)
- **npm** (bundled with Node.js)

---

## 🛠 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/<USERNAME>/<REPO>.git
   cd <REPO>
   ```
2. **Install dependencies**
   ```bash
   npm install
   ```

---

## ▶️ Running Locally

Start the server and access the portal:

```bash
node server.js
```

- **Employee**: [http://localhost:3000/login.html](http://localhost:3000/login.html) *(select role **`employee`**)*
- **Admin**:    [http://localhost:3000/login.html](http://localhost:3000/login.html) *(select role **`admin`**)*

---

## 📁 Project Structure

```
/ (project root)
├─ public/             # Frontend assets
│  ├─ css/             # Stylesheets
│  │  ├─ style.css
│  │  └─ admin.css
│  ├─ js/              # Client-side scripts
│  │  ├─ admin.js
│  │  ├─ employees.js
│  │  └─ inventory.js
│  ├─ img/             # Logos and images
│  └─ *.html           # Standalone pages
├─ server.js           # Express.js server
├─ package.json        # npm metadata & scripts
└─ README.md           # Project overview
```

---

## 🧑‍💻 Usage

### Employee

1. Log in as **Employee**.
2. Complete and submit the **New Equipment Request** form.
3. Track request status under **My Requests**.

### Admin

1. Log in as **Admin**.
2. Review dashboard KPIs and charts.
3. Approve or reject pending requests in the table.

---

## 🤝 Contributing

Contributions, issues, and feature requests welcome!

1. Fork the repository.
2. Create a feature branch: `git checkout -b feature/new-feature`.
3. Commit your changes: `git commit -m "Add new feature"`.
4. Push to branch: `git push origin feature/new-feature`.
5. Open a Pull Request.

---

## 📄 License

Licensed under the **MIT License**. See [LICENSE](LICENSE) for details.

