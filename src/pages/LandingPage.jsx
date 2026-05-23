import { useNavigate } from 'react-router-dom';

const libraryIllustration = 'https://readdy.ai/api/search-image?query=Modern%20digital%20library%20illustration%20with%20floating%20books%2C%20students%20reading%2C%20warm%20ambient%20lighting%2C%20clean%20minimalist%20isometric%20design%2C%20emerald%20green%20and%20white%20color%20scheme%2C%20educational%20technology%20concept%20art%20with%20transparent%20soft%20background%2C%20premium%20modern%20illustration%20style&width=600&height=500&seq=100&orientation=squarish';

export default function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white flex flex-col">
      {/* Top bar */}
      <div className="w-full px-6 lg:px-12 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
            <img
              src="https://static.readdy.ai/image/42aaa639a2198982502a0b7fb96efe1c/f8f4bf38c807254ceb90b9aaef5d3955.png"
              alt="MAN 2 Pamekasan"
              className="w-8 h-8 object-contain"
            />
          </div>
          <div>
            <h1 className="font-bold text-dark-800 text-sm">MAN 2 Pamekasan</h1>
            <p className="text-xs text-dark-400">E-Library System</p>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col lg:flex-row items-center justify-center gap-12 lg:gap-20 px-6 lg:px-16 py-8 lg:py-0">
        {/* Left: Illustration + branding */}
        <div className="flex-1 max-w-xl flex flex-col items-center lg:items-start text-center lg:text-left">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-primary-100/50 rounded-3xl blur-3xl" />
            <img
              src={libraryIllustration}
              alt="Digital Library"
              className="relative w-[320px] lg:w-[420px] h-auto rounded-2xl"
            />
          </div>

          <h2 className="text-3xl lg:text-4xl font-bold text-dark-800 leading-tight mb-4">
            Perpustakaan Digital<br />
            <span className="text-primary-500">MAN 2 Pamekasan</span>
          </h2>
          <p className="text-dark-500 text-base lg:text-lg leading-relaxed max-w-md">
            Akses koleksi buku, pinjam buku favorit, dan kelola aktivitas perpustakaan Anda secara digital.
          </p>

          <div className="flex gap-6 mt-8">
            <div className="text-center">
              <p className="text-2xl font-bold text-dark-800">12,000+</p>
              <p className="text-xs text-dark-400">Koleksi Buku</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-dark-800">3,400+</p>
              <p className="text-xs text-dark-400">Siswa Aktif</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-dark-800">24/7</p>
              <p className="text-xs text-dark-400">Akses Digital</p>
            </div>
          </div>
        </div>

        {/* Right: Role selector cards */}
        <div className="w-full max-w-md space-y-4">
          <h3 className="text-xl font-bold text-dark-800 text-center lg:text-left mb-2">
            Pilih Peran Anda
          </h3>
          <p className="text-sm text-dark-400 text-center lg:text-left mb-6">
            Masuk sebagai siswa atau pustakawan untuk mengakses sistem.
          </p>

          {/* Siswa card */}
          <button
            onClick={() => navigate('/siswa/access')}
            className="w-full group relative overflow-hidden rounded-2xl border-2 border-dark-100 bg-white p-6 text-left transition-all duration-300 hover:border-primary-300 hover:shadow-hover hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-primary-50 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-100 transition-colors">
                <i className="ri-graduation-cap-line text-3xl text-primary-500" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-dark-800 group-hover:text-primary-600 transition-colors">
                  Siswa
                </h4>
                <p className="text-sm text-dark-400 mt-1">
                  Akses perpustakaan, pinjam buku, lihat riwayat peminjaman, dan ajukan surat bebas tanggungan.
                </p>
              </div>
              <i className="ri-arrow-right-line text-xl text-dark-300 group-hover:text-primary-500 transition-colors" />
            </div>
          </button>

          {/* Pustakawan card */}
          <button
            onClick={() => navigate('/pustakawan/login')}
            className="w-full group relative overflow-hidden rounded-2xl border-2 border-dark-100 bg-white p-6 text-left transition-all duration-300 hover:border-accent-blue/30 hover:shadow-hover hover:-translate-y-1"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="relative flex items-center gap-5">
              <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center flex-shrink-0 group-hover:bg-blue-100 transition-colors">
                <i className="ri-book-open-line text-3xl text-accent-blue" />
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-dark-800 group-hover:text-accent-blue transition-colors">
                  Pustakawan
                </h4>
                <p className="text-sm text-dark-400 mt-1">
                  Kelola inventori buku, proses peminjaman, pantau pengembalian, dan kelola laporan perpustakaan.
                </p>
              </div>
              <i className="ri-arrow-right-line text-xl text-dark-300 group-hover:text-accent-blue transition-colors" />
            </div>
          </button>
        </div>
      </div>

      {/* Footer */}
      <div className="w-full px-6 lg:px-12 py-4 border-t border-dark-100">
        <p className="text-xs text-dark-400 text-center">
          &copy; 2026 MAN 2 Pamekasan. Sistem Perpustakaan Digital.
        </p>
      </div>
    </div>
  );
}