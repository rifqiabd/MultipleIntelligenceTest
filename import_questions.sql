-- SQL untuk memasukkan data soal dari testQuestions.ts ke tabel test_questions di Supabase

-- Pastikan tabel sudah dibuat sesuai dengan questions_setup.sql
-- Jika belum, jalankan file questions_setup.sql terlebih dahulu

-- Hapus data lama jika ingin memulai dari awal (opsional)
-- TRUNCATE TABLE test_questions;

-- Linguistic Intelligence
INSERT INTO test_questions (id, text, type) VALUES
('L1', 'Saya suka membaca buku dan artikel di waktu luang saya', 'linguistic'),
('L2', 'Saya merasa mudah menjelaskan ide-ide kompleks kepada orang lain', 'linguistic'),
('L3', 'Saya menikmati permainan kata seperti teka-teki silang atau Scrabble', 'linguistic'),
('L4', 'Saya pandai mengingat kutipan atau frasa', 'linguistic'),
('L5', 'Saya dapat mengekspresikan diri dengan baik dalam tulisan', 'linguistic');

-- Logical-Mathematical Intelligence
INSERT INTO test_questions (id, text, type) VALUES
('M1', 'Saya dapat dengan mudah melakukan perhitungan di kepala saya', 'logical'),
('M2', 'Saya suka memecahkan teka-teki atau asah otak', 'logical'),
('M3', 'Saya suka menganalisis masalah secara sistematis', 'logical'),
('M4', 'Saya pandai mengenali pola dan hubungan', 'logical'),
('M5', 'Saya sering bertanya tentang bagaimana sesuatu bekerja', 'logical');

-- Musical Intelligence
INSERT INTO test_questions (id, text, type) VALUES
('Mu1', 'Saya dapat dengan mudah mengenali instrumen musik yang berbeda dalam sebuah lagu', 'musical'),
('Mu2', 'Saya sering memiliki nada atau lagu yang tersangkut di kepala saya', 'musical'),
('Mu3', 'Saya dapat mengetahui ketika sebuah nada sumbang', 'musical'),
('Mu4', 'Saya menikmati menciptakan atau mendengarkan musik', 'musical'),
('Mu5', 'Saya dapat mengingat melodi dengan mudah', 'musical');

-- Bodily-Kinesthetic Intelligence
INSERT INTO test_questions (id, text, type) VALUES
('B1', 'Saya menikmati aktivitas fisik dan olahraga', 'bodily'),
('B2', 'Saya pandai dalam kerajinan atau aktivitas yang membutuhkan gerakan tangan yang presisi', 'bodily'),
('B3', 'Saya belajar lebih baik dengan melakukan sesuatu secara fisik daripada membaca tentangnya', 'bodily'),
('B4', 'Saya menggunakan bahasa tubuh dan gerakan ketika berkomunikasi', 'bodily'),
('B5', 'Saya memiliki koordinasi dan keseimbangan yang baik', 'bodily');

-- Spatial Intelligence
INSERT INTO test_questions (id, text, type) VALUES
('S1', 'Saya dapat dengan mudah memvisualisasikan objek dari perspektif yang berbeda', 'spatial'),
('S2', 'Saya memiliki rasa arah yang baik', 'spatial'),
('S3', 'Saya menikmati seni visual, seperti melukis atau fotografi', 'spatial'),
('S4', 'Saya dapat dengan mudah membaca peta dan diagram', 'spatial'),
('S5', 'Saya memperhatikan detail visual yang mungkin dilewatkan orang lain', 'spatial');

-- Interpersonal Intelligence
INSERT INTO test_questions (id, text, type) VALUES
('I1', 'Saya menikmati aktivitas sosial dan bertemu orang baru', 'interpersonal'),
('I2', 'Orang-orang sering datang kepada saya untuk meminta saran', 'interpersonal'),
('I3', 'Saya dapat merasakan bagaimana perasaan orang lain', 'interpersonal'),
('I4', 'Saya pandai menyelesaikan konflik antar orang', 'interpersonal'),
('I5', 'Saya lebih suka aktivitas kelompok daripada melakukan sesuatu sendiri', 'interpersonal');

-- Intrapersonal Intelligence
INSERT INTO test_questions (id, text, type) VALUES
('Ia1', 'Saya sering merefleksikan pikiran dan perasaan saya', 'intrapersonal'),
('Ia2', 'Saya memiliki pemahaman yang baik tentang kekuatan dan kelemahan saya', 'intrapersonal'),
('Ia3', 'Saya lebih suka bekerja secara mandiri', 'intrapersonal'),
('Ia4', 'Saya menetapkan tujuan dan merencanakan masa depan saya', 'intrapersonal'),
('Ia5', 'Saya nyaman dengan siapa diri saya', 'intrapersonal');

-- Naturalistic Intelligence
INSERT INTO test_questions (id, text, type) VALUES
('N1', 'Saya menikmati kegiatan luar ruangan dan berada di alam', 'naturalistic'),
('N2', 'Saya dapat mengenali dan mengklasifikasikan berbagai jenis tanaman atau hewan', 'naturalistic'),
('N3', 'Saya tertarik pada isu-isu lingkungan', 'naturalistic'),
('N4', 'Saya memperhatikan pola dan perubahan di alam', 'naturalistic'),
('N5', 'Saya menikmati belajar tentang fenomena alam', 'naturalistic');

-- Tambahkan indeks untuk mengoptimalkan pencarian berdasarkan tipe soal
CREATE INDEX IF NOT EXISTS idx_questions_type ON test_questions (type);

-- Verifikasi data telah dimasukkan dengan benar
-- SELECT COUNT(*) FROM test_questions;
-- SELECT type, COUNT(*) FROM test_questions GROUP BY type;
