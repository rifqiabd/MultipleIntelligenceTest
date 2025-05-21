import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { FC } from "react";

interface HeaderProps {
  greeting: string;
  displayName: string;
  dbStatus: 'connecting' | 'connected' | 'error';
  resultCount: number;
  onProfileClick: () => void;
  onLogoutClick: () => void;
}

const Header: FC<HeaderProps> = ({
  greeting,
  displayName,
  dbStatus,
  resultCount,
  onProfileClick,
  onLogoutClick
}) => {
  // Function to get today's date in Indonesian format
  const getTodayDate = () => {
    return new Date().toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden mb-6">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-3 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-2xl font-bold text-white mb-2 sm:mb-0">
            Dashboard Admin
          </h1>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="bg-white/20 text-white hover:bg-white/30 border-transparent"
              onClick={onProfileClick}
            >
              <User className="h-4 w-4 mr-2" />
              {displayName}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-white/20 text-white hover:bg-white/30 border-transparent"
              onClick={onLogoutClick}
            >
              Keluar
            </Button>
          </div>
        </div>
      </div>
      
      <div className="px-6 py-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center">
          <div>
            <h2 className="text-xl font-medium text-gray-800">{greeting}</h2>
            <p className="text-sm text-gray-500">{getTodayDate()}</p>
          </div>
          <div className="mt-3 md:mt-0">
            {dbStatus === 'connecting' && (
              <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1.5 rounded-lg">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-2 animate-pulse"></span>
                Menghubungkan ke database...
              </div>
            )}
            {dbStatus === 'connected' && (
              <div className="flex items-center bg-green-50 text-green-700 px-3 py-1.5 rounded-lg">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                Terhubung ke database 
                <span className="ml-1.5 bg-green-100 px-2 py-0.5 rounded-md text-xs font-medium">
                  {resultCount} hasil tes
                </span>
              </div>
            )}
            {dbStatus === 'error' && (
              <div className="flex items-center bg-red-50 text-red-700 px-3 py-1.5 rounded-lg">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-2"></span>
                Gagal terhubung ke database
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
