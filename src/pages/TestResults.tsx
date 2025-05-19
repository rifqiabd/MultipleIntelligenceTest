import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Radar } from 'react-chartjs-2';
import { intelligenceTypes, intelligenceDescriptions, IntelligenceType } from "@/data/testQuestions";
import { intelligenceCharacteristics, TestResult } from "@/data/testResultsTypes";
import { registerChartComponents } from "@/utils/chartConfig";
import { PrinterIcon, HomeIcon } from "lucide-react";
import { saveTestResult } from "@/integrations/supabase/api";
import { useToast } from "@/components/ui/use-toast";

// Register Chart.js components
registerChartComponents();

const TestResults = () => {
  const [result, setResult] = useState<TestResult | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const navigate = useNavigate();
  const resultRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();
  useEffect(() => {
    // Get test result from session storage
    const resultData = sessionStorage.getItem("testResult");

    if (!resultData) {
      navigate("/test");
      return;
    }

    const parsedResult = JSON.parse(resultData);
    setResult(parsedResult);

    // Check if already saved to Supabase
    const savedToSupabase = sessionStorage.getItem("resultSavedToSupabase");
    if (savedToSupabase === "true") {
      setIsSaved(true);
    }
  }, [navigate]);const handleSaveResult = async (resultData: TestResult) => {
    if (isSaving || !resultData) return;
    setIsSaving(true);
    
    // Generate an ID if missing
    if (!resultData.id) {
      resultData.id = crypto.randomUUID();
    }
    
    // Format date consistently as ISO string
    if (!resultData.date || typeof resultData.date !== 'string') {
      resultData.date = new Date().toISOString();
    }
    
    console.log("[TestResults] Attempting to save test result:", resultData);
    console.log("[TestResults] SupabaseURL:", import.meta.env.VITE_SUPABASE_URL);
    
    try {
      // Clear session flag to ensure we don't think it's already saved
      sessionStorage.removeItem("resultSavedToSupabase");
      
      const { success, error } = await saveTestResult(resultData);

      if (success) {
        console.log("[TestResults] Save successful!");
        sessionStorage.setItem("resultSavedToSupabase", "true");
        setIsSaved(true);
        toast({
          title: "Hasil tersimpan",
          description: "Hasil tes berhasil disimpan ke database",
        });
      } else {
        console.error("[TestResults] Save failed:", error);
        toast({
          title: "Gagal menyimpan hasil",
          description: "Hasil tes tetap tersedia secara lokal",
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error("[TestResults] Exception during save:", err);
      toast({
        title: "Gagal terhubung ke database",
        description: "Hasil tes tetap tersedia secara lokal",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleReturnHome = () => {
    // Clear session data
    sessionStorage.removeItem("userData");
    sessionStorage.removeItem("testResult");

    // Return to home page
    navigate("/");
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handlePrint = () => {
    window.print();
  };

  if (!result) {
    return <div className="flex justify-center items-center min-h-screen">Memuat hasil...</div>;
  }

  // Sort intelligences by score (highest first)
  const sortedScores = Object.entries(result.results)
    .sort(([, a], [, b]) => b - a)
    .map(([type, score]) => ({
      type: type as IntelligenceType,
      score,
    }));

  // Prepare data for Chart.js radar chart
  const chartData = {
    labels: Object.keys(result.results).map(key =>
      intelligenceTypes[key as IntelligenceType]
    ),
    datasets: [
      {
        label: 'Skor',
        data: Object.values(result.results),
        backgroundColor: 'rgba(136, 132, 216, 0.6)',
        borderColor: '#8884d8',
        borderWidth: 2,
      }
    ],
  };

  const chartOptions = {
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 20,
          font: {
            size: 10
          }
        },
        pointLabels: {
          font: {
            size: 10
          }
        }
      }
    },
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const
      }
    }
  };
  return (
    <div className="min-h-screen bg-gray-50 py-4 px-5 print:py-10  print:px-30">
      <div ref={resultRef} className="container mx-auto max-w-4xl px-4">
        <div className="text-center mb-2 print:hidden">
          <h3 className="text-lg font-medium">Terima kasih, {result.name}!</h3>
          <p className="text-gray-600">
            Berikut adalah hasil dari penilaian kecerdasan majemuk Anda.
          </p>
        </div>
        <Card className="mb-2">
          <CardHeader className="flex flex-col sm:flex-row justify-between items-center">
            <CardTitle className="text-xl text-center">🧠 Profil Kecerdasan Majemuk Anda</CardTitle>
            <div className="mt-1 sm:mt-0">  
              {isSaving && <div className="text-xs bg-blue-100 text-blue-700 px-3 py-1 rounded-full animate-pulse">Menyimpan...</div>}
              {isSaved && <div className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full">Tersimpan ✓</div>}
            </div>
          </CardHeader>
          <CardContent>
            {/* User Profile Section */}
            <Card className="mb-1 bg-gray-50">
              <CardContent className="pt-3">
                <div className="grid grid-cols-2 gap-1">
                  <div>
                    <p className="text-sm text-gray-500">Nama:</p>
                    <p className="font-medium">{result.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Usia:</p>
                    <p className="font-medium">{result.age} tahun</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Jenis Kelamin:</p>
                    <p className="font-medium">{result.gender}</p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">Kelas:</p>
                    <p className="font-medium">{result.studentClass}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tanggal Tes:</p>
                    <p className="font-medium">{formatDate(result.date)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>

        <Card className="mb-2">
          <CardHeader>
            <CardTitle className="text-xl">Kecerdasan Dominan Anda: {intelligenceTypes[result.dominantType]}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4 text-md">{intelligenceDescriptions[result.dominantType]}</p>

            <h3 className="font-bold text-lg mb-2">Skor Kecerdasan Anda</h3>
            <div className="h-64 w-full print:hidden">
              <Radar
                data={{
                  labels: [
                    "Verbal/Linguistik",
                    "Logika-Matematika",
                    "Musikal",
                    "Kinestetik",
                    "Visual-Spasial",
                    "Interpersonal",
                    "Intrapersonal",
                    "Naturalis"
                  ],
                  datasets: [
                    {
                      label: 'Skor',
                      data: [
                        result.results.linguistic,
                        result.results.logical,
                        result.results.musical,
                        result.results.bodily,
                        result.results.spatial,
                        result.results.interpersonal,
                        result.results.intrapersonal,
                        result.results.naturalistic,
                      ],
                      backgroundColor: 'rgba(136, 132, 216, 0.2)',
                      borderColor: 'rgba(136, 132, 216, 1)',
                      borderWidth: 1,
                      pointBackgroundColor: 'rgba(136, 132, 216, 1)',
                    }
                  ]
                }}
                options={{
                  scales: {
                    r: {
                      beginAtZero: true,
                      max: 100,
                      ticks: {
                        stepSize: 20
                      }
                    }
                  },
                  plugins: {
                    tooltip: {
                      callbacks: {
                        label: function (context) {
                          return `${context.label}: ${context.raw}%`;
                        }
                      }
                    },
                    legend: {
                      display: false
                    }
                  },
                  maintainAspectRatio: false
                }}
              />
            </div>

            {/* Numerical scores in grid format */}
            <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-2">
              {sortedScores.map(({ type, score }) => (
                <div key={type} className="bg-gray-50 p-3 rounded">
                  <div className="text-sm text-gray-500">{intelligenceTypes[type]}</div>
                  <div className="font-medium text-purple-700">{score}%</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Characteristics Card */}
        <Card className="mb-4">
          <CardHeader>
            <CardTitle className="text-xl">Ciri-ciri Kecerdasan {intelligenceTypes[result.dominantType].slice(2)}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-2">
              Berikut adalah ciri-ciri umum yang dimiliki orang dengan kecerdasan ini:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2">
              {intelligenceCharacteristics[result.dominantType].map((characteristic, index) => (
              <div key={index} className="bg-gray-100 rounded p-3 flex items-start">
              <span>{characteristic}</span>
              </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="text-center flex gap-4 justify-center max-w-screen print:hidden">
          <Button onClick={handleReturnHome} className="px-8 bg-blue-600 hover:bg-blue-700">
            <HomeIcon className="mr-2 h-4 w-4" />
            Beranda
          </Button>
          <Button onClick={handlePrint} className="px-8 bg-green-600 hover:bg-green-700">
            <PrinterIcon className="mr-2 h-4 w-4" />
            Cetak
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestResults;
