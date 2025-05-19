
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">Oops! Page not found</p>
        <Button 
          onClick={() => navigate("/")}
          className="bg-purple-600 hover:bg-purple-700"
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
