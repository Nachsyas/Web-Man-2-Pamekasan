import { Link, useLocation } from 'react-router-dom';

const siswaNavItems = [
  { label: 'Beranda', path: '/siswa', icon: 'ri-home-line' },
  { label: 'Katalog Perpustakaan', path: '/siswa/buku', icon: 'ri-book-open-line' },
  { label: 'Riwayat', path: '/siswa/riwayat', icon: 'ri-history-line' },
  { label: 'Bebas Tanggungan', path: '/siswa/bebas-tanggungan', icon: 'ri-file-list-3-line' },
];

export default function SiswaHeader({ studentName, nisn }) {
  const location = useLocation();

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-gray-100">
      {/* Desktop header */}
      <div className="hidden lg:flex items-center justify-between h-16 px-8 max-w-[1400px] mx-auto">
        <div className="flex items-center gap-8">
          {/* Logo */}
          <Link to="/siswa" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-primary-50 flex items-center justify-center">
              <img
                src="https://static.readdy.ai/image/42aaa639a2198982502a0b7fb96efe1c/f8f4bf38c807254ceb90b9aaef5d3955.png"
                alt="MAN 2 Pamekasan"
                className="w-7 h-7 object-contain"
              />
            </div>
            <div>
              <h1 className="font-bold text-gray-800 text-sm leading-tight">MAN 2 Pamekasan</h1>
              <p className="text-[11px] text-gray-500">Perpustakaan Digital</p>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="flex items-center gap-1">
            {siswaNavItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`
                    flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200
                    ${isActive
                      ? 'bg-primary-50 text-primary-600'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-50'
                    }
                  `}
                >
                  <i className={item.icon} />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Profile */}
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-medium text-gray-800">{studentName}</p>
            <p className="text-[11px] text-gray-500">{nisn}</p>
          </div>
          <Link
            to="/"
            className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
            title="Keluar"
          >
            <i className="ri-logout-box-r-line text-lg" />
          </Link>
        </div>
      </div>

      {/* Mobile header */}
      <div className="lg:hidden flex flex-col">
        <div className="flex items-center justify-between h-14 px-4">
          <Link to="/siswa" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary-50 flex items-center justify-center">
              <img
                src="https://static.readdy.ai/image/42aaa639a2198982502a0b7fb96efe1c/f8f4bf38c807254ceb90b9aaef5d3955.png"
                alt="MAN 2 Pamekasan"
                className="w-6 h-6 object-contain"
              />
            </div>
            <span className="font-bold text-gray-800 text-sm">E-Library</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{studentName}</span>
            <Link
              to="/"
              className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-red-50 text-gray-400 hover:text-red-500 transition-colors"
            >
              <i className="ri-logout-box-r-line" />
            </Link>
          </div>
        </div>

        {/* Mobile nav tabs */}
        <div className="flex items-center gap-1 px-4 pb-2 overflow-x-auto scrollbar-hide">
          {siswaNavItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-all
                  ${isActive
                    ? 'bg-primary-600 text-white'
                    : 'text-gray-600 hover:text-gray-800 bg-gray-50'
                  }
                `}
              >
                <i className={item.icon} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}