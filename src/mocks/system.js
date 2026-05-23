export const visitorLogs = [
  { id: 'v1', nisn: '0091234567', name: 'Ahmad Rizky', className: 'XII-IPA-1', checkInTime: '07:45', checkOutTime: '08:30', purpose: 'Meminjam Buku', date: '2026-05-13' },
  { id: 'v2', nisn: '0092345678', name: 'Siti Aminah', className: 'XI-IPS-2', checkInTime: '08:15', checkOutTime: null, purpose: 'Baca di Ruang Baca', date: '2026-05-13' },
  { id: 'v3', nisn: '0093456789', name: 'Budi Santoso', className: 'X-MIPA-3', checkInTime: '08:30', checkOutTime: '09:15', purpose: 'Mengembalikan Buku', date: '2026-05-13' },
  { id: 'v4', nisn: '0094567890', name: 'Dewi Lestari', className: 'XII-IPA-2', checkInTime: '09:00', checkOutTime: null, purpose: 'Mencari Referensi', date: '2026-05-13' },
  { id: 'v5', nisn: '0095678901', name: 'Fajar Hidayat', className: 'XI-MIPA-1', checkInTime: '09:30', checkOutTime: '10:00', purpose: 'Meminjam Buku', date: '2026-05-13' },
  { id: 'v6', nisn: '0096789012', name: 'Lina Marlina', className: 'XII-IPS-3', checkInTime: '10:00', checkOutTime: null, purpose: 'Belajar Kelompok', date: '2026-05-13' },
  { id: 'v7', nisn: '0097890123', name: 'Rina Wulandari', className: 'X-IPS-1', checkInTime: '10:30', checkOutTime: '11:00', purpose: 'Baca di Ruang Baca', date: '2026-05-13' },
  { id: 'v8', nisn: '0098901234', name: 'Andi Pratama', className: 'XII-IPA-3', checkInTime: '11:00', checkOutTime: null, purpose: 'Mengembalikan Buku', date: '2026-05-13' },
  { id: 'v9', nisn: '0091234567', name: 'Ahmad Rizky', className: 'XII-IPA-1', checkInTime: '07:30', checkOutTime: '08:15', purpose: 'Meminjam Buku', date: '2026-05-12' },
  { id: 'v10', nisn: '0092345678', name: 'Siti Aminah', className: 'XI-IPS-2', checkInTime: '08:00', checkOutTime: '09:00', purpose: 'Baca di Ruang Baca', date: '2026-05-12' },
  { id: 'v11', nisn: '0099012345', name: 'Yusuf Hamzah', className: 'XI-IPA-2', checkInTime: '13:00', checkOutTime: '14:00', purpose: 'Mencari Referensi', date: '2026-05-13' },
  { id: 'v12', nisn: '0090123456', name: 'Nadia Salsabila', className: 'X-MIPA-2', checkInTime: '13:30', checkOutTime: null, purpose: 'Belajar Kelompok', date: '2026-05-13' },
];

export const systemSettings = {
  libraryName: 'Perpustakaan MAN 2 Pamekasan',
  address: 'Jl. KH. Wachid Hasyim No. 45, Pamekasan, Madura',
  phone: '(0324) 321456',
  email: 'perpustakaan@man2pamekasan.sch.id',
  maxBorrowDays: 7,
  maxBooksPerBorrow: 3,
  finePerDay: 5000,
  maxFineAmount: 100000,
  enableNotifications: true,
  autoApproveBorrowing: false,
  requireApprovalForBulk: true,
};

export const categoriesList = [
  'Agama', 'Filsafat', 'Pendidikan', 'Sejarah', 'Teknologi', 'Sains',
  'Bahasa', 'Seni', 'Matematika', 'Biologi', 'Fisika', 'Kimia',
  'Sosiologi', 'Ekonomi', 'Geografi',
];

export const racksList = [
  'Rak A1', 'Rak A2', 'Rak A3', 'Rak B1', 'Rak B2', 'Rak B3',
  'Rak C1', 'Rak C2', 'Rak C3', 'Rak D1', 'Rak D2', 'Rak D3',
  'Rak E1', 'Rak E2',
];

