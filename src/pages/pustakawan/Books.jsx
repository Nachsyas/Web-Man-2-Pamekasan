import { Html5QrcodeScanner } from 'html5-qrcode';
import { useEffect, useMemo, useRef, useState } from 'react';
import PustakawanLayout from '../../components/feature/DashboardLayout';
import { bookRacks, booksMock } from '../../mocks/books';

const conditions = ['Available', 'Borrowed', 'Damaged', 'Lost'];
const bookTypes = ['Buku Reguler', 'Buku Paket'];

const regulerCategories = [
  'Filsafat', 'Pendidikan', 'Sains & Matematika', 'Teknologi & Komputer', 
  'Seni & Desain', 'Bahasa & Sastra', 'Fiksi / Novel', 'Agama & Spiritual', 
  'Sejarah & Budaya', 'Sosial & Politik', 'Biografi / Otobiografi', 
  'Referensi / Ensiklopedia', 'Karya Umum'
];

const paketCategories = [
  'Al-Qur\'an Hadits', 'Akidah Akhlak', 'Fikih', 'Sejarah Kebudayaan Islam (SKI)',
  'Matematika (Wajib/Peminatan)', 'Biologi', 'Fisika', 'Kimia', 'Bahasa Indonesia',
  'Bahasa Arab', 'Bahasa Inggris', 'Sejarah Indonesia', 'Geografi',
  'Sosiologi', 'Ekonomi', 'PPKn', 'Seni Budaya', 'Prakarya & Kewirausahaan (PKWU)', 'PJOK'
];

