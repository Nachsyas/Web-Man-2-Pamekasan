import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

export default function DashboardLayout({ children, userName }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [showDropdown, setShowDropdown] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const currentUserName = localStorage.getItem('pustakawan_name') || userName || 'Ibu Siti Aminah, S.Pd.';

  const getInitials = (name) => {
    if (!name) return 'SA';
    const cleanName = name.replace(/^(Ibu|Bapak|Pak|Bu|S\.Pd\.|S\.Kom\.)\s+/i, '').trim();
    const words = cleanName.split(/\s+/);
    if (words.length >= 2) {
      return (words[0][0] + words[1][0]).toUpperCase();
    }
    return words[0] ? words[0][0].toUpperCase() : 'SA';
  };

  const userInitials = getInitials(currentUserName);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('pustakawan_email');
    localStorage.removeItem('pustakawan_name');
    localStorage.removeItem('pustakawan_nip');
    navigate('/');
  };

  const menuItems = [
    { path: '/pustakawan/dashboard', icon: 'ri-dashboard-line', label: 'Dashboard' },
    { path: '/pustakawan/buku', icon: 'ri-book-2-line', label: 'Kelola Buku' },
    { path: '/pustakawan/peminjaman', icon: 'ri-hand-coin-line', label: 'Peminjaman' },
    { path: '/pustakawan/pengembalian', icon: 'ri-arrow-go-back-line', label: 'Pengembalian' },
    { path: '/pustakawan/anggota', icon: 'ri-user-line', label: 'Siswa' },
    { path: '/pustakawan/laporan', icon: 'ri-file-chart-line', label: 'Laporan' },
  ];

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans text-gray-800">
      
      {/* ================= SIDEBAR KIRI ================= */}
      {/* Mobile Overlay */}
      {showMobileMenu && (
        <div 
          className="fixed inset-0 bg-gray-900/50 z-40 md:hidden"
          onClick={() => setShowMobileMenu(false)}
        />
      )}
      
      <aside className={`fixed md:static inset-y-0 left-0 w-[260px] bg-white border-r border-gray-100 flex flex-col flex-shrink-0 z-50 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-transform duration-300 ${showMobileMenu ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}>
        {/* Logo Sekolah */}
        <div className="h-20 flex items-center px-6 border-b border-gray-50">
          <div className="w-9 h-9 bg-emerald-50 border border-emerald-100 rounded-full flex items-center justify-center mr-3 shadow-sm text-emerald-600">
             <i className="ri-book-read-fill text-xl" />
          </div>
          <div>
            <h2 className="font-bold text-gray-800 text-sm leading-tight tracking-tight">MAN 2 Pamekasan</h2>
            <p className="text-[10px] text-gray-500 font-medium tracking-wide uppercase mt-0.5">E-Library System</p>
          </div>
        </div>

        {/* Navigasi Utama */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto scrollbar-hide">
          {menuItems.map((menu) => {
            const isActive = location.pathname.includes(menu.path);
            
            return (
              <Link
                key={menu.path}
                to={menu.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                  isActive 
                    ? 'bg-emerald-500 text-white font-bold shadow-md' 
                    : 'text-gray-500 bg-transparent hover:bg-gray-50 hover:text-emerald-600'
                }`}
              >
                <div className="w-6 h-6 flex items-center justify-center rounded-lg">
                    <i className={`${menu.icon} text-[20px] ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-emerald-500'}`} />
                </div>
                <span className="text-sm">{menu.label}</span>
              </Link>
            );
          })}
        </nav>
        {/* Kartu Profil Bawah DIHAPUS Sesuai Instruksi */}
      </aside>

      {/* ================= KONTEN UTAMA & TOPBAR ================= */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden relative w-full md:w-auto">
        
        {/* Topbar Header */}
        <header className="h-16 md:h-20 bg-white/80 backdrop-blur-md border-b border-gray-100 flex items-center justify-between px-4 md:px-8 z-10 sticky top-0 shadow-sm">
           
           {/* Hamburger Menu (Mobile) */}
           <button 
             className="md:hidden w-10 h-10 flex items-center justify-center text-gray-500 hover:text-emerald-600 hover:bg-gray-50 rounded-xl transition-colors"
             onClick={() => setShowMobileMenu(true)}
           >
             <i className="ri-menu-line text-xl" />
           </button>


           {/* Aksi Kanan (Ikon Lonceng Dihapus) */}
           <div className="flex items-center ml-auto">
              {/* Profil Header */}
              <div className="relative">
                <div 
                  className="flex items-center gap-2 md:gap-3 cursor-pointer group p-1.5 hover:bg-gray-50 rounded-xl transition-colors"
                  onClick={() => setShowDropdown(!showDropdown)}
                >
                   <div className="text-right hidden sm:block">
                      <p className="text-sm font-bold text-gray-800 group-hover:text-emerald-600 transition-colors">{currentUserName}</p>
                      <p className="text-xs text-gray-500">Pustakawan</p>
                   </div>
                   <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold border border-emerald-200 shadow-sm">
                      {userInitials}
                   </div>
                   <i className="ri-arrow-down-s-line text-gray-400 group-hover:text-emerald-500 transition-colors" />
                </div>
                
                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-lg border border-gray-100 py-2 z-50">
                    <Link 
                      to="/pustakawan/akun"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                      onClick={() => setShowDropdown(false)}
                    >
                      <i className="ri-user-settings-line mr-2" /> Akun
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full text-left block px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <i className="ri-logout-box-r-line mr-2" /> Logout
                    </button>
                  </div>
                )}
              </div>
           </div>
        </header>

        {/* Render Halaman di Sini */}
        <main className="flex-1 overflow-y-auto bg-slate-50 relative scrollbar-hide">
           {children}
        </main>
      </div>
    </div>
  );
}