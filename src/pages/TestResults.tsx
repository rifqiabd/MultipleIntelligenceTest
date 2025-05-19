import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Radar } from 'react-chartjs-2';
import { intelligenceTypes, intelligenceDescriptions, IntelligenceType } from "@/data/testQuestions";
import { intelligenceCharacteristics, TestResult } from "@/data/testResultsTypes";
import { registerChartComponents } from "@/utils/chartConfig";
import { PrinterIcon } from "lucide-react";

// Register Chart.js components
registerChartComponents();

const TestResults = () => {
  const [result, setResult] = useState<TestResult | null>(null);
  const navigate = useNavigate();
  const resultRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    // Get test result from session storage
    const resultData = sessionStorage.getItem("testResult");
    
    if (!resultData) {
      navigate("/test");
      return;
    }
    
    setResult(JSON.parse(resultData));
  }, [navigate]);
  
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
            size: 12
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
    <div className="min-h-screen bg-gray-50 py-8 px-4 print:py-2 print:px-0">
      <div ref={resultRef} className="container mx-auto max-w-3xl px-0">
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Profil Kecerdasan Majemuk Anda</CardTitle>
          </CardHeader>
          <CardContent>
            {/* User Profile Section */}
            <Card className="mb-5 bg-gray-50">
              <CardContent className="pt-4">
                <div className="grid grid-cols-2 gap-4">
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
                    <p className="text-sm text-gray-500">Email:</p>
                    <p className="font-medium">{result.email}</p>
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
            
            <div className="text-center mb-4">
              <h3 className="text-lg font-medium">Terima kasih, {result.name}!</h3>
              <p className="text-gray-600">
                Berikut adalah hasil dari penilaian kecerdasan majemuk Anda.
              </p>
            </div>
            
            <div className="w-full h-96 mx-auto">
              <Radar data={chartData} options={chartOptions} />
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Kecerdasan Dominan Anda: {intelligenceTypes[result.dominantType]}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">{intelligenceDescriptions[result.dominantType]}</p>
            
            <h3 className="font-bold text-lg mb-2">Skor Kecerdasan Anda</h3>
            <div className="space-y-4">
              {sortedScores.map(({ type, score }) => (
                <div key={type}>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{intelligenceTypes[type]}</span>
                    <span>{score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2.5">
                    <div 
                      className="bg-purple-600 h-2.5 rounded-full" 
                      style={{ width: `${score}%` }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
        
        {/* Characteristics Card */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-xl">Ciri-ciri Kecerdasan {intelligenceTypes[result.dominantType]}</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="mb-4">
              Berdasarkan hasil tes, Anda memiliki kecenderungan kuat pada kecerdasan {intelligenceTypes[result.dominantType].toLowerCase()}. 
              Berikut adalah ciri-ciri umum yang dimiliki orang dengan kecerdasan ini:
            </p>
            
            <ul className="list-disc pl-5 space-y-2">
              {intelligenceCharacteristics[result.dominantType].map((characteristic, index) => (
                <li key={index}>{characteristic}</li>
              ))}
            </ul>
          </CardContent>
        </Card>
        
        <div className="text-center flex gap-4 justify-center print:hidden">
          <Button onClick={handleReturnHome} className="px-8">Kembali ke Beranda</Button>
          <Button onClick={handlePrint} className="px-8 bg-green-600 hover:bg-green-700">
            <PrinterIcon className="mr-2 h-4 w-4" />
            Cetak Hasil
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TestResults;
