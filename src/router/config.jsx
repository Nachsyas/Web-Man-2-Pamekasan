import LandingPage from "../pages/LandingPage";
import NotFound from "../pages/NotFound";
import PustakawanLogin from "../pages/auth/PustakawanLogin";
import SiswaAccess from "../pages/auth/SiswaAccess";
import Dashboard from "../pages/dashboard/page";
import Books from "../pages/pustakawan/Books";
import Borrowing from "../pages/pustakawan/Borrowing";
import Members from "../pages/pustakawan/Members";
import Reports from "../pages/pustakawan/Reports";
import Returns from "../pages/pustakawan/Returns";
import Settings from "../pages/pustakawan/Settings";
import Account from "../pages/pustakawan/Account";
import SiswaCatalog from "../pages/siswa/Catalog";
import SiswaClearance from "../pages/siswa/Clearance";
import SiswaHistory from "../pages/siswa/History";
import SiswaHome from "../pages/siswa/Home";

const routes = [
  // Landing / Role Selector
  { path: "/", element: <LandingPage /> },

  // Siswa Routes
  { path: "/siswa/access", element: <SiswaAccess /> },
  { path: "/siswa", element: <SiswaHome /> },
  { path: "/siswa/buku", element: <SiswaCatalog /> },
  { path: "/siswa/riwayat", element: <SiswaHistory /> },
  { path: "/siswa/bebas-tanggungan", element: <SiswaClearance /> },

  // Pustakawan Routes
  { path: "/pustakawan/login", element: <PustakawanLogin /> },
  { path: "/pustakawan/dashboard", element: <Dashboard /> },
  { path: "/pustakawan/buku", element: <Books /> },
  { path: "/pustakawan/peminjaman", element: <Borrowing /> },
  { path: "/pustakawan/pengembalian", element: <Returns /> },
  { path: "/pustakawan/anggota", element: <Members /> },
  { path: "/pustakawan/laporan", element: <Reports /> },
  { path: "/pustakawan/pengaturan", element: <Settings /> },
  { path: "/pustakawan/akun", element: <Account /> },

  // Legacy redirects
  { path: "/login", element: <LandingPage /> },
  { path: "/dashboard", element: <LandingPage /> },

  // 404 Route
  { path: "*", element: <NotFound /> },
];

export default routes;