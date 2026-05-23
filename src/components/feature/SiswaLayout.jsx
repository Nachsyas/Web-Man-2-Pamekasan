import SiswaHeader from './SiswaHeader';

export default function SiswaLayout({
  children,
  studentName = 'Ahmad Rizky',
  nisn = '0091234567',
}) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <SiswaHeader studentName={studentName} nisn={nisn} />
      <main className="flex-1">
        {children}
      </main>
    </div>
  );
}