export const allBorrowingTransactions = [
  { id: 'TRX-2026-001', memberName: 'Ahmad Rizky', nisn: '0091234567', className: 'XII-IPA-1', books: ['Filsafat Ilmu', 'Pendidikan Karakter'], type: 'Paket', borrowDate: '2026-05-10', dueDate: '2026-05-17', returnDate: null, status: 'Borrowed', fine: 0, approvedBy: 'Ibu Siti Aminah' },
  { id: 'TRX-2026-002', memberName: 'Siti Aminah', nisn: '0092345678', className: 'XI-IPS-2', books: ['Sejarah Peradaban Islam', 'Ekologi dan Lingkungan'], type: 'Paket', borrowDate: '2026-05-08', dueDate: '2026-05-15', returnDate: null, status: 'Borrowed', fine: 0, approvedBy: 'Ibu Siti Aminah' },
  { id: 'TRX-2026-003', memberName: 'Budi Santoso', nisn: '0093456789', className: 'X-MIPA-3', books: ['Matematika Kelas XII', 'Dasar-Dasar Pemrograman Python'], type: 'Paket', borrowDate: '2026-04-25', dueDate: '2026-05-02', returnDate: null, status: 'Overdue', fine: 55000, approvedBy: 'Ibu Siti Aminah' },
  { id: 'TRX-2026-004', memberName: 'Dewi Lestari', nisn: '0094567890', className: 'XII-IPA-2', books: ['Biologi Molekuler'], type: 'Reguler', borrowDate: '2026-04-20', dueDate: '2026-04-27', returnDate: '2026-05-05', status: 'Returned', fine: 40000, approvedBy: 'Ibu Siti Aminah' },
  { id: 'TRX-2026-005', memberName: 'Fajar Hidayat', nisn: '0095678901', className: 'XI-MIPA-1', books: ['Fisika Dasar', 'Kimia Organik', 'Al-Quran dan Ilmu Pengetahuan'], type: 'Reguler', borrowDate: '2026-05-12', dueDate: '2026-05-19', returnDate: null, status: 'Pending', fine: 0 },
  { id: 'TRX-2026-006', memberName: 'Lina Marlina', nisn: '0096789012', className: 'XII-IPS-3', books: ['Seni Kaligrafi Islam', 'Bahasa Arab untuk Madrasah Aliyah'], type: 'Paket', borrowDate: '2026-05-13', dueDate: '2026-05-20', returnDate: null, status: 'Pending', fine: 0 },
  { id: 'TRX-2026-007', memberName: 'Rina Wulandari', nisn: '0097890123', className: 'X-IPS-1', books: ['Sosiologi Modern'], type: 'Reguler', borrowDate: '2026-05-13', dueDate: '2026-05-20', returnDate: null, status: 'Pending', fine: 0 },
  { id: 'TRX-2026-008', memberName: 'Andi Pratama', nisn: '0098901234', className: 'XII-IPA-3', books: ['Ekonomi Mikro', 'Geografi Indonesia'], type: 'Paket', borrowDate: '2026-04-15', dueDate: '2026-04-22', returnDate: '2026-04-25', status: 'Returned', fine: 15000, approvedBy: 'Ibu Siti Aminah' },
  { id: 'TRX-2026-009', memberName: 'Yusuf Hamzah', nisn: '0099012345', className: 'XI-IPA-2', books: ['Fisika Dasar', 'Matematika Kelas XII'], type: 'Reguler', borrowDate: '2026-05-01', dueDate: '2026-05-08', returnDate: null, status: 'Overdue', fine: 25000, approvedBy: 'Ibu Siti Aminah' },
  { id: 'TRX-2026-010', memberName: 'Nadia Salsabila', nisn: '0090123456', className: 'X-MIPA-2', books: ['Biologi Molekuler', 'Kimia Organik'], type: 'Reguler', borrowDate: '2026-05-05', dueDate: '2026-05-12', returnDate: '2026-05-12', status: 'Returned', fine: 0, approvedBy: 'Ibu Siti Aminah' },
  { id: 'TRX-2026-011', memberName: 'Ahmad Rizky', nisn: '0091234567', className: 'XII-IPA-1', books: ['Fisika Dasar'], type: 'Reguler', borrowDate: '2026-04-10', dueDate: '2026-04-17', returnDate: '2026-04-18', status: 'Returned', fine: 5000, approvedBy: 'Ibu Siti Aminah' },
  { id: 'TRX-2026-012', memberName: 'Siti Aminah', nisn: '0092345678', className: 'XI-IPS-2', books: ['Pendidikan Karakter'], type: 'Paket', borrowDate: '2026-03-20', dueDate: '2026-03-27', returnDate: '2026-03-26', status: 'Returned', fine: 0, approvedBy: 'Ibu Siti Aminah' },
];

