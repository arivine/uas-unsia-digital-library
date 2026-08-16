import Loan from '../models/Loan.js';
import Book from '../models/Book.js';
import Member from '../models/Member.js';

const getLoans = async (req, res) => {
  const { status } = req.query;
  const filter = {};

  if (status) filter.status = status;

  const loans = await Loan.find(filter)
    .populate('member', 'name email memberId')
    .populate('book', 'title author category')
    .sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: loans.length, data: loans });
};

const createLoan = async (req, res) => {
  const { member: memberId, book: bookId, dueDate } = req.body;

  const book = await Book.findById(bookId);
  if (!book) {
    res.status(404);
    throw new Error('Buku tidak ditemukan');
  }

  const member = await Member.findById(memberId);
  if (!member) {
    res.status(404);
    throw new Error('Anggota tidak ditemukan');
  }

  if (book.available <= 0) {
    res.status(400);
    throw new Error('Stok buku tidak tersedia');
  }

  const loan = await Loan.create({
    member: memberId,
    book: bookId,
    loanDate: Date.now(),
    dueDate: dueDate || new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
    status: 'borrowed',
  });

  book.available -= 1;
  await book.save();

  const populated = await loan.populate([
    { path: 'member', select: 'name email memberId' },
    { path: 'book', select: 'title author category' },
  ]);

  res.status(201).json({
    success: true,
    message: 'Peminjaman berhasil dicatat',
    data: populated,
  });
};

const returnLoan = async (req, res) => {
  const loan = await Loan.findById(req.params.id);
  if (!loan) {
    res.status(404);
    throw new Error('Data peminjaman tidak ditemukan');
  }

  if (loan.status === 'returned') {
    res.status(400);
    throw new Error('Buku sudah dikembalikan sebelumnya');
  }

  loan.status = 'returned';
  loan.returnDate = new Date();
  await loan.save();

  const book = await Book.findById(loan.book);
  if (book) {
    book.available += 1;
    await book.save();
  }

  const populated = await loan.populate([
    { path: 'member', select: 'name email memberId' },
    { path: 'book', select: 'title author category' },
  ]);

  res.status(200).json({
    success: true,
    message: 'Buku berhasil dikembalikan',
    data: populated,
  });
};

export { getLoans, createLoan, returnLoan };
