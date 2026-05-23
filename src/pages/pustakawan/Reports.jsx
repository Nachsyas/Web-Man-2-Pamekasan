import { useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import PustakawanLayout from '../../components/feature/DashboardLayout';
import { booksMock } from '../../mocks/books';
import { allBorrowingTransactions, categoriesList, allMembers } from '../../mocks/system';

const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
const colors = ['#10B981', '#3B82F6', '#EF4444', '#EC4899', '#F59E0B', '#8B5CF6', '#14B8A6', '#F97316', '#6366F1', '#06B6D4'];

export default function Reports() {
  const [dateFrom, setDateFrom] = useState('2026-01-01');
  const [dateTo, setDateTo] = useState('2026-12-31');
  const [reportType, setReportType] = useState('Peminjaman');

  // Cetak Bebas Tanggungan State
  const [bebasTanggunganNisn, setBebasTanggunganNisn] = useState('');
  const [bebasTanggunganNama, setBebasTanggunganNama] = useState('');
  const [bebasTanggunganDate, setBebasTanggunganDate] = useState(new Date().toISOString().split('T')[0]);
  const [bebasTanggunganStatus, setBebasTanggunganStatus] = useState(null); // null, 'success', 'error'
  const [bebasTanggunganMsg, setBebasTanggunganMsg] = useState('');

  const handleVerifyTanggungan = () => {
    const member = allMembers.find(m => m.nisn === bebasTanggunganNisn || m.name.toLowerCase() === bebasTanggunganNisn.toLowerCase());
    if (!member) {
      setBebasTanggunganStatus('error');
      setBebasTanggunganMsg('Siswa tidak ditemukan.');
      return;
    }
    setBebasTanggunganNama(member.name);
    setBebasTanggunganNisn(member.nisn);
    if (member.activeLoans > 0) {
      setBebasTanggunganStatus('error');
      setBebasTanggunganMsg(`Siswa masih memiliki ${member.activeLoans} pinjaman aktif.`);
    } else {
      setBebasTanggunganStatus('success');
      setBebasTanggunganMsg('Siswa bebas tanggungan perpustakaan. Surat dapat dicetak.');
    }
  };

  const filteredTransactions = useMemo(() => {
    return allBorrowingTransactions.filter(t => {
      const borrowDate = new Date(t.borrowDate);
      const from = new Date(dateFrom);
      const to = new Date(dateTo);
      return borrowDate >= from && borrowDate <= to;
    });
  }, [dateFrom, dateTo]);

  const monthlyData = useMemo(() => {
    return months.map((m, i) => {
      const monthPrefix = `2026-${String(i + 1).padStart(2, '0')}`;
      const borrows = filteredTransactions.filter(t => t.borrowDate.startsWith(monthPrefix)).length;
      const returns = filteredTransactions.filter(t => t.returnDate && t.returnDate.startsWith(monthPrefix)).length;
      const fines = filteredTransactions.filter(t => t.returnDate && t.returnDate.startsWith(monthPrefix)).reduce((s, t) => s + t.fine, 0);
      return { month: m, borrows, returns, fines };
    });
  }, [filteredTransactions]);

  const categoryData = useMemo(() => {
    return categoriesList.map(cat => ({
      name: cat,
      value: booksMock.filter(b => b.category === cat).length,
    })).filter(d => d.value > 0);
  }, []);

  const stats = useMemo(() => {
    const totalBorrows = filteredTransactions.length;
    const totalReturns = filteredTransactions.filter(t => t.status === 'Returned').length;
    const totalFines = filteredTransactions.reduce((s, t) => s + t.fine, 0);
    const overdueCount = filteredTransactions.filter(t => t.status === 'Overdue').length;
    return { totalBorrows, totalReturns, totalFines, overdueCount };
  }, [filteredTransactions]);

  const popularBooks = useMemo(() => {
    const bookCounts = {};
    filteredTransactions.forEach(t => {
      t.books.forEach(b => {
        bookCounts[b] = (bookCounts[b] || 0) + 1;
      });
    });
    return Object.entries(bookCounts)
      .map(([title, count]) => ({ title, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }, [filteredTransactions]);

  return (
    <PustakawanLayout userName="Ibu Siti Aminah, S.Pd." userNisn="Pustakawan">
      <div className="page-container space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Laporan & Layanan</h1>
            <p className="text-gray-500 mt-1">Analisis statistik perpustakaan dan layanan surat</p>
          </div>
          {reportType !== 'CetakBebasTanggungan' && (
            <div className="flex items-center gap-3">
              <button className="btn-secondary">
                <i className="ri-file-download-line" /> Export PDF
              </button>
              <button className="btn-secondary">
                <i className="ri-file-excel-line" /> Export Excel
              </button>
            </div>
          )}
        </div>

        {/* Selection Cards (Tabs) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { id: 'Peminjaman', icon: 'ri-book-mark-line', label: 'Laporan Peminjaman' },
            { id: 'Pengembalian', icon: 'ri-arrow-go-back-line', label: 'Laporan Pengembalian' },
            { id: 'Pengunjung', icon: 'ri-user-location-line', label: 'Laporan Pengunjung' },
            { id: 'CetakBebasTanggungan', icon: 'ri-printer-line', label: 'Bebas Tanggungan' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setReportType(tab.id)}
              className={`p-4 rounded-xl border text-left transition-all ${reportType === tab.id ? 'bg-emerald-50 border-emerald-500 shadow-sm' : 'bg-white border-gray-200 hover:border-emerald-200 hover:bg-emerald-50/50'}`}
            >
              <i className={`${tab.icon} text-xl ${reportType === tab.id ? 'text-emerald-600' : 'text-gray-500'}`} />
              <p className={`mt-2 font-semibold ${reportType === tab.id ? 'text-emerald-800' : 'text-gray-700'}`}>{tab.label}</p>
            </button>
          ))}
        </div>

        {reportType === 'CetakBebasTanggungan' ? (
          <div className="card-base max-w-2xl mx-auto mt-6">
            <div className="border-b border-gray-100 pb-4 mb-6">
              <h3 className="text-lg font-bold text-gray-800">Cetak Surat Bebas Tanggungan</h3>
              <p className="text-sm text-gray-500 mt-1">Verifikasi status peminjaman siswa sebelum mencetak surat.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Cari Siswa (NISN)</label>
                <div className="flex gap-3">
                  <input type="text" value={bebasTanggunganNisn} onChange={e => setBebasTanggunganNisn(e.target.value)} className="input-field flex-1" placeholder="Masukkan NISN Siswa..." />
                  <button onClick={handleVerifyTanggungan} className="btn-secondary whitespace-nowrap">
                    <i className="ri-search-line" /> Verifikasi
                  </button>
                </div>
              </div>

              {bebasTanggunganStatus && (
                <div className={`p-4 rounded-xl border flex gap-3 ${bebasTanggunganStatus === 'success' ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
                  <i className={`text-xl ${bebasTanggunganStatus === 'success' ? 'ri-checkbox-circle-fill text-emerald-500' : 'ri-error-warning-fill text-red-500'}`} />
                  <div>
                    <p className="font-semibold">{bebasTanggunganStatus === 'success' ? 'Memenuhi Syarat' : 'Tidak Memenuhi Syarat'}</p>
                    <p className="text-sm opacity-90">{bebasTanggunganMsg}</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">NISN</label>
                  <input type="text" readOnly value={bebasTanggunganNisn} className="input-field w-full bg-gray-50" placeholder="Otomatis terisi" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">Nama Siswa</label>
                  <input type="text" readOnly value={bebasTanggunganNama} className="input-field w-full bg-gray-50" placeholder="Otomatis terisi" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1">Tanggal Terbit</label>
                  <input type="date" value={bebasTanggunganDate} onChange={e => setBebasTanggunganDate(e.target.value)} className="input-field w-full" />
                </div>
              </div>

              <div className="pt-6 border-t border-gray-100 flex justify-end">
                <button disabled={bebasTanggunganStatus !== 'success'} className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${bebasTanggunganStatus === 'success' ? 'bg-emerald-500 text-white hover:bg-emerald-600 shadow-md' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}>
                  <i className="ri-printer-line" /> Cetak Surat
                </button>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Date Filter (Hanya untuk Laporan Statistik) */}
            <div className="card-base">
              <div className="flex flex-col lg:flex-row gap-4 items-end">
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Dari Tanggal</label>
                    <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="input-field w-full" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1">Sampai Tanggal</label>
                    <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="input-field w-full" />
                  </div>
                </div>
              </div>
            </div>

            {/* Summary Stats */}
            {reportType === 'Peminjaman' ? (
              <>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  {[
                    { label: 'Total Peminjaman', value: stats.totalBorrows, icon: 'ri-hand-coin-line', color: 'text-green-600 bg-green-50' },
                    { label: 'Total Pengembalian', value: stats.totalReturns, icon: 'ri-arrow-go-back-line', color: 'text-blue-600 bg-blue-50' },
                    { label: 'Total Denda', value: `Rp ${stats.totalFines.toLocaleString()}`, icon: 'ri-money-cny-circle-line', color: 'text-yellow-600 bg-yellow-50' },
                    { label: 'Terlambat', value: stats.overdueCount, icon: 'ri-alarm-warning-line', color: 'text-red-600 bg-red-50' },
                  ].map((s, i) => (
                    <div key={i} className="card-base flex items-center gap-4">
                      <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
                        <i className={`${s.icon} text-2xl`} />
                      </div>
                      <div>
                        <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                        <p className="text-xl font-bold text-gray-800">{s.value}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="card-base">
                    <h3 className="font-semibold text-gray-800 mb-6">Statistik Bulanan</h3>
                    <div className="h-[300px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={monthlyData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8" vertical={false} />
                          <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                          <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                          <Bar dataKey="borrows" fill="#10B981" radius={[4, 4, 0, 0]} maxBarSize={30} />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </div>

                  <div className="card-base">
                    <h3 className="font-semibold text-gray-800 mb-6">Distribusi Kategori Buku</h3>
                    <div className="h-[240px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                            {categoryData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 justify-center">
                      {categoryData.map((cat, i) => (
                        <div key={cat.name} className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
                          <span className="text-xs text-gray-600">{cat.name} ({cat.value})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Popular Books Table */}
                <div className="card-base overflow-hidden p-0">
                  <div className="p-5 border-b border-gray-100">
                    <h3 className="font-semibold text-gray-800">Buku Terpopuler</h3>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left text-xs font-semibold text-gray-500 bg-gray-50 border-b border-gray-100">
                          <th className="py-3 whitespace-nowrap pl-6">#</th>
                          <th className="py-3 whitespace-nowrap px-4">Judul Buku</th>
                          <th className="py-3 whitespace-nowrap px-4 text-center">Total Peminjaman</th>
                          <th className="py-3 whitespace-nowrap px-4 text-center">Persentase</th>
                          <th className="py-3 whitespace-nowrap pr-6 pl-4">Visual</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {popularBooks.map((book, idx) => {
                          const maxCount = popularBooks[0]?.count || 1;
                          const pct = Math.round((book.count / maxCount) * 100);
                          return (
                            <tr key={book.title} className="hover:bg-gray-50/50 transition-colors">
                              <td className="py-3 whitespace-nowrap pl-6 text-sm font-medium text-gray-500">{idx + 1}</td>
                              <td className="py-3 whitespace-nowrap px-4 text-sm font-medium text-gray-800">{book.title}</td>
                              <td className="py-3 whitespace-nowrap px-4 text-center text-sm font-bold text-gray-700">{book.count}</td>
                              <td className="py-3 whitespace-nowrap px-4 text-center text-sm text-gray-600">{pct}%</td>
                              <td className="py-3 whitespace-nowrap pr-6 pl-4 w-48">
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                  <div className="h-full rounded-full bg-emerald-500" style={{ width: `${pct}%` }} />
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <div className="card-base text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <i className="ri-bar-chart-2-line text-2xl text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-800">Laporan {reportType} Belum Tersedia</h3>
                <p className="text-gray-500 mt-2">Gunakan menu filter dan pilih Peminjaman untuk melihat statistik saat ini.</p>
              </div>
            )}
          </>
        )}
      </div>
    </PustakawanLayout>
  );
}