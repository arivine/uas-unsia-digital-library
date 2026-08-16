import mongoose from 'mongoose';
import connectDB from './db.js';
import User from '../models/User.js';
import Book from '../models/Book.js';
import Member from '../models/Member.js';
import Loan from '../models/Loan.js';

export async function seedDatabase() {
  const bookCount = await Book.countDocuments();
  const userCount = await User.countDocuments();

  if (userCount > 0 || bookCount > 0) {
    console.log('Data sudah ada, seed dilewati.');
    return;
  }

  await User.create({
    name: 'Admin Perpustakaan',
    email: 'admin@unsia.ac.id',
    password: 'admin123',
  });

  const booksData = [
    { title: 'Pemrograman Web dengan Node.js', author: 'Budi Santoso', category: 'Teknologi', isbn: '978-602-01-1001-1', year: 2021, quantity: 10 },
    { title: 'Dasar-Dasar JavaScript', author: 'Andi Wijaya', category: 'Teknologi', isbn: '978-602-01-1002-2', year: 2020, quantity: 8 },
    { title: 'Manajemen Basis Data', author: 'Siti Rahayu', category: 'Komputer', isbn: '978-602-01-1003-3', year: 2019, quantity: 6 },
    { title: 'Statistika untuk Penelitian', author: 'Rina Marlina', category: 'Matematika', isbn: '978-602-01-1004-4', year: 2018, quantity: 5 },
    { title: 'Pengantar Ilmu Ekonomi', author: 'Dedi Kurniawan', category: 'Ekonomi', isbn: '978-602-01-1005-5', year: 2022, quantity: 12 },
    { title: 'Bahasa Indonesia Akademik', author: 'Fitri Handayani', category: 'Bahasa', isbn: '978-602-01-1006-6', year: 2017, quantity: 15 },
  ];

  const books = [];
  for (const b of booksData) {
    books.push(await Book.create({ ...b, available: b.quantity }));
  }

  const membersData = [
    { name: 'Ahmad Fauzi', email: 'ahmad@student.unsia.ac.id', phone: '081234567890', address: 'Jakarta' },
    { name: 'Dewi Lestari', email: 'dewi@student.unsia.ac.id', phone: '081298765432', address: 'Bogor' },
    { name: 'Rudi Hartono', email: 'rudi@student.unsia.ac.id', phone: '085612345678', address: 'Depok' },
  ];

  const members = [];
  for (const m of membersData) {
    members.push(await Member.create(m));
  }

  await Loan.create({
    member: members[0]._id,
    book: books[0]._id,
    loanDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
    status: 'borrowed',
  });

  await Loan.create({
    member: members[1]._id,
    book: books[1]._id,
    loanDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000),
    dueDate: new Date(Date.now() - 13 * 24 * 60 * 60 * 1000),
    returnDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000),
    status: 'returned',
  });

  await Loan.create({
    member: members[2]._id,
    book: books[2]._id,
    loanDate: new Date(),
    dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'borrowed',
  });

  console.log('Data contoh dimuat otomatis: admin@unsia.ac.id / admin123');
}

if (import.meta.url === `file://${process.argv[1]}`) {
  connectDB()
    .then(async () => {
      await Promise.all([User.deleteMany(), Book.deleteMany(), Member.deleteMany(), Loan.deleteMany()]);
      await seedDatabase();
      console.log('Seed selesai: admin@unsia.ac.id / admin123');
      await mongoose.connection.close();
      process.exit(0);
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
