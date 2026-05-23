export const bookCategories = [
  'Agama', 'Filsafat', 'Pendidikan', 'Sejarah', 'Teknologi', 'Sains',
  'Bahasa', 'Seni', 'Matematika', 'Biologi', 'Fisika', 'Kimia',
  'Sosiologi', 'Ekonomi', 'Geografi',
];

export const bookRacks = [
  'Rak A1', 'Rak A2', 'Rak A3', 'Rak B1', 'Rak B2', 'Rak B3',
  'Rak C1', 'Rak C2', 'Rak C3', 'Rak D1', 'Rak D2', 'Rak D3',
  'Rak E1', 'Rak E2',
];

export const booksMock = [
  {
    id: 'bk1',
    title: 'Filsafat Ilmu: Sejarah dan Perkembangannya',
    author: 'Dr. H. Mulyadhi Kartanegara',
    isbn: '978-602-1234-56-7',
    category: 'Filsafat',
    rack: 'Rak A1',
    year: 2020,
    stock: 12,
    totalStock: 15,
    condition: 'Available',
    coverUrl: 'https://readdy.ai/api/search-image?query=A%20scholarly%20Indonesian%20philosophy%20book%20cover%20with%20traditional%20batik%20patterns%20and%20green%20academic%20styling%20on%20a%20clean%20white%20background%2C%20minimalist%20design%2C%20educational%20book%20cover%20design&width=300&height=450&seq=301&orientation=portrait',
    description: 'Buku ini membahas perkembangan filsafat ilmu dari masa Yunani kuno hingga era modern.',
    createdAt: '2023-01-15'
  },
  {
    id: 'bk2',
    title: 'Pendidikan Karakter: Teori dan Praktik',
    author: 'Prof. Dr. M. Djalil',
    isbn: '978-602-2345-67-8',
    category: 'Pendidikan',
    rack: 'Rak B2',
    year: 2021,
    stock: 8,
    totalStock: 10,
    condition: 'Borrowed',
    coverUrl: 'https://readdy.ai/api/search-image?query=Indonesian%20education%20character%20building%20book%20cover%20with%20students%20illustration%2C%20green%20and%20white%20color%20scheme%2C%20academic%20book%20design%2C%20clean%20minimalist%20educational%20publishing%20style&width=300&height=450&seq=302&orientation=portrait',
    description: 'Panduan lengkap untuk mengimplementasikan pendidikan karakter di sekolah.',
    createdAt: '2023-02-20'
  },
  {
    id: 'bk3',
    title: 'Sejarah Peradaban Islam',
    author: 'Dr. Siti Maryam',
    isbn: '978-602-3456-78-9',
    category: 'Sejarah',
    rack: 'Rak C1',
    year: 2019,
    stock: 0,
    totalStock: 8,
    condition: 'Lost',
    coverUrl: 'https://readdy.ai/api/search-image?query=Islamic%20civilization%20history%20book%20cover%20with%20elegant%20mosque%20silhouette%20and%20golden%20accents%2C%20scholarly%20academic%20design%2C%20clean%20white%20background%20with%20green%20border%2C%20educational%20publishing%20style&width=300&height=450&seq=303&orientation=portrait',
    description: 'Mengulas sejarah peradaban Islam dari masa Rasulullah SAW hingga kejayaan Abbasiyah.',
    createdAt: '2023-03-10'
  },
  {
    id: 'bk4',
    title: 'Dasar-Dasar Pemrograman Python',
    author: 'Budi Raharjo',
    isbn: '978-602-4567-89-0',
    category: 'Teknologi',
    rack: 'Rak D3',
    year: 2022,
    stock: 6,
    totalStock: 8,
    condition: 'Available',
    coverUrl: 'https://readdy.ai/api/search-image?query=Python%20programming%20textbook%20cover%20for%20Indonesian%20students%2C%20clean%20modern%20tech%20education%20design%20with%20code%20snippets%20visualization%2C%20green%20accent%20colors%2C%20academic%20computer%20science%20book%20cover&width=300&height=450&seq=304&orientation=portrait',
    description: 'Buku pembelajaran Python untuk pemula dengan contoh kasus yang relevan.',
    createdAt: '2023-04-05'
  },
  {
    id: 'bk5',
    title: 'Ekologi dan Lingkungan Hidup',
    author: 'Dr. Ir. H. Agus Suyanto',
    isbn: '978-602-5678-90-1',
    category: 'Sains',
    rack: 'Rak A3',
    year: 2023,
    stock: 3,
    totalStock: 6,
    condition: 'Damaged',
    coverUrl: 'https://readdy.ai/api/search-image?query=Ecology%20and%20environmental%20science%20book%20cover%20with%20green%20nature%20illustration%2C%20trees%20and%20earth%20design%2C%20Indonesian%20environmental%20education%20textbook%2C%20clean%20academic%20publishing%20style&width=300&height=450&seq=305&orientation=portrait',
    description: 'Pembelajaran tentang ekosistem dan pelestarian lingkungan untuk siswa MA.',
    createdAt: '2023-05-15'
  }
];