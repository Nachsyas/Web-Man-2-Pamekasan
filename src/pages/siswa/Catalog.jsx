import { useState } from 'react';
import SiswaLayout from '../../components/feature/SiswaLayout';
import { availableBooksForStudents, studentCategories } from '../../mocks/student';

export default function SiswaCatalog() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('Semua');
  const [bookType, setBookType] = useState('Reguler'); // 'Reguler' | 'Paket'

  const filteredBooks = availableBooksForStudents.filter((book) => {
    const matchesSearch =
      book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'Semua' || book.category === activeCategory;
    const matchesType = bookType === 'Paket' ? book.category === 'Pendidikan' : book.category !== 'Pendidikan';
    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <SiswaLayout>
      <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-6 lg:py-10 space-y-6">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Katalog Perpustakaan</h1>
            <p className="text-gray-500 mt-1">Telusuri dan pinjam buku dari koleksi perpustakaan</p>
          </div>
        </div>

        {/* Tabs Jenis Buku */}
        <div className="flex gap-4 border-b border-gray-200">
          <button 
            onClick={() => { setBookType('Reguler'); setActiveCategory('Semua'); }}
            className={`pb-3 text-sm font-bold border-b-2 transition-all ${bookType === 'Reguler' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-emerald-500'}`}
          >
            Buku Reguler
          </button>
          <button 
            onClick={() => { setBookType('Paket'); setActiveCategory('Semua'); }}
            className={`pb-3 text-sm font-bold border-b-2 transition-all ${bookType === 'Paket' ? 'border-emerald-500 text-emerald-600' : 'border-transparent text-gray-500 hover:text-emerald-500'}`}
          >
            Buku Paket
          </button>
        </div>

        {/* Search and filter */}
        <div className="flex flex-col lg:flex-row gap-4">
          <div className="relative flex-1">
            <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari judul atau penulis buku..."
              className="w-full border border-gray-200 rounded-xl pl-12 py-3.5 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
            />
          </div>
          {bookType === 'Reguler' && (
            <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 lg:pb-0">
              {studentCategories.filter(c => c !== 'Pendidikan').slice(0, 6).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`
                    px-4 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all
                    ${activeCategory === cat
                      ? 'bg-emerald-500 text-white shadow-md'
                      : 'bg-white border border-gray-200 text-gray-600 hover:border-emerald-300'
                    }
                  `}
                >
                  {cat}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Book grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-5">
          {filteredBooks.map((book) => {
            const isAvailable = book.stock > 0;
            return (
              <div
                key={book.id}
                className="bg-white rounded-xl border border-gray-200 overflow-hidden group transition-all duration-300 hover:shadow-lg hover:-translate-y-1 flex flex-col h-full"
              >
                <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 flex-shrink-0">
                  <img
                    src="https://placehold.co/300x400/ecfdf5/059669?text=Buku+Perpustakaan"
                    alt={book.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-2 left-2">
                    <span className="bg-gray-900/70 text-white px-2 py-1 rounded text-[10px] backdrop-blur-sm">
                      {book.category}
                    </span>
                  </div>
                  <div className="absolute top-2 right-2">
                    <span className={`px-2 py-1 rounded text-[10px] text-white ${isAvailable ? 'bg-emerald-500' : 'bg-red-500'}`}>
                      {isAvailable ? `Stok: ${book.stock}` : 'Habis'}
                    </span>
                  </div>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <h3 className="font-semibold text-gray-800 text-sm line-clamp-2 leading-snug mb-1">
                    {book.title}
                  </h3>
                  <p className="text-xs text-gray-500 mb-2">{book.author}</p>
                  <p className="text-xs text-gray-400 line-clamp-2 mb-4">{book.description}</p>
                  
                  <div
                    className={`mt-auto w-full py-2.5 rounded-xl text-sm font-medium text-center transition-all ${
                      isAvailable
                        ? 'bg-emerald-50 text-emerald-600 border border-emerald-200'
                        : 'bg-red-50 text-red-600 border border-red-200'
                    }`}
                  >
                    {isAvailable ? 'Tersedia di Rak' : 'Sedang Dipinjam'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredBooks.length === 0 && (
          <div className="text-center py-16 card-base">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <i className="ri-search-line text-2xl text-gray-400" />
            </div>
            <h3 className="font-semibold text-gray-700 mb-1">Tidak ada buku ditemukan</h3>
            <p className="text-sm text-gray-400">Coba ubah kata kunci atau filter kategori</p>
          </div>
        )}

      </div>
    </SiswaLayout>
  );
}