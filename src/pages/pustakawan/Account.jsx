import { useState, useEffect } from 'react';
import PustakawanLayout from '../../components/feature/DashboardLayout';

export default function Account() {
  const [email, setEmail] = useState(() => localStorage.getItem('pustakawan_email') || 'pustakawan@man2pamekasan.sch.id');
  const [userName, setUserName] = useState(() => email.split('@')[0]);
  const [phone, setPhone] = useState('081234567890');
  const [passwordForm, setPasswordForm] = useState({ old: '', new: '', confirm: '' });
  const [toast, setToast] = useState({ message: '', type: '' });

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: '' }), 3000);
  };

  const handleProfileSave = (e) => {
    e.preventDefault();
    showToast('Profil berhasil diperbarui!');
  };

  const handlePasswordSave = (e) => {
    e.preventDefault();
    if (passwordForm.new !== passwordForm.confirm) {
      showToast('Konfirmasi password baru tidak cocok!', 'error');
    } else {
      showToast('Password berhasil diubah!');
      setPasswordForm({ old: '', new: '', confirm: '' });
    }
  };

  return (
    <PustakawanLayout userName={userName}>
      <div className="p-4 md:p-8 max-w-4xl mx-auto space-y-6">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Akun Saya</h1>
          <p className="text-gray-500 mt-1">Kelola informasi profil dan keamanan akun Anda</p>
        </div>

        {toast.message && (
          <div className={`px-4 py-3 rounded-xl border flex items-center gap-2 animate-fade-in ${
            toast.type === 'error' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-emerald-50 text-emerald-600 border-emerald-100'
          }`}>
            <i className={`text-lg ${toast.type === 'error' ? 'ri-error-warning-fill' : 'ri-checkbox-circle-fill'}`} />
            <p className="text-sm font-medium">{toast.message}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Sidebar Profil (Kiri) */}
          <div className="col-span-1">
            <div className="card-base p-6 flex flex-col items-center text-center">
              <div className="w-24 h-24 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-3xl font-bold border-4 border-white shadow-lg mb-4 uppercase">
                {userName.substring(0, 2)}
              </div>
              <h2 className="font-bold text-gray-800 text-lg capitalize">{userName}</h2>
              <p className="text-sm text-gray-500 mb-2">Pustakawan Utama</p>
              <div className="bg-emerald-50 text-emerald-600 text-xs px-3 py-1 rounded-full font-medium">
                Status: Aktif
              </div>
            </div>
          </div>

          {/* Form Pengaturan (Kanan) */}
          <div className="col-span-1 lg:col-span-2 space-y-6">
            
            {/* Form Informasi Pribadi */}
            <div className="card-base p-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i className="ri-user-settings-line text-emerald-500" /> Informasi Pribadi
              </h3>
              <form onSubmit={handleProfileSave} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nama Lengkap</label>
                    <input 
                      type="text" 
                      value={userName}
                      onChange={(e) => setUserName(e.target.value)}
                      className="input-field w-full capitalize"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                    <input 
                      type="email" 
                      value={email}
                      readOnly
                      className="input-field w-full bg-gray-50 text-gray-500 cursor-not-allowed border-gray-200"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Nomor HP</label>
                    <input 
                      type="tel" 
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="input-field w-full"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button type="submit" className="btn-primary">
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>

            {/* Form Ubah Password */}
            <div className="card-base p-6">
              <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                <i className="ri-lock-password-line text-emerald-500" /> Keamanan & Password
              </h3>
              <form onSubmit={handlePasswordSave} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password Lama</label>
                  <input 
                    type="password" 
                    required
                    value={passwordForm.old}
                    onChange={(e) => setPasswordForm({...passwordForm, old: e.target.value})}
                    className="input-field w-full"
                    placeholder="Masukkan password saat ini"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Password Baru</label>
                    <input 
                      type="password" 
                      required
                      value={passwordForm.new}
                      onChange={(e) => setPasswordForm({...passwordForm, new: e.target.value})}
                      className="input-field w-full"
                      placeholder="Minimal 8 karakter"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Konfirmasi Password Baru</label>
                    <input 
                      type="password" 
                      required
                      value={passwordForm.confirm}
                      onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})}
                      className="input-field w-full"
                      placeholder="Ulangi password baru"
                    />
                  </div>
                </div>
                <div className="flex justify-end pt-2">
                  <button type="submit" className="btn-secondary">
                    Perbarui Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </PustakawanLayout>
  );
}
