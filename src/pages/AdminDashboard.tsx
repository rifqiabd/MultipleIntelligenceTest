import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Radar, Bar } from 'react-chartjs-2';
import { ScrollArea } from "@/components/ui/scroll-area";
import { intelligenceTypes, intelligenceDescriptions, IntelligenceType } from "@/data/testQuestions";
import { TestResult, intelligenceCharacteristics, getChartData } from "@/data/testResultsTypes";
import { registerChartComponents } from "@/utils/chartConfig";

// Register ChartJS components
registerChartComponents();

// Mock data for demonstration
const mockTestResults: TestResult[] = [
  {
    id: "1",
    name: "John Doe",
    age: 28,
    gender: "Male",
    email: "john@example.com",
    studentClass: "Teacher",
    date: "2025-05-10",
    results: {
      linguistic: 85,
      logical: 70,
      musical: 60,
      bodily: 45,
      spatial: 65,
      interpersonal: 90,
      intrapersonal: 75,
      naturalistic: 50
    },    dominantType: "interpersonal"
  },
  {
    id: "2",
    name: "Jane Smith",
    age: 35,
    gender: "Female",
    email: "jane@example.com",
    studentClass: "Engineer",
    date: "2025-05-12",
    results: {
      linguistic: 65,
      logical: 95,
      musical: 40,
      bodily: 55,
      spatial: 85,
      interpersonal: 60,
      intrapersonal: 70,
      naturalistic: 45
    },
    dominantType: "logical"
  },
  {
    id: "3",
    name: "Alex Johnson",
    age: 22,
    gender: "Non-binary",
    email: "alex@example.com",
    studentClass: "Musician",
    date: "2025-05-14",
    results: {
      linguistic: 70,
      logical: 60,
      musical: 95,
      bodily: 75,
      spatial: 65,
      interpersonal: 80,
      intrapersonal: 85,
      naturalistic: 50
    },
    dominantType: "musical"
  }
];

// Chart data transformation is now imported from shared module

const AdminDashboard = () => {
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();
  
  useEffect(() => {
    // Check if admin is logged in
    const isLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";
    
    if (!isLoggedIn) {
      navigate("/admin");
      return;
    }
    
    // Load test results (from localStorage in this case)
    const storedResults = localStorage.getItem("testResults");
    if (storedResults) {
      setTestResults(JSON.parse(storedResults));
    } else {
      // Use mock data if no stored results
      setTestResults(mockTestResults);
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("isAdminLoggedIn");
    navigate("/admin");
  };
  // Prepare chart data
  const { barChartData, radarData } = getChartData(testResults);
  // Intelligence characteristics are now imported from shared types

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">        
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-purple-800">Dashboard Admin</h1>
          <Button variant="outline" onClick={handleLogout}>Keluar</Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">          {/* Chart 1: Average Intelligence Scores */}
          <Card>
            <CardHeader>
              <CardTitle>Rata-rata Skor Kecerdasan</CardTitle>
            </CardHeader>            
            <CardContent className="h-80">
              <div className="h-full w-full">
                <Radar 
                  data={radarData} 
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
                    maintainAspectRatio: false
                  }}
                />
              </div>
            </CardContent>
          </Card>
            {/* Chart 2: Dominant Intelligence Types */}          <Card>
            <CardHeader>
              <CardTitle>Tipe Kecerdasan Dominan</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <div className="h-full w-full">
                <Bar 
                  data={barChartData}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                      y: {
                        beginAtZero: true,
                        ticks: {
                          precision: 0
                        }
                      }
                    }
                  }}
                />
              </div>
            </CardContent>
          </Card>
        </div>        {/* Test Results Table */}
        <Card>
          <CardHeader>
            <CardTitle>Hasil Tes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>                
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Kelas</TableHead>
                    <TableHead>Linguistik</TableHead>
                    <TableHead>Logis</TableHead>
                    <TableHead>Musikal</TableHead>
                    <TableHead>Kinestetik</TableHead>
                    <TableHead>Spasial</TableHead>
                    <TableHead>Interpersonal</TableHead>
                    <TableHead>Intrapersonal</TableHead>
                    <TableHead>Naturalistik</TableHead>
                    <TableHead>Tipe Dominan</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium">{result.name}</TableCell>
                      <TableCell>{result.studentClass}</TableCell>
                      <TableCell>{result.results.linguistic}%</TableCell>
                      <TableCell>{result.results.logical}%</TableCell>
                      <TableCell>{result.results.musical}%</TableCell>
                      <TableCell>{result.results.bodily}%</TableCell>
                      <TableCell>{result.results.spatial}%</TableCell>
                      <TableCell>{result.results.interpersonal}%</TableCell>
                      <TableCell>{result.results.intrapersonal}%</TableCell>
                      <TableCell>{result.results.naturalistic}%</TableCell>
                      <TableCell>{intelligenceTypes[result.dominantType as IntelligenceType]}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedResult(result);
                              setModalOpen(true);
                            }}                            >
                            Lihat
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => {
                              const updatedResults = testResults.filter(item => item.id !== result.id);
                              setTestResults(updatedResults);
                              localStorage.setItem("testResults", JSON.stringify(updatedResults));
                            }}
                          >
                            Hapus
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
          {/* Modal for Result Details */}
        <Dialog open={modalOpen} onOpenChange={setModalOpen}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Detail Hasil Tes</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[calc(90vh-120px)]">
              {selectedResult && (
                <div className="p-4 space-y-6">                  {/* User Profile Section */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-500">Nama:</p>
                      <p className="font-medium">{selectedResult.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Usia:</p>
                      <p className="font-medium">{selectedResult.age} tahun</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Jenis Kelamin:</p>
                      <p className="font-medium">{selectedResult.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email:</p>
                      <p className="font-medium">{selectedResult.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Kelas:</p>
                      <p className="font-medium">{selectedResult.studentClass}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tanggal Tes:</p>
                      <p className="font-medium">{new Date(selectedResult.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  {/* Results Visualization */}                  
                  <div>
                    <h3 className="font-bold text-lg mb-2">Skor Kecerdasan</h3>
                    <div className="space-y-4">
                      {Object.entries(selectedResult.results)
                        .sort(([, a], [, b]) => b - a)
                        .map(([type, score]) => (
                          <div key={type}>
                            <div className="flex justify-between mb-1">
                              <span className="font-medium capitalize">{type}</span>
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
                  </div>
                  
                  {/* Dominant Type */}
                  <div>
                    <h3 className="font-bold text-lg mb-2">Kecerdasan Dominan: {intelligenceTypes[selectedResult.dominantType as IntelligenceType]}</h3>
                    <p className="mb-4">{intelligenceDescriptions[selectedResult.dominantType as IntelligenceType]}</p>
                    
                    <h4 className="font-semibold mt-4 mb-2">Karakteristik:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {intelligenceCharacteristics[selectedResult.dominantType as IntelligenceType]?.map((characteristic, idx) => (
                        <li key={idx}>{characteristic}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}
            </ScrollArea>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};

export default AdminDashboard;
