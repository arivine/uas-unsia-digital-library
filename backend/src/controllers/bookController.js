import Book from '../models/Book.js';

const getBooks = async (req, res) => {
  const { category, search } = req.query;
  const filter = {};

  if (category) filter.category = category;
  if (search) {
    filter.$or = [
      { title: { $regex: search, $options: 'i' } },
      { author: { $regex: search, $options: 'i' } },
    ];
  }

  const books = await Book.find(filter).sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: books.length, data: books });
};

const getBookById = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    res.status(404);
    throw new Error('Buku tidak ditemukan');
  }
  res.status(200).json({ success: true, data: book });
};

const createBook = async (req, res) => {
  const { title, author, category, isbn, year, quantity, description } = req.body;

  const book = await Book.create({
    title,
    author,
    category,
    isbn,
    year,
    quantity,
    available: quantity,
    description,
  });

  res.status(201).json({ success: true, message: 'Buku berhasil ditambahkan', data: book });
};

const updateBook = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    res.status(404);
    throw new Error('Buku tidak ditemukan');
  }

  const { title, author, category, isbn, year, quantity, description } = req.body;

  const borrowedCount = book.quantity - book.available;

  book.title = title ?? book.title;
  book.author = author ?? book.author;
  book.category = category ?? book.category;
  book.isbn = isbn ?? book.isbn;
  book.year = year ?? book.year;
  book.description = description ?? book.description;

  if (quantity !== undefined) {
    if (quantity < borrowedCount) {
      res.status(400);
      throw new Error('Jumlah eksemplar tidak boleh kurang dari jumlah yang sedang dipinjam');
    }
    book.quantity = quantity;
    book.available = quantity - borrowedCount;
  }

  const updated = await book.save();

  res.status(200).json({ success: true, message: 'Buku berhasil diperbarui', data: updated });
};

const deleteBook = async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) {
    res.status(404);
    throw new Error('Buku tidak ditemukan');
  }

  if (book.available !== book.quantity) {
    res.status(400);
    throw new Error('Buku tidak dapat dihapus karena masih ada yang dipinjam');
  }

  await book.deleteOne();

  res.status(200).json({ success: true, message: 'Buku berhasil dihapus' });
};

export { getBooks, getBookById, createBook, updateBook, deleteBook };
