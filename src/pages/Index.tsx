
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-4xl font-bold mb-3 text-purple-800 md:text-5xl">Tes Kecerdasan Majemuk</h1>
        <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
          Temukan profil kecerdasan unik Anda berdasarkan teori kecerdasan majemuk Howard Gardner.
        </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl mx-auto">
          <Button 
            onClick={() => navigate("/test")}
            className="px-8 py-6 text-lg bg-purple-600 hover:bg-purple-700"
          >
            Mulai Tes
          </Button>
          
          <Button 
            onClick={() => navigate("/admin")}
            variant="outline"
            className="px-8 py-6 text-lg border-purple-300 hover:bg-purple-100"
          >
            Login Admin
          </Button>
        </div>
          <div className="mt-12 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-purple-700">Tentang Kecerdasan Majemuk</h2>
          <p className="text-gray-700">
            Teori kecerdasan majemuk Howard Gardner menunjukkan bahwa ada beberapa jenis kecerdasan di luar pandangan tradisional tentang IQ.
            Tes ini akan membantu Anda menemukan kekuatan Anda di delapan area kecerdasan yang berbeda: Linguistik, Logis-Matematis, 
            Musikal, Kinestetik-Tubuh, Spasial, Interpersonal, Intrapersonal, dan Naturalis.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
