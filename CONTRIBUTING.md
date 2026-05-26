# 🚀 Panduan Alur Kerja Git & GitHub untuk Tim

Halo Tim! Mengingat waktu pengerjaan kita yang sangat singkat (1 bulan) dengan 9 orang developer yang bekerja secara paralel, kita wajib mematuhi standar alur kerja Git ini agar kode tidak saling menimpa.

**⚠️ ATURAN MUTLAK: Dilarang keras melakukan push langsung ke branch `main` atau `dev`. Semua integrasi kode wajib melalui jalur Pull Request (PR)!**

## 🗺️ Alur Kerja Singkat (Git Flow)

`[Pusat: dev] ──> Tarik ke Lokal ──> Buat Branch Tugas ──> Ngoding & Commit ──> Tarik dev (Cek Konflik) ──> Push ke Branch Sendiri ──> Buka PR ke dev`

---

## 🌟 Fase 1: Memulai Tugas Baru

Sebelum menulis satu baris kode pun, pastikan kode di lokal komputer Anda adalah versi yang paling mutakhir dari branch integrasi pusat (`dev`).

1. **Pindah ke branch pusat:**
   ```bash
   git checkout dev
   ```

2. **Tarik kode terbaru dari GitHub:**
   ```bash
   git pull origin dev
   ```
   *(Pastikan tidak ada error. Jika muncul pesan "Already up to date", lanjut ke langkah 3).*

3. **Buat branch baru khusus untuk tugas Anda:**
   Gunakan format penamaan: `<tipe>/<nomor-issue>-<nama-singkat-tugas>`.
   ```bash
   git checkout -b feat/2-api-login
   ```
   *(Perintah `-b` akan otomatis membuat branch baru sekaligus memindahkan Anda ke branch tersebut).*

---

## 💻 Fase 2: Pengerjaan & Commit Berkala

Lakukan pengerjaan tugas di branch Anda sendiri. Lakukan commit secara berkala setiap kali selesai mengerjakan satu fungsi kecil (jangan menunggu semua selesai baru di-commit).

4. **Cek status file apa saja yang berubah:**
   ```bash
   git status
   ```

5. **Masukkan file yang diubah ke staging area:**
   ```bash
   git add .
   ```

6. **Simpan dengan pesan commit baku:**
   ```bash
   git commit -m "feat(auth): menyelesaikan logika endpoint login"
   ```

### 📌 Standar Pesan Commit (Wajib Dipakai)

* **`feat:`** ➔ Membuat fitur baru atau halaman baru.
* **`fix:`** ➔ Memperbaiki bug atau error.
* **`ui:`** ➔ Slicing tampilan antarmuka (belum ada logika data).
* **`docs:`** ➔ Membuat/mengubah dokumentasi (README, ERD, kontrak API).
* **`chore:`** ➔ Konfigurasi proyek atau update package/library.

---

## 🔄 Fase 3: Mencegah Konflik Sebelum Push

Ini adalah langkah paling krusial agar kode Anda tidak bentrok (*merge conflict*) dengan kode teman lain yang mungkin baru saja di-merge ke `dev`.

7. **Tarik pembaruan terakhir dari `dev` ke branch Anda saat ini:**
   ```bash
   git pull origin dev
   ```

* **🟢 Skenario A (Aman):** Muncul pesan *Already up to date* atau proses merge otomatis berjalan lancar ➔ Lanjut ke Fase 4.
* **🔴 Skenario B (Ada Konflik):** Muncul tulisan *MERGE CONFLICT*. Buka VS Code/Editor Anda, cari file yang merah, lalu pilih kode mana yang benar (*Accept Current* atau *Accept Incoming*). Setelah file disimpan, jalankan:
  ```bash
  git add .
  git commit -m "chore: menyelesaikan merge conflict dengan dev"
  ```

---

## 🚀 Fase 4: Mengirim Kode & Membuka PR

Setelah file dipastikan aman dan bisa berjalan di komputer lokal, kirim kode Anda untuk di-review.

8. **Push branch tugas Anda ke GitHub:**
   ```bash
   git push origin feat/2-api-login
   ```
   *(Ingat: Lakukan push ke nama branch Anda sendiri, bukan ke origin dev).*

9. **Ajukan Pull Request (PR) di GitHub:**
   * Buka halaman repositori kita di web GitHub.
   * Klik tombol hijau/kuning **"Compare & pull request"** yang muncul di bagian atas.
   * Pastikan arah panah target penggabungan sudah benar: `base: dev ⬅️ compare: feat/2-api-login`.
   * **Wajib di Deskripsi PR:** Tuliskan kata kunci `Closes #<nomor-issue>` (Contoh: `Closes #2`). Ini berfungsi agar kartu tugas di GitHub Projects otomatis bergeser ke kolom *Done* saat disetujui.
   * Klik **Create pull request** dan infokan ke grup agar PM/Lead melakukan code review.

---

## 🧹 Fase 5: Pembersihan & Ambil Tugas Baru

Jika PR Anda sudah disetujui (Approved) dan digabungkan ke `dev` oleh PM, tugas Anda di branch tersebut telah selesai. Rapikan Git lokal Anda sebelum mengambil tugas baru.

10. **Kembali ke branch pusat:**
    ```bash
    git checkout dev
    ```

11. **Tarik hasil gabungan kode terbaru:**
    ```bash
    git pull origin dev
    ```

12. **Hapus branch tugas lama di komputer lokal Anda agar tetap rapi:**
    ```bash
    git branch -d feat/2-api-login
    ```
