import mongoose from 'mongoose';

const loanSchema = new mongoose.Schema(
  {
    member: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      required: [true, 'Anggota wajib diisi'],
    },
    book: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Book',
      required: [true, 'Buku wajib diisi'],
    },
    loanDate: {
      type: Date,
      default: Date.now,
    },
    dueDate: {
      type: Date,
      required: [true, 'Tanggal jatuh tempo wajib diisi'],
    },
    returnDate: {
      type: Date,
    },
    status: {
      type: String,
      enum: ['borrowed', 'returned'],
      default: 'borrowed',
    },
  },
  { timestamps: true }
);

const Loan = mongoose.model('Loan', loanSchema);

export default Loan;
