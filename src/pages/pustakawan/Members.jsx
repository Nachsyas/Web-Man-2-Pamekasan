import { useMemo, useState } from 'react';
import PustakawanLayout from '../../components/feature/DashboardLayout';
import { allMembers, visitorLogs, allBorrowingTransactions } from '../../mocks/system';


function StatusBadge({ activeLoans }) {
  const isReturned = activeLoans === 0;
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold border ${isReturned ? 'bg-green-50 text-green-600 border-green-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
      {isReturned ? <i className="ri-check-line mr-1" /> : <i className="ri-error-warning-line mr-1" />}
      {isReturned ? 'Sudah Dikembalikan' : 'Belum Mengembalikan'}
    </span>
  );
}

export default function Members() {
  const [members, setMembers] = useState(allMembers);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const [showAdd, setShowAdd] = useState(false);
  const [newMember, setNewMember] = useState({ nisn: '', name: '', email: '' });
  const [toast, setToast] = useState('');
  
  const [searchSiswa, setSearchSiswa] = useState('');
  const [selectedStudent, setSelectedStudent] = useState(null);

  const mockSchoolStudents = useMemo(() => [
    { nisn: '0011223344', name: 'Zahra Aulia', className: 'X-IPA-1' },
    { nisn: '0022334455', name: 'Rafi Ramadhan', className: 'X-IPS-2' },
    { nisn: '0033445566', name: 'Nisa Sabyan', className: 'XI-MIPA-1' },
    { nisn: '0044556677', name: 'Arif Hidayat', className: 'XII-IPS-1' }
  ], []);

  const filteredSchoolStudents = useMemo(() => {
    if (!searchSiswa) return [];
    return mockSchoolStudents.filter(s => s.nisn.includes(searchSiswa));
  }, [searchSiswa, mockSchoolStudents]);

  const handleSelectStudent = (student) => {
    setSelectedStudent(student);
    setSearchSiswa(student.nisn);
    setNewMember({ ...newMember, nisn: student.nisn, name: student.name });
  };

  const visitors = visitorLogs;

  const filtered = useMemo(() => {
    return members.filter(m => {
      const q = search.toLowerCase();
      const matchSearch = !q || m.name.toLowerCase().includes(q) || m.nisn.includes(q);
      const mStatus = m.activeLoans === 0 ? 'Returned' : 'NotReturned';
      const matchStatus = !statusFilter || mStatus === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [members, search, statusFilter]);

  const stats = useMemo(() => {
    const today = '2026-05-13';
    return {
      total: members.length,
      activeToday: visitors.filter(v => v.date === today).length,
      newThisMonth: members.filter(m => m.joinedAt.startsWith('2026-05')).length,
      overdue: members.filter(m => m.activeLoans > 0).length,
    };
  }, [members, visitors]);

  const addMember = () => {
    if (!newMember.nisn || !newMember.name) {
      setToast('NISN dan Nama wajib diisi');
      setTimeout(() => setToast(''), 3000);
      return;
    }
    const member = {
      id: Math.random().toString(36).slice(2),
      ...newMember,
      status: 'Active',
      totalBorrows: 0,
      activeLoans: 0,
      joinedAt: new Date().toISOString().split('T')[0],
    };
    setMembers(prev => [member, ...prev]);
    setShowAdd(false);
    setNewMember({ nisn: '', name: '', email: '' });
    setSearchSiswa('');
    setSelectedStudent(null);
    setToast('Siswa berhasil ditambahkan');
    setTimeout(() => setToast(''), 3000);
  };

  return (
    <PustakawanLayout userName="Ibu Siti Aminah, S.Pd." userNisn="Pustakawan">
      <div className="page-container space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Manajemen Siswa</h1>
            <p className="text-gray-500 mt-1">Data siswa perpustakaan dan kunjungan harian</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => setShowAdd(true)} className="btn-primary">
              <i className="ri-user-add-line" /> Tambah Siswa
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Siswa', value: stats.total, icon: 'ri-team-line', color: 'text-green-600 bg-green-50' },
            { label: 'Kunjungan Hari Ini', value: stats.activeToday, icon: 'ri-user-follow-line', color: 'text-emerald-600 bg-emerald-50' },
            { label: 'Baru Bulan Ini', value: stats.newThisMonth, icon: 'ri-user-received-line', color: 'text-blue-600 bg-blue-50' },
            { label: 'Belum Mengembalikan', value: stats.overdue, icon: 'ri-book-read-line', color: 'text-red-600 bg-red-50' },
          ].map((s, i) => (
            <div key={i} className="card-base flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${s.color}`}>
                <i className={`${s.icon} text-2xl`} />
              </div>
              <div>
                <p className="text-xs text-gray-500 font-medium">{s.label}</p>
                <p className="text-xl font-bold text-gray-800">{s.value}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="card-base">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1 relative">
              <i className="ri-search-line absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Cari nama atau NISN..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="input-field w-full pl-11"
              />
            </div>

            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="input-field lg:w-48">
              <option value="">Semua Status</option>
              <option value="Returned">Sudah Dikembalikan</option>
              <option value="NotReturned">Belum Mengembalikan</option>
            </select>
          </div>
        </div>

        {/* Tabel Data Anggota */}
        <div className="card-base overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-left text-xs font-semibold text-gray-500 bg-gray-50 border-b border-gray-100">
                  <th className="py-4 whitespace-nowrap pl-6 pr-4">NISN</th>
                  <th className="py-4 whitespace-nowrap px-4">Nama</th>
                  <th className="py-4 whitespace-nowrap px-4 text-center">Status</th>
                  <th className="py-4 whitespace-nowrap px-4 text-center">
                    <div className="flex flex-col items-center gap-1">
                      <span>Total Pinjam</span>
                      <div className="flex items-center gap-2 text-[10px] text-gray-500 font-medium bg-gray-100 px-2 py-0.5 rounded-full">
                        <span className="text-indigo-500">Paket</span>
                        <span className="w-px h-3 bg-gray-300"></span>
                        <span className="text-emerald-500">Reguler</span>
                      </div>
                    </div>
                  </th>
                  <th className="py-4 whitespace-nowrap pr-6 pl-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filtered.map(member => (
                  <tr key={member.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 whitespace-nowrap pl-6 pr-4 text-sm font-mono text-gray-600">{member.nisn}</td>
                    <td className="py-3 whitespace-nowrap px-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center flex-shrink-0">
                          <i className="ri-user-line text-emerald-600 text-sm" />
                        </div>
                        <span className="text-sm font-medium text-gray-800">{member.name}</span>
                      </div>
                    </td>
                    <td className="py-3 whitespace-nowrap px-4 text-center"><StatusBadge activeLoans={member.activeLoans} /></td>
                    <td className="py-3 whitespace-nowrap px-4">
                      <div className="flex flex-col items-center justify-center gap-1">
                        <span className="text-sm font-bold text-gray-800">{member.totalBorrows}</span>
                        <div className="flex items-center gap-2 text-[11px] font-bold bg-gray-50 px-2 py-0.5 rounded-md border border-gray-200">
                          <span className="text-indigo-600" title="Buku Paket">{member.paketBorrows}</span>
                          <span className="w-px h-3 bg-gray-300"></span>
                          <span className="text-emerald-600" title="Buku Reguler">{member.regulerBorrows}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 whitespace-nowrap pr-6 pl-4 text-right">
                      <button className="w-8 h-8 rounded-lg hover:bg-emerald-50 text-emerald-600 flex items-center justify-center ml-auto transition-colors">
                        <i className="ri-eye-line" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
            {/* Log Peminjaman & Pengembalian */}
            <div className="card-base overflow-hidden p-0">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">Log Peminjaman & Pengembalian</h3>
              </div>
              <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-semibold text-gray-500 bg-gray-50 border-b border-gray-100 sticky top-0">
                      <th className="py-3 whitespace-nowrap pl-6 px-4">Nama Siswa</th>
                      <th className="py-3 whitespace-nowrap px-4">Buku</th>
                      <th className="py-3 whitespace-nowrap px-4">Tgl Pinjam</th>
                      <th className="py-3 whitespace-nowrap pr-6 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {allBorrowingTransactions.slice(0, 10).map(trx => (
                      <tr key={trx.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 whitespace-nowrap pl-6 px-4 text-sm font-medium text-gray-800">{trx.memberName}</td>
                        <td className="py-3 whitespace-nowrap px-4 text-sm text-gray-600 truncate max-w-[150px]">{trx.books.join(', ')}</td>
                        <td className="py-3 whitespace-nowrap px-4 text-sm text-gray-500">{trx.borrowDate}</td>
                        <td className="py-3 whitespace-nowrap pr-6 text-right text-xs">
                          {trx.status === 'Returned' ? (
                              <span className="text-emerald-600 font-semibold">Dikembalikan</span>
                          ) : (
                              <span className="text-amber-600 font-semibold">Dipinjam</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Log Pengunjung */}
            <div className="card-base overflow-hidden p-0">
              <div className="p-5 border-b border-gray-100 flex items-center justify-between">
                <h3 className="font-semibold text-gray-800">Log Pengunjung</h3>
                <span className="text-xs text-gray-500">{visitors.filter(v => v.date === '2026-05-13').length} hari ini</span>
              </div>
              <div className="overflow-x-auto max-h-[400px] overflow-y-auto">
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-xs font-semibold text-gray-500 bg-gray-50 border-b border-gray-100 sticky top-0">
                      <th className="py-3 whitespace-nowrap pl-6 px-4">Tanggal</th>
                      <th className="py-3 whitespace-nowrap px-4">Jam</th>
                      <th className="py-3 whitespace-nowrap px-4">NISN</th>
                      <th className="py-3 whitespace-nowrap pr-6 text-right">Nama</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {visitors.filter(v => v.date === '2026-05-13').map(visitor => (
                      <tr key={visitor.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="py-3 whitespace-nowrap pl-6 px-4 text-sm text-gray-500">{visitor.date}</td>
                        <td className="py-3 whitespace-nowrap px-4 text-sm text-gray-500">{visitor.checkInTime}</td>
                        <td className="py-3 whitespace-nowrap px-4 text-sm font-mono text-gray-600">{visitor.nisn}</td>
                        <td className="py-3 whitespace-nowrap pr-6 text-sm font-medium text-gray-800 text-right">{visitor.name}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
        </div>

        {/* Modal Tambah Siswa */}
        {showAdd && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm transition-all duration-300">
                <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl animate-fade-in overflow-hidden border border-emerald-100">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <div className="flex items-center gap-3">
                           <div className="w-10 h-10 bg-white border border-emerald-200 rounded-xl flex items-center justify-center shadow-sm">
                              <i className="ri-user-add-fill text-emerald-600 text-xl" />
                           </div>
                           <div>
                              <h2 className="text-lg font-bold text-gray-800 leading-tight">Tambah Siswa</h2>
                              <p className="text-xs text-gray-500">Input data siswa perpustakaan baru</p>
                           </div>
                        </div>
                        <button onClick={() => setShowAdd(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-500 hover:bg-red-50 hover:text-red-500 transition-colors"><i className="ri-close-line text-xl" /></button>
                    </div>

                    <div className="p-6 space-y-4 bg-white min-h-[300px]">
                        <div className="relative">
                            <label className="block text-sm font-bold text-gray-700 mb-1">Pencarian NISN Siswa</label>
                            <div className="relative">
                                <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input 
                                    type="text" 
                                    value={searchSiswa} 
                                    onChange={e => {
                                        setSearchSiswa(e.target.value);
                                        setSelectedStudent(null);
                                        setNewMember({...newMember, nisn: e.target.value, name: ''});
                                    }} 
                                    placeholder="Ketik NISN siswa baru..."
                                    className="input-field w-full pl-10" 
                                />
                            </div>
                            {/* Dropdown Hasil Pencarian Siswa */}
                            {searchSiswa && !selectedStudent && filteredSchoolStudents.length > 0 && (
                                <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg max-h-48 overflow-y-auto">
                                    {filteredSchoolStudents.map(m => (
                                        <button 
                                            key={m.nisn} 
                                            onClick={() => handleSelectStudent(m)}
                                            className="w-full text-left px-4 py-2 hover:bg-emerald-50 hover:text-emerald-700 text-sm transition-colors border-b border-gray-50 last:border-0"
                                        >
                                            <div className="font-semibold text-emerald-700">{m.nisn}</div>
                                            <div className="text-sm text-gray-800">{m.name}</div>
                                            <div className="text-xs text-gray-500">Kelas: {m.className}</div>
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Nama Siswa (Autofill)</label>
                            <input 
                                type="text" 
                                value={newMember.name} 
                                readOnly 
                                placeholder="Nama siswa akan terisi otomatis"
                                className="input-field w-full bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200" 
                            />
                        </div>
                    </div>

                    <div className="p-5 border-t border-gray-100 flex justify-end gap-3 bg-gray-50/80">
                        <button onClick={() => setShowAdd(false)} className="px-6 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-bold hover:bg-gray-100 transition-colors text-sm bg-white shadow-sm">Batal</button>
                        <button onClick={addMember} className="px-8 py-2.5 rounded-xl bg-emerald-500 text-white font-bold hover:bg-emerald-600 hover:shadow-md active:scale-95 transition-all duration-200 text-sm shadow-sm border border-emerald-600 flex items-center gap-2">
                            <i className="ri-save-3-line" /> Simpan
                        </button>
                    </div>
                </div>
            </div>
        )}

        {/* Toast Notifikasi */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-50 bg-gray-900 text-white px-5 py-3.5 rounded-xl shadow-xl text-sm flex items-center gap-3 animate-fade-in">
            <i className="ri-checkbox-circle-fill text-emerald-400 text-lg" />
            <span className="font-medium">{toast}</span>
          </div>
        )}
      </div>
    </PustakawanLayout>
  );
}