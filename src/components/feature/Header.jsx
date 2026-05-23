import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { notifications } from '../../mocks/dashboard';

export default function Header({ userName, onMenuClick, onSearch }) {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const notifRef = useRef(null);
  const profileRef = useRef(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
      if (profileRef.current && !profileRef.current.contains(e.target)) {
        setShowProfile(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (onSearch) onSearch(searchQuery);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="flex items-center justify-between h-16 px-4 lg:px-8">
        {/* Left: hamburger + search */}
        <div className="flex items-center gap-4 flex-1">
          <button
            onClick={onMenuClick}
            className="lg:hidden w-10 h-10 rounded-lg flex items-center justify-center hover:bg-gray-50 transition-colors"
          >
            <i className="ri-menu-line text-xl text-gray-600" />
          </button>

          <form onSubmit={handleSearch} className="hidden md:flex items-center flex-1 max-w-md">
            <div className="relative w-full">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari buku, siswa, atau transaksi..."
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-gray-50 border border-transparent focus:bg-white focus:border-primary-200 focus:ring-2 focus:ring-primary-100 text-sm placeholder-gray-400 transition-all outline-none"
              />
            </div>
          </form>
        </div>

        {/* Right: notifications + profile */}
        <div className="flex items-center gap-2">
          {/* Notification bell */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="w-10 h-10 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-colors relative"
            >
              <i className="ri-notification-3-line text-xl text-gray-600" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {showNotifications && (
              <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                  <h3 className="font-semibold text-gray-800">Notifikasi</h3>
                  <button className="text-xs text-primary-600 hover:text-primary-700 font-medium">
                    Tandai semua dibaca
                  </button>
                </div>
                <div className="max-h-[360px] overflow-y-auto">
                  {notifications.map((notif) => (
                    <div
                      key={notif.id}
                      className={`p-4 flex gap-3 hover:bg-gray-50 transition-colors cursor-pointer border-b border-gray-50 last:border-0 ${!notif.read ? 'bg-primary-50/30' : ''}`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0
                        ${notif.type === 'success' ? 'bg-green-50 text-green-600' : ''}
                        ${notif.type === 'warning' ? 'bg-yellow-50 text-yellow-600' : ''}
                        ${notif.type === 'info' ? 'bg-blue-50 text-blue-600' : ''}
                        ${notif.type === 'error' ? 'bg-red-50 text-red-600' : ''}
                      `}>
                        <i className={`text-lg
                          ${notif.type === 'success' ? 'ri-check-line' : ''}
                          ${notif.type === 'warning' ? 'ri-alert-line' : ''}
                          ${notif.type === 'info' ? 'ri-information-line' : ''}
                          ${notif.type === 'error' ? 'ri-error-warning-line' : ''}
                        `} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm text-gray-800">{notif.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">{notif.message}</p>
                        <p className="text-[11px] text-gray-400 mt-1">{notif.time}</p>
                      </div>
                      {!notif.read && (
                        <div className="w-2 h-2 rounded-full bg-primary-500 flex-shrink-0 mt-2" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="p-3 border-t border-gray-100 text-center">
                  <span className="text-sm text-primary-600 hover:text-primary-700 font-medium cursor-pointer">
                    Lihat semua notifikasi
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Profile dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfile(!showProfile)}
              className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-xl hover:bg-gray-50 transition-colors"
            >
              <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                <i className="ri-user-fill text-white text-sm" />
              </div>
              <div className="hidden lg:block text-left">
                <p className="text-sm font-medium text-gray-800 leading-tight">{userName}</p>
                <p className="text-xs text-gray-400 leading-tight">Pustakawan</p>
              </div>
              <i className="ri-arrow-down-s-line text-gray-400 hidden lg:block" />
            </button>

            {showProfile && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden animate-fade-in">
                <div className="p-4 bg-gradient-to-r from-primary-50 to-blue-50">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                      <i className="ri-user-fill text-white text-xl" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">{userName}</p>
                      <p className="text-xs text-gray-500">Pustakawan</p>
                    </div>
                  </div>
                </div>
                <div className="p-2">
                  <Link to="/pustakawan/pengaturan" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                    <i className="ri-user-settings-line text-gray-500" />
                    <span className="text-sm text-gray-700">Profil Saya</span>
                  </Link>
                  <span className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer">
                    <i className="ri-lock-password-line text-gray-500" />
                    <span className="text-sm text-gray-700">Ubah Password</span>
                  </span>
                  <Link to="/pustakawan/pengaturan" className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors">
                    <i className="ri-settings-4-line text-gray-500" />
                    <span className="text-sm text-gray-700">Pengaturan</span>
                  </Link>
                </div>
                <div className="p-2 border-t border-gray-100">
                  <Link
                    to="/"
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-red-50 transition-colors text-red-600"
                  >
                    <i className="ri-logout-box-r-line" />
                    <span className="text-sm font-medium">Keluar</span>
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}