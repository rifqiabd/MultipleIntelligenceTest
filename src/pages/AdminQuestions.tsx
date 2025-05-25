import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { QuestionsManager } from "@/components/admin/questions/QuestionsManager";
import { getCurrentUser } from "@/integrations/supabase/auth";

export default function AdminQuestions() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Check admin login status
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        // Periksa status login di localStorage terlebih dahulu
        const isLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";
        if (!isLoggedIn) {
          // Jika tidak login, redirect ke halaman login
          navigate("/admin/login");
          return;
        }
        
        // Verifikasi dengan server
        const { success, user } = await getCurrentUser();
        if (success && user) {
          setIsAdminLoggedIn(true);
        } else {
          // If getting current user fails, clear localStorage and redirect to login
          localStorage.removeItem("isAdminLoggedIn");
          navigate("/admin/login");
        }
      } catch (error) {
        console.error("Error checking login status:", error);
        toast({
          title: "Gagal memeriksa status login",
          description: "Silakan login kembali untuk melanjutkan",
          variant: "destructive",
        });
        navigate("/admin/login");
      } finally {
        setIsLoading(false);
      }
    };

    checkLoginStatus();
  }, [navigate, toast]);

  // If checking login status, show loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-t-2 border-primary mb-3"></div>
          <p className="text-gray-600 font-medium">Memeriksa status login...</p>
          <p className="text-gray-500 text-sm mt-1">Mohon tunggu sebentar</p>
        </div>
      </div>
    );
  }

  // If not logged in, component will redirect (handled in useEffect)
  return (
    <div className="min-h-screen bg-gray-50 px-3 sm:px-4 md:px-6">
      <div className="container mx-auto py-4 sm:py-6 md:py-8 max-w-7xl">
        <div className="mb-4 sm:mb-6">
          <h1 className="text-xl sm:text-2xl font-bold mb-1 text-center sm:text-left">Manajemen Soal</h1>
          <div className="flex justify-center sm:justify-start gap-2">
            <button 
              onClick={() => navigate("/admin")}
              className="text-sm text-blue-600 hover:underline flex items-center transition-colors"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-1">
                <path d="m15 18-6-6 6-6"/>
              </svg>
              Kembali ke Dashboard
            </button>
          </div>
        </div>
        
        <QuestionsManager isAdminLoggedIn={isAdminLoggedIn} />
      </div>
    </div>
  );
}
