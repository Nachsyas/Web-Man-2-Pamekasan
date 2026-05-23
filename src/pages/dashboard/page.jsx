import { Link } from 'react-router-dom';
import { Area, AreaChart, Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import PustakawanLayout from '../../components/feature/DashboardLayout';
import { borrowingChartData, dashboardStats } from '../../mocks/dashboard';
import { allBorrowingTransactions } from '../../mocks/system';

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
  if (status === 'Borrowed') return <span className="bg-green-50 text-green-700 border border-green-100 px-3 py-1 rounded-lg text-xs font-semibold">Dipinjam</span>;
  if (status === 'Overdue') return <span className="bg-red-50 text-red-700 border border-red-100 px-3 py-1 rounded-lg text-xs font-semibold">Terlambat</span>;
  return <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-xs font-semibold">{status}</span>;
}

export default function Dashboard() {
  const activeLoans = allBorrowingTransactions.filter(t => t.status === 'Borrowed' || t.status === 'Overdue');

  return (
    <PustakawanLayout userName="Ibu Siti Aminah, S.Pd." userNisn="Pustakawan">
      <div className="p-8 space-y-8 max-w-[1400px] mx-auto">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Dashboard</h1>
            <p className="text-gray-500 mt-1">Selamat datang kembali, Ibu Siti Aminah.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/pustakawan/peminjaman" className="btn-primary">Peminjaman</Link>
            <Link to="/pustakawan/pengembalian" className="btn-secondary">Pengembalian</Link>
          </div>
        </div>

        {/* Statistik Ringkas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Total Buku" value={dashboardStats.totalBooks.toLocaleString()} icon="ri-book-3-line" trend={5.2} trendLabel="dari bulan lalu" color="bg-green-500" />
          <StatCard title="Buku Dipinjam" value={dashboardStats.borrowedBooks.toLocaleString()} icon="ri-hand-coin-line" trend={12.8} trendLabel="dari minggu lalu" color="bg-blue-500" />
          <StatCard title="Terlambat" value={dashboardStats.lateReturns} icon="ri-alarm-warning-line" trend={-3.5} trendLabel="dari bulan lalu" color="bg-red-500" />
          <StatCard title="Siswa Aktif" value={dashboardStats.activeMembers.toLocaleString()} icon="ri-user-star-line" trend={8.1} trendLabel="siswa baru" color="bg-purple-500" />
        </div>

        {/* Baris Grafik - Diberi Axis yang Jelas */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card-base">
            <h2 className="font-bold text-gray-800 mb-6">Sirkulasi Buku Bulanan</h2>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={borrowingChartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip cursor={{ fill: '#f9fafb' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Bar dataKey="borrowings" fill="#10b981" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="returns" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          <div className="card-base">
            <h2 className="font-bold text-gray-800 mb-6">Tren Kunjungan</h2>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={borrowingChartData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: '#6b7280' }} />
                  <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                  <Area type="monotone" dataKey="borrowings" stroke="#10b981" fill="#10b981" fillOpacity={0.1} />
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
                {activeLoans.map(loan => (
                  <tr key={loan.id} className="hover:bg-gray-50 transition-colors">
                    <td className="py-4 pl-6">
                      <p className="font-medium text-gray-800">{loan.memberName}</p>

                    </td>
                    <td className="py-4 px-4 text-sm text-gray-700">{loan.books.join(', ')}</td>
                    <td className="py-4 px-4 text-sm text-gray-600">{loan.borrowDate}</td>
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