export const dashboardStats = {
  totalBooks: 12480,
  borrowedBooks: 2847,
  lateReturns: 156,
  activeMembers: 3456,
  totalVisitors: 8924,
  newBooksThisMonth: 234,
};

export const borrowingChartData = [
  { month: 'Jan', borrowings: 1200, returns: 980 },
  { month: 'Feb', borrowings: 1350, returns: 1100 },
  { month: 'Mar', borrowings: 1100, returns: 1050 },
  { month: 'Apr', borrowings: 1600, returns: 1400 },
  { month: 'May', borrowings: 1450, returns: 1300 },
  { month: 'Jun', borrowings: 1800, returns: 1650 },
  { month: 'Jul', borrowings: 2100, returns: 1950 },
  { month: 'Aug', borrowings: 1900, returns: 1750 },
  { month: 'Sep', borrowings: 1700, returns: 1550 },
  { month: 'Oct', borrowings: 1550, returns: 1450 },
  { month: 'Nov', borrowings: 1400, returns: 1300 },
  { month: 'Dec', borrowings: 1300, returns: 1200 },
];

export const popularBooks = [
  { id: '1', title: 'Filsafat Ilmu: Sejarah dan Perkembangannya', author: 'Dr. H. Mulyadhi Kartanegara', borrowCount: 342, coverUrl: 'https://readdy.ai/api/search-image?query=A%20scholarly%20Indonesian%20philosophy%20book%20cover%20with%20traditional%20batik%20patterns%20and%20green%20academic%20styling%20on%20a%20clean%20white%20background%2C%20minimalist%20design%2C%20educational%20book%20cover%20design&width=300&height=450&seq=1&orientation=portrait', category: 'Filsafat' },
  { id: '2', title: 'Pendidikan Karakter: Teori dan Praktik', author: 'Prof. Dr. M. Djalil', borrowCount: 298, coverUrl: 'https://readdy.ai/api/search-image?query=Indonesian%20education%20character%20building%20book%20cover%20with%20students%20illustration%2C%20green%20and%20white%20color%20scheme%2C%20academic%20book%20design%2C%20clean%20minimalist%20educational%20publishing%20style&width=300&height=450&seq=2&orientation=portrait', category: 'Pendidikan' },
  { id: '3', title: 'Sejarah Peradaban Islam', author: 'Dr. Siti Maryam', borrowCount: 276, coverUrl: 'https://readdy.ai/api/search-image?query=Islamic%20civilization%20history%20book%20cover%20with%20elegant%20mosque%20silhouette%20and%20golden%20accents%2C%20scholarly%20academic%20design%2C%20clean%20white%20background%20with%20green%20border%2C%20educational%20publishing%20style&width=300&height=450&seq=3&orientation=portrait', category: 'Sejarah' },
  { id: '4', title: 'Dasar-Dasar Pemrograman Python', author: 'Budi Raharjo', borrowCount: 245, coverUrl: 'https://readdy.ai/api/search-image?query=Python%20programming%20textbook%20cover%20for%20Indonesian%20students%2C%20clean%20modern%20tech%20education%20design%20with%20code%20snippets%20visualization%2C%20green%20accent%20colors%2C%20academic%20computer%20science%20book%20cover&width=300&height=450&seq=4&orientation=portrait', category: 'Teknologi' },
  { id: '5', title: 'Ekologi dan Lingkungan Hidup', author: 'Dr. Ir. H. Agus Suyanto', borrowCount: 201, coverUrl: 'https://readdy.ai/api/search-image?query=Ecology%20and%20environmental%20science%20book%20cover%20with%20green%20nature%20illustration%2C%20trees%20and%20earth%20design%2C%20Indonesian%20environmental%20education%20textbook%2C%20clean%20academic%20publishing%20style&width=300&height=450&seq=5&orientation=portrait', category: 'Sains' },
];

export const recentActivities = [
  { id: '1', type: 'borrow', description: 'Meminjam buku "Filsafat Ilmu: Sejarah dan Perkembangannya"', user: 'Ahmad Rizky (XII-IPA-1)', time: '5 menit yang lalu' },
  { id: '2', type: 'approval', description: 'Pengajuan peminjaman paket buku disetujui', user: 'Siti Aminah (XI-IPS-2)', time: '12 menit yang lalu', status: 'Approved' },
  { id: '3', type: 'return', description: 'Mengembalikan 2 buku dengan status baik', user: 'Budi Santoso (X-MIPA-3)', time: '25 menit yang lalu' },
  { id: '4', type: 'overdue', description: 'Jatuh tempo peminjaman buku "Dasar-Dasar Pemrograman Python"', user: 'Dewi Lestari (XII-IPA-2)', time: '1 jam yang lalu', status: 'Overdue' },
  { id: '5', type: 'member', description: 'Anggota baru terdaftar dengan NISN 0098765432', user: 'Rina Wulandari (X-IPS-1)', time: '2 jam yang lalu' },
  { id: '6', type: 'borrow', description: 'Meminjam 3 buku paket pelajaran semester genap', user: 'Fajar Hidayat (XI-MIPA-1)', time: '3 jam yang lalu' },
  { id: '7', type: 'return', description: 'Mengembalikan buku dengan kondisi rusak ringan', user: 'Lina Marlina (XII-IPS-3)', time: '4 jam yang lalu', status: 'Damaged' },
];

export const pendingApprovals = [
  { id: '1', memberName: 'Ahmad Rizky', nisn: '0091234567', className: 'XII-IPA-1', books: ['Filsafat Ilmu', 'Pendidikan Karakter'], requestDate: '13 Mei 2026', status: 'Pending' },
  { id: '2', memberName: 'Siti Aminah', nisn: '0092345678', className: 'XI-IPS-2', books: ['Sejarah Peradaban Islam', 'Ekologi dan Lingkungan', 'Dasar-Dasar Pemrograman'], requestDate: '13 Mei 2026', status: 'Pending' },
  { id: '3', memberName: 'Budi Santoso', nisn: '0093456789', className: 'X-MIPA-3', books: ['Matematika Dasar', 'Fisika Modern'], requestDate: '12 Mei 2026', status: 'Pending' },
  { id: '4', memberName: 'Dewi Lestari', nisn: '0094567890', className: 'XII-IPA-2', books: ['Kimia Organik', 'Biologi Sel'], requestDate: '12 Mei 2026', status: 'Pending' },
];

export const notifications = [
  { id: '1', title: 'Pengajuan Peminjaman Baru', message: 'Ahmad Rizky mengajukan peminjaman 2 buku', type: 'info', time: '5 menit yang lalu', read: false },
  { id: '2', title: 'Buku Jatuh Tempo', message: '3 buku akan jatuh tempo besok', type: 'warning', time: '1 jam yang lalu', read: false },
  { id: '3', title: 'Stok Buku Menipis', message: 'Stok "Filsafat Ilmu" tersisa 2 eksemplar', type: 'warning', time: '3 jam yang lalu', read: true },
  { id: '4', title: 'Import Excel Berhasil', message: '124 buku berhasil diimpor dari file Excel', type: 'success', time: '5 jam yang lalu', read: true },
  { id: '5', title: 'Anggota Baru Terdaftar', message: '15 anggota baru berhasil didaftarkan hari ini', type: 'success', time: '1 hari yang lalu', read: true },
];