export const allMembers = [
  { id: '1', nisn: '0091234567', name: 'Ahmad Rizky', className: 'XII-IPA-1', phone: '0812-3456-7890', email: 'ahmad.rizky@student.man2pamekasan.sch.id', status: 'Active', totalBorrows: 23, paketBorrows: 15, regulerBorrows: 8, activeLoans: 2, joinedAt: '2023-07-15' },
  { id: '2', nisn: '0092345678', name: 'Siti Aminah', className: 'XI-IPS-2', phone: '0813-4567-8901', email: 'siti.aminah@student.man2pamekasan.sch.id', status: 'Active', totalBorrows: 18, paketBorrows: 10, regulerBorrows: 8, activeLoans: 2, joinedAt: '2024-01-10' },
  { id: '3', nisn: '0093456789', name: 'Budi Santoso', className: 'X-MIPA-3', phone: '0814-5678-9012', email: 'budi.santoso@student.man2pamekasan.sch.id', status: 'Active', totalBorrows: 15, paketBorrows: 10, regulerBorrows: 5, activeLoans: 2, joinedAt: '2024-07-20' },
  { id: '4', nisn: '0094567890', name: 'Dewi Lestari', className: 'XII-IPA-2', phone: '0815-6789-0123', email: 'dewi.lestari@student.man2pamekasan.sch.id', status: 'Active', totalBorrows: 31, paketBorrows: 18, regulerBorrows: 13, activeLoans: 0, joinedAt: '2023-01-05' },
  { id: '5', nisn: '0095678901', name: 'Fajar Hidayat', className: 'XI-MIPA-1', phone: '0816-7890-1234', email: 'fajar.hidayat@student.man2pamekasan.sch.id', status: 'Active', totalBorrows: 12, paketBorrows: 8, regulerBorrows: 4, activeLoans: 3, joinedAt: '2024-07-15' },
  { id: '6', nisn: '0096789012', name: 'Lina Marlina', className: 'XII-IPS-3', phone: '0817-8901-2345', email: 'lina.marlina@student.man2pamekasan.sch.id', status: 'Active', totalBorrows: 9, paketBorrows: 5, regulerBorrows: 4, activeLoans: 2, joinedAt: '2024-01-20' },
  { id: '7', nisn: '0097890123', name: 'Rina Wulandari', className: 'X-IPS-1', phone: '0818-9012-3456', email: 'rina.wulandari@student.man2pamekasan.sch.id', status: 'Active', totalBorrows: 5, paketBorrows: 3, regulerBorrows: 2, activeLoans: 1, joinedAt: '2025-01-10' },
  { id: '8', nisn: '0098901234', name: 'Andi Pratama', className: 'XII-IPA-3', phone: '0819-0123-4567', email: 'andi.pratama@student.man2pamekasan.sch.id', status: 'Active', totalBorrows: 19, paketBorrows: 12, regulerBorrows: 7, activeLoans: 0, joinedAt: '2023-09-01' },
  { id: '9', nisn: '0099012345', name: 'Yusuf Hamzah', className: 'XI-IPA-2', phone: '0821-1234-5678', email: 'yusuf.hamzah@student.man2pamekasan.sch.id', status: 'Active', totalBorrows: 14, paketBorrows: 9, regulerBorrows: 5, activeLoans: 2, joinedAt: '2024-03-15' },
  { id: '10', nisn: '0090123456', name: 'Nadia Salsabila', className: 'X-MIPA-2', phone: '0822-2345-6789', email: 'nadia.salsabila@student.man2pamekasan.sch.id', status: 'Active', totalBorrows: 7, paketBorrows: 4, regulerBorrows: 3, activeLoans: 0, joinedAt: '2025-02-20' },
  { id: '11', nisn: '0091122334', name: 'Rudi Hartono', className: 'XI-IPS-1', phone: '0823-3456-7890', email: 'rudi.hartono@student.man2pamekasan.sch.id', status: 'Inactive', totalBorrows: 3, paketBorrows: 2, regulerBorrows: 1, activeLoans: 0, joinedAt: '2024-08-10' },
  { id: '12', nisn: '0092233445', name: 'Maya Anggraini', className: 'XII-IPS-2', phone: '0824-4567-8901', email: 'maya.anggraini@student.man2pamekasan.sch.id', status: 'Active', totalBorrows: 22, paketBorrows: 15, regulerBorrows: 7, activeLoans: 1, joinedAt: '2023-05-12' },
  { id: '13', nisn: '0093344556', name: 'Dedi Kurniawan', className: 'X-MIPA-1', phone: '0825-5678-9012', email: 'dedi.kurniawan@student.man2pamekasan.sch.id', status: 'Suspended', totalBorrows: 8, paketBorrows: 5, regulerBorrows: 3, activeLoans: 0, joinedAt: '2024-10-05' },
  { id: '14', nisn: '0094455667', name: 'Indah Permata', className: 'XI-IPA-3', phone: '0826-6789-0123', email: 'indah.permata@student.man2pamekasan.sch.id', status: 'Active', totalBorrows: 11, paketBorrows: 6, regulerBorrows: 5, activeLoans: 0, joinedAt: '2024-04-18' },
  { id: '15', nisn: '0095566778', name: 'Eko Wibowo', className: 'XII-MIPA-1', phone: '0827-7890-1234', email: 'eko.wibowo@student.man2pamekasan.sch.id', status: 'Active', totalBorrows: 16, paketBorrows: 10, regulerBorrows: 6, activeLoans: 1, joinedAt: '2023-11-20' },
];