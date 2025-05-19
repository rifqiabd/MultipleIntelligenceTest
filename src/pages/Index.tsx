
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-50 to-purple-50 p-4">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-4xl font-bold mb-3 text-purple-800 md:text-5xl">Multiple Intelligences Test</h1>
        <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
          Discover your unique intelligence profile based on Howard Gardner's theory of multiple intelligences.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-xl mx-auto">
          <Button 
            onClick={() => navigate("/test")}
            className="px-8 py-6 text-lg bg-purple-600 hover:bg-purple-700"
          >
            Take the Test
          </Button>
          
          <Button 
            onClick={() => navigate("/admin")}
            variant="outline"
            className="px-8 py-6 text-lg border-purple-300 hover:bg-purple-100"
          >
            Admin Login
          </Button>
        </div>
        
        <div className="mt-12 p-6 bg-white rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-purple-700">About Multiple Intelligences</h2>
          <p className="text-gray-700">
            Howard Gardner's theory of multiple intelligences suggests that there are multiple types of intelligence beyond the traditional view of IQ.
            This test will help you discover your strengths across eight different intelligence areas: Linguistic, Logical-Mathematical, 
            Musical, Bodily-Kinesthetic, Spatial, Interpersonal, Intrapersonal, and Naturalistic.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Index;
