import { useEffect, useState } from 'react';
import api from '../api/client';
import Modal from '../components/Modal';

const emptyForm = {
  title: '',
  author: '',
  category: '',
  isbn: '',
  year: '',
  quantity: 1,
  description: '',
};

export default function Books() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState('');
  const [formError, setFormError] = useState('');

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const res = await api.get('/books', { params: search ? { search } : {} });
      setBooks(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal memuat data buku');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const openAdd = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError('');
    setModalOpen(true);
  };

  const openEdit = (book) => {
    setEditing(book);
    setForm({
      title: book.title,
      author: book.author,
      category: book.category,
      isbn: book.isbn || '',
      year: book.year || '',
      quantity: book.quantity,
      description: book.description || '',
    });
    setFormError('');
    setModalOpen(true);
  };

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');
    const payload = {
      ...form,
      year: form.year ? Number(form.year) : undefined,
      quantity: Number(form.quantity),
    };
    try {
      if (editing) {
        await api.put(`/books/${editing._id}`, payload);
      } else {
        await api.post('/books', payload);
      }
      setModalOpen(false);
      fetchBooks();
    } catch (err) {
      const msg = err.response?.data?.message;
      const fieldErrors = err.response?.data?.errors;
      setFormError(
        fieldErrors?.length ? fieldErrors.map((e) => e.message).join(', ') : msg || 'Gagal menyimpan'
      );
    }
  };

  const handleDelete = async (book) => {
    if (!window.confirm(`Hapus buku "${book.title}"?`)) return;
    try {
      await api.delete(`/books/${book._id}`);
      fetchBooks();
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal menghapus buku');
    }
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Data Buku</h1>
          <p className="page-subtitle">Kelola koleksi buku perpustakaan</p>
        </div>
        <button className="btn btn-primary" onClick={openAdd}>
          + Tambah Buku
        </button>
      </div>

      <div className="toolbar">
        <input
          className="search-input"
          type="text"
          placeholder="Cari judul atau penulis..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && fetchBooks()}
        />
        <button className="btn btn-outline" onClick={fetchBooks}>
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
                <th>Judul</th>
                <th>Penulis</th>
                <th>Kategori</th>
                <th>Tahun</th>
                <th>Stok</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {books.length === 0 ? (
                <tr>
                  <td colSpan={6} className="empty-cell">
                    Belum ada data buku
                  </td>
                </tr>
              ) : (
                books.map((book) => (
                  <tr key={book._id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>
                      <span className="badge">{book.category}</span>
                    </td>
                    <td>{book.year || '-'}</td>
                    <td>
                      {book.available}/{book.quantity}
                    </td>
                    <td>
                      <button className="btn btn-sm btn-outline" onClick={() => openEdit(book)}>
                        Edit
                      </button>{' '}
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(book)}>
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
        <Modal title={editing ? 'Edit Buku' : 'Tambah Buku'} onClose={() => setModalOpen(false)}>
          {formError && <div className="alert alert-error">{formError}</div>}
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Judul Buku</label>
              <input name="title" value={form.title} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label>Penulis</label>
              <input name="author" value={form.author} onChange={handleChange} required />
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>Kategori</label>
                <input name="category" value={form.category} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Tahun</label>
                <input
                  type="number"
                  name="year"
                  value={form.year}
                  onChange={handleChange}
                  placeholder="2024"
                />
              </div>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label>ISBN</label>
                <input name="isbn" value={form.isbn} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label>Jumlah Eksemplar</label>
                <input
                  type="number"
                  name="quantity"
                  value={form.quantity}
                  onChange={handleChange}
                  min="0"
                  required
                />
              </div>
            </div>
            <div className="form-group">
              <label>Deskripsi</label>
              <textarea name="description" value={form.description} onChange={handleChange} rows="3" />
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
