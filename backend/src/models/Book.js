import mongoose from 'mongoose';

const bookSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Judul buku wajib diisi'],
      trim: true,
    },
    author: {
      type: String,
      required: [true, 'Penulis wajib diisi'],
      trim: true,
    },
    category: {
      type: String,
      required: [true, 'Kategori wajib diisi'],
      trim: true,
    },
    isbn: {
      type: String,
      trim: true,
    },
    year: {
      type: Number,
      min: [1000, 'Tahun terbit tidak valid'],
      max: [new Date().getFullYear(), 'Tahun terbit tidak valid'],
    },
    quantity: {
      type: Number,
      required: [true, 'Jumlah eksemplar wajib diisi'],
      min: [0, 'Jumlah eksemplar tidak boleh negatif'],
      default: 1,
    },
    available: {
      type: Number,
      min: [0, 'Jumlah tersedia tidak boleh negatif'],
      default: 0,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

bookSchema.pre('validate', function (next) {
  if (this.available === undefined || this.available === null) {
    this.available = this.quantity;
  }
  next();
});

const Book = mongoose.model('Book', bookSchema);

export default Book;
