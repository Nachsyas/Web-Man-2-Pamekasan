import { useEffect, useMemo, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';
import PustakawanLayout from '../../components/feature/DashboardLayout';
import { api } from '../../services/api';

function StatusBadge({ status }) {
  const styles = {
    Borrowed: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Returned: 'bg-gray-100 text-gray-700 border-gray-200',
    Overdue: 'bg-red-50 text-red-700 border-red-200',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold uppercase tracking-wide border ${styles[status] || styles.Borrowed}`}>
      {status}
    </span>
  );
}

export default function Borrowing() {
  const [transactions, setTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [borrowType, setBorrowType] = useState('Reguler'); // 'Reguler' or 'Paket'
  const [toast, setToast] = useState('');
  const [showScanner, setShowScanner] = useState(false);
  
  const [listTab, setListTab] = useState('Reguler'); // 'Reguler' or 'Paket'
  
  const [searchSiswa, setSearchSiswa] = useState('');
  const [selectedMember, setSelectedMember] = useState(null);
  const [searchBuku, setSearchBuku] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [booksForModal, setBooksForModal] = useState([]);

  const activeLoans = useMemo(() => transactions.filter(t => t.status === 'Borrowed' || t.status === 'Overdue'), [transactions]);

  const fetchLoans = async () => {
    setIsLoading(true);
    try {
      const res = await api.getLoans();
      const rawData = Array.isArray(res) ? res : (res.data || []);
      const mapped = rawData.map(l => ({
        id: l.id,
        memberName: l.memberName || l.borrower_name || (l.students && l.students.name) || 'Siswa',
        books: l.books || [l.book_title || (l.books_relation && l.books_relation.title) || 'Buku'],
        borrowDate: l.borrowDate || l.borrow_date,
        dueDate: l.dueDate || l.due_date,
        status: (l.status === 'overdue' || l.status === 'terlambat') ? 'Overdue' : (l.status === 'dipinjam' || l.status === 'borrowed') ? 'Borrowed' : l.status,
        type: l.type || (l.category === 'paket' ? 'Paket' : 'Reguler'),
      }));
      setTransactions(mapped);
    } catch (err) {
      console.error('Gagal mengambil data peminjaman:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, []);

  // Handle student search debouncing
  useEffect(() => {
    const handler = setTimeout(async () => {
      if (searchSiswa.trim().length > 1 && !selectedMember) {
        try {
          const res = await api.searchStudentsForLoan(searchSiswa);
          setFilteredMembers(res.data);
        } catch (err) {
          console.error(err);
        }
      } else {
        setFilteredMembers([]);
      }
    }, 300);
    return () => clearTimeout(handler);
  }, [searchSiswa, selectedMember]);

  // Handle book search inside modal
  const fetchBooksForModal = async () => {
    try {
      const apiCategory = borrowType === 'Paket' ? 'paket' : 'reguler';
      const res = await api.getBooksForLoanModal(apiCategory, searchBuku);
      setBooksForModal(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (showModal) {
      fetchBooksForModal();
    }
  }, [showModal, borrowType, searchBuku]);

  const handleScanBarcode = async (barcode) => {
    try {
      let book = null;
      let foundType = 'Reguler';

      if (barcode.startsWith('MANDA-LIB:BOOK:')) {
        const scanRes = await api.scanBook(barcode);
        if (scanRes && scanRes.data) {
          const rawBook = scanRes.data;
          book = {
            ...rawBook,
            stock: rawBook.stok_sekarang !== undefined ? rawBook.stok_sekarang : (rawBook.stock || 0)
          };
          foundType = book.category === 'paket' ? 'Paket' : 'Reguler';
        }
      } else {
        let res = await api.getBooksForLoanModal('reguler', barcode);
        book = res.data && res.data.length > 0 ? res.data.find(b => b.isbn === barcode) || res.data[0] : null;
        
        if (!book) {
          res = await api.getBooksForLoanModal('paket', barcode);
          book = res.data && res.data.length > 0 ? res.data.find(b => b.isbn === barcode) || res.data[0] : null;
          foundType = 'Paket';
        }
      }
      
      if (book) {
        setSelectedBook(book);
        setBorrowType(foundType);
        setShowModal(true);
        setToast(`Buku "${book.title}" berhasil dipindai dan terpilih!`);
      } else {
        setToast(`Buku dengan barcode/ISBN ${barcode} tidak ditemukan.`);
      }
    } catch (err) {
      console.error(err);
      setToast('Gagal memproses barcode buku.');
    } finally {
      setTimeout(() => setToast(''), 3000);
    }
  };

  const handleScanBarcodeInsideModal = async (barcode) => {
    try {
      let book = null;

      if (barcode.startsWith('MANDA-LIB:BOOK:')) {
        const scanRes = await api.scanBook(barcode);
        if (scanRes && scanRes.data) {
          const rawBook = scanRes.data;
          const mappedBook = {
            ...rawBook,
            stock: rawBook.stok_sekarang !== undefined ? rawBook.stok_sekarang : (rawBook.stock || 0)
          };
          
          const bookCategory = mappedBook.category === 'paket' ? 'Paket' : 'Reguler';
          if (bookCategory !== borrowType) {
            setToast(`Buku tersebut berjenis ${bookCategory}, tidak cocok untuk transaksi ${borrowType}.`);
            return;
          }
          book = mappedBook;
        }
      } else {
        const apiCategory = borrowType === 'Paket' ? 'paket' : 'reguler';
        const res = await api.getBooksForLoanModal(apiCategory, barcode);
        book = res.data && res.data.length > 0 ? res.data.find(b => b.isbn === barcode) || res.data[0] : null;
      }
      
      if (book) {
        setSelectedBook(book);
        setToast(`Buku "${book.title}" berhasil terpilih!`);
      } else {
        setToast(`Buku dengan barcode ${barcode} tidak cocok atau tidak ditemukan.`);
      }
    } catch (err) {
      setToast('Gagal memproses barcode.');
    } finally {
      setTimeout(() => setToast(''), 3000);
    }
  };

  useEffect(() => {
    if (showScanner) {
      const scanner = new Html5QrcodeScanner("borrow-reader", { 
        qrbox: { width: 260, height: 120 },
        fps: 8,
      });
      
      scanner.render(
        async (decodedText) => {
          scanner.clear();
          setShowScanner(false);
          if (showModal) {
            await handleScanBarcodeInsideModal(decodedText);
          } else {
            await handleScanBarcode(decodedText);
          }
        },
        (error) => {} // Frame error ignored
      );
      
      return () => {
        scanner.clear().catch(e => console.error("Gagal membersihkan scanner", e));
      };
    }
  }, [showScanner, showModal, borrowType]);

  // Handle auto-fill Nama Siswa
  const handleSelectMember = (member) => {
    setSelectedMember(member);
    setSearchSiswa(member.nisn);
  };

  const handleManualSubmit = async () => {
    if (!selectedMember || !selectedBook) {
        setToast('Pilih siswa dan buku terlebih dahulu!');
        setTimeout(() => setToast(''), 3000);
        return;
    }

    const dueDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    try {
      if (borrowType === 'Reguler') {
        await api.createRegularLoan(selectedMember.nisn, selectedBook.id, dueDate);
      } else {
        await api.createPacketLoan(selectedBook.id, dueDate, [selectedMember.nisn]);
      }
      setToast('Tambah peminjaman berhasil!');
      fetchLoans();
      setShowModal(false);
      setSelectedMember(null);
      setSearchSiswa('');
      setSelectedBook(null);
      setSearchBuku('');
    } catch (err) {
      setToast(err.message || 'Gagal menyimpan transaksi peminjaman.');
    } finally {
      setTimeout(() => setToast(''), 3000);
    }
  };

  const openModal = (type) => {
    setBorrowType(type);
    setShowModal(true);
    setSelectedMember(null);
    setSearchSiswa('');
    setSelectedBook(null);
    setSearchBuku('');
  };

  return (
    <PustakawanLayout userName="Ibu Siti Aminah, S.Pd.">
      <div className="page-container space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800 tracking-tight">Peminjaman Buku</h1>
            <p className="text-gray-500 mt-1">Daftar transaksi peminjaman aktif dan tambah peminjaman baru</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowScanner(true)} className="bg-white border-2 border-emerald-100 text-emerald-600 px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-semibold hover:bg-emerald-50 hover:border-emerald-200 hover:shadow-sm transition-all duration-200 active:scale-95 shadow-sm">
               <i className="ri-qr-scan-2-line text-lg" /> Pindai Barcode Buku
            </button>
            <button onClick={() => openModal('Reguler')} className="btn-secondary">
               <i className="ri-add-line" /> Tambah Peminjaman Reguler
            </button>
            <button onClick={() => openModal('Paket')} className="btn-primary">
               <i className="ri-book-3-line" /> Tambah Peminjaman Paket
            </button>
          </div>
        </div>

        {/* Area Buku Keluar (Borrowed & Overdue) */}
        <div className="card-base p-0 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-white">
             <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className="font-bold text-gray-800">Buku Sedang Dipinjam</h2>
                
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
          </div>
          <div className="overflow-x-auto">
              <table className="w-full text-left">
                 <thead className="bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                   <tr>
                     <th className="py-3 whitespace-nowrap pl-6">Peminjam</th>
                     <th className="py-3 whitespace-nowrap px-4">Buku</th>
                     <th className="py-3 whitespace-nowrap px-4">Jatuh Tempo</th>
                     <th className="py-3 whitespace-nowrap pr-6 text-right">Status</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-gray-50 bg-white">
                   {activeLoans.filter(loan => loan.type === listTab).flatMap(loan => 
                     loan.books.map((b, i) => (
                       <tr key={`${loan.id}-${i}`} className="hover:bg-emerald-50/30 transition-colors">
                          <td className="py-3 whitespace-nowrap pl-6">
                              <p className="font-bold text-gray-800">{loan.memberName}</p>
                          </td>
                          <td className="py-3 px-4 text-sm text-gray-700">
                              {b}
                          </td>
                          <td className="py-3 whitespace-nowrap px-4 text-sm font-bold text-gray-600">{loan.dueDate}</td>
                          <td className="py-3 whitespace-nowrap pr-6 text-right"><StatusBadge status={loan.status} /></td>
                       </tr>
                     ))
                   )}
                   {activeLoans.filter(loan => loan.type === listTab).length === 0 && (
                     <tr>
                       <td colSpan="4" className="py-8 text-center text-gray-500 text-sm">
                         Tidak ada data peminjaman aktif untuk {listTab}
                       </td>
                     </tr>
                   )}
                 </tbody>
              </table>
          </div>
        </div>

        {/* ================= MODAL TRANSAKSI ================= */}
        {showModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-all duration-300">
                <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl animate-fade-in overflow-hidden border border-emerald-100 max-h-[90vh] flex flex-col">
                    
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50 flex-shrink-0">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-white border border-emerald-200 rounded-xl flex items-center justify-center shadow-sm">
                              <i className="ri-edit-2-fill text-emerald-600 text-xl" />
                           </div>
                           <div>
                              <h2 className="text-lg font-bold text-gray-800 leading-tight">Tambah Peminjaman {borrowType}</h2>
                              <p className="text-xs text-gray-500">Pilih siswa dan buku yang akan dipinjam</p>
                           </div>
                        </div>
                        <button onClick={() => setShowModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"><i className="ri-close-line text-xl" /></button>
                    </div>

                    <div className="p-6 space-y-6 bg-white overflow-y-auto flex-1">
                        
                        {/* Area Input Siswa */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="relative">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Pencarian NISN Siswa</label>
                                <div className="relative">
                                    <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                    <input 
                                        type="text" 
                                        value={searchSiswa} 
                                        onChange={e => {
                                            setSearchSiswa(e.target.value);
                                            setSelectedMember(null);
                                        }} 
                                        placeholder="Ketik NISN siswa..."
                                        className="input-field w-full pl-10" 
                                    />
                                </div>
                                {/* Dropdown Hasil Pencarian Siswa */}
                                {searchSiswa && !selectedMember && filteredMembers.length > 0 && (
                                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                                        {filteredMembers.map(m => (
                                            <button 
                                                key={m.nisn} 
                                                onClick={() => handleSelectMember(m)}
                                                className="w-full text-left px-4 py-2 hover:bg-emerald-50 hover:text-emerald-700 text-sm transition-colors border-b border-gray-50 last:border-0"
                                            >
                                                <div className="font-semibold text-emerald-700">{m.nisn}</div>
                                                <div className="text-sm text-gray-800">{m.name}</div>
                                                <div className="text-xs text-gray-500">Kelas: {m.class || '-'}</div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Nama Siswa (Autofill)</label>
                                <input 
                                    type="text" 
                                    value={selectedMember ? selectedMember.name : ''} 
                                    readOnly 
                                    placeholder="Nama siswa akan terisi otomatis"
                                    className="input-field w-full bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200" 
                                />
                            </div>
                        </div>

                        {/* Area Input Buku */}
                        <div>
                            <div className="flex items-center justify-between mb-2">
                                <label className="block text-sm font-bold text-gray-700">Pilih Buku {borrowType}</label>
                                <div className="flex items-center gap-2">
                                    <button onClick={() => setShowScanner(true)} className="bg-emerald-50 border border-emerald-200 text-emerald-600 px-3 py-1.5 rounded-xl flex items-center gap-1.5 text-xs font-semibold hover:bg-emerald-100 transition-colors shadow-sm active:scale-95">
                                        <i className="ri-qr-scan-2-line text-sm" /> Kamera Scan
                                    </button>
                                    <div className="relative w-48 sm:w-64">
                                        <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm" />
                                        <input 
                                            type="text" 
                                            value={searchBuku} 
                                            onChange={e => setSearchBuku(e.target.value)} 
                                            placeholder="Cari buku..."
                                            className="input-field w-full pl-9 py-1.5 text-sm" 
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-4 max-h-64 overflow-y-auto pr-2 scrollbar-hide">
                                {booksForModal.length > 0 ? booksForModal.map(b => (
                                    <div 
                                        key={b.id} 
                                        onClick={() => setSelectedBook(b)}
                                        className={`cursor-pointer rounded-xl border-2 p-3 transition-all flex flex-col items-center text-center gap-2
                                            ${selectedBook?.id === b.id ? 'border-emerald-500 bg-emerald-50' : 'border-gray-100 hover:border-emerald-200 bg-white'}
                                        `}
                                    >
                                        <div className="w-16 h-20 bg-gray-200 rounded overflow-hidden">
                                            <img src={b.coverUrl || 'https://placehold.co/150x200?text=Buku'} alt={b.title} className="w-full h-full object-cover" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-gray-800 line-clamp-2">{b.title}</p>
                                            <p className={`text-[10px] mt-1 font-medium ${b.stock > 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                                                Stok: {b.stock}
                                            </p>
                                        </div>
                                    </div>
                                )) : (
                                    <div className="col-span-full py-8 text-center text-gray-500 text-sm">
                                        Tidak ada buku yang ditemukan.
                                    </div>
                                )}
                            </div>
                        </div>

                    </div>

                    <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/80 flex-shrink-0">
                        <button onClick={() => setShowModal(false)} className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-100 transition-colors text-sm bg-white shadow-sm">Batal</button>
                        <button onClick={handleManualSubmit} className="px-8 py-2.5 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 hover:shadow-md active:scale-95 transition-all duration-200 text-sm shadow-sm border border-emerald-600 flex items-center gap-2">
                            <i className="ri-save-3-line" /> Simpan Peminjaman
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* MODAL SCANNER BARCODE */}
        {showScanner && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm">
                <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-fade-in relative border border-emerald-100">
                    <button onClick={() => setShowScanner(false)} className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors z-10">
                        <i className="ri-close-line text-lg" />
                    </button>
                    <h3 className="font-bold text-xl text-gray-800 mb-4 text-center">Pindai Barcode Buku</h3>
                    <div className="rounded-xl overflow-hidden border-4 border-emerald-100 mb-4 bg-black relative">
                        <div id="borrow-reader" className="w-full" />
                    </div>
                    <p className="text-xs text-gray-500 text-center leading-relaxed">
                        Arahkan kamera ke barcode label buku untuk menginput data secara otomatis.
                    </p>
                </div>
            </div>
        )}

        {/* Toast Notifikasi */}
        {toast && (
            <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-6 py-4 rounded-xl shadow-2xl text-sm flex items-center gap-3 animate-fade-in">
                <i className="ri-checkbox-circle-fill text-emerald-400 text-xl" />
                <span className="font-medium tracking-wide">{toast}</span>
            </div>
        )}
      </div>
    </PustakawanLayout>
  );
}