import { useEffect, useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import api from '../api/client';
import StatCard from '../components/StatCard';
import { BookIcon, UsersIcon, ClipboardIcon, CheckCircleIcon } from '../components/Icons';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

export default function Dashboard() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    api
      .get('/dashboard/summary')
      .then((res) => setSummary(res.data.data))
      .catch((err) => setError(err.response?.data?.message || 'Gagal memuat dashboard'));
  }, []);

  if (error) {
    return <div className="alert alert-error">{error}</div>;
  }

  if (!summary) {
    return (
      <div className="loader-wrap">
        <div className="spinner" />
      </div>
    );
  }

  const categoryLabels = summary.booksByCategory.map((b) => b._id || 'Tanpa Kategori');
  const categoryData = summary.booksByCategory.map((b) => b.count);

  const monthLabels = summary.loansPerMonth.map((m) => m.month);
  const monthData = summary.loansPerMonth.map((m) => m.count);

  return (
    <div>
      <h1 className="page-title">Dashboard</h1>
      <p className="page-subtitle">Ringkasan kondisi koleksi dan transaksi peminjaman</p>

      <div className="stats-grid">
        <StatCard title="Total Buku" value={summary.totalBooks} icon={<BookIcon size={26} />} color="#2563eb" />
        <StatCard title="Total Anggota" value={summary.totalMembers} icon={<UsersIcon size={26} />} color="#16a34a" />
        <StatCard title="Total Peminjaman" value={summary.totalLoans} icon={<ClipboardIcon size={26} />} color="#d97706" />
        <StatCard title="Buku Tersedia" value={summary.availableBooks} icon={<CheckCircleIcon size={26} />} color="#7c3aed" />
      </div>

      <div className="charts-grid">
        <div className="card">
          <h3 className="card-title">Jumlah Buku per Kategori</h3>
          <div className="chart-box" style={{ height: 300, maxHeight: 300 }}>
            <Bar
              data={{
                labels: categoryLabels,
                datasets: [
                  {
                    label: 'Jumlah Buku',
                    data: categoryData,
                    backgroundColor: '#2563eb',
                  },
                ],
              }}
              options={{ maintainAspectRatio: false, responsive: true }}
            />
          </div>
        </div>

        <div className="card">
          <h3 className="card-title">Status Peminjaman</h3>
          <div className="chart-box" style={{ height: 300, maxHeight: 300 }}>
            <Doughnut
              data={{
                labels: ['Dipinjam', 'Dikembalikan'],
                datasets: [
                  {
                    data: [summary.loansByStatus.borrowed, summary.loansByStatus.returned],
                    backgroundColor: ['#f59e0b', '#16a34a'],
                  },
                ],
              }}
              options={{ maintainAspectRatio: false, responsive: true }}
            />
          </div>
        </div>

        <div className="card card-wide">
          <h3 className="card-title">Peminjaman per Bulan</h3>
          <div className="chart-box" style={{ height: 300, maxHeight: 300 }}>
            <Line
              data={{
                labels: monthLabels,
                datasets: [
                  {
                    label: 'Jumlah Peminjaman',
                    data: monthData,
                    borderColor: '#7c3aed',
                    backgroundColor: 'rgba(124, 58, 237, 0.1)',
                    fill: true,
                  },
                ],
              }}
              options={{ maintainAspectRatio: false, responsive: true }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
