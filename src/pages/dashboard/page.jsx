import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import PustakawanLayout from '../../components/feature/DashboardLayout';
import { api } from '../../services/api';

function StatCard({ title, value, icon, trend, trendLabel, color }) {
  const isPositive = trend >= 0;
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex items-center gap-4 hover:shadow-md transition-all">
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center ${color} bg-opacity-10 flex-shrink-0`}>
        <i className={`${icon} text-2xl ${color.replace('bg-', 'text-')}`} />
      </div>
      <div>
        <p className="text-sm text-gray-500 font-medium">{title}</p>
        <p className="text-2xl font-bold text-gray-800">{value}</p>
        <p className={`text-xs font-medium mt-1 ${isPositive ? 'text-green-600' : 'text-red-500'}`}>
          {isPositive ? '+' : ''}{trend}% <span className="text-gray-400 font-normal">{trendLabel}</span>
        </p>
      </div>
    </div>
  );
}

function StatusBadge({ status }) {
  if (status === 'dipinjam' || status === 'borrowed') return <span className="bg-green-50 text-green-700 border border-green-100 px-3 py-1 rounded-lg text-xs font-semibold">Dipinjam</span>;
  if (status === 'terlambat' || status === 'overdue') return <span className="bg-red-50 text-red-700 border border-red-100 px-3 py-1 rounded-lg text-xs font-semibold">Terlambat</span>;
  return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-xs font-semibold">{status}</span>;
}

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const librarianName = localStorage.getItem('pustakawan_name') || 'Ibu Siti Aminah';

  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const res = await api.getDashboard();
        setData(res);
      } catch (err) {
        console.error('Gagal memuat dashboard:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  const summary = data?.summary || {};
  const bookCirculation = data?.book_circulation || [];
  const visitTrend = data?.visit_trend || [];
  const activeLoans = data?.borrowed_monitoring || [];

  if (isLoading) {
    return (
      <PustakawanLayout>
        <div className="p-8 flex items-center justify-center min-h-[50vh]">
          <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </PustakawanLayout>
    );
  }

  return (
    <PustakawanLayout>
      <div className="p-8 space-y-8 max-w-[1400px] mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Dashboard</h1>
            <p className="text-gray-500 mt-1">Selamat datang kembali, {librarianName}.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/pustakawan/peminjaman" className="btn-primary">Peminjaman</Link>
            <Link to="/pustakawan/pengembalian" className="btn-secondary">Pengembalian</Link>
          </div>
        </div>

        {/* Statistik Ringkas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Buku" value={summary.total_books?.value || 0} icon="ri-book-3-line" trend={summary.total_books?.change_percentage || 0} trendLabel={summary.total_books?.description || ''} color="bg-green-500" />
          <StatCard title="Buku Dipinjam" value={summary.borrowed_books?.value || 0} icon="ri-hand-coin-line" trend={summary.borrowed_books?.change_percentage || 0} trendLabel={summary.borrowed_books?.description || ''} color="bg-blue-500" />
          <StatCard title="Terlambat" value={summary.overdue?.value || 0} icon="ri-alarm-warning-line" trend={summary.overdue?.change_percentage || 0} trendLabel={summary.overdue?.description || ''} color="bg-red-500" />
          <StatCard title="Siswa Aktif" value={summary.active_students?.value || 0} icon="ri-user-star-line" trend={summary.active_students?.change_percentage || 0} trendLabel={summary.active_students?.description || ''} color="bg-purple-500" />
        </div>

        {/* Baris Grafik */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-base">
            <h2 className="font-bold text-gray-800 mb-6">Sirkulasi Buku Bulanan</h2>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={bookCirculation} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="borrowings" fill="#10b981" radius={[4, 4, 0, 0]} name="Peminjaman" />
                  <Bar dataKey="returns" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Pengembalian" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card-base">
            <h2 className="font-bold text-gray-800 mb-6">Tren Kunjungan</h2>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={visitTrend} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="visits" stroke="#10b981" fill="#10b981" fillOpacity={0.1} name="Kunjungan" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Tabel Monitoring */}
        <div className="card-base p-0 overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <h2 className="font-bold text-gray-800">Monitoring Buku Sedang Dipinjam</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
                <tr>
                  <th className="py-4 pl-6">Peminjam</th>
                  <th className="py-4 px-4">Judul Buku</th>
                  <th className="py-4 px-4">Tanggal Pinjam</th>
                  <th className="py-4 pr-6 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {activeLoans.map((loan, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 pl-6">
                      <p className="font-medium text-gray-800">{loan.borrower_name}</p>
                      <p className="text-xs text-gray-400 font-mono mt-0.5">NISN: {loan.nisn}</p>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">{loan.book_title_display || loan.book_titles?.join(', ')}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{loan.borrow_date ? loan.borrow_date.split('T')[0] : '-'}</td>
                    <td className="py-4 pr-6 text-right">
                      <StatusBadge status={loan.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </PustakawanLayout>
  );
}