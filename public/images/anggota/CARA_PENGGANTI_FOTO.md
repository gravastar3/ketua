# 📸 Cara Mengganti Foto Anggota

## 📁 Struktur Folder
```
/home/z/my-project/public/images/
├── anggota/
│   ├── anggota1.jpg  ← Foto Anggota 1 (Ketua Kelompok)
│   ├── anggota2.jpg  ← Foto Anggota 2 (Analis Data)
│   ├── anggota3.jpg  ← Foto Anggota 3 (Programmer)
│   └── anggota4.jpg  ← Foto Anggota 4 (Editor & UI/UX)
└── default-avatar.svg ← Default avatar jika foto tidak ada
```

## 📝 Cara Mengganti Foto

### Opsi 1: Lokal Folder
1. Siapkan foto anggota dengan format:
   - **Format**: JPG, PNG, atau WebP
   - **Ukuran**: Recommended 200x200px (square)
   - **Kualitas**: Medium-High untuk kualitas baik

2. Letakkan foto di folder `/public/images/anggota/`:
   ```bash
   # Contoh untuk anggota 1
   cp /path/to/anggota1.jpg /home/z/my-project/public/images/anggota/anggota1.jpg
   ```

3. Pastikan nama file sesuai:
   - `anggota1.jpg` - Ketua Kelompok
   - `anggota2.jpg` - Analis Data  
   - `anggota3.jpg` - Programmer
   - `anggota4.jpg` - Editor & UI/UX

### Opsi 2: URL Eksternal
Edit file `/src/components/about/AboutProject.tsx` dan ubah path foto:
```typescript
{ 
  id: '1', 
  name: 'Nama Lengkap', 
  role: 'Ketua Kelompok', 
  nim: '1234567890',
  photo: 'https://example.com/photo.jpg', // ← Ganti dengan URL foto
  email: 'email@universitas.ac.id'
}
```

## 🎨 Desain Foto
- **Background**: Disarankan solid atau gradient yang tidak terlalu mencolok
- **Pose**: Professional, formal, atau casual yang tetap sopan
- **Cahaya**: Terang, wajah jelas terlihat
- **Kualitas**: Tidak blur atau pixelated

## ⚙️ Konfigurasi Tambahan

### Mengubah Nama Anggota
Edit data di dalam komponen `AboutProject.tsx`:
```typescript
const [teamMembers, setTeamMembers] = useState<TeamMember[]>([
  { 
    id: '1', 
    name: 'John Doe', // ← Ganti dengan nama lengkap
    role: 'Ketua Kelompok', 
    nim: '1234567890', // ← Ganti dengan NIM
    photo: '/images/anggota/anggota1.jpg',
    email: 'john.doe@universitas.ac.id' // ← Ganti dengan email
  },
  // ... anggota lainnya
])
```

### Mengubah Peran
Peran yang tersedia:
- **Ketua Kelompok** - Warna pink-purple
- **Analis Data** - Warna purple-blue  
- **Programmer** - Warna blue-green
- **Editor & UI/UX** - Warna green-yellow

## 🚀 Troubleshooting

### Foto Tidak Muncul
1. Pastikan file ada di folder yang benar
2. Periksa spelling nama file (case-sensitive)
3. Refresh browser (Ctrl+F5)
4. Cek console browser untuk error

### Foto Error
- Jika foto gagal dimuat, akan muncul default avatar dengan ikon kamera
- Badge "📷 Foto belum tersedia" akan ditampilkan
- Tidak akan error, website tetap berfungsi normal

### Format Tidak Didukung
- Gunakan format yang didukung: JPG, PNG, WebP
- Convert foto ke format yang didukung jika perlu
- Gunakan tools online seperti convertio.co untuk konversi

## 📱 Responsive Design
- Foto akan tampil dengan baik di semua ukuran layar
- Mobile: Grid 2x2 untuk 4 anggota
- Desktop: Grid 2x2 yang lebih besar
- Semua card memiliki tinggi yang sama (h-full)

## ✅ Checklist Sebelum Presentasi
- [ ] Semua foto anggota sudah diupload
- [ ] Nama dan NIM sudah benar
- [ ] Email sudah valid (jika digunakan)
- [ ] Foto terlihat jelas dan profesional
- [ ] Tidak ada error di console browser
- [ ] Responsive design terlihat baik di mobile dan desktop

## 🎨 Tips Tambahan
- Gunakan foto yang konsisten gayanya (semua formal atau semua casual)
- Pastikan background foto netral agar tidak bentrok dengan UI
- Jika tidak ada foto, default avatar sudah cukup profesional
- Website akan tetap berfungsi dengan baik tanpa foto asli