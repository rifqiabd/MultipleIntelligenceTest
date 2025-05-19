import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const Index = () => {
  const navigate = useNavigate();
  
  // Animasi untuk elemen-elemen
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        delayChildren: 0.3,
        staggerChildren: 0.2
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: "spring", stiffness: 100 }
    }
  };

  const intelligenceTypes = [
    { name: "Linguistik", icon: "📚", color: "bg-blue-100" },
    { name: "Logis-Matematis", icon: "🧮", color: "bg-green-100" },
    { name: "Musikal", icon: "🎵", color: "bg-yellow-100" },
    { name: "Kinestetik-Tubuh", icon: "🏃", color: "bg-red-100" },
    { name: "Spasial", icon: "🎨", color: "bg-purple-100" },
    { name: "Interpersonal", icon: "👥", color: "bg-pink-100" },
    { name: "Intrapersonal", icon: "🧠", color: "bg-indigo-100" },
    { name: "Naturalis", icon: "🌿", color: "bg-emerald-100" },
  ];
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-start bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-4 overflow-x-hidden">
      {/* Header dengan efek glassmorphism */}
      <motion.div 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-6xl mx-auto mt-10 mb-6 px-6 py-4 bg-white bg-opacity-70 backdrop-blur-lg rounded-xl shadow-lg"
      >
        <div className="flex items-center justify-center">
          <div className="mr-4 bg-purple-600 rounded-full p-3 shadow-md">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
          </div>
          <div className="text-center md:text-left">
            <h1 className="text-4xl font-bold mb-1 text-purple-800 md:text-5xl">Tes Kecerdasan Majemuk</h1>
            <p className="text-lg text-gray-700 max-w-2xl">
              Temukan profil kecerdasan unik Anda berdasarkan teori kecerdasan majemuk Howard Gardner.
            </p>
          </div>
        </div>
      </motion.div>
      
      <motion.div 
        className="max-w-6xl w-full mx-auto"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Hero section dengan button */}
        <motion.div 
          variants={itemVariants}
          className="flex flex-col md:flex-row items-center justify-between bg-white rounded-xl overflow-hidden shadow-lg mb-10"
        >
          <div className="p-8 md:p-10 md:w-1/2">
            <motion.h2 
              className="text-2xl md:text-3xl font-bold text-purple-800 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              Mulai Perjalanan Penemuan Diri Anda
            </motion.h2>
            <motion.p 
              className="text-gray-600 mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              Tes ini akan membantu Anda mengidentifikasi dan mengembangkan kecerdasan yang paling menonjol dalam diri Anda.
            </motion.p>
            
            <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-4">
              <Button 
                onClick={() => navigate("/test")}
                className="px-8 py-6 text-lg bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
                Mulai Tes
              </Button>
              
              <Button 
                onClick={() => navigate("/admin")}
                variant="outline"
                className="px-8 py-6 text-lg border-purple-300 text-purple-700 hover:bg-purple-100 hover:border-purple-400 transition-all duration-300 hover:-translate-y-1"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                Login Admin
              </Button>
            </div>
          </div>
          
          <div className="md:w-1/2 h-64 md:h-auto bg-purple-100 relative overflow-hidden hidden md:block">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-indigo-300 opacity-70"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-3 gap-3">
                {intelligenceTypes.slice(0, 6).map((type, i) => (
                  <motion.div
                    key={i}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2 + (i * 0.1) }}
                    className={`${type.color} w-20 h-20 rounded-lg flex items-center justify-center shadow-sm`}
                  >
                    <div className="text-3xl">{type.icon}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Informasi tentang teori kecerdasan majemuk */}
        <motion.div 
          variants={itemVariants}
          className="bg-white rounded-xl p-8 shadow-lg mb-10"
        >
          <div className="flex items-center mb-5">
            <div className="p-3 bg-purple-100 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-2xl font-semibold text-purple-800">Tentang Kecerdasan Majemuk</h2>
          </div>
          
          <p className="text-gray-700 mb-6 leading-relaxed">
            Teori kecerdasan majemuk Howard Gardner menunjukkan bahwa ada beberapa jenis kecerdasan di luar pandangan tradisional tentang IQ.
            Tes ini akan membantu Anda menemukan kekuatan Anda di delapan area kecerdasan yang berbeda.
          </p>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {intelligenceTypes.map((type, i) => (
              <motion.div
                key={i}
                whileHover={{ y: -5, boxShadow: "0 10px 20px rgba(0,0,0,0.1)" }}
                className={`${type.color} p-4 rounded-lg text-center transition-all duration-300`}
              >
                <div className="text-3xl mb-2">{type.icon}</div>
                <div className="font-medium text-gray-800">{type.name}</div>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Footer */}
        <motion.div 
          variants={itemVariants}
          className="text-center text-sm text-gray-500 mt-10 mb-6"
        >
          <p>© {new Date().getFullYear()} Tes Kecerdasan Majemuk</p>
          <p className="mt-1">Berdasarkan teori Howard Gardner</p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Index;
