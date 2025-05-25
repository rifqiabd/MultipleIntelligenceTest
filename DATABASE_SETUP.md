# Database Setup Guide for Multiple Intelligence Test

## Masalah yang Mungkin Ditemui

Aplikasi Multiple Intelligence Test mengakses tabel database di Supabase untuk menyimpan dan mengambil soal-soal tes. Namun, ada beberapa nama tabel yang digunakan dalam kode:

1. `test_questions` - Nama tabel yang benar sesuai dengan file setup SQL
2. `table_questions` - Nama yang sebelumnya digunakan dalam kode aplikasi
3. `questions` - Nama sederhana yang mungkin digunakan

Jika tabel yang sesuai tidak ditemukan, aplikasi akan menampilkan error seperti:

```
relation "public.table_questions" does not exist
```

## Solusi

### 1. Gunakan file SQL yang Sudah Disediakan

File `fix_tables.sql` telah dibuat untuk secara otomatis memperbaiki masalah tabel. File ini akan:

- Membuat tabel `test_questions` jika belum ada
- Menyiapkan semua kebijakan keamanan Row Level Security (RLS)
- Mengimpor soal-soal default jika tabel kosong
- Membuat view `all_questions` untuk kompatibilitas
- Memigrasikan data dari `table_questions` ke `test_questions` jika perlu

### 2. Langkah-langkah Setup Manual

1. Buka Supabase Dashboard
2. Pilih project Anda
3. Buka tab SQL Editor
4. Jalankan file `fix_tables.sql`

### 3. Verifikasi Setup

Setelah menjalankan file SQL:

1. Periksa tabel `test_questions` di tab Database > Tables
2. Pastikan ada data soal-soal di dalamnya
3. Periksa bahwa kebijakan RLS telah dikonfigurasi dengan benar

## File SQL yang Tersedia

- `questions_setup.sql` - Membuat struktur tabel dasar
- `import_questions.sql` - Mengimpor data soal-soal default
- `supabase_setup.sql` - Membuat tabel lain yang diperlukan aplikasi
- `fix_tables.sql` - File perbaikan otomatis untuk masalah tabel

## Batasan Supabase Free Plan

Supabase Free Plan menawarkan:

- Database PostgreSQL 500MB
- Storage 1GB
- 50MB backup
- Bandwidth 2GB
- 500.000 requests/bulan

Untuk aplikasi Multiple Intelligence Test dengan 200 pengguna:

- Sekitar 2 request per pengguna (total 400 request)
- Sekitar 500 request admin per bulan
- Total sekitar 900 request per bulan

Dengan demikian, Free Plan Supabase sangat mencukupi untuk aplikasi ini bahkan dengan jumlah pengguna yang lebih besar.

## Optimasi Database

1. **Caching**: Implementasikan caching untuk soal-soal di sisi klien
2. **Batch Operations**: Gunakan operasi batch untuk insert/update multiple
3. **Pagination**: Implementasikan pagination untuk `getTestResults()`
4. **Monitoring**: Pantau penggunaan request di dashboard Supabase
