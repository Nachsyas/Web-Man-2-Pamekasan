import { useEffect, useState } from 'react';
import SiswaHeader from './SiswaHeader';
import { api } from '../../services/api';

export default function SiswaLayout({
  children,
  studentName,
  nisn,
}) {
  const [profile, setProfile] = useState({
    name: studentName || localStorage.getItem('siswa_nama') || 'Ahmad Rizky',
    nisn: nisn || localStorage.getItem('siswa_nisn') || '0091234567',
  });

  useEffect(() => {
    api.getStudentDashboard()
      .then(res => {
        if (res && res.student) {
          const name = res.student.name || res.student.nama || 'Siswa';
          const id = res.student.nisn || '';
          setProfile({
            name: name,
            nisn: id,
          });
          localStorage.setItem('siswa_nama', name);
          localStorage.setItem('siswa_nisn', id);
        }
      })
      .catch(err => {
        console.error('Gagal mengambil profil siswa di layout:', err);
      });
  }, [studentName, nisn]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiswaHeader studentName={profile.name} nisn={profile.nisn} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}