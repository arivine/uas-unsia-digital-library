import mongoose from 'mongoose';

const memberSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Nama anggota wajib diisi'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email anggota wajib diisi'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Format email tidak valid'],
    },
    phone: {
      type: String,
      trim: true,
    },
    address: {
      type: String,
      trim: true,
    },
    memberId: {
      type: String,
      unique: true,
      trim: true,
    },
  },
  { timestamps: true }
);

memberSchema.pre('save', async function (next) {
  if (!this.memberId) {
    const count = await mongoose.model('Member').countDocuments();
    this.memberId = `M${String(count + 1).padStart(4, '0')}`;
  }
  next();
});

const Member = mongoose.model('Member', memberSchema);

export default Member;
