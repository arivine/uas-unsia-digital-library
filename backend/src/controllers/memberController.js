import Member from '../models/Member.js';

const getMembers = async (req, res) => {
  const { search } = req.query;
  const filter = {};

  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { memberId: { $regex: search, $options: 'i' } },
    ];
  }

  const members = await Member.find(filter).sort({ createdAt: -1 });

  res.status(200).json({ success: true, count: members.length, data: members });
};

const createMember = async (req, res) => {
  const { name, email, phone, address } = req.body;

  const existing = await Member.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error('Email anggota sudah terdaftar');
  }

  const member = await Member.create({ name, email, phone, address });

  res.status(201).json({ success: true, message: 'Anggota berhasil ditambahkan', data: member });
};

const updateMember = async (req, res) => {
  const member = await Member.findById(req.params.id);
  if (!member) {
    res.status(404);
    throw new Error('Anggota tidak ditemukan');
  }

  const { name, email, phone, address } = req.body;

  member.name = name ?? member.name;
  member.email = email ?? member.email;
  member.phone = phone ?? member.phone;
  member.address = address ?? member.address;

  const updated = await member.save();

  res.status(200).json({ success: true, message: 'Anggota berhasil diperbarui', data: updated });
};

const deleteMember = async (req, res) => {
  const member = await Member.findById(req.params.id);
  if (!member) {
    res.status(404);
    throw new Error('Anggota tidak ditemukan');
  }

  await member.deleteOne();

  res.status(200).json({ success: true, message: 'Anggota berhasil dihapus' });
};

export { getMembers, createMember, updateMember, deleteMember };
