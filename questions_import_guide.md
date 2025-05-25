# Panduan Import Data Soal ke Supabase

## Menggunakan SQL Editor di Supabase

### Metode 1: Import SQL Langsung

1. Login ke dashboard Supabase
2. Pilih project Anda
3. Klik "SQL Editor" di sidebar kiri
4. Klik "New Query"
5. Buka file `questions_setup.sql` dan copy-paste seluruh isinya
6. Klik "Run" untuk membuat tabel `test_questions` dan menambahkan kebijakan keamanan
7. Buka file `import_questions.sql` dan copy-paste seluruh isinya
8. Klik "Run" untuk mengimpor semua soal ke database

### Metode 2: Import via Table Editor dan File JSON

1. Pastikan tabel `test_questions` sudah dibuat (menggunakan `questions_setup.sql`)
2. Di dashboard Supabase, pilih "Table Editor" di sidebar kiri
3. Pilih tabel `test_questions`
4. Klik "Insert" di bagian atas
5. Pilih "Import data from file"
6. Upload file `questions.json`
7. Konfirmasikan mapping kolom dan klik "Import"

## Menggunakan Halaman Manajemen Soal

Jika Anda sudah membuat fitur manajemen soal sesuai kode yang kita buat:

1. Login ke aplikasi sebagai admin
2. Navigasikan ke halaman "Manajemen Soal"
3. Cari opsi "Import" di bagian bawah halaman
4. Upload file `questions.json`

## Memverifikasi Import

Untuk memeriksa apakah data sudah berhasil diimpor:

1. Di SQL Editor, jalankan query:
   ```sql
   SELECT type, COUNT(*) FROM test_questions GROUP BY type;
   ```
2. Harusnya Anda akan melihat 8 tipe kecerdasan dengan masing-masing 5 soal

## Catatan

- Jika ingin mengimpor ulang, hapus dulu data yang ada:
  ```sql
  TRUNCATE TABLE test_questions;
  ```
- Pastikan Row Level Security (RLS) aktif dan kebijakan keamanan dikonfigurasi untuk akses admin
- Jika menemui error duplikat ID, pastikan tabel dalam keadaan kosong sebelum mengimpor
