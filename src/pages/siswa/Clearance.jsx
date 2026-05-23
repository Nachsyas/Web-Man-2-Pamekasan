import SiswaLayout from '../../components/feature/SiswaLayout';

export default function SiswaClearance() {
  return (
    <SiswaLayout>
      <div className="max-w-[800px] mx-auto px-4 lg:px-8 py-6 lg:py-10 space-y-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-dark-800">Surat Bebas Tanggungan</h1>
          <p className="text-dark-500 mt-1">
            Informasi pengajuan surat keterangan bebas tanggungan perpustakaan.
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 text-center">
          <div className="w-16 h-16 rounded-full bg-yellow-50 flex items-center justify-center mx-auto mb-4">
            <i className="ri-information-line text-2xl text-yellow-500" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-3">Informasi Penting</h3>
          <p className="text-gray-600 mb-6 max-w-lg mx-auto leading-relaxed">
            Pengajuan via sistem dinonaktifkan. Silakan temui Pustakawan langsung untuk pengecekan inventaris dan pencetakan Surat Bebas Tanggungan.
          </p>
        </div>
      </div>
    </SiswaLayout>
  );
}