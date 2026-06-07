import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import PustakawanLayout from '../../components/feature/DashboardLayout';
import { api } from '../../services/api';

const colors = ['#10B981', '#3B82F6', '#EF4444', '#EC4899', '#F59E0B', '#8B5CF6', '#14B8A6', '#F97316', '#6366F1', '#06B6D4'];

export default function Reports() {
  const [dateFrom, setDateFrom] = useState('2026-01-01');
  const [dateTo, setDateTo] = useState('2026-12-31');
  const [reportType, setReportType] = useState('Peminjaman'); // 'Peminjaman', 'Pengembalian', 'Pengunjung'
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const typeParam = reportType === 'Peminjaman' ? 'peminjaman' : reportType === 'Pengembalian' ? 'pengembalian' : 'pengunjung';
        const res = await api.getReports(typeParam, dateFrom, dateTo);
        if (res) {
          setReportData(res);
        }
      } catch (err) {
        console.error('Failed to fetch report data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchReport();
  }, [reportType, dateFrom, dateTo]);

  const chartData = useMemo(() => {
    if (!reportData || !reportData.monthly_statistics) return [];
    return reportData.monthly_statistics;
  }, [reportData]);

  const pieData = useMemo(() => {
    if (!reportData) return [];
    const dist = reportData.category_distribution || reportData.class_distribution || [];
    return dist.map(d => ({
      name: d.name,
      value: d.total
    }));
  }, [reportData]);

  const tableData = useMemo(() => {
    if (!reportData) return [];
    return reportData.popular_books || reportData.top_visitors || [];
  }, [reportData]);

  return (
    <PustakawanLayout userName="Ibu Siti Aminah, S.Pd." userNisn="Pustakawan">
      <div className="page-container space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Laporan & Layanan</h1>
            <p className="text-gray-500 mt-1">Analisis statistik perpustakaan dan layanan surat</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="btn-secondary" onClick={() => window.print()}>
              <i className="ri-file-download-line" /> Cetak Laporan
            </button>
          </div>
        </div>

        {/* Selection Cards (Tabs) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
          {[
            { id: 'Peminjaman', icon: 'ri-book-mark-line', label: 'Laporan Peminjaman' },
            { id: 'Pengembalian', icon: 'ri-arrow-go-back-line', label: 'Laporan Pengembalian' },
            { id: 'Pengunjung', icon: 'ri-user-location-line', label: 'Laporan Pengunjung' }
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

        {/* Date Filter */}
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

        {loading ? (
          <div className="card-base text-center py-12 text-gray-400">
            <div className="animate-spin inline-block w-8 h-8 border-[3px] border-current border-t-transparent text-emerald-600 rounded-full mb-2" role="status" aria-label="loading">
              <span className="sr-only">Loading...</span>
            </div>
            <p className="text-sm">Memuat data laporan...</p>
          </div>
        ) : !reportData ? (
          <div className="card-base text-center py-12 text-gray-400">
            Gagal memuat data laporan
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            {reportType === 'Pengunjung' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {[
                  { label: 'Total Kunjungan', value: reportData.summary?.total_kunjungan || 0, icon: 'ri-footprint-line', color: 'text-emerald-600 bg-emerald-50' },
                  { label: 'Siswa Berkunjung', value: reportData.summary?.pengunjung || 0, icon: 'ri-group-line', color: 'text-blue-600 bg-blue-50' },
                  { label: 'Kunjungan Hari Ini', value: reportData.summary?.kunjungan_hari_ini || 0, icon: 'ri-calendar-event-line', color: 'text-indigo-600 bg-indigo-50' },
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
            ) : (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label: 'Total Peminjaman', value: reportData.summary?.total_peminjaman || 0, icon: 'ri-hand-coin-line', color: 'text-green-600 bg-green-50' },
                  { label: 'Total Pengembalian', value: reportData.summary?.total_pengembalian || 0, icon: 'ri-arrow-go-back-line', color: 'text-blue-600 bg-blue-50' },
                  { label: 'Total Denda', value: `Rp ${(reportData.summary?.total_denda || 0).toLocaleString('id-ID')}`, icon: 'ri-money-cny-circle-line', color: 'text-yellow-600 bg-yellow-50' },
                  { label: 'Terlambat', value: reportData.summary?.terlambat || 0, icon: 'ri-alarm-warning-line', color: 'text-red-600 bg-red-50' },
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
            )}

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="card-base">
                <h3 className="font-semibold text-gray-800 mb-6">Statistik Bulanan ({reportType})</h3>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#E8E8E8" vertical={false} />
                      <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} dy={10} />
                      <YAxis axisLine={false} tickLine={false} tick={{ fill: '#9ca3af', fontSize: 12 }} />
                      <Tooltip cursor={{ fill: '#f3f4f6' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="total" fill={reportType === 'Peminjaman' ? '#10B981' : reportType === 'Pengembalian' ? '#3B82F6' : '#6366F1'} radius={[4, 4, 0, 0]} maxBarSize={30} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="card-base">
                <h3 className="font-semibold text-gray-800 mb-6">
                  {reportType === 'Pengunjung' ? 'Distribusi Pengunjung Per Kelas' : 'Distribusi Kategori Buku'}
                </h3>
                {pieData.length === 0 ? (
                  <div className="h-[240px] flex items-center justify-center text-gray-400 text-sm">Tidak ada data distribusi</div>
                ) : (
                  <>
                    <div className="h-[240px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={2} dataKey="value">
                            {pieData.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                            ))}
                          </Pie>
                          <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-x-4 gap-y-2 justify-center">
                      {pieData.map((item, i) => (
                        <div key={item.name} className="flex items-center gap-1.5">
                          <div className="w-3 h-3 rounded-full" style={{ backgroundColor: colors[i % colors.length] }} />
                          <span className="text-xs text-gray-600">{item.name} ({item.value})</span>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Popular Books / Top Visitors Table */}
            <div className="card-base overflow-hidden p-0">
              <div className="p-5 border-b border-gray-100">
                <h3 className="font-semibold text-gray-800">
                  {reportType === 'Pengunjung' ? 'Pengunjung Teraktif' : 'Buku Terpopuler'}
                </h3>
              </div>
              <div className="overflow-x-auto">
                {tableData.length === 0 ? (
                  <div className="py-8 text-center text-gray-400 text-sm">Tidak ada data tabel</div>
                ) : (
                  <table className="w-full">
                    <thead>
                      <tr className="text-left text-xs font-semibold text-gray-500 bg-gray-50 border-b border-gray-100">
                        <th className="py-3 whitespace-nowrap pl-6">#</th>
                        {reportType === 'Pengunjung' ? (
                          <>
                            <th className="py-3 whitespace-nowrap px-4">Nama Siswa</th>
                            <th className="py-3 whitespace-nowrap px-4">NISN</th>
                            <th className="py-3 whitespace-nowrap px-4 text-center">Kelas</th>
                            <th className="py-3 whitespace-nowrap px-4 text-center">Total Kunjungan</th>
                          </>
                        ) : (
                          <>
                            <th className="py-3 whitespace-nowrap px-4">Judul Buku</th>
                            <th className="py-3 whitespace-nowrap px-4 text-center">Total Transaksi</th>
                          </>
                        )}
                        <th className="py-3 whitespace-nowrap px-4 text-center">Persentase</th>
                        <th className="py-3 whitespace-nowrap pr-6 pl-4">Visual</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {tableData.map((item, idx) => {
                        const count = reportType === 'Pengunjung' ? item.total_kunjungan : (reportType === 'Peminjaman' ? item.total_peminjaman : item.total_pengembalian);
                        const pct = item.percentage || 0;
                        return (
                          <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                            <td className="py-3 whitespace-nowrap pl-6 text-sm font-medium text-gray-500">{item.rank || (idx + 1)}</td>
                            {reportType === 'Pengunjung' ? (
                              <>
                                <td className="py-3 whitespace-nowrap px-4 text-sm font-medium text-gray-800">{item.name}</td>
                                <td className="py-3 whitespace-nowrap px-4 text-sm font-mono text-gray-600">{item.nisn}</td>
                                <td className="py-3 whitespace-nowrap px-4 text-center text-sm text-gray-600">{item.class || '-'}</td>
                              </>
                            ) : (
                              <td className="py-3 whitespace-nowrap px-4 text-sm font-medium text-gray-800">{item.title}</td>
                            )}
                            <td className="py-3 whitespace-nowrap px-4 text-center text-sm font-bold text-gray-700">{count}</td>
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
                )}
              </div>
            </div>
          </>
        )}
      </div>
    </PustakawanLayout>
  );
}