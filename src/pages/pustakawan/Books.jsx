import * as XLSX from 'xlsx';
import { useEffect, useMemo, useRef, useState } from 'react';
import PustakawanLayout from '../../components/feature/DashboardLayout';
import { bookRacks } from '../../mocks/books';
import { api } from '../../services/api';

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
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  
  const [showFormModal, setShowFormModal] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [showLabelModal, setShowLabelModal] = useState(false);
  
  // State Khusus Import Excel
  const [showImportModal, setShowImportModal] = useState(false);
  const [importFile, setImportFile] = useState(null);
  const [isImporting, setIsImporting] = useState(false);
  const [importProgress, setImportProgress] = useState('');
  const fileInputRef = useRef(null);

  const [editingBook, setEditingBook] = useState(null);
  const [form, setForm] = useState({});
  const [toast, setToast] = useState('');

  const [labelsData, setLabelsData] = useState(null);
  const [loadingLabels, setLoadingLabels] = useState(false);
  const [labelQuantity, setLabelQuantity] = useState(10);

  const handleOpenLabelModal = async (book) => {
    setEditingBook(book);
    setShowLabelModal(true);
    setLoadingLabels(true);
    setLabelsData(null);
    const initialQty = Math.min(10, book.stock || 10);
    setLabelQuantity(initialQty);
    try {
      const res = await api.getBookLabels(book.id, book.stock || 100);
      if (res) {
        setLabelsData(res.data || res);
      }
    } catch (err) {
      console.error('Gagal mengambil label buku:', err);
    } finally {
      setLoadingLabels(false);
    }
  };

  const fetchBooks = async () => {
    setIsLoading(true);
    try {
      let apiCategory = '';
      if (typeFilter === 'Buku Paket') apiCategory = 'paket';
      if (typeFilter === 'Buku Reguler') apiCategory = 'reguler';

      const data = await api.getBooks(search, apiCategory);
      const mapped = data.map(b => {
        const stockVal = b.stok_sekarang !== undefined ? b.stok_sekarang : (b.stock !== undefined ? b.stock : 0);
        const totalStockVal = b.stok_awal !== undefined ? b.stok_awal : (b.stock !== undefined ? b.stock : 0);
        const isPaket = b.category === 'paket' || 
                        (b.subject && b.subject.toLowerCase().includes('pelajaran')) || 
                        (b.title && b.title.toLowerCase().includes('kelas'));
        
        return {
          id: b.id,
          title: b.title,
          isbn: b.isbn || '',
          author: b.author,
          publisher: b.publisher || '',
          year: b.publication_year || b.year || '',
          classification_number: b.classification_number || '',
          rack: b.rack_location || b.rack || '',
          stock: stockVal,
          totalStock: totalStockVal,
          type: isPaket ? 'Buku Paket' : 'Buku Reguler',
          category: b.subject || '',
          condition: stockVal > 0 ? 'Available' : 'Borrowed'
        };
      });
      setBooks(mapped);
    } catch (err) {
      setToast(err.message || 'Gagal memuat data buku');
      setTimeout(() => setToast(''), 3000);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [search, typeFilter]);

  // Scanner removed as requested

  const filteredBooks = useMemo(() => {
    return books.filter(b => {
      const matchCategory = !categoryFilter || b.category === categoryFilter;
      return matchCategory;
    });
  }, [books, categoryFilter]);

  const saveBook = async () => {
    if (!form.title || !form.isbn) {
      setToast('Judul dan ISBN wajib diisi!');
      setTimeout(() => setToast(''), 3000);
      return;
    }

    const payload = {
      classification_number: form.classification_number || '000',
      author: form.author || 'Pustakawan',
      title: form.title,
      edition: form.edition || 'Cetakan 1',
      publication_place: form.publication_place || 'Pamekasan',
      publisher: form.publisher || 'MAN 2 Pamekasan',
      publication_year: parseInt(form.year) || new Date().getFullYear(),
      total_pages: parseInt(form.total_pages) || 100,
      subject: form.category || 'Umum',
      stock: parseInt(form.stock) || 0,
      category: form.type === 'Buku Paket' ? 'paket' : 'reguler',
      rack_location: form.rack || 'Rak Umum',
      isbn: form.isbn,
    };

    try {
      if (editingBook) {
        await api.updateBook(editingBook.id, payload);
        setToast('Buku berhasil diperbarui');
      } else {
        await api.createBook(payload);
        setToast('Buku baru berhasil ditambahkan');
      }

      // Save suggestions to local state and localStorage
      if (form.category) {
        if (form.type === 'Buku Paket') {
          if (!paketCategories.includes(form.category) && !customCategoriesPaket.includes(form.category)) {
            const updated = [...customCategoriesPaket, form.category];
            setCustomCategoriesPaket(updated);
            localStorage.setItem('custom_categories_paket', JSON.stringify(updated));
          }
        } else {
          if (!regulerCategories.includes(form.category) && !customCategoriesReguler.includes(form.category)) {
            const updated = [...customCategoriesReguler, form.category];
            setCustomCategoriesReguler(updated);
            localStorage.setItem('custom_categories_reguler', JSON.stringify(updated));
          }
        }
      }

      if (form.rack) {
        if (!bookRacks.includes(form.rack) && !customRacks.includes(form.rack)) {
          const updated = [...customRacks, form.rack];
          setCustomRacks(updated);
          localStorage.setItem('custom_racks', JSON.stringify(updated));
        }
      }

      fetchBooks();
      setShowFormModal(false);
    } catch (err) {
      setToast(err.message || 'Gagal menyimpan data buku');
    } finally {
      setTimeout(() => setToast(''), 3000);
    }
  };

  const confirmDelete = async () => {
    try {
      await api.deleteBook(editingBook.id);
      setToast('Buku berhasil dihapus');
      fetchBooks();
      setShowDelete(false);
    } catch (err) {
      setToast(err.message || 'Gagal menghapus buku');
    } finally {
      setTimeout(() => setToast(''), 3000);
    }
  };

  // Logika Import Excel
  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImportFile(e.target.files[0]);
    }
  };

  const handleDownloadTemplate = () => {
    const headers = [
      'Judul Buku',
      'ISBN',
      'Penulis',
      'Penerbit',
      'Tahun Terbit',
      'Jumlah Halaman',
      'Stok',
      'Nomor Klasifikasi',
      'Lokasi Rak',
      'Jenis Buku',
      'Subjek/Kategori'
    ];
    
    const data = [
      {
        'Judul Buku': 'Bedebah di Ujung Tanduk',
        'ISBN': '9786020656860',
        'Penulis': 'Tere Liye',
        'Penerbit': 'Gramedia Pustaka Utama',
        'Tahun Terbit': 2021,
        'Jumlah Halaman': 382,
        'Stok': 15,
        'Nomor Klasifikasi': '813',
        'Lokasi Rak': 'Rak A1',
        'Jenis Buku': 'Reguler',
        'Subjek/Kategori': 'Fiksi / Novel'
      },
      {
        'Judul Buku': 'Bahasa Indonesia Kelas X',
        'ISBN': '9786022443122',
        'Penulis': 'Kementerian Pendidikan dan Kebudayaan',
        'Penerbit': 'Kemendikbud',
        'Tahun Terbit': 2021,
        'Jumlah Halaman': 250,
        'Stok': 40,
        'Nomor Klasifikasi': '370',
        'Lokasi Rak': 'Rak Paket X',
        'Jenis Buku': 'Paket',
        'Subjek/Kategori': 'Bahasa Indonesia'
      }
    ];
    
    const worksheet = XLSX.utils.json_to_sheet(data, { header: headers });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template Pendataan Buku');
    
    XLSX.writeFile(workbook, 'template_pendataan_buku.xlsx');
    setToast('Template Excel berhasil diunduh!');
    setTimeout(() => setToast(''), 3000);
  };

  const processImport = () => {
    if (!importFile) return;
    setIsImporting(true);
    setImportProgress('Membaca file Excel...');
    
    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);
        
        if (json.length === 0) {
          throw new Error('File Excel kosong atau tidak memiliki data.');
        }
        
        let successCount = 0;
        let failCount = 0;
        
        for (let i = 0; i < json.length; i++) {
          const row = json[i];
          setImportProgress(`Mengimpor ${i + 1} dari ${json.length} buku...`);
          
          const title = row['Judul Buku'];
          const isbn = row['ISBN'] ? String(row['ISBN']) : '';
          
          if (!title || !isbn) {
            failCount++;
            continue;
          }
          
          const rawType = row['Jenis Buku'] || 'Reguler';
          const categoryVal = rawType.toLowerCase().includes('paket') ? 'paket' : 'reguler';
          
          const payload = {
            classification_number: String(row['Nomor Klasifikasi'] || '000'),
            author: row['Penulis'] || 'Pustakawan',
            title: title,
            edition: row['Edisi'] || 'Cetakan 1',
            publication_place: row['Tempat Terbit'] || 'Pamekasan',
            publisher: row['Penerbit'] || 'MAN 2 Pamekasan',
            publication_year: parseInt(row['Tahun Terbit']) || new Date().getFullYear(),
            total_pages: parseInt(row['Jumlah Halaman']) || 100,
            subject: row['Subjek/Kategori'] || 'Umum',
            stock: parseInt(row['Stok']) || 0,
            category: categoryVal,
            rack_location: row['Lokasi Rak'] || 'Rak Umum',
            isbn: isbn,
          };
          
          try {
            await api.createBook(payload);
            successCount++;
          } catch (err) {
            console.error(`Gagal mengimpor baris ${i + 1}:`, err);
            failCount++;
          }
        }
        
        setToast(`Import selesai! Berhasil: ${successCount}, Gagal: ${failCount}`);
        fetchBooks();
        setShowImportModal(false);
        setImportFile(null);
      } catch (err) {
        setToast(`Gagal mengimpor: ${err.message}`);
      } finally {
        setIsImporting(false);
        setImportProgress('');
        setTimeout(() => setToast(''), 4000);
      }
    };
    
    reader.onerror = () => {
      setToast('Gagal membaca file Excel.');
      setIsImporting(false);
      setImportProgress('');
      setTimeout(() => setToast(''), 3000);
    };
    
    reader.readAsArrayBuffer(importFile);
  };

  const [customCategoriesReguler, setCustomCategoriesReguler] = useState(() => {
    try {
      const saved = localStorage.getItem('custom_categories_reguler');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [customCategoriesPaket, setCustomCategoriesPaket] = useState(() => {
    try {
      const saved = localStorage.getItem('custom_categories_paket');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [customRacks, setCustomRacks] = useState(() => {
    try {
      const saved = localStorage.getItem('custom_racks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const combinedRegulerCategories = useMemo(() => {
    const fromBooks = books
      .filter(b => b.type === 'Buku Reguler')
      .map(b => b.category)
      .filter(Boolean);
    return Array.from(new Set([...regulerCategories, ...fromBooks, ...customCategoriesReguler]));
  }, [books, customCategoriesReguler]);

  const combinedPaketCategories = useMemo(() => {
    const fromBooks = books
      .filter(b => b.type === 'Buku Paket')
      .map(b => b.category)
      .filter(Boolean);
    return Array.from(new Set([...paketCategories, ...fromBooks, ...customCategoriesPaket]));
  }, [books, customCategoriesPaket]);

  const combinedRacks = useMemo(() => {
    const fromBooks = books.map(b => b.rack).filter(Boolean);
    return Array.from(new Set([...bookRacks, ...fromBooks, ...customRacks]));
  }, [books, customRacks]);

  const activeCategoriesInForm = form.type === 'Buku Paket' ? combinedPaketCategories : combinedRegulerCategories;

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
                                        <button onClick={() => handleOpenLabelModal(book)} className="w-9 h-9 rounded-xl text-gray-400 hover:text-purple-600 hover:bg-purple-50 hover:shadow-sm flex items-center justify-center transition-all duration-200" title="Cetak Label">
                                            <i className="ri-printer-line text-lg" />
                                        </button>
                                        <button onClick={() => { setEditingBook(book); setForm({ ...book, stock: book.totalStock }); setShowFormModal(true); }} className="w-9 h-9 rounded-xl text-gray-400 hover:text-emerald-600 hover:bg-emerald-50 hover:shadow-sm flex items-center justify-center transition-all duration-200" title="Edit Data">
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
                                <button onClick={handleDownloadTemplate} className="bg-white border border-blue-200 text-blue-600 px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-100 transition-colors flex items-center gap-2 shadow-sm">
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
                                <> <i className="ri-loader-4-line animate-spin" /> {importProgress || 'Memproses...'} </>
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
                               <input
                                 list="category-suggestions"
                                 value={form.category || ''}
                                 onChange={e => setForm({...form, category: e.target.value})}
                                 className="w-full bg-gray-50 border border-gray-200 text-gray-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 hover:border-emerald-300 transition-colors text-sm"
                                 placeholder="Ketik atau pilih kategori..."
                               />
                               <datalist id="category-suggestions">
                                 {activeCategoriesInForm.map(c => <option key={c} value={c} />)}
                               </datalist>
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
                                   <input
                                     list="rack-suggestions"
                                     value={form.rack || ''}
                                     onChange={e => setForm({...form, rack: e.target.value})}
                                     className="w-full bg-white border border-gray-200 text-gray-800 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-4 focus:ring-emerald-100 focus:border-emerald-500 hover:border-emerald-300 transition-colors text-sm shadow-sm"
                                     placeholder="Ketik atau pilih lokasi..."
                                   />
                                   <datalist id="rack-suggestions">
                                     {combinedRacks.map(r => <option key={r} value={r} />)}
                                   </datalist>
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



        {/* MODAL 3: PREVIEW PRINT LABEL */}
        {showLabelModal && editingBook && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm print-modal-overlay">
                {/* CSS @media print inject to only print the official labels */}
                <style dangerouslySetInnerHTML={{ __html: `
                  @media print {
                    /* Hide sidebar, topbar, modal headers, controls and buttons */
                    aside, header, button, .no-print, .print-exclude, .print-modal-overlay::before {
                      display: none !important;
                    }
                    
                    /* Reset body and layout container styling for printing */
                    body, html, main, #root, div {
                      background: transparent !important;
                      box-shadow: none !important;
                      border: none !important;
                      padding: 0 !important;
                      margin: 0 !important;
                    }
                  
                    /* Make overlay static and clean layout for print */
                    .print-modal-overlay {
                      position: static !important;
                      display: block !important;
                      background: transparent !important;
                      backdrop-filter: none !important;
                      padding: 0 !important;
                      margin: 0 !important;
                      width: 100% !important;
                    }
                  
                    /* Remove modal borders and styling */
                    .print-modal-overlay > div {
                      background: transparent !important;
                      border: none !important;
                      box-shadow: none !important;
                      padding: 0 !important;
                      margin: 0 !important;
                      width: 100% !important;
                      max-width: 100% !important;
                    }
                  
                    /* Lay out stickers in a 3-column print grid */
                    .print-label-container {
                      max-height: none !important;
                      overflow: visible !important;
                      background: transparent !important;
                      border: none !important;
                      padding: 0 !important;
                      margin: 0 !important;
                      display: grid !important;
                      grid-template-columns: repeat(3, 1fr) !important;
                      gap: 15px !important;
                    }
                  
                    /* Format print label items as clean stickers with border cut guide */
                    .print-label-item {
                      page-break-inside: avoid !important;
                      break-inside: avoid !important;
                      border: 1px dashed #444 !important;
                      background: white !important;
                      box-shadow: none !important;
                      margin: 0 auto !important;
                      width: 100% !important;
                      box-sizing: border-box !important;
                      padding: 10px !important;
                    }
                  }
                `}} />

                <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl animate-fade-in">
                    <div className="flex justify-between items-center mb-6 print-exclude">
                        <div>
                            <h3 className="font-bold text-gray-800 text-lg">Preview Label Identitas</h3>
                            <p className="text-xs text-gray-500 mt-0.5">Dihasilkan otomatis oleh sistem backend</p>
                        </div>
                        <button onClick={() => setShowLabelModal(false)} className="text-gray-400 hover:text-gray-600"><i className="ri-close-line text-xl" /></button>
                    </div>
                    
                    <div className="mb-4 print-exclude">
                      <label className="block text-xs font-bold text-gray-700 mb-1.5">Jumlah Stiker yang Dicetak</label>
                      <input 
                        type="number" 
                        min="1" 
                        max={editingBook.stock || 100}
                        value={labelQuantity} 
                        onChange={(e) => setLabelQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                        className="input-field w-full text-sm py-1.5"
                      />
                    </div>
                    
                    {loadingLabels ? (
                      <div className="h-[250px] flex flex-col items-center justify-center gap-2 text-gray-400 print-exclude">
                        <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                        <p className="text-xs">Menghasilkan stiker label...</p>
                      </div>
                    ) : (
                      <div className="max-h-[350px] overflow-y-auto space-y-4 pr-2 bg-gray-50 p-4 rounded-xl border border-gray-100 print-label-container">
                        {labelsData?.labels ? (
                          labelsData.labels.slice(0, labelQuantity).map((lbl, idx) => (
                            <div key={idx} className="border border-gray-300 p-1 bg-white mx-auto w-[240px] rounded drop-shadow-sm print-label-item">
                                <div className="border border-gray-800 p-3 text-center">
                                    <h4 className="font-bold text-[9px] uppercase tracking-wider mb-1">{lbl.institution_name}</h4>
                                    <div className="w-full h-px bg-gray-800 mb-2" />
                                    <p className="font-bold text-xs leading-tight font-serif mb-1">{lbl.call_number}</p>
                                    <p className="text-[10px] font-bold leading-tight line-clamp-1 uppercase mb-2">{lbl.title}</p>
                                    <i className="ri-barcode-line text-3xl text-gray-800 block mb-0.5" />
                                    <p className="font-mono text-[9px] font-bold tracking-widest">{lbl.isbn || '000-000-000'}</p>
                                    <div className="mt-2 flex justify-between items-end border-t border-gray-300 pt-1.5 text-[9px] font-bold">
                                        <span>{lbl.rack_location || 'RAK-00'}</span>
                                        <span className="bg-gray-800 text-white px-1.5 py-0.5 rounded-sm uppercase">{lbl.category === 'paket' ? 'PKT' : 'RGL'}</span>
                                    </div>
                                </div>
                            </div>
                          ))
                        ) : (
                          Array.from({ length: labelQuantity }).map((_, idx) => (
                            <div key={idx} className="border border-gray-300 p-1 bg-white mx-auto w-[240px] rounded drop-shadow-sm print-label-item">
                                <div className="border border-gray-800 p-3 text-center">
                                    <h4 className="font-bold text-[10px] uppercase tracking-wider mb-1">Perpus MAN 2 Pamekasan</h4>
                                    <div className="w-full h-px bg-gray-800 mb-3" />
                                    <p className="font-bold text-xs leading-tight font-serif mb-1">
                                      {editingBook.classification_number || '000'} {editingBook.author ? editingBook.author.substring(0, 3).toUpperCase() : 'XXX'} {editingBook.title ? editingBook.title.substring(0, 1).toLowerCase() : 'x'} C.{idx + 1}
                                    </p>
                                    <p className="text-xs font-bold leading-tight line-clamp-2 uppercase">{editingBook.title}</p>
                                    <i className="ri-barcode-line text-5xl text-gray-800 block mb-1" />
                                    <p className="font-mono text-xs font-bold tracking-widest mb-3">{editingBook.isbn || '000-000-000'}</p>
                                    <div className="mt-3 flex justify-between items-end border-t border-gray-300 pt-2 text-[10px] font-bold">
                                        <span>{editingBook.rack || 'RAK-00'}</span>
                                        <span className="bg-gray-800 text-white px-1.5 py-0.5 rounded-sm">{editingBook.type === 'Buku Paket' ? 'PKT' : 'RGL'}</span>
                                    </div>
                                </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                    
                    <button onClick={() => { window.print(); setShowLabelModal(false); }} className="w-full mt-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-colors print-exclude">
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