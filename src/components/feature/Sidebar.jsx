import { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', path: '/pustakawan/dashboard', icon: 'ri-dashboard-line' },
  { label: 'Kelola Buku', path: '/pustakawan/buku', icon: 'ri-book-3-line' },
  { label: 'Peminjaman', path: '/pustakawan/peminjaman', icon: 'ri-hand-coin-line' },
  { label: 'Pengembalian', path: '/pustakawan/pengembalian', icon: 'ri-arrow-go-back-line' },
  { label: 'Siswa', path: '/pustakawan/anggota', icon: 'ri-user-line' },
  { label: 'Laporan', path: '/pustakawan/laporan', icon: 'ri-file-chart-line' },
  { label: 'Pengaturan', path: '/pustakawan/pengaturan', icon: 'ri-settings-3-line' },
];

export default function Sidebar({ isOpen, onClose, userName, userNisn, logoUrl }) {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setIsCollapsed(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed lg:sticky top-0 left-0 h-screen z-50
          transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          ${isCollapsed ? 'w-20' : 'w-72'}
          bg-white border-r border-gray-200 flex flex-col
        `}
      >
        {/* Logo area */}
        <div className={`p-6 border-b border-gray-100 flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
          <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 bg-primary-50 flex items-center justify-center">
            <img src={logoUrl} alt="MAN 2 Pamekasan" className="w-8 h-8 object-contain" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <h1 className="font-bold text-gray-800 text-sm leading-tight truncate">MAN 2 Pamekasan</h1>
              <p className="text-xs text-gray-400">E-Library System</p>
            </div>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 px-3 overflow-y-auto scrollbar-hide">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    onClick={() => { if (window.innerWidth < 1024) onClose(); }}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-xl group relative transition-colors
                      ${isActive ? 'bg-primary-600 text-white' : 'text-gray-600 hover:bg-gray-50'}
                      ${isCollapsed ? 'justify-center px-2' : ''}
                    `}
                    title={isCollapsed ? item.label : undefined}
                  >
                    <div className={`
                      w-9 h-9 rounded-lg flex items-center justify-center transition-colors
                      ${isActive ? 'bg-white/20' : 'bg-gray-100 group-hover:bg-primary-100'}
                    `}>
                      <i className={`${item.icon} text-lg ${isActive ? 'text-white' : 'text-gray-500 group-hover:text-primary-600'}`} />
                    </div>
                    {!isCollapsed && (
                      <span className={`font-medium ${isActive ? 'text-white' : ''}`}>{item.label}</span>
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* User profile */}
        <div className="p-4 border-t border-gray-100">
          <div className={`flex items-center gap-3 ${isCollapsed ? 'justify-center' : ''}`}>
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center flex-shrink-0">
              <i className="ri-user-fill text-white text-lg" />
            </div>
            {!isCollapsed && (
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm text-gray-800 truncate">{userName}</p>
                <p className="text-xs text-gray-400 truncate">{userNisn}</p>
                <span className="inline-block mt-1 text-[10px] px-2 py-0.5 rounded-full font-medium bg-blue-50 text-blue-600">
                  Pustakawan
                </span>
              </div>
            )}
          </div>
        </div>

        {/* Toggle collapse button */}
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="hidden lg:flex absolute -right-3 top-24 w-6 h-6 bg-primary-600 text-white rounded-full items-center justify-center shadow-md hover:bg-primary-700 transition-colors"
        >
          <i className={`text-sm ${isCollapsed ? 'ri-arrow-right-s-line' : 'ri-arrow-left-s-line'}`} />
        </button>
      </aside>
    </>
  );
}