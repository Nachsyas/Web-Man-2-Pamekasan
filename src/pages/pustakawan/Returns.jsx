import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import PustakawanLayout from '../../components/feature/DashboardLayout';
import { allBorrowingTransactions } from '../../mocks/system';
import { booksMock } from '../../mocks/books';

export default function Returns() {
  const [searchCode, setSearchCode] = useState('');
  const [foundTrx, setFoundTrx] = useState(null);
  const [transactions, setTransactions] = useState(allBorrowingTransactions);
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [toast, setToast] = useState('');
  
  const [listTab, setListTab] = useState('Reguler'); // 'Reguler' or 'Paket'
  
  // States for Return Modal
  const [returnCondition, setReturnCondition] = useState('Baik');
  const [replacementType, setReplacementType] = useState('Buku');
  const [replacementNominal, setReplacementNominal] = useState('');

  const activeTransactions = useMemo(() => {
    return transactions.filter(t => (t.status === 'Borrowed' || t.status === 'Overdue') && t.type === listTab);
  }, [transactions, listTab]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return {
      today: transactions.filter(t => t.returnDate === today).length,
      overdue: transactions.filter(t => t.status === 'Overdue').length,
      totalFine: transactions.reduce((sum, t) => sum + t.fine, 0),
      pendingReturn: transactions.filter(t => t.status === 'Borrowed' || t.status === 'Overdue').length,
    };
  }, [transactions]);

  const searchTransaction = () => {
    const found = transactions.find(t => t.id.toLowerCase() === searchCode.toLowerCase() && (t.status === 'Borrowed' || t.status === 'Overdue'));
    if (found) {
      setFoundTrx(found);
      setReturnCondition('Baik');
      setReplacementType('Buku');
      setReplacementNominal('');
      setShowReturnModal(true);
    } else {
      setToast('Transaksi tidak ditemukan atau sudah dikembalikan');
      setTimeout(() => setToast(''), 3000);
    }
  };

  const processReturn = () => {
    if (!foundTrx) return;
    setTransactions(prev => prev.map(t => {
      if (t.id !== foundTrx.id) return t;
      return { ...t, status: 'Returned', returnDate: new Date().toISOString().split('T')[0] };
    }));
    setShowReturnModal(false);
    setSearchCode('');
    setToast(`Pengembalian ${foundTrx.id} berhasil diproses.`);
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <PustakawanLayout userName="Ibu Siti Aminah, S.Pd." userNisn="Pustakawan">
      <div className="page-container space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Pengembalian Buku</h1>
            <p className="text-gray-500 mt-1">Proses pengembalian dan perhitungan denda</p>
          </div>
          <Link to="/pustakawan/peminjaman" className="btn-secondary">
            <i className="ri-hand-coin-line" /> Ke Peminjaman
          </Link>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Kembali Hari Ini', value: stats.today, icon: 'ri-check-double-line', color: 'text-green-600 bg-green-50' },
            { label: 'Terlambat', value: stats.overdue, icon: 'ri-alarm-warning-line', color: 'text-red-600 bg-red-50' },
            { label: 'Total Denda', value: `Rp ${stats.totalFine.toLocaleString()}`, icon: 'ri-money-cny-circle-line', color: 'text-yellow-600 bg-yellow-50' },
            { label: 'Menunggu Kembali', value: stats.pendingReturn, icon: 'ri-book-open-line', color: 'text-blue-600 bg-blue-50' },
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

        {/* Search Card */}
        <div className="card-base bg-gray-50/50">
          <h3 className="font-semibold text-gray-800 mb-4">Cari Transaksi Peminjaman</h3>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <i className="ri-barcode-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Masukkan kode transaksi (contoh: TRX-2026-001)..."
                value={searchCode}
                onChange={e => setSearchCode(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && searchTransaction()}
                className="input-field w-full pl-11 bg-white"
              />
            </div>
            <button onClick={searchTransaction} className="btn-primary">
              <i className="ri-search-line" /> Cari Transaksi
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-3">atau pilih dari daftar peminjaman aktif di bawah</p>
        </div>

        {/* Tabel Transaksi Aktif */}
        <div className="card-base overflow-hidden p-0">
          <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <h3 className="font-semibold text-gray-800">Peminjaman Aktif & Terlambat</h3>
              <span className="text-xs font-medium bg-emerald-50 text-emerald-600 px-2 py-1 rounded-md">{activeTransactions.length} transaksi</span>
            </div>
            
            {/* Tabs */}
            <div className="flex bg-gray-100 p-1 rounded-xl">
              <button 
                onClick={() => setListTab('Reguler')} 
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${listTab === 'Reguler' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Reguler
              </button>
              <button 
                onClick={() => setListTab('Paket')} 
                className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${listTab === 'Paket' ? 'bg-white text-emerald-700 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
              >
                Paket
              </button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-500 bg-gray-50 border-b border-gray-100">
                  <th className="py-3 whitespace-nowrap pl-6 pr-4">Kode</th>
                  <th className="py-3 whitespace-nowrap px-4">Siswa</th>
                  <th className="py-3 whitespace-nowrap px-4">Buku</th>
                  <th className="py-3 whitespace-nowrap px-4 text-center">Jatuh Tempo</th>
                  <th className="py-3 whitespace-nowrap px-4 text-center">Status</th>
                  <th className="py-3 whitespace-nowrap px-4 text-center">Denda</th>
                  <th className="py-3 whitespace-nowrap pr-6 pl-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {activeTransactions.map(trx => (
                  <tr key={trx.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 whitespace-nowrap pl-6 pr-4 text-sm font-mono text-gray-600">{trx.id}</td>
                    <td className="py-3 whitespace-nowrap px-4">
                      <p className="text-sm font-medium text-gray-800">{trx.memberName}</p>
                    </td>
                    <td className="py-3 whitespace-nowrap px-4">
                      <div className="flex flex-wrap gap-1">
                        {trx.books.map((b, i) => (
                          <span key={i} className="bg-gray-100 border border-gray-200 text-gray-600 px-2 py-1 rounded text-[11px]">{b}</span>
                        ))}
                      </div>
                    </td>
                    <td className="py-3 whitespace-nowrap px-4 text-center text-sm text-gray-600">{trx.dueDate}</td>
                    <td className="py-3 whitespace-nowrap px-4 text-center whitespace-nowrap">
                      <span className={`inline-flex px-2.5 py-1 rounded-lg text-xs font-semibold border ${trx.status === 'Overdue' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-green-50 text-green-600 border-green-100'}`}>
                        {trx.status === 'Overdue' ? 'Terlewat Batas Waktu Peminjaman' : 'Dipinjam'}
                      </span>
                    </td>
                    <td className="py-3 whitespace-nowrap px-4 text-center text-sm font-bold whitespace-nowrap">
                      {trx.fine > 0 ? <span className="text-red-500">Kalkulasi Denda...</span> : <span className="text-gray-400">-</span>}
                    </td>
                    <td className="py-3 whitespace-nowrap pr-6 pl-4 text-right">
                      <button 
                        onClick={() => { 
                          setFoundTrx(trx); 
                          setReturnCondition('Baik');
                          setReplacementType('Buku');
                          setReplacementNominal('');
                          setShowReturnModal(true); 
                        }} 
                        className="btn-primary py-1.5 px-4 text-xs inline-flex"
                      >
                        Sudah Dikembalikan
                      </button>
                    </td>
                  </tr>
                ))}
                {activeTransactions.length === 0 && (
                  <tr>
                    <td colSpan="7" className="py-8 text-center text-gray-500 text-sm">
                      Tidak ada peminjaman aktif untuk {listTab}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Kembalikan */}
        {showReturnModal && foundTrx && (() => {
          const calculateDaysLate = (dueDateStr) => {
            if (!dueDateStr) return 0;
            const today = new Date();
            const dueDate = new Date(dueDateStr);
            today.setHours(0,0,0,0);
            dueDate.setHours(0,0,0,0);
            const diffTime = today - dueDate;
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays > 0 ? diffDays : 0;
          };

          const daysLate = calculateDaysLate(foundTrx.dueDate);
          const baseFine = daysLate * 5000;
          
          const firstBookTitle = foundTrx.books[0] || '';
          const bookDetails = booksMock.find(b => b.title === firstBookTitle) || {
            title: firstBookTitle,
            author: '-',
            isbn: '-',
            category: 'Reguler'
          };

          // Format Date ID
          const formatDateId = (dateStr) => {
             if (!dateStr) return '-';
             const date = new Date(dateStr);
             const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
             return date.toLocaleDateString('id-ID', options);
          };

          const totalPayment = returnCondition === 'Rusak' && replacementType === 'Uang'
             ? baseFine + (parseInt(replacementNominal) || 0)
             : baseFine;

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-sm">
              <div className="bg-white rounded-[24px] w-full max-w-md max-h-[90vh] overflow-y-auto overflow-x-hidden relative flex flex-col shadow-2xl">
                {/* Header */}
                <div className="flex items-center gap-4 p-5 border-b border-gray-100 sticky top-0 bg-white z-10">
                  <button onClick={() => setShowReturnModal(false)} className="text-gray-800 hover:text-emerald-600 transition-colors">
                    <i className="ri-arrow-left-line text-2xl" />
                  </button>
                  <h2 className="text-xl font-bold text-gray-800">Pengembalian Buku</h2>
                </div>

                <div className="p-5 space-y-6">
                  {/* Book Info Card */}
                  <div className="border border-gray-200 rounded-2xl p-4 flex gap-4 items-start bg-white">
                    <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-500 flex-shrink-0">
                      <i className="ri-book-read-line text-2xl" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start gap-2">
                        <h3 className="font-bold text-gray-800 leading-tight">{bookDetails.title}</h3>
                        <span className="px-3 py-1 bg-indigo-50 text-indigo-600 border border-indigo-100 rounded-full text-[10px] font-bold whitespace-nowrap">
                          {bookDetails.category === 'Pendidikan' ? 'Paket' : 'Biasa'}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 mt-1">{bookDetails.author}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-xs font-medium text-gray-500">ISBN</span>
                        <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded">{bookDetails.isbn}</span>
                      </div>
                    </div>
                  </div>

                  {/* Data Peminjaman Section */}
                  <div>
                    <h3 className="font-bold text-gray-800 mb-4 text-lg">Data Peminjaman</h3>
                    
                    <div className="space-y-4">
                      {/* NISN & Nama */}
                      <div className="space-y-4 bg-white rounded-2xl p-4 border border-gray-100">
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1.5">NISN</label>
                          <input type="text" readOnly value={foundTrx.nisn || '-'} className="w-full bg-gray-100 border-none rounded-xl px-4 py-3 text-sm text-gray-600 focus:outline-none font-medium" />
                        </div>
                        <div>
                          <label className="block text-sm font-bold text-gray-700 mb-1.5">Nama</label>
                          <input type="text" readOnly value={foundTrx.memberName} className="w-full bg-gray-100 border-none rounded-xl px-4 py-3 text-sm text-gray-600 focus:outline-none font-medium" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Tanggal Diajukan</label>
                            <div className="relative">
                              <i className="ri-calendar-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                              <input type="text" readOnly value={formatDateId(foundTrx.borrowDate)} className="w-full bg-gray-100 border-none rounded-xl pl-9 pr-3 py-3 text-xs text-gray-600 focus:outline-none font-medium truncate" />
                            </div>
                          </div>
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1.5">Jatuh Tempo</label>
                            <div className="relative">
                              <i className="ri-calendar-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                              <input type="text" readOnly value={formatDateId(foundTrx.dueDate)} className="w-full bg-gray-100 border-none rounded-xl pl-9 pr-3 py-3 text-xs text-gray-600 focus:outline-none font-medium truncate" />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Kondisi */}
                      <div className="pt-2">
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-bold text-gray-700">Kondisi</label>
                          <span className="text-[10px] text-[#FF4B4B] font-medium">*Apabila rusak, siswa wajib mengganti</span>
                        </div>
                        <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1.5 rounded-xl">
                          <button 
                            onClick={() => setReturnCondition('Baik')}
                            className={`py-2.5 rounded-lg text-sm font-bold transition-all ${returnCondition === 'Baik' ? 'bg-[#059669] text-white shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                          >
                            Baik
                          </button>
                          <button 
                            onClick={() => setReturnCondition('Rusak')}
                            className={`py-2.5 rounded-lg text-sm font-bold transition-all ${returnCondition === 'Rusak' ? 'bg-[#E5E7EB] text-gray-500 shadow-sm' : 'text-gray-400 hover:text-gray-600'}`}
                          >
                            Rusak*
                          </button>
                        </div>
                      </div>

                      {/* Ganti dengan (if Rusak) */}
                      {returnCondition === 'Rusak' && (
                        <div className="animate-fade-in space-y-4 pt-4 border-t border-gray-100">
                          <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Metode Penggantian</label>
                            <div className="grid grid-cols-2 gap-3">
                              <button 
                                onClick={() => setReplacementType('Buku')}
                                className={`py-2.5 rounded-xl text-sm font-bold transition-all border ${replacementType === 'Buku' ? 'border-[#FF4B4B] bg-[#FFEAEA] text-[#FF4B4B]' : 'border-gray-200 bg-white text-gray-500'}`}
                              >
                                <i className="ri-book-mark-line mr-1" /> Buku
                              </button>
                              <button 
                                onClick={() => setReplacementType('Uang')}
                                className={`py-2.5 rounded-xl text-sm font-bold transition-all border ${replacementType === 'Uang' ? 'border-[#FF4B4B] bg-[#FFEAEA] text-[#FF4B4B]' : 'border-gray-200 bg-white text-gray-500'}`}
                              >
                                <i className="ri-money-dollar-circle-line mr-1" /> Uang
                              </button>
                            </div>
                          </div>

                          {replacementType === 'Buku' ? (
                            <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                              <p className="text-xs text-gray-500 mb-2 font-medium"><i className="ri-info-circle-line text-[#FF4B4B]" /> Harap mengganti dengan buku spesifikasi berikut:</p>
                              <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Nama Buku</label>
                                <input type="text" readOnly value={bookDetails.title} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 font-medium focus:outline-none" />
                              </div>
                              <div className="grid grid-cols-2 gap-3">
                                <div>
                                  <label className="block text-xs font-semibold text-gray-600 mb-1">ISBN</label>
                                  <input type="text" readOnly value={bookDetails.isbn} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 font-medium focus:outline-none" />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-gray-600 mb-1">Penulis</label>
                                  <input type="text" readOnly value={bookDetails.author} className="w-full bg-white border border-gray-200 rounded-lg px-3 py-2.5 text-sm text-gray-700 font-medium focus:outline-none" />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
                              <div>
                                <label className="block text-xs font-semibold text-gray-600 mb-1">Nominal Penggantian (Rp)</label>
                                <div className="relative">
                                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">Rp</span>
                                  <input 
                                    type="number" 
                                    value={replacementNominal} 
                                    onChange={e => setReplacementNominal(e.target.value)} 
                                    placeholder="Contoh: 50000" 
                                    className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3 text-sm text-gray-800 font-bold focus:outline-none focus:border-[#FF4B4B] focus:ring-1 focus:ring-[#FF4B4B]" 
                                  />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Denda */}
                      <div className="pt-2">
                        <div className="flex justify-between items-center mb-2">
                          <label className="text-sm font-bold text-gray-700">Denda</label>
                          {daysLate > 0 && (
                            <span className="text-[12px] text-[#FF4B4B] font-bold flex items-center gap-1">
                              <i className="ri-time-line" /> {daysLate} Hari Telat
                            </span>
                          )}
                        </div>
                        <div className="w-full bg-[#FFEAEA] rounded-xl px-4 py-3 text-center border border-[#FFD5D5]">
                          <span className="text-[#FF4B4B] font-bold text-lg">
                            Rp {totalPayment.toLocaleString('id-ID')}
                          </span>
                        </div>
                      </div>

                    </div>
                  </div>
                  
                  {/* Action Buttons */}
                  <div className="pt-4 pb-2">
                    <button 
                      onClick={processReturn}
                      className={`w-full py-3.5 rounded-full font-bold text-white transition-all shadow-md ${
                        returnCondition === 'Rusak' 
                          ? 'bg-[#E12A2A] hover:bg-red-700' 
                          : 'bg-[#059669] hover:bg-emerald-600'
                      }`}
                    >
                      {returnCondition === 'Rusak' ? 'Buku Rusak, Siswa Mengganti' : 'Kembalikan Buku'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

        {/* Toast Notifikasi */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3.5 rounded-xl shadow-xl text-sm flex items-center gap-3 animate-fade-in">
            <i className="ri-checkbox-circle-fill text-green-400 text-lg" />
            <span className="font-medium">{toast}</span>
          </div>
        )}
      </div>
    </PustakawanLayout>
  );
}