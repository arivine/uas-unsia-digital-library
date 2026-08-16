# Secure UNSIA Digital Library Dashboard

Aplikasi web full-stack untuk mengelola data buku, anggota, dan peminjaman perpustakaan digital UNSIA.
Dibangun dengan **Node.js + Express + MongoDB/Mongoose** (backend) dan **React + Vite + Chart.js** (frontend),
dengan autentikasi **JWT**, proteksi route, validasi input, dan keamanan dasar (Helmet, CORS, dotenv).

## Fitur

- Autentikasi: register, login, dan profil pengguna (`/api/auth/me`)
- Password di-hash dengan **bcryptjs**, token **JWT** (`Authorization: Bearer <token>`)
- CRUD Buku, CRUD Anggota (bonus), dan transaksi Peminjaman + Pengembalian
- Dashboard dengan 4 kartu ringkasan + 3 grafik (Chart.js): buku per kategori, status peminjaman, peminjaman per bulan
- Protected route, validasi input (express-validator), error handling global, Helmet & CORS
- Frontend responsif dengan React Router, protected route, penyimpanan token, dan logout

## Struktur Proyek

```
uas-unsia-digital-library/
├── backend/                 # REST API (Node.js + Express + Mongoose)
│   └── src/
│       ├── config/          # koneksi DB & seed data
│       ├── models/          # User, Book, Member, Loan
│       ├── controllers/     # logika endpoint
│       ├── routes/          # routing modular
│       ├── middleware/      # auth (protected), validator, error handler
│       ├── utils/           # generateToken, asyncHandler
│       ├── app.js           # setup express
│       └── server.js        # entry point
├── frontend/                # React + Vite + Chart.js
│   └── src/
│       ├── pages/           # Login, Register, Dashboard, Books, Members, Loans, NotFound
│       ├── components/      # Navbar, ProtectedRoute, Modal, StatCard, Layout, Icons
│       ├── context/         # AuthContext (token + user)
│       └── api/             # axios client
├── docker-compose.yml
└── README.md
```

## Cara Menjalankan

### Opsi A: Docker Compose (paling mudah, disarankan)

Cukup satu perintah, semuanya (MongoDB + backend + frontend) berjalan otomatis:

```bash
docker compose up --build
```

Setelah selesai:

- Frontend: http://localhost:8080
- Backend API: http://localhost:5000/api/health
- MongoDB: localhost:27017

### Opsi B: Menjalankan secara manual (tanpa Docker)

**Prasyarat:** Node.js (>=18) dan MongoDB berjalan di `localhost:27017`.

1. Backend:

```bash
cd backend
npm install
cp .env.example .env     # sesuaikan MONGO_URI jika perlu
npm run dev
```

2. Frontend (terminal terpisah):

```bash
cd frontend
npm install
npm run dev
```

Buka http://localhost:5173.

## Akun & Data Contoh

Data contoh **dimuat otomatis** saat database masih kosong (fitur auto-seed). Akun yang tersedia:

| Keterangan      | Nilai                       |
|-----------------|-----------------------------|
| Email           | `admin@unsia.ac.id`         |
| Password        | `admin123`                  |

Data contoh meliputi 6 buku, 3 anggota, dan 3 transaksi peminjaman. Untuk mengatur ulang data, jalankan `npm run seed` di folder `backend`, atau set `AUTO_SEED=false` di `.env` untuk menonaktifkan auto-seed.

## Endpoint API

| Method | Endpoint                 | Fungsi                          | Akses     |
|--------|--------------------------|---------------------------------|-----------|
| POST   | `/api/auth/register`     | Registrasi pengguna             | Public    |
| POST   | `/api/auth/login`        | Login, mendapatkan JWT          | Public    |
| GET    | `/api/auth/me`           | Profil pengguna aktif           | Protected |
| GET    | `/api/books`             | Seluruh data buku               | Protected |
| POST   | `/api/books`             | Tambah buku                     | Protected |
| PUT    | `/api/books/:id`         | Perbarui buku                   | Protected |
| DELETE | `/api/books/:id`         | Hapus buku                      | Protected |
| GET    | `/api/members`           | Data anggota (bonus)            | Protected |
| POST   | `/api/members`           | Tambah anggota (bonus)          | Protected |
| PUT    | `/api/members/:id`       | Perbarui anggota (bonus)        | Protected |
| DELETE | `/api/members/:id`       | Hapus anggota (bonus)           | Protected |
| GET    | `/api/loans`             | Data peminjaman                 | Protected |
| POST   | `/api/loans`             | Catat peminjaman                | Protected |
| PUT    | `/api/loans/:id/return`  | Tandai buku dikembalikan        | Protected |
| GET    | `/api/dashboard/summary` | Ringkasan dashboard             | Protected |

## Teknologi

- **Backend:** Node.js, Express.js, MongoDB, Mongoose, bcryptjs, jsonwebtoken, express-validator, helmet, cors, dotenv
- **Frontend:** React.js, Vite, React Router, Axios, Chart.js (react-chartjs-2)
