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
        className="max-w-3xl w-full bg-white/90 backdrop-blur-sm rounded-3xl p-8 md:p-12 shadow-xl border border-purple-200"
      >
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.7 }}
          className="text-center"
        >
          <h1 className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-indigo-600 mb-6">
            Untuk Kekasihku Tercinta ❤️
          </h1>
          
          <div className="space-y-4 text-lg text-gray-700 mb-8">
            <p className="italic">
              "Terima kasih telah menjadi inspirasi dan semangat dalam hidupku."
            </p>
            
            <p>
              Aplikasi ini ku persembahkan untukmu, dengan harapan dapat membantu 
              menyelesaikan skripsimu dengan lebih mudah. Semua kerja keras ini 
              adalah bentuk dukunganku untukmu.
            </p>
            
            <p>
              Aku bangga melihat usaha dan kerja kerasmu selama ini. Teruslah berjuang, 
              dan ingatlah bahwa aku akan selalu ada untuk mendukungmu, dalam suka maupun duka.
            </p>
            
            <p className="font-medium text-purple-700">
              Semangat mengejar mimpi-mimpimu, sayang! Aku percaya kamu bisa!
            </p>
          </div>
          
          <div className="font-script text-2xl text-pink-600 my-8">
            Dengan cinta, Aku ❤️
          </div>
          
          <div className="pt-6 border-t border-purple-100">
            <Button 
              onClick={() => navigate("/")}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white px-8 py-5 rounded-xl shadow-lg transition-all duration-300 text-lg"
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