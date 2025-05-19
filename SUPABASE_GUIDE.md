# Konfigurasi Supabase untuk Aplikasi Tes Kecerdasan Majemuk

Dokumen ini menjelaskan langkah-langkah yang diperlukan untuk mengatur Supabase sebagai backend untuk aplikasi Tes Kecerdasan Majemuk.

## Langkah 1: Buat Project di Supabase

1. Buka [app.supabase.com](https://app.supabase.com) dan login/signup
2. Klik "New Project"
3. Isi informasi project:
   - Nama: Multiple Intelligence Test
   - Password database: (buat password kuat)
   - Region: pilih yang terdekat dengan pengguna (mis. Singapore/Tokyo untuk Indonesia)
4. Klik "Create New Project"

## Langkah 2: Konfigurasi Database

1. Setelah project dibuat, buka tab "SQL Editor"
2. Klik "New Query"
3. Copy dan paste SQL dari file `supabase_setup.sql`
4. Klik "Run" untuk mengeksekusi query dan membuat tabel

## Langkah 3: Siapkan Autentikasi

1. Buka tab "Authentication" -> "Providers"
2. Pastikan "Email" diaktifkan
3. Buka tab "Users" dan klik "Invite"
4. Tambahkan email admin yang akan memiliki akses ke dashboard
5. Tunggu email konfirmasi dan set password

## Langkah 4: Dapatkan Kredensial API

1. Buka tab "Settings" -> "API"
2. Copy "URL" dan "anon public" key
3. Buat file `.env` di root project dengan isi:
   ```
   VITE_SUPABASE_URL=your_supabase_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

## Langkah 5: Deploy Aplikasi

1. Build aplikasi dengan `npm run build`
2. Deploy ke hosting statis pilihan Anda (Netlify, Vercel, dll.)
3. Set environment variables di platform hosting

## Pengecekan

1. Buka aplikasi dan isi form tes
2. Selesaikan tes dan lihat hasil
3. Cek di Supabase Table Editor apakah data tersimpan dengan benar
4. Login ke dashboard admin dan pastikan data dapat ditampilkan

## Troubleshooting

- **Data tidak tersimpan**: Periksa console browser untuk error dan konfirmasi kredensial Supabase sudah benar
- **Tidak dapat login**: Pastikan email yang digunakan sudah terdaftar sebagai user di Supabase
- **Error RLS (Row Level Security)**: Pastikan policies sudah dibuat dengan benar
