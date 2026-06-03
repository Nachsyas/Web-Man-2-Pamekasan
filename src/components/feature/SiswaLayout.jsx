import SiswaHeader from './SiswaHeader';

export default function SiswaLayout({
  children,
  studentName,
  nisn,
}) {
  const currentStudentName = studentName || localStorage.getItem('siswa_nama') || 'Ahmad Rizky';
  const currentNisn = nisn || localStorage.getItem('siswa_nisn') || '0091234567';

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiswaHeader studentName={currentStudentName} nisn={currentNisn} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}