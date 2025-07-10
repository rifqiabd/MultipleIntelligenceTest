import { useEffect } from "react";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const MakasihYa = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Trigger confetti when the page loads
    const duration = 5 * 1000;
    const animationEnd = Date.now() + duration;

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval = setInterval(() => {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      // Celebrate with confetti
      confetti({
        particleCount,
        origin: { x: randomInRange(0.1, 0.9), y: Math.random() - 0.2 },
        colors: ['#9333ea', '#4f46e5', '#f472b6', '#fb7185'],
        spread: 80,
        angle: randomInRange(55, 125),
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl w-full bg-white/90 backdrop-blur-sm rounded-3xl p-4 sm:p-6 md:p-8 lg:p-12 shadow-xl border border-purple-200"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-center"
        >
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-4 sm:mb-6">
            Untuk Orang yang Ku Kagumi
          </h1>

          <div className="space-y-3 sm:space-y-4 text-sm sm:text-base md:text-lg text-gray-700 mb-6 sm:mb-8">
            <p className="italic text-sm sm:text-base md:text-lg">
              "Hari ini kamu akan mempertahankan hasil kerja kerasmu selama bertahun-tahun."
            </p>

            <p className="text-sm sm:text-base md:text-lg">
              Aplikasi ini ku persembahkan untukmu sebagai bentuk dukungan untuk sidang skripsimu.
              Semua fitur yang ada di sini dibangun dengan harapan dapat membantu
              memudahkan penelitianmu. Ini adalah caraku mendukung kesuksesanmu.
            </p>

            <p className="text-sm sm:text-base md:text-lg">
              Aku sangat mengagumi dedikasi dan kerja kerasmu selama ini. Dari semester pertama hingga
              detik ini, kamu telah menunjukkan kegigihan yang menginspirasi.
              Sidang hari ini hanyalah formalitas - kamu sudah terbukti hebat!
            </p>

            <p className="font-medium text-purple-700 text-sm sm:text-base md:text-lg">
              Be Confident! Kamu sudah siap dan pantas menyandang gelar sarjana.
              Aku akan selalu mendoakanmu dan mendukungmu! 🎓
            </p>
          </div>

          <div className="font-script text-lg sm:text-xl md:text-2xl text-pink-600 my-6 sm:my-8">
            Dengan doa dan dukungan, Aku ❤️
          </div>

          <div className="pt-4 sm:pt-6 border-t border-purple-100">
            <Button
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-6 sm:px-8 py-3 sm:py-4 md:py-5 rounded-xl shadow-lg transition-all duration-300 text-base sm:text-lg w-full sm:w-auto"
            >
              Kembali ke Beranda
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default MakasihYa;