import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SiswaLayout from '../../components/feature/SiswaLayout';
import { api } from '../../services/api';

function StatusBadge({ status }) {
  if (status === 'active') return <span className="text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs">Dipinjam</span>;
  if (status === 'returned') return <span className="text-green-600 bg-green-50 px-2 py-1 rounded text-xs">Dikembalikan</span>;
  if (status === 'overdue') return <span className="text-red-600 bg-red-50 px-2 py-1 rounded text-xs">Terlambat</span>;
  return <span className="text-gray-600 bg-gray-50 px-2 py-1 rounded text-xs">{status}</span>;
}

export default function SiswaHistory() {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [loans, setLoans] = useState([]);
  const [summary, setSummary] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const nisn = localStorage.getItem('siswa_nisn') || '';

  const fetchHistory = async () => {
    if (!nisn) return;
    setIsLoading(true);
    try {
      let apiStatus = '';
      if (filter === 'active') apiStatus = 'dipinjam';
      else if (filter === 'overdue') apiStatus = 'terlambat';
      else if (filter === 'returned') apiStatus = 'dikembalikan';

      const res = await api.getStudentHistory(search, apiStatus);
      setSummary(res.summary || {});
      const dataList = res.data || [];
      const mapped = dataList.map(l => {
        const statLower = (l.status || '').toLowerCase();
        let status = 'returned';
        if (statLower === 'dipinjam' || statLower === 'borrowed') status = 'active';
        else if (statLower === 'terlambat' || statLower === 'overdue') status = 'overdue';
        else if (statLower === 'dikembalikan' || statLower === 'returned') status = 'returned';
        else status = l.status;

        return {
          id: l.id,
          transactionCode: l.transaction_code || `TRX-${l.id}`,
          bookTitle: l.book_title || 'Buku Perpustakaan',
          author: l.book_author || '-',
          borrowDate: l.borrow_date ? l.borrow_date.split('T')[0] : '-',
          dueDate: l.due_date ? l.due_date.split('T')[0] : '-',
          returnDate: l.return_date ? l.return_date.split('T')[0] : null,
          status: status,
          fine: l.fine || 0,
          type: l.category === 'paket' ? 'Paket' : 'Reguler',
        };
      });
      setLoans(mapped);
    } catch (err) {
      console.error('Gagal memuat riwayat:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [nisn, filter, search]);

  const filtered = loans;

  const filterTabs = [
    { key: 'all', label: 'Semua', count: summary.semua || 0 },
    { key: 'active', label: 'Dipinjam', count: summary.dipinjam || 0 },
    { key: 'overdue', label: 'Terlambat', count: summary.terlambat || 0 },
    { key: 'returned', label: 'Dikembalikan', count: summary.dikembalikan || 0 },
  ];

  return (
    <SiswaLayout>
      <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-6 lg:py-10 space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-dark-800">Riwayat Peminjaman</h1>
          <p className="text-dark-500 mt-1">Lihat semua riwayat peminjaman dan status buku Anda</p>
        </div>


        {/* Search and filter tabs */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari judul atau penulis buku..."
              className="w-full border rounded-lg pl-12 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500 bg-white"
            />
          </div>
          <div className="flex items-center gap-2 overflow-x-auto">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setFilter(tab.key)}
                className={`
                  px-3 py-2 rounded-xl text-xs font-medium whitespace-nowrap transition-all
                  ${filter === tab.key
                    ? 'bg-primary-500 text-white shadow-md'
                    : 'bg-white border border-gray-200 text-gray-600 hover:border-gray-300'
                  }
                `}
              >
                {tab.label}
                <span className={`ml-1.5 px-1.5 py-0.5 rounded-md text-[10px] ${filter === tab.key ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* History table */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-xs text-gray-500 font-medium border-b border-gray-100 bg-gray-50/50">
                  <th className="py-3 pl-5">Buku</th>
                  <th className="py-3">Jenis</th>
                  <th className="py-3">Kode Transaksi</th>
                  <th className="py-3">Tanggal Pinjam</th>
                  <th className="py-3">Jatuh Tempo</th>
                  <th className="py-3">Tanggal Kembali</th>
                  <th className="py-3">Denda</th>
                  <th className="py-3 pr-5">Status</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((b) => (
                  <tr key={b.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 pl-5">
                      <div className="flex items-center gap-3">
                        <img src="https://placehold.co/300x400/ecfdf5/059669?text=Buku+Perpustakaan" alt={b.bookTitle} className="w-10 h-14 rounded object-cover flex-shrink-0" />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-gray-800 line-clamp-1">{b.bookTitle}</p>
                          <p className="text-xs text-gray-400">{b.author}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 text-sm">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                        b.type === 'Paket' ? 'bg-blue-50 text-blue-700 border border-blue-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                      }`}>
                        {b.type}
                      </span>
                    </td>
                    <td className="py-4 text-sm text-gray-600 font-mono">{b.transactionCode}</td>
                    <td className="py-4 text-sm text-gray-600">{b.borrowDate}</td>
                    <td className="py-4 text-sm text-gray-600">{b.dueDate}</td>
                    <td className="py-4 text-sm text-gray-600">{b.returnDate || '-'}</td>
                    <td className="py-4 text-sm">
                      {b.fine > 0 ? (
                        <span className="text-red-500 font-medium">Rp {b.fine.toLocaleString()}</span>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 pr-5">
                      <StatusBadge status={b.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mx-auto mb-4">
              <i className="ri-history-line text-2xl text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-700 mb-1">Tidak ada riwayat</h3>
            <p className="text-sm text-gray-400">Belum ada peminjaman yang sesuai dengan filter</p>
          </div>
        )}
      </div>
    </SiswaLayout>
  );
}