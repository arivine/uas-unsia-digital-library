import { useEffect, useState } from 'react';
import api from '../api/client';
import Modal from '../components/Modal';

const emptyForm = { name: '', email: '', phone: '', address: '' };

export default function Members() {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const res = await api.get('/members', { params: search ? { search } : {} });
      setMembers(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat data anggota');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (member) => {
    setEditing(member);
    setForm({
      name: member.name,
      email: member.email,
      phone: member.phone || '',
      address: member.address || '',
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      if (editing) {
        await api.put(`/members/${editing._id}`, form);
      } else {
        await api.post('/members', form);
      }
      setModalOpen(false);
      fetchMembers();
    } catch (err) {
      const msg = err.response?.data?.message;
      const fieldErrors = err.response?.data?.errors;
      setFormError(
        fieldErrors?.length ? fieldErrors.map((e) => e.message).join(', ') : msg || 'Gagal menyimpan'
      );
    }
  };

  const handleDelete = async (member) => {
    if (!window.confirm(`Hapus anggota "${member.name}"?`)) return;
    try {
      await api.delete(`/members/${member._id}`);
      fetchMembers();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus anggota');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Data Anggota</h1>
          <p className="page-subtitle">Kelola data anggota perpustakaan</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          + Tambah Anggota
        </button>
      </div>

      <div className="toolbar">
        <input
          className="search-input"
          type="text"
          placeholder="Cari nama, email, atau ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchMembers()}
        />
        <button className="btn btn-outline" onClick={fetchMembers}>
          Cari
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loader-wrap">
          <div className="spinner" />
        </div>
      ) : (
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>ID Anggota</th>
                <th>Nama</th>
                <th>Email</th>
                <th>Telepon</th>
                <th>Alamat</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {members.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-cell">
                    Belum ada data anggota
                  </td>
                </tr>
              ) : (
                members.map((member) => (
                  <tr key={member._id}>
                    <td>
                      <span className="badge">{member.memberId}</span>
                    </td>
                    <td>{member.name}</td>
                    <td>{member.email}</td>
                    <td>{member.phone || '-'}</td>
                    <td>{member.address || '-'}</td>
                    <td>
                      <button className="btn btn-sm btn-outline" onClick={() => openEdit(member)}>
                        Edit
                      </button>{' '}
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(member)}>
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <Modal title={editing ? 'Edit Anggota' : 'Tambah Anggota'} onClose={() => setModalOpen(false)}>
          {formError && <div className="alert alert-error">{formError}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Nama Lengkap</label>
              <input name="name" value={form.name} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" name="email" value={form.email} onChange={handleChange} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Telepon</label>
                <input name="phone" value={form.phone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Alamat</label>
                <input name="address" value={form.address} onChange={handleChange} />
              </div>
            </div>
            <div className="modal-actions">
              <button type="button" className="btn btn-outline" onClick={() => setModalOpen(false)}>
                Batal
              </button>
              <button type="submit" className="btn btn-primary">
                Simpan
              </button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  );
}
