import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const pustakawanIllustration = 'https://readdy.ai/api/search-image?query=Modern%20library%20management%20workspace%20illustration%20with%20librarian%20organizing%20books%20on%20digital%20shelves%2C%20warm%20lighting%2C%20clean%20minimalist%20isometric%20design%2C%20emerald%20green%20and%20blue%20accent%20colors%2C%20professional%20educational%20atmosphere%2C%20transparent%20soft%20background&width=500&height=400&seq=120&orientation=squarish';

export default function PustakawanLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email.trim()) {
      setError('Masukkan email atau username');
      return;
    }
    if (!password) {
      setError('Masukkan password Anda');
      return;
    }

    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      localStorage.setItem('pustakawan_email', email.trim());
      navigate('/pustakawan/dashboard');
    }, 1200);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white">
      {/* Left: illustration and branding */}
      <div className="hidden lg:flex lg:w-[45%] relative overflow-hidden bg-gray-900">
        <div className="absolute inset-0 bg-gradient-to-br from-primary-900 via-gray-900 to-blue-900 opacity-90" />
        <div className="relative z-10 flex flex-col justify-between p-12 xl:p-16 w-full">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center">
              <img
                src="https://static.readdy.ai/image/42aaa639a2198982502a0b7fb96efe1c/f8f4bf38c807254ceb90b9aaef5d3955.png"
                alt="MAN 2 Pamekasan"
                className="w-8 h-8 object-contain"
              />
            </div>
            <div>
              <h2 className="text-white font-bold text-sm">MAN 2 Pamekasan</h2>
              <p className="text-white/60 text-xs">Digital Library System</p>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center py-8">
            <div className="relative">
              <div className="absolute inset-0 bg-white/5 rounded-3xl blur-3xl" />
              <img
                src={pustakawanIllustration}
                alt="Library Management"
                className="relative w-[380px] h-auto rounded-2xl"
              />
            </div>
          </div>

          <div className="space-y-3">
            <h1 className="text-white text-3xl font-bold leading-tight">
              Dashboard Pustakawan
            </h1>
            <p className="text-white/60 text-base leading-relaxed max-w-sm">
              Kelola seluruh operasional perpustakaan, inventori, peminjaman, dan laporan dari satu dashboard terintegrasi.
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
            <h2 className="text-gray-800 font-bold text-sm">MAN 2 Pamekasan</h2>
            <p className="text-gray-400 text-xs">E-Library System</p>
          </div>
        </div>

        <div className="w-full max-w-md space-y-6">
          <div className="text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-medium mb-4">
              <i className="ri-shield-user-line" />
              <span>Akses Pustakawan</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 mb-2">Selamat Datang Kembali</h1>
            <p className="text-gray-500">
              Masuk ke dashboard pustakawan untuk mengelola perpustakaan.
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
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Email / Username
              </label>
              <div className="relative">
                <i className="ri-user-line absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type="text"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Masukkan email atau username"
                  className="w-full border border-gray-300 rounded-lg pl-11 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <i className="ri-lock-password-line absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 text-lg" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Masukkan password"
                  className="w-full border border-gray-300 rounded-lg pl-11 pr-11 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <i className={`${showPassword ? 'ri-eye-off-line' : 'ri-eye-line'} text-lg`} />
                </button>
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
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-gray-600 transition-colors"
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