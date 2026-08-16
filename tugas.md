Deskripsi Kasus
UNSIA Digital Library membutuhkan aplikasi web full-stack yang tidak hanya mampu mengelola data
buku, anggota, dan peminjaman, tetapi juga aman digunakan, terhubung ke database, memiliki
antarmuka frontend yang nyaman, serta menyediakan dashboard visual untuk membantu pengelola
perpustakaan memahami kondisi koleksi dan transaksi peminjaman. Aplikasi yang dikembangkan harus
menerapkan konsep backend API, koneksi MongoDB/Mongoose, autentikasi JWT, validasi input,
protected route, frontend React, operasi CRUD, serta visualisasi data sederhana.
Tugas Anda adalah membangun satu aplikasi full-stack berbasis website dengan ketentuan berikut.
Soal (Bobot: 60%)
1. Buatlah aplikasi full-stack "Secure UNSIA Digital Library Dashboard" menggunakan Node.js, Express.js,
MongoDB/Mongoose, React.js, dan Chart.js dengan ketentuan minimal sebagai berikut:
• Backend REST API wajib menggunakan Node.js dan Express.js dengan struktur modular berbasis
routes, controllers, models, middleware, dan config.
• Database wajib menggunakan MongoDB, dapat berupa MongoDB Atlas atau MongoDB lokal, dengan
integrasi Mongoose.
• Aplikasi wajib memiliki minimal 4 model data: User, Book, Member, dan Loan/Peminjaman.
User authentication wajib menyediakan fitur register dan login dengan password yang di-hash
menggunakan bcryptjs.
• Autentikasi wajib menggunakan JWT dan token dikirim melalui Authorization: Bearer <token>.
• Endpoint pengelolaan data wajib dilindungi menggunakan middleware protected route, kecuali register
dan login.
• CRUD wajib tersedia minimal untuk entitas Book dan Loan/Peminjaman. CRUD untuk Member menjadi
nilai tambah.
• Setiap API wajib mengembalikan respons JSON dengan status HTTP yang tepat, seperti 200, 201, 400,
401, 403, 404, dan 500.
• Validasi input wajib diterapkan pada proses register, login, tambah buku, update buku, tambah anggota,
dan transaksi peminjaman.
• Keamanan dasar wajib diterapkan minimal menggunakan dotenv untuk environment variables, Helmet,
CORS, dan error handling global.
• Frontend wajib menggunakan React.js dengan minimal halaman Login, Register, Dashboard, Data Buku,
Data Anggota atau Peminjaman, dan halaman Not Found.
• Frontend wajib menerapkan routing, protected route, penyimpanan token, logout, dan integrasi ke
backend menggunakan fetch atau Axios.
• Dashboard wajib menampilkan minimal 3 kartu ringkasan, misalnya total buku, total anggota, total
peminjaman, dan jumlah buku tersedia.
• Dashboard wajib memiliki minimal 1 grafik menggunakan Chart.js, misalnya grafik jumlah buku per
kategori, status peminjaman, atau jumlah peminjaman per bulan.
• Aplikasi wajib memiliki tampilan web yang rapi, responsif, dan mudah digunakan.

Endpoint Minimal yang Harus Dibuat
Method Endpoint Fungsi Akses
POST /api/auth/register Registrasi pengguna baru Public
POST /api/auth/login Login dan mendapatkan
JWT
Public
GET /api/auth/me Menampilkan profil
pengguna aktif
Protected
GET /api/books Menampilkan seluruh data
buku
Protected
POST /api/books Menambahkan data buku Protected
PUT /api/books/:id Memperbarui data buku Protected
DELETE /api/books/:id Menghapus data buku Protected
GET /api/loans Menampilkan data
peminjaman
Protected
POST /api/loans Mencatat transaksi
peminjaman buku
Protected
PUT /api/loans/:id/return Mengubah status
peminjaman menjadi
dikembalikan
Protected
GET /api/dashboard/summary Mengambil data ringkasan
dashboard
Protected

Komponen Penilaian Soal Project (60%)
Komponen Kriteria Penilaian Bobot
Backend API & Struktur Proyek Struktur modular, konfigurasi server,
routing, controller, middleware, dan
error handling.
10%
Database & Mongoose Model Koneksi MongoDB, schema/model
yang tepat, relasi sederhana antarentitas,
dan penggunaan query Mongoose.
10%
Autentikasi & Keamanan JWT Register, login, hashing password, JWT,
protected route, validasi, Helmet,
CORS, dan dotenv.
15%
CRUD Buku dan Peminjaman CRUD berjalan, status HTTP tepat,
respons JSON konsisten, serta validasi
data.
10%
Frontend React & Integrasi API Routing, protected route, form, tabel
data, edit, hapus, logout, dan integrasi
API.
10%
Dashboard & Visualisasi Data Kartu ringkasan dan grafik dinamis
menggunakan Chart.js.
5%