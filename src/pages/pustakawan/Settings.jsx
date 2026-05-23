import { useState } from 'react';
import PustakawanLayout from '../../components/feature/DashboardLayout';
import { categoriesList, racksList, systemSettings } from '../../mocks/system';

export default function Settings() {
  const [settings, setSettings] = useState(systemSettings);
  const [categories, setCategories] = useState(categoriesList);
  const [racks, setRacks] = useState(racksList);
  const [newCategory, setNewCategory] = useState('');
  const [newRack, setNewRack] = useState('');
  const [activeTab, setActiveTab] = useState('categories');
  const [toast, setToast] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(0);

  const saveSettings = () => {
    setToast('Pengaturan berhasil disimpan');
    setTimeout(() => setToast(''), 3000);
  };

  const addCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
      setCategories(prev => [...prev, newCategory.trim()]);
      setNewCategory('');
      setToast('Kategori berhasil ditambahkan');
      setTimeout(() => setToast(''), 3000);
    }
  };

  const removeCategory = (cat) => {
    setCategories(prev => prev.filter(c => c !== cat));
  };

  const addRack = () => {
    if (newRack.trim() && !racks.includes(newRack.trim())) {
      setRacks(prev => [...prev, newRack.trim()]);
      setNewRack('');
      setToast('Rak berhasil ditambahkan');
      setTimeout(() => setToast(''), 3000);
    }
  };

  const removeRack = (rack) => {
    setRacks(prev => prev.filter(r => r !== rack));
  };

  const changePassword = () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      setToast('Semua field password wajib diisi');
      setTimeout(() => setToast(''), 3000);
      return;
    }
    if (newPassword !== confirmPassword) {
      setToast('Password baru dan konfirmasi tidak cocok');
      setTimeout(() => setToast(''), 3000);
      return;
    }
    if (newPassword.length < 8) {
      setToast('Password minimal 8 karakter');
      setTimeout(() => setToast(''), 3000);
      return;
    }
    setToast('Password berhasil diubah');
    setOldPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setPasswordStrength(0);
    setTimeout(() => setToast(''), 3000);
  };

  const checkStrength = (pwd) => {
    let strength = 0;
    if (pwd.length >= 8) strength++;
    if (/[A-Z]/.test(pwd)) strength++;
    if (/[0-9]/.test(pwd)) strength++;
    if (/[^A-Za-z0-9]/.test(pwd)) strength++;
    setPasswordStrength(strength);
  };

  const strengthLabels = ['Lemah', 'Sedang', 'Kuat', 'Sangat Kuat'];
  const strengthColors = ['bg-red-500', 'bg-yellow-500', 'bg-blue-500', 'bg-green-500'];

  return (
    <PustakawanLayout userName="Ibu Siti Aminah, S.Pd." userNisn="Pustakawan">
      <div className="p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Pengaturan Sistem</h1>
          <p className="text-gray-500 mt-1">Konfigurasi perpustakaan dan akun</p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl w-fit">
          {[
            { id: 'categories', label: 'Kategori', icon: 'ri-bookmark-line' },
            { id: 'racks', label: 'Rak', icon: 'ri-archive-line' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-white text-gray-800 shadow-sm'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <i className={tab.icon} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content based on ActiveTab (Forms setting dll) */}
      </div>
    </PustakawanLayout>
  );
}