import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const studentIllustration = 'https://readdy.ai/api/search-image?query=Young%20Indonesian%20student%20happily%20reading%20a%20book%20in%20a%20modern%20library%2C%20clean%20illustration%20style%2C%20emerald%20green%20and%20white%20color%20scheme%2C%20educational%20atmosphere%2C%20minimalist%20modern%20digital%20art%20with%20transparent%20soft%20background%2C%20friendly%20and%20welcoming%20mood&width=500&height=400&seq=110&orientation=squarish';

export default function SiswaAccess() {
  const navigate = useNavigate();
  const [nisn, setNisn] = useState('');
  const [nama, setNama] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!nisn.trim()) {
      setError('Masukkan NISN Anda');
      return;
    }
    if (!nama.trim()) {
      setError('Masukkan Nama Lengkap Anda');
      return;
    }
    if (nisn.trim().length < 8) {
      setError('NISN minimal 8 digit');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem('siswa_nisn', nisn.trim());
      localStorage.setItem('siswa_nama', nama.trim());
      navigate('/siswa');
    }, 1000);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left: illustration and branding */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-dark-50">
        <div className="absolute inset-0 gradient-mesh opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-500/10 via-transparent to-accent-blue/10" />
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center">
              <img
                src="https://static.readdy.ai/image/42aaa639a2198982502a0b7fb96efe1c/f8f4bf38c807254ceb90b9aaef5d3955.png"
                alt="MAN 2 Pamekasan"
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <h2 className="text-dark-800 font-bold text-sm">MAN 2 Pamekasan</h2>
              <p className="text-dark-400 text-xs">E-Library System</p>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center py-8">
            <div className="relative">
              <div className="absolute inset-0 bg-primary-200/30 rounded-3xl blur-3xl" />
              <img
                src={studentIllustration}
                alt="Student in Library"
                className="relative w-[380px] h-auto rounded-2xl"
              />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-dark-800 leading-tight">
              Portal Siswa
            </h1>
            <p className="text-dark-500 text-base leading-relaxed max-w-sm">
              Akses perpustakaan digital, kelola peminjaman buku, dan ajukan surat bebas tanggungan dengan mudah.
            </p>
          </div>
        </div>
      </div>

      {/* Right: form */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-12">
        <div className="lg:hidden flex items-center gap-3 mb-10 self-start">
          <div className="w-10 h-10 rounded-xl bg-primary-50 flex items-center justify-center">
            <img
              src="https://static.readdy.ai/image/42aaa639a2198982502a0b7fb96efe1c/f8f4bf38c807254ceb90b9aaef5d3955.png"
              alt="MAN 2 Pamekasan"
              className="w-8 h-8 object-contain"
            />
          </div>
          <div>
            <h2 className="text-dark-800 font-bold text-sm">MAN 2 Pamekasan</h2>
            <p className="text-dark-400 text-xs">E-Library System</p>
          </div>
        </div>

        <div className="w-full max-w-md space-y-6">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-600 px-3 py-1 rounded-full text-xs font-medium mb-4">
              <i className="ri-graduation-cap-line" />
              <span>Akses Siswa</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-dark-800 mb-2">Selamat Datang</h1>
            <p className="text-dark-500">
              Masukkan NISN dan Nama Lengkap Anda untuk mengakses layanan perpustakaan.
            </p>
          </div>

          {error && (
            <div className="flex items-center gap-2 p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
              <i className="ri-error-warning-line text-lg flex-shrink-0" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">
                NISN
              </label>
              <div className="relative">
                <i className="ri-id-card-line absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400 text-lg" />
                <input
                  type="text"
                  value={nisn}
                  onChange={(e) => setNisn(e.target.value)}
                  placeholder="Contoh: 0091234567"
                  className="input-field pl-11 w-full border rounded-lg px-4 py-3"
                />
              </div>
              <p className="text-xs text-dark-400 mt-1.5 ml-1">
                Nomor Induk Siswa Nasional Anda
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-dark-700 mb-1.5">
                Nama Lengkap
              </label>
              <div className="relative">
                <i className="ri-user-smile-line absolute left-3.5 top-1/2 -translate-y-1/2 text-dark-400 text-lg" />
                <input
                  type="text"
                  value={nama}
                  onChange={(e) => setNama(e.target.value)}
                  placeholder="Masukkan nama lengkap"
                  className="input-field pl-11 w-full border rounded-lg px-4 py-3"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-primary-600 hover:bg-primary-700 text-white py-3.5 rounded-lg flex items-center justify-center gap-2 disabled:opacity-70 transition-colors"
            >
              {isLoading ? (
                <>
                  <i className="ri-loader-4-line animate-spin text-lg" />
                  <span>Memuat...</span>
                </>
              ) : (
                <>
                  <span>Masuk</span>
                  <i className="ri-arrow-right-line" />
                </>
              )}
            </button>
          </form>

          <div className="text-center">
            <Link
              to="/"
              className="inline-flex items-center gap-2 text-sm text-dark-400 hover:text-dark-600 transition-colors"
            >
              <i className="ri-arrow-left-line" />
              <span>Kembali ke halaman utama</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}