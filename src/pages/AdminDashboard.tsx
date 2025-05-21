import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/components/ui/use-toast";
import { TestResult } from "@/data/testResultsTypes";
import { IntelligenceType } from "@/data/testQuestions";
import { registerChartComponents } from "@/utils/chartConfig";
import { getAllTestResults, deleteTestResult } from "@/integrations/supabase/api";
import { signOut, updateUserProfile, getCurrentUser } from "@/integrations/supabase/auth";
import { checkSupabaseConnection, getTestResultsCount, getUniqueClasses } from "@/integrations/supabase/utils";

import {
  Header,
  QuickStats,
  Charts,
  ResultsCard,
  ResultDetail,
  ProfileUpdate
} from "@/components/admin/dashboard";

// Register ChartJS components
registerChartComponents();

const AdminDashboard = () => {
  // State untuk data hasil tes
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [filteredResults, setFilteredResults] = useState<TestResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // State untuk status database dan metadata
  const [dbStatus, setDbStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [resultCount, setResultCount] = useState<number>(0);
  const [availableClasses, setAvailableClasses] = useState<string[]>([]);
  
  // State untuk profile dan greeting
  const [greeting, setGreeting] = useState<string>("");
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [resultModalOpen, setResultModalOpen] = useState(false);
  const [displayName, setDisplayName] = useState<string>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);
  
  // State untuk sorting dan filtering
  const [sortConfig, setSortConfig] = useState<{
    key: string;
    direction: 'ascending' | 'descending' | null;
  }>({
    key: 'date',
    direction: 'descending'
  });

  // State untuk filters
  const [filters, setFilters] = useState({
    studentClass: 'all',
    startDate: '',
    endDate: '',
    searchName: '',
    dominantType: 'all'
  });

  const navigate = useNavigate();
  const { toast } = useToast();

  // Generate greeting based on time of day
  const generateGreeting = () => {
    const currentHour = new Date().getHours();
    let greetingText = "";

    if (currentHour >= 5 && currentHour < 12) {
      greetingText = "Selamat pagi";
    } else if (currentHour >= 12 && currentHour < 15) {
      greetingText = "Selamat siang";
    } else if (currentHour >= 15 && currentHour < 18) {
      greetingText = "Selamat sore";
    } else {
      greetingText = "Selamat malam";
    }

    // Use displayName from state that comes from Supabase Auth
    return `${greetingText}, ${displayName || "Admin"}!`;
  };
  
  // Load current user data
  const loadUserData = async () => {
    try {
      // Periksa status login di localStorage terlebih dahulu
      const isLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";
      if (!isLoggedIn) {
        // Jika tidak login, redirect ke halaman login
        navigate("/admin/login");
        return;
      }
      
      const { success, user } = await getCurrentUser();
      if (success && user) {
        // Set display name directly from user metadata in Supabase
        const adminName = user.user_metadata?.display_name || user.email?.split('@')[0] || "Admin";
        setDisplayName(adminName);
        setUserEmail(user.email || "");
        // Update greeting after getting user data
        setGreeting(`${generateGreeting()}`);
      } else {
        // If getting current user fails, clear localStorage and redirect to login
        localStorage.removeItem("isAdminLoggedIn");
        navigate("/admin/login");
      }
    } catch (error) {
      console.error("Error loading user data:", error);
      // If error occurs, clear localStorage and redirect to login
      localStorage.removeItem("isAdminLoggedIn");
      navigate("/admin/login");
    }
  };

  // Check database connection status
  const checkDbConnection = async () => {
    setDbStatus('connecting');
    const isConnected = await checkSupabaseConnection();
    setDbStatus(isConnected ? 'connected' : 'error');

    if (isConnected) {
      // Get count of test results
      const count = await getTestResultsCount();
      setResultCount(count);
    }
  };

  // Fetch test result data
  const fetchTestResults = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const { success, data, error } = await getAllTestResults();
      if (success && data) {
        setTestResults(data);
        applyFiltersAndSort(data, filters, sortConfig);
      } else {
        throw error || new Error("Failed to fetch test results");
      }
      
      // Get unique classes for filter dropdown
      const classes = await getUniqueClasses();
      setAvailableClasses(classes);
    } catch (err) {
      console.error("Error fetching test results:", err);
      setError("Terjadi kesalahan saat memuat data. Silakan coba lagi.");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle profile update
  const handleProfileUpdate = async () => {
    setIsUpdatingProfile(true);
    
    try {
      const { success } = await updateUserProfile(displayName);
      
      if (success) {
        localStorage.setItem("adminName", displayName);
        setGreeting(generateGreeting());
        setProfileModalOpen(false);
        toast({
          title: "Profil diperbarui",
          description: "Nama tampilan berhasil diperbarui",
        });
      } else {
        toast({
          title: "Gagal memperbarui profil",
          description: "Terjadi kesalahan saat memperbarui profil",
          variant: "destructive",
        });
      }
    } catch (err) {
      toast({
        title: "Gagal memperbarui profil",
        description: "Terjadi kesalahan saat memperbarui profil",
        variant: "destructive",
      });
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  // Handle logout
  const handleLogout = async () => {
    const { success } = await signOut();
    
    // Hapus semua data admin dari localStorage
    localStorage.removeItem("isAdminLoggedIn");
    localStorage.removeItem("adminName");
    
    if (success) {
      navigate("/");
    } else {
      toast({
        title: "Gagal keluar",
        description: "Terjadi kesalahan saat logout",
        variant: "destructive",
      });
    }
  };

  // Handle delete test result
  const handleDeleteResult = async (id: string) => {
    if (window.confirm("Apakah Anda yakin ingin menghapus hasil tes ini?")) {
      const { success, error } = await deleteTestResult(id);

      if (success) {
        // Update local state
        setTestResults(prev => prev.filter(item => item.id !== id));
        setFilteredResults(prev => prev.filter(item => item.id !== id));

        // Update count after successful deletion
        setResultCount(prev => Math.max(0, prev - 1));

        toast({
          title: "Berhasil dihapus",
          description: "Data hasil tes berhasil dihapus",
        });
      } else {
        console.error("Error deleting test result:", error);
        toast({
          title: "Gagal menghapus",
          description: "Terjadi kesalahan saat menghapus data",
          variant: "destructive",
        });
      }
    }
  };

  // Handle filter changes
  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => {
      const newFilters = {
        ...prev,
        [key]: value
      };
      applyFiltersAndSort(testResults, newFilters, sortConfig);
      return newFilters;
    });
  };

  // Reset filters
  const resetFilters = () => {
    const defaultFilters = {
      studentClass: 'all',
      startDate: '',
      endDate: '',
      searchName: '',
      dominantType: 'all'
    };
    setFilters(defaultFilters);
    applyFiltersAndSort(testResults, defaultFilters, sortConfig);
  };

  // Check if any filter is active
  const isFilterActive = () => {
    return (
      filters.studentClass !== 'all' ||
      filters.startDate !== '' ||
      filters.endDate !== '' ||
      filters.searchName !== '' ||
      filters.dominantType !== 'all'
    );
  };

  // Sort function for any column in the table
  const handleSort = (key: string) => {
    let direction: 'ascending' | 'descending' | null = 'ascending';

    // If we're already sorting by this key, toggle the direction
    if (sortConfig.key === key) {
      direction = sortConfig.direction === 'ascending' ? 'descending' : 'ascending';
    }

    const newSortConfig = { key, direction };
    setSortConfig(newSortConfig);
    applyFiltersAndSort(testResults, filters, newSortConfig);
  };

  // Reset sort to default
  const resetSort = () => {
    const defaultSort = { key: 'date', direction: 'descending' as const };
    setSortConfig(defaultSort);
    applyFiltersAndSort(testResults, filters, defaultSort);
  };

  // Apply filters and sorting to results
  const applyFiltersAndSort = (results: TestResult[], activeFilters = filters, activeSortConfig = sortConfig) => {
    // First apply filters
    let filtered = [...results];

    // Filter by class
    if (activeFilters.studentClass !== 'all') {
      filtered = filtered.filter(item => item.studentClass === activeFilters.studentClass);
    }

    // Filter by date range
    if (activeFilters.startDate) {
      const startDate = new Date(activeFilters.startDate);
      filtered = filtered.filter(item => new Date(item.date) >= startDate);
    }

    if (activeFilters.endDate) {
      const endDate = new Date(activeFilters.endDate);
      endDate.setHours(23, 59, 59, 999); // End of day
      filtered = filtered.filter(item => new Date(item.date) <= endDate);
    }

    // Filter by name search
    if (activeFilters.searchName) {
      const searchTerm = activeFilters.searchName.toLowerCase();
      filtered = filtered.filter(item => item.name.toLowerCase().includes(searchTerm));
    }

    // Filter by dominant intelligence type
    if (activeFilters.dominantType !== 'all') {
      filtered = filtered.filter(item => item.dominantType === activeFilters.dominantType);
    }

    // Apply sorting
    if (activeSortConfig.key && activeSortConfig.direction) {
      filtered.sort((a, b) => {
        // Get the values based on the key
        let aValue: any;
        let bValue: any;

        // Handle nested properties for results
        if (activeSortConfig.key.startsWith('results.')) {
          const resultKey = activeSortConfig.key.split('.')[1] as keyof typeof a.results;
          aValue = a.results[resultKey];
          bValue = b.results[resultKey];
        } else if (activeSortConfig.key === 'date') {
          // For dates, convert to timestamps for comparison
          aValue = new Date(a.date).getTime();
          bValue = new Date(b.date).getTime();
        } else if (activeSortConfig.key === 'dominantType') {
          // For dominant type, sort by the display name
          aValue = a.dominantType as IntelligenceType;
          bValue = b.dominantType as IntelligenceType;
        } else {
          // For other properties like name, studentClass
          aValue = a[activeSortConfig.key as keyof typeof a];
          bValue = b[activeSortConfig.key as keyof typeof b];
        }

        // Perform the comparison
        if (aValue < bValue) {
          return activeSortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return activeSortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredResults(filtered);
  };

  // Initialize component
  useEffect(() => {
    setGreeting(generateGreeting());
    checkDbConnection();
    loadUserData();
    fetchTestResults();
    
    // Set up auto-refresh interval
    const refreshInterval = setInterval(() => {
      checkDbConnection();
    }, 60000); // Check connection every minute

    return () => {
      clearInterval(refreshInterval);
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 px-2 sm:px-4 md:px-6">
      <div className="container mx-auto p-2 md:p-4">
        {/* Header */}
        <Header 
          greeting={greeting}
          displayName={displayName}
          dbStatus={dbStatus}
          resultCount={resultCount}
          onProfileClick={() => setProfileModalOpen(true)}
          onLogoutClick={handleLogout}
        />

        {/* Quick Stats */}
        <QuickStats testResults={filteredResults} />

        {/* Charts */}
        <Charts testResults={filteredResults} />

        {/* Results Table */}
        <ResultsCard 
          testResults={filteredResults}
          availableClasses={availableClasses}
          filters={filters}
          sortConfig={sortConfig}
          isLoading={isLoading}
          error={error}
          isFilterActive={isFilterActive}
          onFilterChange={handleFilterChange}
          onResetFilters={resetFilters}
          onSort={handleSort}
          onResetSort={resetSort}
          onView={(result) => {
            setSelectedResult(result);
            setResultModalOpen(true);
          }}
          onDelete={handleDeleteResult}
          onRetry={fetchTestResults}
        />

        {/* Modal for Result Details */}
        <ResultDetail 
          isOpen={resultModalOpen}
          onOpenChange={setResultModalOpen}
          result={selectedResult}
        />

        {/* Modal for Profile Update */}
        <ProfileUpdate 
          isOpen={profileModalOpen}
          onOpenChange={setProfileModalOpen}
          displayName={displayName}
          userEmail={userEmail}
          isUpdating={isUpdatingProfile}
          onDisplayNameChange={setDisplayName}
          onSave={handleProfileUpdate}
        />
      </div>
    </div>
  );
};

export default AdminDashboard;
