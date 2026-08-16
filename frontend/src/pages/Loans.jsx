import { useEffect, useState } from 'react';
import api from '../api/client';
import Modal from '../components/Modal';

export default function Loans() {
  const [loans, setLoans] = useState([]);
  const [members, setMembers] = useState([]);
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ member: '', book: '', dueDate: '' });
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  const fetchLoans = async () => {
    setLoading(true);
    try {
      const res = await api.get('/loans', { params: statusFilter ? { status: statusFilter } : {} });
      setLoans(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat data peminjaman');
    } finally {
      setLoading(false);
    }
  };

  const fetchOptions = async () => {
    try {
      const [m, b] = await Promise.all([api.get('/members'), api.get('/books')]);
      setMembers(m.data.data);
      setBooks(b.data.data.filter((book) => book.available > 0));
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat data');
    }
  };

  useEffect(() => {
    fetchLoans();
    fetchOptions();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    try {
      await api.post('/loans', {
        member: form.member,
        book: form.book,
        dueDate: form.dueDate || undefined,
      });
      setModalOpen(false);
      setForm({ member: '', book: '', dueDate: '' });
      fetchLoans();
      fetchOptions();
    } catch (err) {
      const msg = err.response?.data?.message;
      const fieldErrors = err.response?.data?.errors;
      setFormError(
        fieldErrors?.length ? fieldErrors.map((e) => e.message).join(', ') : msg || 'Gagal menyimpan'
      );
    }
  };

  const handleReturn = async (loan) => {
    if (!window.confirm('Tandai buku sebagai dikembalikan?')) return;
    try {
      await api.put(`/loans/${loan._id}/return`);
      fetchLoans();
      fetchOptions();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal memproses pengembalian');
    }
  };

  const formatDate = (date) =>
    date ? new Date(date).toLocaleDateString('id-ID') : '-';

  const statusBadge = (status) =>
    status === 'borrowed' ? (
      <span className="badge badge-warning">Dipinjam</span>
    ) : (
      <span className="badge badge-success">Dikembalikan</span>
    );

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Peminjaman</h1>
          <p className="page-subtitle">Kelola transaksi peminjaman buku</p>
        </div>
        <button
          className="btn btn-primary"
          onClick={() => {
            setFormError('');
            setModalOpen(true);
          }}
        >
          + Catat Peminjaman
        </button>
      </div>

      <div className="toolbar">
        <select
          className="search-input"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Semua Status</option>
          <option value="borrowed">Dipinjam</option>
          <option value="returned">Dikembalikan</option>
        </select>
        <button className="btn btn-outline" onClick={fetchLoans}>
          Terapkan
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
                <th>Anggota</th>
                <th>Buku</th>
                <th>Tanggal Pinjam</th>
                <th>Jatuh Tempo</th>
                <th>Tanggal Kembali</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {loans.length === 0 ? (
                <tr>
                  <td colSpan={7} className="empty-cell">
                    Belum ada data peminjaman
                  </td>
                </tr>
              ) : (
                loans.map((loan) => (
                  <tr key={loan._id}>
                    <td>{loan.member?.name || '-'}</td>
                    <td>{loan.book?.title || '-'}</td>
                    <td>{formatDate(loan.loanDate)}</td>
                    <td>{formatDate(loan.dueDate)}</td>
                    <td>{formatDate(loan.returnDate)}</td>
                    <td>{statusBadge(loan.status)}</td>
                    <td>
                      {loan.status === 'borrowed' && (
                        <button className="btn btn-sm btn-success" onClick={() => handleReturn(loan)}>
                          Kembalikan
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {modalOpen && (
        <Modal title="Catat Peminjaman" onClose={() => setModalOpen(false)}>
          {formError && <div className="alert alert-error">{formError}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Anggota</label>
              <select
                name="member"
                value={form.member}
                onChange={(e) => setForm({ ...form, member: e.target.value })}
                required
              >
                <option value="">Pilih anggota...</option>
                {members.map((m) => (
                  <option key={m._id} value={m._id}>
                    {m.name} ({m.memberId})
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Buku</label>
              <select
                name="book"
                value={form.book}
                onChange={(e) => setForm({ ...form, book: e.target.value })}
                required
              >
                <option value="">Pilih buku (tersedia)...</option>
                {books.map((b) => (
                  <option key={b._id} value={b._id}>
                    {b.title} — {b.available} tersedia
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Jatuh Tempo (opsional)</label>
              <input
                type="date"
                name="dueDate"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
              <small className="hint">Kosongkan untuk otomatis 7 hari dari sekarang</small>
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
