import { Link } from 'react-router-dom';
import SiswaLayout from '../../components/feature/SiswaLayout';
import { clearanceRequests, studentBorrowings, studentProfile } from '../../mocks/student';

function StatusBadge({ status }) {
  if (status === 'active') return <span className="badge-info text-blue-600 bg-blue-50 px-2 py-1 rounded text-xs">Dipinjam</span>;
  if (status === 'returned') return <span className="badge-success text-green-600 bg-green-50 px-2 py-1 rounded text-xs">Dikembalikan</span>;
  if (status === 'overdue') return <span className="badge-danger text-red-600 bg-red-50 px-2 py-1 rounded text-xs">Terlambat</span>;
  return <span className="badge-neutral text-gray-600 bg-gray-50 px-2 py-1 rounded text-xs">{status}</span>;
}

export default function SiswaHome() {
  const activeLoans = studentBorrowings.filter((b) => b.status === 'active' || b.status === 'overdue');
  const returnedLoans = studentBorrowings.filter((b) => b.status === 'returned');
  const latestBorrowings = [...studentBorrowings].slice(0, 4);
  
  const hasClearanceApproved = clearanceRequests.some(
    (c) => c.nisn === studentProfile.nisn && c.status === 'approved'
  );
  const hasPendingClearance = clearanceRequests.some(
    (c) => c.nisn === studentProfile.nisn && c.status === 'pending'
  );

  return (
    <SiswaLayout>
      <div className="max-w-[1200px] mx-auto px-4 lg:px-8 py-6 lg:py-10 space-y-8">
        {/* Welcome banner */}
        <div className="card-base p-6 lg:p-8 bg-gradient-to-br from-primary-50 via-white to-blue-50/50 rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <p className="text-sm text-primary-600 font-medium mb-1">Selamat Datang</p>
              <h1 className="text-2xl lg:text-3xl font-bold text-dark-800">
                {studentProfile.name}
              </h1>
              <p className="text-dark-500 text-sm mt-1">
                {studentProfile.className} &middot; NISN: {studentProfile.nisn}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                to="/siswa/buku"
                className="bg-primary-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:bg-primary-700 transition-colors"
              >
                <i className="ri-book-open-line" />
                <span>Pinjam Buku</span>
              </Link>
              <Link
                to="/siswa/bebas-tanggungan"
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg flex items-center gap-2 text-sm hover:bg-gray-50 transition-colors"
              >
                <i className="ri-file-list-3-line" />
                <span>Surat Bebas</span>
              </Link>
            </div>
          </div>

          {/* Quick stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-6 border-t border-dark-100">
            <div className="text-center lg:text-left">
              <p className="text-2xl font-bold text-dark-800">{studentProfile.totalBorrows}</p>
              <p className="text-xs text-dark-400">Total Peminjaman</p>
            </div>
            <div className="text-center lg:text-left">
              <p className="text-2xl font-bold text-primary-600">{studentProfile.activeLoans}</p>
              <p className="text-xs text-dark-400">Buku Dipinjam</p>
            </div>
            <div className="text-center lg:text-left">
              <p className="text-2xl font-bold text-red-500">{studentProfile.overdueLoans}</p>
              <p className="text-xs text-dark-400">Terlambat</p>
            </div>
            <div className="text-center lg:text-left">
              <p className="text-2xl font-bold text-blue-500">{returnedLoans.length}</p>
              <p className="text-xs text-dark-400">Dikembalikan</p>
            </div>
          </div>
        </div>

        {/* Active loans alert */}
        {activeLoans.length > 0 && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-dark-800">Buku yang Sedang Dipinjam</h2>
              <Link to="/siswa/riwayat" className="text-sm text-primary-500 hover:text-primary-600 font-medium">
                Lihat Semua
              </Link>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeLoans.map((loan) => (
                <div
                  key={loan.id}
                  className={`bg-white rounded-xl border p-4 flex gap-4 transition-all duration-300 hover:shadow-md ${
                    loan.status === 'overdue' ? 'border-l-4 border-l-red-500' : 'border-l-4 border-l-primary-500'
                  }`}
                >
                  <img
                    src="https://placehold.co/300x400/ecfdf5/059669?text=Buku+Perpustakaan"
                    alt={loan.bookTitle}
                    className="w-20 h-28 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="font-semibold text-dark-800 text-sm line-clamp-2 leading-snug">
                        {loan.bookTitle}
                      </h3>
                      <StatusBadge status={loan.status} />
                    </div>
                    <p className="text-xs text-dark-500">{loan.author}</p>
                    <div className="mt-3 space-y-1">
                      <div className="flex items-center gap-2 text-xs">
                        <i className="ri-calendar-line text-dark-400" />
                        <span className="text-dark-500">Pinjam: {loan.borrowDate}</span>
                      </div>
                      <div className="flex items-center gap-2 text-xs">
                        <i className={`ri-time-line ${loan.status === 'overdue' ? 'text-red-500' : 'text-dark-400'}`} />
                        <span className={loan.status === 'overdue' ? 'text-red-500 font-medium' : 'text-dark-500'}>
                          Jatuh tempo: {loan.dueDate}
                        </span>
                      </div>
                      {loan.fine > 0 && (
                        <div className="flex items-center gap-2 text-xs">
                          <i className="ri-money-dollar-circle-line text-red-500" />
                          <span className="text-red-500 font-medium">
                            Denda: Rp {loan.fine.toLocaleString()}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Clearance status */}
        <div className="bg-white rounded-xl border border-gray-100 p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                <i className="ri-file-list-3-line text-xl text-blue-500" />
              </div>
              <div>
                <h3 className="font-semibold text-dark-800">Surat Bebas Tanggungan</h3>
                <p className="text-sm text-dark-500 mt-0.5">
                  {hasClearanceApproved
                    ? 'Surat bebas tanggungan Anda telah disetujui. Silakan unduh dokumen.'
                    : hasPendingClearance
                    ? 'Pengajuan surat bebas tanggungan sedang diproses.'
                    : 'Ajukan surat bebas tanggungan jika tidak ada buku yang dipinjam.'}
                </p>
              </div>
            </div>
            <Link
              to="/siswa/bebas-tanggungan"
              className={`flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                hasClearanceApproved
                  ? 'bg-primary-500 text-white hover:bg-primary-600'
                  : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {hasClearanceApproved ? (
                <>
                  <i className="ri-download-line" />
                  <span>Unduh</span>
                </>
              ) : (
                <>
                  <span>Lihat Status</span>
                  <i className="ri-arrow-right-line" />
                </>
              )}
            </Link>
          </div>
        </div>

        {/* Recent borrowing history */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-dark-800">Riwayat Peminjaman Terbaru</h2>
            <Link to="/siswa/riwayat" className="text-sm text-primary-500 hover:text-primary-600 font-medium">
              Lihat Semua
            </Link>
          </div>
          <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-xs text-dark-500 font-medium border-b border-dark-100 bg-gray-50/50">
                    <th className="py-3 pl-5">Buku</th>
                    <th className="py-3">Tanggal Pinjam</th>
                    <th className="py-3">Jatuh Tempo</th>
                    <th className="py-3 pr-5">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {latestBorrowings.map((b) => (
                    <tr key={b.id} className="border-b border-dark-50 last:border-0 hover:bg-gray-50 transition-colors">
                      <td className="py-4 pl-5">
                        <div className="flex items-center gap-3">
                          <img src="https://placehold.co/300x400/ecfdf5/059669?text=Buku+Perpustakaan" alt={b.bookTitle} className="w-10 h-14 rounded object-cover flex-shrink-0" />
                          <div className="min-w-0">
                            <p className="text-sm font-medium text-dark-800 line-clamp-1">{b.bookTitle}</p>
                            <p className="text-xs text-dark-400">{b.author}</p>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 text-sm text-dark-600">{b.borrowDate}</td>
                      <td className="py-4 text-sm text-dark-600">{b.dueDate}</td>
                      <td className="py-4 pr-5">
                        <StatusBadge status={b.status} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </SiswaLayout>
  );
}