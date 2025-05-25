import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

const Index = () => {
  const navigate = useNavigate();
  // Simulasi user login, ganti dengan logic auth asli jika ada
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  // Untuk mendeteksi kode rahasia
  const [secretCode, setSecretCode] = useState<string[]>([]);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
    };
    window.addEventListener("scroll", onScroll);

    // Event listener untuk tombol keyboard (kode: sayang)
    const handleKeyDown = (e: KeyboardEvent) => {
      setSecretCode((prev) => {
        const updatedCode = [...prev, e.key].slice(-5);
        
        // Cek jika kode adalah "sayang"
        if (updatedCode.join("").toLowerCase() === "sayang") {
          navigate("/makasihya");
        }
        return updatedCode;
      });
    };
    
    window.addEventListener("keydown", handleKeyDown);
    
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  // HERO SECTION
  // Features/benefits for cards
  const features = [
    {
      icon: "🧠",
      title: "Kenali Potensi Unikmu",
      desc: "Tes berbasis teori Howard Gardner untuk mengungkap kekuatan kecerdasan dominan Anda.",
    },
    {
      icon: "🚀",
      title: "Pengembangan Diri",
      desc: "Dapatkan tips personal untuk mengembangkan potensi sesuai profil kecerdasan Anda.",
    },
    {
      icon: "👩‍🏫",
      title: "Bermanfaat untuk Guru & Orang Tua",
      desc: "Bantu siswa dan anak berkembang optimal dengan memahami keunikan mereka.",
    },
  ];

  // Steps section
  const steps = [
    {
      icon: "📝",
      title: "Isi Tes",
      desc: "Jawab pertanyaan sederhana seputar kebiasaan dan preferensi Anda.",
    },
    {
      icon: "📊",
      title: "Lihat Hasil",
      desc: "Temukan kecerdasan dominan dan potensi tersembunyi Anda.",
    },
    {
      icon: "🎯",
      title: "Aksi & Kembangkan",
      desc: "Ikuti saran pengembangan diri sesuai hasil tes Anda.",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      {/* MARKETING STYLE HEADER */}
      <header
        className={`w-full fixed top-0 left-0 z-40 transition-all duration-300 ${
          scrolled ? "bg-white/90 shadow-md backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 md:px-4 py-4">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}> 
            <span className="bg-gradient-to-br from-purple-500 to-indigo-500 flex items-center justify-center text-white text-sm font-black md:text-xl shadow-md px-4 py-1">Multiple Intelegences Test</span>
          </div>
          {/* Desktop Nav */}
          <nav className="hidden md:flex gap-8 text-base font-medium">
            <a href="#home" className="text-gray-70 0 hover:text-purple-700 transition">Beranda</a>
            <a href="#features" className="text-gray-70 0 hover:text-purple-700 transition">Fitur</a>
            <a href="#how" className="text-gray-700 hover:text-purple-700 transition">Cara Kerja</a>
            <a href="#testimonials" className="text-gray-700 hover:text-purple-700 transition">Testimoni</a>
          </nav>
          {/* CTA / User */}
          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg shadow font-semibold cursor-pointer">
                {user.name}
              </div>
            ) : (
              <Button
                onClick={() => navigate('/admin')}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:from-purple-700 hover:to-indigo-700 transition font-semibold"
              >
                Login
              </Button>
            )}
          </div>
          {/* Mobile Hamburger */}
          <button
            className="md:hidden flex flex-col items-center justify-center w-10 h-10 rounded-lg hover:bg-purple-100 transition"
            onClick={() => setMobileNav((v) => !v)}
            aria-label="Toggle navigation"
          >
            <span className="block w-6 h-0.5 bg-purple-700 mb-1 rounded"></span>
            <span className="block w-6 h-0.5 bg-purple-700 mb-1 rounded"></span>
            <span className="block w-6 h-0.5 bg-purple-700 rounded"></span>
          </button>
        </div>
        {/* Mobile Nav Drawer */}
        {mobileNav && (
          <div className="md:hidden bg-white/95 shadow-lg border-t border-purple-100 px-6 py-6 flex flex-col gap-4 text-base font-medium animate-fade-in-down">
            <a href="#home" className="text-gray-700 hover:text-purple-700 transition" onClick={() => setMobileNav(false)}>Beranda</a>
            <a href="#features" className="text-gray-700 hover:text-purple-700 transition" onClick={() => setMobileNav(false)}>Fitur</a>
            <a href="#how" className="text-gray-700 hover:text-purple-700 transition" onClick={() => setMobileNav(false)}>Cara Kerja</a>
            <a href="#testimonials" className="text-gray-700 hover:text-purple-700 transition" onClick={() => setMobileNav(false)}>Testimoni</a>
            {user ? (
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg shadow font-semibold mt-2">{user.name}</div>
            ) : (
              <Button
                onClick={() => { setMobileNav(false); navigate('/admin'); }}
                className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-lg shadow hover:from-purple-700 hover:to-indigo-700 transition font-semibold mt-2"
              >
                Login
              </Button>
            )}
          </div>
        )}
      </header>

      {/* HERO SECTION */}
      <section id="home" className="w-full max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between px-4 gap-12 min-h-screen pt-32 md:pt-10" style={{ minHeight: '100vh' }}>
        <div className="flex-1 text-center md:text-left">
          <motion.h1
            initial={{ opacity: 0, y: -30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-5xl md:text-6xl font-extrabold text-purple-800 mb-6 leading-tight"
          >
            Temukan <span className="text-indigo-600">Kecerdasan</span> Unikmu!
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.7 }}
            className="text-xl md:text-2xl text-gray-700 mb-8 max-w-xl"
          >
            Tes Kecerdasan Majemuk gratis & mudah. Kenali kekuatan, potensi, dan gaya belajar terbaikmu!
          </motion.p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start mb-8">
            <Button
              onClick={() => navigate("/test")}
              className="px-10 py-5 text-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
            >
              Mulai Tes Sekarang
            </Button>
            <Button
              onClick={() => navigate("/admin")}
              variant="outline"
              className="px-10 py-5 text-lg border-purple-300 text-purple-700 hover:bg-purple-100 hover:border-purple-400 transition-all duration-300 hover:-translate-y-1"
            >
              Login Admin
            </Button>
          </div>
          <div className="flex flex-wrap gap-3 justify-center md:justify-start mt-4">
            <span className="bg-white/80 rounded-full px-4 py-2 text-sm text-gray-700 shadow">Gratis</span>
            <span className="bg-white/80 rounded-full px-4 py-2 text-sm text-gray-700 shadow">Tanpa Registrasi</span>
            <span className="bg-white/80 rounded-full px-4 py-2 text-sm text-gray-700 shadow">Privasi Terjaga</span>
          </div>
        </div>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="flex-1 flex items-center justify-center"
        >
          <div className="grid grid-cols-4 gap-10 bg-white/90 rounded-2xl p-12 shadow-2xl border border-purple-100">
            {/* Intelligence icons */}
            <span className="text-6xl">📚</span>
            <span className="text-6xl">🧮</span>
            <span className="text-6xl">🎵</span>
            <span className="text-6xl">🏃</span>
            <span className="text-6xl">🎨</span>
            <span className="text-6xl">👥</span>
            <span className="text-6xl">🧠</span>
            <span className="text-6xl">🌿</span>
          </div>
        </motion.div>
      </section>

      {/* FEATURES SECTION */}
      <section id="features" className="w-full min-h-screen max-w-5xl mx-auto my-20 py-20 px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * i, duration: 0.5 }}
              className="bg-white rounded-2xl shadow-lg p-12 flex flex-col items-center text-center border-t-4 border-purple-200 hover:border-indigo-400 transition-all duration-300"
            >
              <div className="text-5xl mb-4">{f.icon}</div>
              <div className="font-bold text-lg text-purple-700 mb-2">{f.title}</div>
              <div className="text-gray-600 text-base">{f.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section id="how" className="w-full min-h-screen max-w-5xl mx-auto py-20 px-4">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-3xl md:text-4xl font-bold text-purple-800 mb-10 text-center"
        >
          Cara Kerja Tes Ini
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 * idx, duration: 0.5 }}
              className="bg-white rounded-xl shadow-md p-8 flex flex-col items-center text-center border-b-4 border-indigo-200 hover:border-purple-400 transition-all duration-300"
            >
              <div className="text-4xl mb-3">{step.icon}</div>
              <div className="font-semibold text-lg text-indigo-700 mb-1">{step.title}</div>
              <div className="text-gray-600 text-base">{step.desc}</div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* TRUST/TESTIMONIALS SECTION */}
      <section id="testimonials" className="w-full max-w-5xl mx-auto py-12 px-4">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-2xl md:text-3xl font-bold text-indigo-800 mb-8 text-center"
        >
          Dipercaya oleh Ribuan Pengguna
        </motion.h3>
        <div className="flex flex-col md:flex-row gap-8 justify-center items-stretch">
          <div className="bg-white rounded-xl shadow p-6 flex-1 text-center border-l-4 border-pink-200">
            <div className="text-lg italic text-gray-700 mb-2">“Tes ini membantu saya memahami kekuatan anak saya dan membimbingnya belajar dengan lebih bahagia!”</div>
            <div className="font-semibold text-pink-700">- Ibu Rina, Orang Tua</div>
          </div>
          <div className="bg-white rounded-xl shadow p-6 flex-1 text-center border-l-4 border-green-200">
            <div className="text-lg italic text-gray-700 mb-2">“Sebagai guru, saya jadi lebih mudah memfasilitasi keberagaman siswa di kelas.”</div>
            <div className="font-semibold text-green-700">- Pak Dedi, Guru SD</div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="w-full text-center text-xs text-gray-500 py-8 border-t border-gray-200 mt-auto bg-white/70">
        <div>© {new Date().getFullYear()} Made with 💖 in PPTQA | Tes Kecerdasan Majemuk Berdasarkan teori Howard Gardner</div>
        <div className="mt-1">Created for Dewi Sinta</div>
      </footer>
    </div>
  );
};

export default Index;