function ConditionBadge({ condition }) {
  const styles = {
    Available: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Borrowed: 'bg-blue-50 text-blue-700 border-blue-200',
    Damaged: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    Lost: 'bg-red-50 text-red-700 border-red-200',
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[11px] font-bold tracking-wide uppercase border ${styles[condition] || styles.Available}`}>
      {condition}
    </span>
  );
}

export default function Books() {
  const [books, setBooks] = useState(booksMock.map(b => ({ ...b, type: 'Buku Reguler' })));
  
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showLabelModal, setShowLabelModal] = useState(false);
  
  // State Khusus Import Excel
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const fileInputRef = useRef(null);

  const [editingBook, setEditingBook] = useState(null);
  const [form, setForm] = useState({});
  const [toast, setToast] = useState('');

  // Efek Kamera Scan Barcode
  useEffect(() => {
    if (showScanner) {
      const scanner = new Html5QrcodeScanner("reader", { 
        qrbox: { width: 260, height: 120 },
        fps: 8,
      });
      
      scanner.render(
        (decodedText) => {
          setForm({
            title: 'Buku Hasil Scan Kamera', 
            isbn: decodedText,
            category: '',
            type: 'Buku Reguler',
            stock: '',
            rack: '',
          });
          scanner.clear();
          setShowScanner(false);
          setShowFormModal(true);
          setToast(`Barcode ${decodedText} berhasil dipindai!`);
          setTimeout(() => setToast(''), 3000);
        },
        (error) => {} // Frame scanner error ignored
      );
      return () => { scanner.clear().catch(e => console.error("Gagal membersihkan scanner", e)); };
    }
  }, [showScanner]);

  const filteredBooks = useMemo(() => {
    return books.filter(b => {
      const matchSearch = !search || b.title.toLowerCase().includes(search.toLowerCase()) || b.isbn.includes(search);
      const matchCategory = !categoryFilter || b.category === categoryFilter;
      const matchType = !typeFilter || b.type === typeFilter;
      return matchSearch && matchCategory && matchType;
    });
  }, [books, search, categoryFilter, typeFilter]);

  const saveBook = () => {
    if (!form.title || !form.isbn) {
      setToast('Judul dan ISBN wajib diisi!');
      setTimeout(() => setToast(''), 3000);
      return;
    }
    if (editingBook) {
      setBooks(books.map(b => b.id === editingBook.id ? { ...b, ...form } : b));
      setToast('Buku berhasil diperbarui');
    } else {
      setBooks([{ 
        ...form, 
        id: `BK-${Date.now()}`, 
        stock: parseInt(form.stock) || 0,
        totalStock: parseInt(form.stock) || 0,
        type: form.type || 'Buku Reguler',
        condition: 'Available'
      }, ...books]);
      setToast('Buku baru berhasil ditambahkan');
    }
    setShowFormModal(false);
    setTimeout(() => setToast(''), 3000);
  };

  const confirmDelete = () => {
    setBooks(books.filter(b => b.id !== editingBook.id));
    setShowDelete(false);
    setToast('Buku berhasil dihapus');
    setTimeout(() => setToast(''), 3000);
  };

  // Logika Simulasi Import Excel
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImportFile(e.target.files[0]);
    }
  };

  const processImport = () => {
    if (!importFile) return;
    setIsImporting(true);
    
    // Simulasi proses pembacaan file Excel (Nanti diintegrasikan dengan library 'xlsx' SheetJS)
    setTimeout(() => {
      setIsImporting(false);
      setShowImportModal(false);
      setImportFile(null);
      setToast(`Berhasil mengimpor data dari ${importFile.name}!`);
      setTimeout(() => setToast(''), 4000);
    }, 2000);
  };

  const activeCategoriesInForm = form.type === 'Buku Paket' ? paketCategories : regulerCategories;

  return (
    <PustakawanLayout userName="Ibu Siti Aminah, S.Pd." userNisn="Pustakawan">
      <div className="max-w-[1400px] mx-auto px-4 lg:px-8 py-6 lg:py-10 space-y-6">
        
        {/* Header Section */}
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4">
            <div>
                <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 tracking-tight">Kelola Buku</h1>
                <p className="text-gray-500 mt-1">Manajemen inventaris kategori reguler dan buku paket sekolah</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
                {/* Tombol Import Excel Baru */}
                <button onClick={() => setShowImportModal(true)} className="bg-white border-2 border-gray-200 text-gray-700 px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-semibold hover:bg-green-50 hover:border-green-200 hover:text-green-700 transition-all duration-200 active:scale-95 shadow-sm">
                    <i className="ri-file-excel-2-line text-lg text-green-600" /> Import Excel
                </button>
                <button onClick={() => setShowScanner(true)} className="bg-white border-2 border-emerald-100 text-emerald-600 px-4 py-2.5 rounded-xl flex items-center gap-2 text-sm font-semibold hover:bg-emerald-50 hover:border-emerald-200 hover:shadow-sm transition-all duration-200 active:scale-95 shadow-sm">
                    <i className="ri-qr-scan-2-line text-lg" /> Kamera Scan
                </button>
                <button onClick={() => { setEditingBook(null); setForm({ type: 'Buku Reguler', category: '', condition: 'Available' }); setShowFormModal(true); }} className="bg-emerald-500 text-white px-5 py-2.5 rounded-xl flex items-center gap-2 text-sm font-semibold hover:bg-emerald-600 hover:shadow-md transition-all duration-200 active:scale-95 shadow-sm border border-emerald-600">
                    <i className="ri-add-line text-lg" /> Tambah Buku
                </button>
            </div>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col md:flex-row gap-4 p-5 transition-all hover:shadow-md">
           <div className="flex-1 relative group">
              <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-emerald-500 transition-colors" />
              <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Cari judul atau ISBN..." className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 hover:border-emerald-300 transition-colors text-sm" />
           </div>
           <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setCategoryFilter(''); }} className="md:w-48 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 hover:border-emerald-300 transition-colors text-sm cursor-pointer">
              <option value="">Semua Jenis Buku</option>
              <option value="Buku Paket">Buku Paket</option>
              <option value="Buku Reguler">Buku Reguler</option>
           </select>
           <select value={categoryFilter} onChange={e => setCategoryFilter(e.target.value)} className="md:w-56 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 hover:border-emerald-300 transition-colors text-sm cursor-pointer">
              <option value="">Semua Kategori</option>
              {typeFilter === 'Buku Paket' && paketCategories.map(c => <option key={c} value={c}>{c}</option>)}
              {typeFilter === 'Buku Reguler' && regulerCategories.map(c => <option key={c} value={c}>{c}</option>)}
              {!typeFilter && [...regulerCategories, ...paketCategories].map(c => <option key={c} value={c}>{c}</option>)}
           </select>
        </div>

        {/* Tabel Data Buku */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead className="bg-emerald-50/50 text-xs font-bold text-gray-500 uppercase tracking-wider border-b border-gray-100">
                        <tr>
                            <th className="py-3 whitespace-nowrap pl-6">Judul Buku</th>
                            <th className="py-3 whitespace-nowrap px-4">Jenis & Kategori</th>
                            <th className="py-3 whitespace-nowrap px-4">Stok</th>
                            <th className="py-3 whitespace-nowrap px-4">Kondisi</th>
                            <th className="py-3 whitespace-nowrap pr-6 text-right">Aksi</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                        {filteredBooks.map(book => (
                            <tr key={book.id} className="hover:bg-emerald-50/30 transition-colors duration-200 group">
                                <td className="py-3 whitespace-nowrap pl-6">
                                    <p className="font-bold text-gray-800 line-clamp-1 group-hover:text-emerald-700 transition-colors">{book.title}</p>
                                    <p className="text-xs text-gray-500 font-mono mt-1">ISBN: <span className="bg-gray-100 px-1.5 py-0.5 rounded text-gray-600">{book.isbn}</span></p>
                                </td>
                                <td className="py-3 whitespace-nowrap px-4">
                                    <div className="flex flex-col gap-1.5 items-start">
                                        <span className={`px-2 py-0.5 rounded flex items-center gap-1 text-[10px] font-bold uppercase tracking-wide border ${book.type === 'Buku Paket' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-white text-emerald-600 border-emerald-200'}`}>
                                            <i className={book.type === 'Buku Paket' ? 'ri-book-stack-line' : 'ri-book-open-line'} />
                                            {book.type || 'Buku Reguler'}
                                        </span>
                                        <span className="text-xs font-medium text-gray-500">{book.category}</span>
                                    </div>
                                </td>
                                <td className="py-3 whitespace-nowrap px-4 text-sm font-bold text-gray-700">{book.stock} <span className="text-gray-400 font-normal">/ {book.totalStock || book.stock}</span></td>
                                <td className="py-3 whitespace-nowrap px-4"><ConditionBadge condition={book.condition} /></td>
                                <td className="py-3 whitespace-nowrap pr-6 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                        <button onClick={() => { setEditingBook(book); setShowLabelModal(true); }} className="w-9 h-9 rounded-xl text-gray-400 hover:text-purple-600 hover:bg-purple-50 hover:shadow-sm flex items-center justify-center transition-all duration-200" title="Cetak Label">
                                            <i className="ri-printer-line text-lg" />
                                        </button>
                                        <button onClick={() => { setEditingBook(book); setForm(book); setShowFormModal(true); }} className="w-9 h-9 rounded-xl text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 hover:shadow-sm flex items-center justify-center transition-all duration-200" title="Edit Data">
                                            <i className="ri-edit-line text-lg" />
                                        </button>
                                        <button onClick={() => { setEditingBook(book); setShowDelete(true); }} className="w-9 h-9 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 hover:shadow-sm flex items-center justify-center transition-all duration-200" title="Hapus Buku">
                                            <i className="ri-delete-bin-line text-lg" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
                {filteredBooks.length === 0 && (
                    <div className="py-16 text-center">
                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                           <i className="ri-search-line text-2xl text-gray-400" />
                        </div>
                        <p className="text-gray-500 font-medium">Buku tidak ditemukan.</p>
                        <p className="text-sm text-gray-400 mt-1">Coba sesuaikan kata kunci atau filter pencarian Anda.</p>
                    </div>
                )}
            </div>
        </div>

        {/* ======================= ZONA MODAL ======================= */}

        {/* MODAL 5: IMPORT EXCEL (BARU) */}
        {showImportModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-all duration-300">
                <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-fade-in overflow-hidden border border-emerald-100">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-white border border-green-200 rounded-xl flex items-center justify-center shadow-sm">
                              <i className="ri-file-excel-2-fill text-green-600 text-xl" />
                           </div>
                           <div>
                              <h2 className="text-lg font-bold text-gray-800 leading-tight">Import Data Excel</h2>
                              <p className="text-xs text-gray-500">Unggah file .xlsx atau .csv sekaligus</p>
                           </div>
                        </div>
                        <button onClick={() => { setShowImportModal(false); setImportFile(null); }} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"><i className="ri-close-line text-xl" /></button>
                    </div>

                    <div className="p-6 space-y-6 bg-white">
                        {/* Area Download Template */}
                        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-4">
                            <i className="ri-information-fill text-blue-500 text-xl mt-0.5" />
                            <div>
                                <p className="text-sm font-semibold text-blue-900 mb-1">Butuh Format Excel yang benar?</p>
                                <p className="text-xs text-blue-700/80 mb-3 leading-relaxed">Unduh template Excel kami agar sistem dapat membaca kolom Judul, ISBN, Kategori, dan Stok dengan sempurna tanpa error.</p>
                                <button className="bg-white border border-blue-200 text-blue-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-2 shadow-sm">
                                    <i className="ri-download-2-line" /> Unduh Template .XLSX
                                </button>
                            </div>
                        </div>

                        {/* Area Drag & Drop / Upload */}
                        <div 
                          className={`border-2 border-dashed rounded-2xl p-8 text-center transition-all ${importFile ? 'border-green-400 bg-green-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100'}`}
                        >
                            <input 
                              type="file" 
                              accept=".xlsx, .xls, .csv" 
                              className="hidden" 
                              ref={fileInputRef}
                              onChange={handleFileChange}
                            />
                            
                            {!importFile ? (
                                <>
                                    <div className="w-16 h-16 bg-white rounded-full shadow-sm border border-gray-200 flex items-center justify-center mx-auto mb-4">
                                        <i className="ri-upload-cloud-2-line text-3xl text-gray-400" />
                                    </div>
                                    <p className="text-sm font-bold text-gray-700 mb-1">Tarik & Letakkan file di sini</p>
                                    <p className="text-xs text-gray-500 mb-4">Mendukung format .XLSX, .XLS, atau .CSV</p>
                                    <button onClick={() => fileInputRef.current.click()} className="bg-white border border-gray-300 text-gray-700 px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-50 transition-colors shadow-sm">
                                        Pilih File Manual
                                    </button>
                                </>
                            ) : (
                                <>
                                    <div className="w-16 h-16 bg-green-100 rounded-full border border-green-200 flex items-center justify-center mx-auto mb-4">
                                        <i className="ri-file-excel-2-fill text-3xl text-green-600" />
                                    </div>
                                    <p className="text-sm font-bold text-gray-800 mb-1">{importFile.name}</p>
                                    <p className="text-xs text-gray-500 mb-4">{(importFile.size / 1024).toFixed(2)} KB • Siap diproses</p>
                                    <button onClick={() => setImportFile(null)} className="text-xs text-red-500 font-bold hover:text-red-700 transition-colors">
                                        Batal & Ganti File
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/80">
                        <button onClick={() => { setShowImportModal(false); setImportFile(null); }} className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-100 transition-colors text-sm bg-white shadow-sm" disabled={isImporting}>Batal</button>
                        <button onClick={processImport} disabled={!importFile || isImporting} className={`px-8 py-2.5 rounded-xl text-white font-bold transition-all duration-200 text-sm shadow-sm flex items-center gap-2 ${!importFile ? 'bg-gray-400 cursor-not-allowed' : 'bg-emerald-500 hover:bg-emerald-600 hover:shadow-md active:scale-95 border border-emerald-600'}`}>
                            {isImporting ? (
                                <> <i className="ri-loader-4-line animate-spin" /> Memproses... </>
                            ) : (
                                <> <i className="ri-upload-2-fill" /> Mulai Import </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* MODAL 1: FORM TAMBAH / EDIT BUKU */}
        {showFormModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-all duration-300">
                <div className="bg-white rounded-3xl w-full max-w-2xl shadow-2xl animate-fade-in flex flex-col max-h-[90vh] overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-emerald-50/30">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-white border border-emerald-100 rounded-xl flex items-center justify-center shadow-sm">
                              <i className={`text-emerald-500 text-xl ${editingBook ? 'ri-edit-2-line' : 'ri-book-read-line'}`} />
                           </div>
                           <h2 className="text-xl font-bold text-gray-800">{editingBook ? 'Edit Data Buku' : 'Tambah Buku Baru'}</h2>
                        </div>
                        <button onClick={() => setShowFormModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"><i className="ri-close-line text-xl" /></button>
                    </div>
                    <div className="p-6 overflow-y-auto space-y-5 bg-white">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            
                            <div className="md:col-span-2">
                                <label className="block text-sm font-bold text-gray-700 mb-2">Jenis Inventaris Buku</label>
                                <div className="flex gap-4">
                                    {bookTypes.map(type => (
                                        <label key={type} className={`flex-1 flex items-center justify-center gap-2 p-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${form.type === type ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm' : 'border-gray-100 text-gray-500 hover:bg-gray-50 hover:border-emerald-200'}`}>
                                            <input type="radio" name="bookType" value={type} checked={form.type === type} 
                                              onChange={e => setForm({...form, type: e.target.value, category: ''})} 
                                              className="hidden" 
                                            />
                                            <i className={type === 'Buku Paket' ? 'ri-book-stack-fill text-xl' : 'ri-book-open-fill text-xl'} />
                                            <span className="font-bold text-sm">{type}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <div className="md:col-span-2">
                               <label className="block text-sm font-semibold text-gray-700 mb-1.5">Judul Buku Lengkap <span className="text-red-500">*</span></label>
                               <input value={form.title || ''} onChange={e => setForm({...form, title: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 hover:border-emerald-300 transition-colors text-sm" placeholder="Masukkan judul buku lengkap" />
                            </div>
                            <div>
                               <label className="block text-sm font-semibold text-gray-700 mb-1.5">ISBN / ISSN Barcode <span className="text-red-500">*</span></label>
                               <input value={form.isbn || ''} onChange={e => setForm({...form, isbn: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-emerald-700 font-bold rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 hover:border-emerald-300 transition-colors text-sm font-mono tracking-wide" placeholder="978-xxx..." />
                            </div>
                            <div>
                               <label className="block text-sm font-semibold text-gray-700 mb-1.5">Penulis</label>
                               <input value={form.author || ''} onChange={e => setForm({...form, author: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 hover:border-emerald-300 transition-colors text-sm" placeholder="Nama Penulis / Kementerian" />
                            </div>

                            <div>
                               <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                                 Kategori {form.type === 'Buku Paket' ? 'Mata Pelajaran' : 'Sastra & Referensi'}
                               </label>
                               <select value={form.category || ''} onChange={e => setForm({...form, category: e.target.value})} className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 hover:border-emerald-300 transition-colors text-sm cursor-pointer">
                                    <option value="">Pilih Kategori Kustom...</option>
                                    {activeCategoriesInForm.map(c => <option key={c} value={c}>{c}</option>)}
                               </select>
                            </div>

                            <div>
                               <label className="block text-sm font-semibold text-gray-700 mb-1.5">Penerbit & Tahun</label>
                               <div className="flex gap-2">
                                   <input value={form.publisher || ''} onChange={e => setForm({...form, publisher: e.target.value})} className="w-2/3 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 hover:border-emerald-300 transition-colors text-sm" placeholder="Penerbit" />
                                   <input type="number" value={form.year || ''} onChange={e => setForm({...form, year: e.target.value})} className="w-1/3 bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 hover:border-emerald-300 transition-colors text-sm" placeholder="Tahun" />
                               </div>
                            </div>

                            <div className="md:col-span-2 p-5 bg-emerald-50/50 rounded-2xl border border-emerald-100 grid grid-cols-1 md:grid-cols-2 gap-5">
                                <div>
                                   <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Lokasi Tempat Rak</label>
                                   <select value={form.rack || ''} onChange={e => setForm({...form, rack: e.target.value})} className="w-full bg-white border border-gray-200 text-gray-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 hover:border-emerald-300 transition-colors text-sm cursor-pointer shadow-sm">
                                        <option value="">Pilih Posisi Rak...</option>
                                        {bookRacks.map(r => <option key={r} value={r}>{r}</option>)}
                                   </select>
                                </div>
                                <div>
                                   <label className="block text-xs font-bold text-gray-600 mb-2 uppercase tracking-wide">Jumlah Unit Ekslempar</label>
                                   <input type="number" value={form.stock || ''} onChange={e => setForm({...form, stock: e.target.value})} className="w-full bg-white border border-gray-200 text-gray-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 hover:border-emerald-300 transition-colors text-sm shadow-sm font-bold" placeholder="Cth: 40" />
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/80">
                        <button onClick={() => setShowFormModal(false)} className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-100 transition-colors text-sm bg-white shadow-sm">Batal</button>
                        <button onClick={saveBook} className="px-8 py-2.5 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 hover:shadow-md active:scale-95 transition-all duration-200 text-sm shadow-sm border border-emerald-600">Simpan Data Buku</button>
                    </div>
                </div>
            </div>
        )}

        {/* MODAL 2: SCANNER CAMERA DIRECT */}
        {showScanner && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/80 backdrop-blur-sm">
                <div className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl animate-fade-in relative border border-emerald-100">
                    <button onClick={() => setShowScanner(false)} className="absolute top-4 right-4 w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors z-10">
                        <i className="ri-close-line text-lg" />
                    </button>
                    <h3 className="font-bold text-xl text-gray-800 mb-4 text-center">Pindai Barcode Kamera</h3>
                    <div className="rounded-xl overflow-hidden border-4 border-emerald-100 mb-4 bg-black relative">
                        <div id="reader" className="w-full" />
                    </div>
                    <p className="text-xs text-gray-500 text-center leading-relaxed">
                        Arahkan jendela kamera tepat ke deretan kode <span className="font-bold text-emerald-600">ISBN</span> buku paket untuk pengisian baris kode otomatis.
                    </p>
                </div>
            </div>
        )}

        {/* MODAL 3: PREVIEW PRINT LABEL */}
        {showLabelModal && editingBook && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
                <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl animate-fade-in">
                    <div className="flex justify-between items-center mb-6">
                        <h3 className="font-bold text-gray-800">Preview Label Identitas</h3>
                        <button onClick={() => setShowLabelModal(false)} className="text-gray-400 hover:text-gray-600"><i className="ri-close-line text-xl" /></button>
                    </div>
                    
                    <div className="border border-gray-300 p-1 bg-white mx-auto w-[240px] rounded drop-shadow-sm">
                        <div className="border border-gray-800 p-3 text-center">
                            <h4 className="font-bold text-[10px] uppercase tracking-wider mb-1">Perpus MAN 2 Pamekasan</h4>
                            <div className="w-full h-px bg-gray-800 mb-3" />
                            <i className="ri-barcode-line text-5xl text-gray-800 block mb-1" />
                            <p className="font-mono text-xs font-bold tracking-widest mb-3">{editingBook.isbn || '000-000-000'}</p>
                            <p className="text-xs font-bold leading-tight line-clamp-2 uppercase">{editingBook.title}</p>
                            <div className="mt-3 flex justify-between items-end border-t border-gray-300 pt-2 text-[10px] font-bold">
                                <span>{editingBook.rack || 'RAK-00'}</span>
                                <span className="bg-gray-800 text-white px-1.5 py-0.5 rounded-sm">{editingBook.type === 'Buku Paket' ? 'PKT' : 'RGL'}</span>
                            </div>
                        </div>
                    </div>
                    
                    <button onClick={() => { window.print(); setShowLabelModal(false); }} className="w-full mt-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors">
                        <i className="ri-printer-fill" /> Cetak Label Stiker
                    </button>
                </div>
            </div>
        )}

        {/* MODAL 4: KONFIRMASI DELETION */}
        {showDelete && editingBook && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
                <div className="bg-white rounded-3xl w-full max-w-sm p-8 text-center animate-fade-in shadow-2xl">
                    <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5 border-[6px] border-white shadow-[0_0_0_2px_rgba(254,226,226,1)]">
                        <i className="ri-delete-bin-line text-4xl text-red-500" />
                    </div>
                    <h3 className="font-bold text-xl mb-2 text-gray-800">Hapus Inventaris?</h3>
                    <p className="text-sm text-gray-500 mb-8 leading-relaxed">Yakin ingin menghapus permanen <span className="font-bold text-gray-800">"{editingBook.title}"</span> dari database?</p>
                    <div className="flex gap-3">
                        <button onClick={() => setShowDelete(false)} className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-bold hover:bg-gray-50 transition-colors text-sm">Batal</button>
                        <button onClick={confirmDelete} className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white text-sm font-bold hover:bg-red-600 hover:shadow-md transition-all border border-red-600">Ya, Hapus</button>
                    </div>
                </div>
            </div>
        )}

        {/* Toast Notification Box */}
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