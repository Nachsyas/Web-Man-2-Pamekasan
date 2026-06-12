import { useEffect, useState } from 'react';
import SiswaLayout from '../../components/feature/SiswaLayout';
import { api } from '../../services/api';

export default function SiswaClearance() {
  const [clearance, setClearance] = useState({ is_eligible: false, liabilities: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [isDownloading, setIsDownloading] = useState(false);
  const [printDate] = useState(() => {
    return new Date().toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  });

  const nisn = localStorage.getItem('siswa_nisn') || '0104398772';
  const name = localStorage.getItem('siswa_nama') || 'Ach. Fahri Rasuli';

  useEffect(() => {
    const fetchClearance = async () => {
      if (!nisn) return;
      setIsLoading(true);
      try {
        const res = await api.getStudentDashboard();
        if (res && res.clearance) {
          setClearance({
            is_eligible: res.clearance.is_available || false,
            liabilities: res.clearance.active_liabilities || []
          });
        } else {
          setClearance({ is_eligible: false, liabilities: [] });
        }
      } catch (err) {
        console.error('Gagal memuat data clearance:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchClearance();
  }, [nisn]);

  const activeLoans = clearance.liabilities || [];
  const isEligible = clearance.is_eligible && !isLoading;

  const handlePrint = async () => {
    if (!nisn || !isEligible) return;
    setIsDownloading(true);
    try {
      if (!window.html2pdf) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        script.crossOrigin = 'anonymous';
        
        const loadPromise = new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
        });
        document.body.appendChild(script);
        await loadPromise;
      }

      const element = document.getElementById('pdf-content');
      
      // Create a temporary container at (0,0) to allow canvas engine sizing without viewport clipping
      const container = document.createElement('div');
      container.style.position = 'fixed';
      container.style.left = '0';
      container.style.top = '0';
      container.style.width = '210mm';
      container.style.zIndex = '-9999';
      container.style.pointerEvents = 'none';
      container.style.background = 'white';
      
      const clone = element.cloneNode(true);
      clone.style.display = 'block';
      container.appendChild(clone);
      document.body.appendChild(container);

      const opt = {
        margin:       0,
        filename:     `Surat_Bebas_Perpustakaan_${nisn}.pdf`,
        image:        { type: 'jpeg', quality: 0.98 },
        html2canvas:  { 
          scale: 2, 
          useCORS: true, 
          letterRendering: true, 
          backgroundColor: '#ffffff',
          windowWidth: 1024,
          scrollX: 0,
          scrollY: 0
        },
        jsPDF:        { unit: 'mm', format: 'a4', orientation: 'portrait' }
      };

      await window.html2pdf().set(opt).from(clone).save();
      
      document.body.removeChild(container);
    } catch (err) {
      console.error('Gagal mengunduh PDF:', err);
      alert('Gagal mengunduh PDF secara otomatis. Mengalihkan ke menu cetak manual peramban...');
      window.print();
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <SiswaLayout>
      {/* CSS @media print inject to only print the official letter */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          @page {
            size: A4;
            margin: 15mm 15mm 15mm 15mm;
          }
          body {
            background: white !important;
            color: black !important;
          }
          header, footer, nav, aside, button, .no-print {
            display: none !important;
          }
          .min-h-screen, main, .max-w-\[900px\], div {
            background: transparent !important;
            box-shadow: none !important;
            border: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
          }
          .print-letter-box {
            display: block !important;
            border: none !important;
            box-shadow: none !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            background: white !important;
          }
          /* Tighten spacing specifically for print layout to force 1 page */
          .print-letter-box .space-y-8 > :not([hidden]) ~ :not([hidden]) {
            margin-top: 1.25rem !important;
          }
          .print-letter-box .space-y-4 > :not([hidden]) ~ :not([hidden]) {
            margin-top: 0.5rem !important;
          }
          .print-letter-box .pt-8 {
            padding-top: 0.5rem !important;
          }
          .print-letter-box .space-y-12 > :not([hidden]) ~ :not([hidden]),
          .print-letter-box .space-y-16 > :not([hidden]) ~ :not([hidden]) {
            margin-top: 2rem !important;
          }
        }
      `}} />

      <div className="max-w-[900px] mx-auto px-4 lg:px-8 py-6 lg:py-10 space-y-8">
        <div className="no-print">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-800">Bebas Tanggungan Perpustakaan</h1>
          <p className="text-gray-500 mt-1">
            Halaman validasi mandiri dan unduh surat bebas tanggungan perpustakaan sekolah.
          </p>
        </div>

        {isLoading ? (
          <div className="card-base text-center py-12 flex flex-col items-center justify-center gap-3 no-print">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin" />
            <p className="text-gray-500 text-sm font-medium">Memverifikasi status tanggungan Anda...</p>
          </div>
        ) : (
          <div className="space-y-6">
            {/* Banner State */}
            {isEligible ? (
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 flex-shrink-0">
                    <i className="ri-checkbox-circle-fill text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-emerald-800">Status: Bebas Tanggungan</h3>
                    <p className="text-sm text-emerald-600/90 mt-0.5">
                      Sistem memverifikasi Anda tidak memiliki buku pinjaman aktif. Anda dapat mengunduh surat bebas tanggungan dalam format PDF.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handlePrint}
                  disabled={isDownloading}
                  className="bg-emerald-600 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-bold hover:bg-emerald-700 transition-colors shadow-sm self-start sm:self-auto active:scale-95 duration-150 disabled:opacity-75 disabled:cursor-not-allowed flex-shrink-0"
                >
                  {isDownloading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Mengunduh PDF...</span>
                    </>
                  ) : (
                    <>
                      <i className="ri-file-pdf-line text-lg" />
                      <span>Unduh PDF</span>
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 no-print">
                <div className="flex gap-4">
                  <div className="w-12 h-12 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600 flex-shrink-0">
                    <i className="ri-error-warning-fill text-2xl" />
                  </div>
                  <div>
                    <h3 className="font-bold text-rose-800">Status: Belum Memenuhi Syarat</h3>
                    <p className="text-sm text-rose-600/90 mt-0.5 leading-relaxed">
                      Surat bebas tanggungan belum dapat diterbitkan. Anda terdeteksi masih memiliki <strong>{activeLoans.length} tanggungan aktif</strong>. Silakan selesaikan tanggungan Anda ke pustakawan.
                    </p>
                  </div>
                </div>
                <button
                  disabled={true}
                  className="bg-gray-400 text-white px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 text-sm font-bold shadow-sm self-start sm:self-auto cursor-not-allowed opacity-75 flex-shrink-0"
                  title="Kembalikan semua buku terlebih dahulu untuk mengaktifkan unduhan"
                >
                  <i className="ri-lock-line text-lg" />
                  <span>Unduh Dinonaktifkan</span>
                </button>
              </div>
            )}

            {/* List of Active Loans (Only for Ineligible State) */}
            {!isEligible && activeLoans.length > 0 && (
              <div className="card-base overflow-hidden p-0 no-print">
                <div className="p-5 border-b border-gray-100 bg-gray-50/50">
                  <h3 className="font-bold text-gray-800 text-sm">Daftar Tanggungan Buku (Harus Dikembalikan)</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-xs text-gray-500 font-semibold border-b border-gray-100 bg-gray-50/30">
                        <th className="py-3.5 pl-6 pr-4">Buku & Kondisi</th>
                        <th className="py-3.5 px-4">Status</th>
                        <th className="py-3.5 px-4 pr-6">Jenis Buku</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {activeLoans.map((loan) => {
                        const isLostOrDamaged = loan.status === 'belum diganti' || loan.condition === 'rusak' || loan.condition === 'hilang';
                        const statusLabel = loan.condition === 'hilang' ? 'Hilang' : loan.condition === 'rusak' ? 'Rusak' : 'Belum Kembali';
                        const derivedCategory = loan.category || (loan.book_title && (
                          loan.book_title.toLowerCase().includes('kelas') || 
                          loan.book_title.toLowerCase().includes('pelajaran') ||
                          loan.book_title.toLowerCase().includes('inggris') || 
                          loan.book_title.toLowerCase().includes('indonesia')
                        ) ? 'Paket' : 'Reguler');

                        return (
                          <tr key={loan.id} className="hover:bg-gray-50/30 transition-colors">
                            <td className="py-4 pl-6 pr-4">
                              <div>
                                <p className="text-sm font-semibold text-gray-800 leading-snug">{loan.book_title}</p>
                                <p className="text-xs text-amber-600 font-medium mt-0.5">
                                  {loan.description || (isLostOrDamaged ? `Buku ${statusLabel.toLowerCase()} - harap selesaikan penggantian ke pustakawan` : 'Buku sedang dipinjam')}
                                </p>
                              </div>
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-600 font-medium">
                              <span className={`px-2.5 py-0.5 rounded text-xs font-semibold capitalize ${
                                isLostOrDamaged ? 'bg-red-50 text-red-600 border border-red-100' : 'bg-blue-50 text-blue-600 border border-blue-100'
                              }`}>
                                {statusLabel}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-sm text-gray-700 font-medium capitalize">{derivedCategory}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Guide Info Box */}
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5 text-amber-800 text-sm leading-relaxed no-print flex gap-3.5">
              <i className="ri-information-line text-xl text-amber-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-900">Petunjuk Penyimpanan PDF (Pas 1 Halaman):</p>
                <ul className="list-disc list-inside mt-1.5 space-y-1.5 text-[13px] font-medium">
                  {isEligible ? (
                    <li>Klik tombol <strong>Unduh PDF</strong> di atas untuk langsung mengunduh berkas surat bebas tanggungan secara otomatis.</li>
                  ) : (
                    <li className="text-rose-700 font-bold">Kembalikan terlebih dahulu semua buku tanggungan Anda ke petugas perpustakaan agar tombol <strong>Unduh PDF</strong> aktif.</li>
                  )}
                  <li>Sistem akan menyusun surat secara presisi pada satu halaman A4 yang bersih dan rapi.</li>
                </ul>
              </div>
            </div>

            {/* Preview Label */}
            <div className="flex items-center justify-between no-print pt-2">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                {isEligible ? 'Preview Surat Bebas Tanggungan' : 'Draf Preview Surat Bebas Tanggungan'}
              </span>
              <span className="text-xs text-gray-400">
                {isEligible ? 'Tampilan resmi surat keterangan yang akan diunduh' : 'Unduh dinonaktifkan karena Anda masih memiliki tanggungan'}
              </span>
            </div>

            {/* Preview & Print Container */}
            <div className="print-letter-box bg-white border border-gray-200 shadow-md rounded-2xl max-w-[850px] mx-auto text-black overflow-x-auto p-4 md:p-8">
              <div id="pdf-content" style={{ width: '210mm', minHeight: '297mm', boxSizing: 'border-box' }} className="bg-white p-[20mm] text-black font-serif leading-relaxed mx-auto relative">
                
                {/* Draf Watermark Overlay (Only for Ineligible State) */}
                {!isEligible && (
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none select-none overflow-hidden z-10 opacity-[0.08]">
                    <span className="text-rose-900 border-8 border-rose-900 font-extrabold text-7xl uppercase tracking-widest px-8 py-4 rounded-3xl transform -rotate-12">
                      DRAF / NON-AKTIF
                    </span>
                  </div>
                )}

                <div className="space-y-8">
                  {/* Kop Surat Madrasah */}
                  <div className="flex items-center border-b-4 border-double border-black pb-4 gap-4">
                    <img
                      src="/logo-kemenag.png"
                      alt="Logo Kemenag"
                      className="w-16 h-16 md:w-20 md:h-20 object-contain flex-shrink-0"
                    />
                    <div className="text-center flex-1">
                      <h4 className="font-extrabold text-[10px] md:text-xs uppercase tracking-wider text-black">Kementerian Agama Republik Indonesia</h4>
                      <h3 className="font-black text-xs md:text-lg uppercase tracking-wide text-black font-serif">Madrasah Aliyah Negeri 2 Pamekasan</h3>
                      <p className="text-[8px] md:text-xs text-black mt-1 font-semibold leading-relaxed">
                        Jl. KH. Wachid Hasyim No. 45, Pamekasan, Madura<br />
                        Telepon: (0324) 321456 &middot; Email: perpustakaan@man2pamekasan.sch.id
                      </p>
                    </div>
                    {/* Mirror spacer */}
                    <div className="w-16 h-16 md:w-20 md:h-20 flex-shrink-0 invisible" />
                  </div>

                  {/* Judul Surat */}
                  <div className="text-center space-y-1">
                    <h2 className="font-black text-sm md:text-lg text-black uppercase underline tracking-wide font-serif">Surat Keterangan Bebas Perpustakaan</h2>
                    <p className="text-[10px] md:text-sm font-mono text-black font-semibold">Nomor: B-{nisn.slice(-4)}/Ma.13.26.2/PP.00.6/06/2026</p>
                  </div>

                  {/* Isi Pengantar */}
                  <div className="text-xs md:text-sm text-black leading-relaxed space-y-4 font-medium">
                    <p>Yang bertanda tangan di bawah ini, Kepala Perpustakaan Madrasah Aliyah Negeri (MAN) 2 Pamekasan menerangkan bahwa:</p>
                    
                    <div className="grid grid-cols-[100px_10px_1fr] md:grid-cols-[150px_10px_1fr] gap-y-2 px-4 md:px-6 py-1">
                      <span className="font-bold">Nama Lengkap</span>
                      <span>:</span>
                      <span className="font-bold text-black uppercase">{name}</span>

                      <span className="font-bold">NISN Siswa</span>
                      <span>:</span>
                      <span className="font-mono font-bold">{nisn}</span>

                      <span className="font-bold">Status Layanan</span>
                      <span>:</span>
                      {isEligible ? (
                        <span className="font-bold text-emerald-700">BEBAS TANGGUNGAN PERPUSTAKAAN</span>
                      ) : (
                        <span className="font-bold text-rose-700">BELUM BEBAS TANGGUNGAN PERPUSTAKAAN</span>
                      )}
                    </div>

                    <p className="text-justify indent-8 leading-relaxed">
                      Berdasarkan hasil verifikasi sistem inventarisasi data sirkulasi Perpustakaan MAN 2 Pamekasan terhitung tanggal <strong>{printDate}</strong>, siswa yang bersangkutan dinyatakan <strong>{isEligible ? 'TIDAK MEMILIKI TANGGUNGAN' : 'MASIH MEMILIKI TANGGUNGAN'}</strong> baik berupa peminjaman buku paket pelajaran, buku reguler sastra referensi, maupun keterlambatan denda administrasi perpustakaan.
                    </p>

                    <p className="text-justify indent-8 leading-relaxed">
                      Demikian surat keterangan bebas tanggungan perpustakaan ini diterbitkan secara mandiri oleh sistem untuk dipergunakan sebagaimana mestinya sebagai syarat kelulusan/pengambilan ijazah/keperluan administrasi akademik lainnya.
                    </p>
                  </div>

                  {/* Tanda Tangan */}
                  <div className="flex justify-end pt-8">
                    <div className="text-center space-y-12 md:space-y-16 w-48 md:w-64 text-xs md:text-sm text-black">
                      <div>
                        <p className="font-medium">Pamekasan, {printDate}</p>
                        <p className="font-bold mt-0.5">Kepala Perpustakaan,</p>
                      </div>
                      <div>
                        <p className="font-bold underline text-black">Ibu Siti Aminah, S.Pd.</p>
                        <p className="text-[10px] md:text-xs text-gray-600 font-semibold font-mono mt-0.5">NIP. 19780512 200501 2 003</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) }
      </div>
    </SiswaLayout>
  );
}