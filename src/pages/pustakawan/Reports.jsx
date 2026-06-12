import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import PustakawanLayout from '../../components/feature/DashboardLayout';
import { api } from '../../services/api';
import html2pdf from 'html2pdf.js';

const colors = ['#10B981', '#3B82F6', '#EF4444', '#EC4899', '#F59E0B', '#8B5CF6', '#14B8A6', '#F97316', '#6366F1', '#06B6D4'];

const formatDate = (dateStr) => {
  if (!dateStr) return '-';
  const months = [
    'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
    'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
  ];
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return dateStr;
  const day = date.getDate();
  const month = months[date.getMonth()];
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
};

export default function Reports() {
  const [dateFrom, setDateFrom] = useState('2026-01-01');
  const [dateTo, setDateTo] = useState('2026-12-31');
  const [reportType, setReportType] = useState('Peminjaman'); // 'Peminjaman', 'Pengembalian', 'Pengunjung'
  const [peminjamanData, setPeminjamanData] = useState(null);
  const [pengembalianData, setPengembalianData] = useState(null);
  const [pengunjungData, setPengunjungData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

  const reportData = useMemo(() => {
    if (reportType === 'Peminjaman') return peminjamanData;
    if (reportType === 'Pengembalian') return pengembalianData;
    if (reportType === 'Pengunjung') return pengunjungData;
    return null;
  }, [reportType, peminjamanData, pengembalianData, pengunjungData]);

  const handleDownloadPDF = async () => {
    if (!peminjamanData || !pengembalianData || !pengunjungData) return;
    setIsGeneratingPDF(true);
    try {
      const element = document.getElementById('report-pdf-template');
      
      // Create a temporary container at (0,0) to allow canvas engine sizing without clipping
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '0';
      container.style.top = '0';
      container.style.width = '210mm';
      container.style.zIndex = '-9999';
      container.style.pointerEvents = 'none';
      container.style.background = 'white';
      
      const clone = element.cloneNode(true);
      clone.style.display = 'block';
      container.appendChild(clone);
      document.body.appendChild(container);

      const opt = {
        margin:       0,
        filename:     `laporan-perpustakaan-lengkap-${dateFrom}-to-${dateTo}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { 
          scale: 2, 
          useCORS: true, 
          logging: false, 
          letterRendering: true,
          windowWidth: 1024,
          scrollX: 0,
          scrollY: 0
        },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' },
        pagebreak:    { mode: ['css', 'legacy'] }
      };

      await html2pdf().set(opt).from(clone).save();
      
      document.body.removeChild(container);
    } catch (err) {
      console.error('Failed to generate PDF:', err);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  useEffect(() => {
    const fetchAllReports = async () => {
      setLoading(true);
      try {
        const [pem, peng, visitor] = await Promise.all([
          api.getReports('peminjaman', dateFrom, dateTo),
          api.getReports('pengembalian', dateFrom, dateTo),
          api.getReports('pengunjung', dateFrom, dateTo)
        ]);
        setPeminjamanData(pem);
        setPengembalianData(peng);
        setPengunjungData(visitor);
      } catch (err) {
        console.error('Failed to fetch report data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchAllReports();
  }, [dateFrom, dateTo]);

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
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          /* Hide all interactive components */
          aside, header, nav, select, input, button, .print-hidden, .page-container > div:not(.print-block) {
            display: none !important;
          }
          
          /* Reset root and body margins */
          body, html, #root, main, .page-container {
            background: white !important;
            color: black !important;
            padding: 0 !important;
            margin: 0 !important;
            overflow: visible !important;
            height: auto !important;
          }

          /* Printable container config */
          .print-block {
            display: block !important;
            background: white !important;
            color: black !important;
            width: 100% !important;
          }

          /* Page breaks */
          .page-break-inside-avoid {
            page-break-inside: avoid !important;
            break-inside: avoid !important;
          }
        }
      `}} />

      <div className="page-container space-y-6 print:hidden">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Laporan & Layanan</h1>
            <p className="text-gray-500 mt-1">Analisis statistik perpustakaan dan layanan surat</p>
          </div>
          <div className="flex items-center gap-3">
            <button 
              className="btn-secondary flex items-center gap-2" 
              onClick={handleDownloadPDF}
              disabled={isGeneratingPDF || loading || !peminjamanData || !pengembalianData || !pengunjungData}
            >
              {isGeneratingPDF ? (
                <>
                  <div className="animate-spin inline-block w-4 h-4 border-2 border-current border-t-transparent text-emerald-600 rounded-full" role="status" aria-label="loading" />
                  Mengunduh...
                </>
              ) : (
                <>
                  <i className="ri-file-download-line" /> Unduh Laporan (PDF)
                </>
              )}
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

      {/* Print-Only Layout containing ALL reports */}
      <div id="report-pdf-template" style={{ display: 'none', width: '210mm', boxSizing: 'border-box' }} className="bg-white p-[15mm] font-serif text-gray-900 leading-normal">
         
         {/* Kop Surat (Formal Indonesian Letterhead) */}
         <div className="flex items-center border-b-4 border-double border-gray-900 pb-4 mb-6 gap-6">
             <img
                 src="/logo-kemenag.png"
                 alt="Logo Kemenag"
                 className="w-16 h-16 object-contain flex-shrink-0"
             />
             <div className="text-center flex-1">
                 <h2 className="text-xs font-bold uppercase tracking-wider leading-none mb-1">Kementerian Agama Republik Indonesia</h2>
                 <h2 className="text-[10px] font-semibold uppercase tracking-wider leading-none mb-1">Kantor Kementerian Agama Kabupaten Pamekasan</h2>
                 <h1 className="text-sm font-extrabold uppercase tracking-wide leading-tight mb-1">Madrasah Aliyah Negeri 2 Pamekasan</h1>
                 <p className="text-[9px] italic leading-tight">Jalan Wahid Hasyim No. 17, Pamekasan, Jawa Timur 69316</p>
                 <p className="text-[9px] leading-tight mt-0.5">Telepon: (0324) 321456 | Website: web.man2pamekasan.sch.id | Email: perpustakaan@man2pamekasan.sch.id</p>
             </div>
             {/* Mirror placeholder to center text */}
             <div className="w-16 h-16 flex-shrink-0 invisible" />
         </div>

         {/* Document Header */}
         <div className="text-center mb-6">
             <h2 className="text-sm font-bold uppercase underline">Laporan Lengkap Layanan & Aktivitas Perpustakaan</h2>
             <p className="text-[10px] font-mono mt-1">Nomor: B-{Math.floor(1000 + Math.random() * 9000)}/Ma.13.26.2/PP.00.6/06/2026</p>
         </div>

         {/* Meta Laporan */}
         <div className="grid grid-cols-2 gap-4 text-xs mb-6 border border-gray-200 p-3 rounded-lg bg-gray-50/50">
             <div>
                 <p><span className="font-bold">Jenis Laporan:</span> Laporan Aktivitas Keseluruhan (Peminjaman, Pengembalian, Pengunjung)</p>
                 <p><span className="font-bold">Periode:</span> {formatDate(dateFrom)} s.d. {formatDate(dateTo)}</p>
             </div>
             <div className="text-right">
                 <p><span className="font-bold">Tanggal Cetak:</span> {formatDate(new Date().toISOString().split('T')[0])}</p>
                 <p><span className="font-bold">Petugas Pencetak:</span> Ibu Siti Aminah, S.Pd. (Pustakawan)</p>
             </div>
         </div>

         {/* Section I: Ringkasan Statistik Laporan */}
         <div className="mb-6" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
             <h3 className="text-xs font-bold uppercase border-b border-gray-400 pb-1 mb-3">I. Ringkasan Statistik Laporan</h3>
             <table className="w-full text-xs text-left border-collapse border border-gray-300">
                 <thead>
                     <tr className="bg-gray-100">
                         <th className="border border-gray-300 p-2.5 font-bold" style={{ width: '40%' }}>Parameter Indikator</th>
                         <th className="border border-gray-300 p-2.5 text-right font-bold" style={{ width: '25%' }}>Nilai Capaian</th>
                         <th className="border border-gray-300 p-2.5 pl-4" style={{ width: '35%' }}>Keterangan Aktivitas</th>
                     </tr>
                 </thead>
                 <tbody>
                     <tr>
                         <td className="border border-gray-300 p-2.5">Total Transaksi Peminjaman</td>
                         <td className="border border-gray-300 p-2.5 text-right font-bold">{peminjamanData?.summary?.total_peminjaman || 0} buku</td>
                         <td className="border border-gray-300 p-2.5 pl-4">Total ekslempar buku dipinjam keluar</td>
                     </tr>
                     <tr>
                         <td className="border border-gray-300 p-2.5">Total Buku Dikembalikan</td>
                         <td className="border border-gray-300 p-2.5 text-right font-bold">{pengembalianData?.summary?.total_pengembalian || 0} buku</td>
                         <td className="border border-gray-300 p-2.5 pl-4">Jumlah buku yang berhasil dikembalikan</td>
                     </tr>
                     <tr>
                         <td className="border border-gray-300 p-2.5">Total Penerimaan Denda Terkumpul</td>
                         <td className="border border-gray-300 p-2.5 text-right font-bold">Rp {(pengembalianData?.summary?.total_denda || 0).toLocaleString('id-ID')}</td>
                         <td className="border border-gray-300 p-2.5 pl-4">Total denda keterlambatan / penggantian buku</td>
                     </tr>
                     <tr>
                         <td className="border border-gray-300 p-2.5">Peminjaman Terlambat (Overdue)</td>
                         <td className="border border-gray-300 p-2.5 text-right font-bold text-red-600">{peminjamanData?.summary?.terlambat || 0} buku</td>
                         <td className="border border-gray-300 p-2.5 pl-4">Buku melewati jatuh tempo dan belum kembali</td>
                     </tr>
                     <tr>
                         <td className="border border-gray-300 p-2.5">Total Kunjungan Siswa</td>
                         <td className="border border-gray-300 p-2.5 text-right font-bold">{pengunjungData?.summary?.total_kunjungan || 0} kali</td>
                         <td className="border border-gray-300 p-2.5 pl-4">Jumlah kedatangan siswa ke ruang baca perpustakaan</td>
                     </tr>
                     <tr>
                         <td className="border border-gray-300 p-2.5">Siswa Terdaftar Berkunjung</td>
                         <td className="border border-gray-300 p-2.5 text-right font-bold">{pengunjungData?.summary?.pengunjung || 0} orang</td>
                         <td className="border border-gray-300 p-2.5 pl-4">Jumlah anggota unik yang berkunjung</td>
                     </tr>
                 </tbody>
             </table>
         </div>

         {/* Page Break */}
         <div className="html2pdf__page-break" />

         {/* Section II: Detail Peminjaman & Pengembalian Buku */}
         <div className="mb-6" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
             <h3 className="text-xs font-bold uppercase border-b border-gray-400 pb-1 mb-3">II. Detail Distribusi & Buku Terpopuler</h3>
             
             {/* Sub-section A: Distribusi Kategori Buku */}
             <div className="mb-4">
                 <h4 className="text-[11px] font-bold uppercase text-gray-700 mb-2">A. Distribusi Berdasarkan Kategori Buku</h4>
                 <table className="w-full text-xs text-left border-collapse border border-gray-300">
                     <thead>
                         <tr className="bg-gray-100">
                             <th className="border border-gray-300 p-2.5 font-bold">Kategori Buku</th>
                             <th className="border border-gray-300 p-2.5 text-center font-bold" style={{ width: '30%' }}>Volume Transaksi</th>
                         </tr>
                     </thead>
                     <tbody>
                         {(peminjamanData?.category_distribution || []).map((d, i) => (
                             <tr key={i}>
                                 <td className="border border-gray-300 p-2.5">{d.name}</td>
                                 <td className="border border-gray-300 p-2.5 text-center">{d.total}</td>
                             </tr>
                         ))}
                         {(!peminjamanData?.category_distribution || peminjamanData.category_distribution.length === 0) && (
                             <tr>
                                 <td colSpan="2" className="border border-gray-300 p-2.5 text-center text-gray-500">Tidak ada data distribusi</td>
                             </tr>
                         )}
                     </tbody>
                 </table>
             </div>

             {/* Sub-section B: Buku Terpopuler */}
             <div className="mt-6">
                 <h4 className="text-[11px] font-bold uppercase text-gray-700 mb-2">B. Daftar Buku Terpopuler (Paling Banyak Dipinjam)</h4>
                 <table className="w-full text-xs text-left border-collapse border border-gray-300">
                     <thead>
                         <tr className="bg-gray-100">
                             <th className="border border-gray-300 p-2.5 font-bold text-center" style={{ width: '8%' }}>Peringkat</th>
                             <th className="border border-gray-300 p-2.5 font-bold" style={{ width: '52%' }}>Judul Buku</th>
                             <th className="border border-gray-300 p-2.5 font-bold text-center" style={{ width: '25%' }}>Frekuensi Peminjaman</th>
                             <th className="border border-gray-300 p-2.5 font-bold text-center" style={{ width: '15%' }}>Persentase</th>
                         </tr>
                     </thead>
                     <tbody>
                         {(peminjamanData?.popular_books || []).map((item, idx) => (
                             <tr key={idx}>
                                 <td className="border border-gray-300 p-2.5 text-center">{idx + 1}</td>
                                 <td className="border border-gray-300 p-2.5">{item.title}</td>
                                 <td className="border border-gray-300 p-2.5 text-center font-bold">{item.total_peminjaman}</td>
                                 <td className="border border-gray-300 p-2.5 text-center">{item.percentage || 0}%</td>
                             </tr>
                         ))}
                         {(!peminjamanData?.popular_books || peminjamanData.popular_books.length === 0) && (
                             <tr>
                                 <td colSpan="4" className="border border-gray-300 p-2.5 text-center text-gray-500">Tidak ada data buku terpopuler</td>
                             </tr>
                         )}
                     </tbody>
                 </table>
             </div>
         </div>

         {/* Page Break */}
         <div className="html2pdf__page-break" />

         {/* Section III: Detail Pengunjung & Siswa Teraktif */}
         <div className="mb-6" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
             <h3 className="text-xs font-bold uppercase border-b border-gray-400 pb-1 mb-3">III. Detail Laporan Pengunjung</h3>
             
             {/* Sub-section A: Distribusi Kunjungan per Kelas */}
             <div className="mb-4">
                 <h4 className="text-[11px] font-bold uppercase text-gray-700 mb-2">A. Distribusi Kunjungan Berdasarkan Tingkat Kelas</h4>
                 <table className="w-full text-xs text-left border-collapse border border-gray-300">
                     <thead>
                         <tr className="bg-gray-100">
                             <th className="border border-gray-300 p-2.5 font-bold">Kelas</th>
                             <th className="border border-gray-300 p-2.5 text-center font-bold" style={{ width: '30%' }}>Volume Kunjungan</th>
                         </tr>
                     </thead>
                     <tbody>
                         {(pengunjungData?.class_distribution || []).map((d, i) => (
                             <tr key={i}>
                                 <td className="border border-gray-300 p-2.5">{d.name}</td>
                                 <td className="border border-gray-300 p-2.5 text-center">{d.total}</td>
                             </tr>
                         ))}
                         {(!pengunjungData?.class_distribution || pengunjungData.class_distribution.length === 0) && (
                             <tr>
                                 <td colSpan="2" className="border border-gray-300 p-2.5 text-center text-gray-500">Tidak ada data distribusi</td>
                             </tr>
                         )}
                     </tbody>
                 </table>
             </div>

             {/* Sub-section B: Siswa Teraktif */}
             <div className="mt-6">
                 <h4 className="text-[11px] font-bold uppercase text-gray-700 mb-2">B. Daftar Pengunjung / Siswa Paling Aktif</h4>
                 <table className="w-full text-xs text-left border-collapse border border-gray-300">
                     <thead>
                         <tr className="bg-gray-100">
                             <th className="border border-gray-300 p-2.5 font-bold text-center" style={{ width: '8%' }}>No</th>
                             <th className="border border-gray-300 p-2.5 font-bold" style={{ width: '42%' }}>Nama Siswa</th>
                             <th className="border border-gray-300 p-2.5 font-bold" style={{ width: '20%' }}>NISN</th>
                             <th className="border border-gray-300 p-2.5 font-bold text-center" style={{ width: '10%' }}>Kelas</th>
                             <th className="border border-gray-300 p-2.5 font-bold text-center" style={{ width: '20%' }}>Frekuensi Kunjungan</th>
                         </tr>
                     </thead>
                     <tbody>
                         {(pengunjungData?.top_visitors || []).map((item, idx) => (
                             <tr key={idx}>
                                 <td className="border border-gray-300 p-2.5 text-center">{idx + 1}</td>
                                 <td className="border border-gray-300 p-2.5">{item.name}</td>
                                 <td className="border border-gray-300 p-2.5 font-mono">{item.nisn}</td>
                                 <td className="border border-gray-300 p-2.5 text-center">{item.class || '-'}</td>
                                 <td className="border border-gray-300 p-2.5 text-center font-bold">{item.total_kunjungan}</td>
                             </tr>
                         ))}
                         {(!pengunjungData?.top_visitors || pengunjungData.top_visitors.length === 0) && (
                             <tr>
                                 <td colSpan="5" className="border border-gray-300 p-2.5 text-center text-gray-500">Tidak ada data siswa teraktif</td>
                             </tr>
                         )}
                     </tbody>
                 </table>
             </div>
         </div>

         {/* Signature Block (Tanda Tangan) */}
         <div className="flex justify-between items-start text-xs mt-12" style={{ pageBreakInside: 'avoid', breakInside: 'avoid' }}>
             <div className="w-[200px]">
                 {/* Empty left side signature */}
             </div>
             <div className="w-[250px] text-center">
                 <p>Pamekasan, {formatDate(new Date().toISOString().split('T')[0])}</p>
                 <p className="mt-1">Kepala Perpustakaan MAN 2 Pamekasan</p>
                 <div className="h-20" />
                 <p className="font-bold underline text-gray-900">Ibu Siti Aminah, S.Pd.</p>
                 <p className="text-gray-500">NIP. 197508242005012001</p>
             </div>
         </div>

      </div>

    </PustakawanLayout>
  );
}