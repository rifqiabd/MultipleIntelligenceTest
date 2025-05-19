import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartLegend, ChartTooltip } from "@/components/ui/chart";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { intelligenceTypes, intelligenceDescriptions, IntelligenceType } from "@/data/testQuestions";

// Types for our test data
type TestResult = {
  id: string;
  name: string;
  age: number;
  gender: string;
  email: string;
  occupation: string;
  date: string;
  results: {
    linguistic: number;
    logical: number;
    musical: number;
    bodily: number;
    spatial: number;
    interpersonal: number;
    intrapersonal: number;
    naturalistic: number;
  };
  dominantType: string;
};

// Mock data for demonstration
const mockTestResults: TestResult[] = [
  {
    id: "1",
    name: "John Doe",
    age: 28,
    gender: "Male",
    email: "john@example.com",
    occupation: "Teacher",
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
    },
    dominantType: "Interpersonal"
  },
  {
    id: "2",
    name: "Jane Smith",
    age: 35,
    gender: "Female",
    email: "jane@example.com",
    occupation: "Engineer",
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
    dominantType: "Logical"
  },
  {
    id: "3",
    name: "Alex Johnson",
    age: 22,
    gender: "Non-binary",
    email: "alex@example.com",
    occupation: "Musician",
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
    dominantType: "Musical"
  }
];

// Transform data for visualization
const getChartData = (testResults: TestResult[]) => {
  // For bar chart - count occurrences of dominant types
  const dominantTypeCounts: Record<string, number> = {};
  testResults.forEach(result => {
    const type = result.dominantType;
    dominantTypeCounts[type] = (dominantTypeCounts[type] || 0) + 1;
  });
  
  const barChartData = Object.keys(dominantTypeCounts).map(type => ({
    name: type,
    count: dominantTypeCounts[type]
  }));

  // For radar chart - average scores across all participants
  const totalScores = {
    linguistic: 0,
    logical: 0,
    musical: 0,
    bodily: 0,
    spatial: 0,
    interpersonal: 0,
    intrapersonal: 0,
    naturalistic: 0
  };

  testResults.forEach(result => {
    totalScores.linguistic += result.results.linguistic;
    totalScores.logical += result.results.logical;
    totalScores.musical += result.results.musical;
    totalScores.bodily += result.results.bodily;
    totalScores.spatial += result.results.spatial;
    totalScores.interpersonal += result.results.interpersonal;
    totalScores.intrapersonal += result.results.intrapersonal;
    totalScores.naturalistic += result.results.naturalistic;
  });

  const radarData = [
    {
      subject: "Linguistic",
      A: testResults.length > 0 ? totalScores.linguistic / testResults.length : 0,
    },
    {
      subject: "Logical",
      A: testResults.length > 0 ? totalScores.logical / testResults.length : 0,
    },
    {
      subject: "Musical",
      A: testResults.length > 0 ? totalScores.musical / testResults.length : 0,
    },
    {
      subject: "Bodily",
      A: testResults.length > 0 ? totalScores.bodily / testResults.length : 0,
    },
    {
      subject: "Spatial",
      A: testResults.length > 0 ? totalScores.spatial / testResults.length : 0,
    },
    {
      subject: "Interpersonal",
      A: testResults.length > 0 ? totalScores.interpersonal / testResults.length : 0,
    },
    {
      subject: "Intrapersonal",
      A: testResults.length > 0 ? totalScores.intrapersonal / testResults.length : 0,
    },
    {
      subject: "Naturalistic",
      A: testResults.length > 0 ? totalScores.naturalistic / testResults.length : 0,
    }
  ];

  return { barChartData, radarData };
};

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

  const chartConfig = {
    A: {
      label: "Average Score",
      color: "#8884d8"
    }
  };

  // Intelligence characteristics for each type (copied from TestResults.tsx)
  const intelligenceCharacteristics: Record<string, string[]> = {
    linguistic: [
      "Pintar bermain dengan kata-kata",
      "Memiliki kosakata yang luas",
      "Pandai bercerita dan menulis",
      "Menikmati membaca dan berdiskusi",
      "Berkomunikasi dengan jelas dan efektif"
    ],
    logical: [
      "Mudah memahami pola dan konsep abstrak",
      "Menyukai angka dan kalkulasi",
      "Pemikir sistematis dan analitis",
      "Senang memecahkan teka-teki",
      "Pendekatan metodis dalam memecahkan masalah"
    ],
    musical: [
      "Sensitif terhadap nada dan ritme",
      "Mudah mengingat melodi",
      "Sering mengekspresikan diri melalui musik",
      "Dapat memainkan instrumen musik",
      "Memiliki pemahaman yang baik tentang struktur musik"
    ],
    bodily: [
      "Koordinasi fisik yang baik",
      "Belajar lebih baik melalui gerakan dan pengalaman",
      "Terampil dalam kerajinan tangan",
      "Menggunakan bahasa tubuh saat berkomunikasi",
      "Menikmati aktivitas fisik dan olahraga"
    ],
    spatial: [
      "Kemampuan visualisasi yang kuat",
      "Mudah membaca peta dan diagram",
      "Memiliki orientasi ruang yang baik",
      "Menikmati seni visual dan desain",
      "Berpikir dalam gambar dan citra"
    ],
    interpersonal: [
      "Mudah berempati dengan orang lain",
      "Berkomunikasi dan bernegosiasi dengan baik",
      "Dapat memotivasi dan mempengaruhi orang lain",
      "Terampil dalam bekerja dalam tim",
      "Membangun hubungan dengan mudah"
    ],
    intrapersonal: [
      "Pemahaman diri yang mendalam",
      "Reflektif dan introspektif",
      "Kesadaran akan nilai dan tujuan pribadi",
      "Mandiri dan disiplin diri",
      "Peka terhadap perasaan dan emosi sendiri"
    ],
    naturalistic: [
      "Hubungan yang kuat dengan dunia alam",
      "Kemampuan mengidentifikasi flora dan fauna",
      "Kesadaran akan pola-pola alam",
      "Kepedulian terhadap lingkungan",
      "Menikmati kegiatan di alam terbuka"
    ]
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-purple-800">Admin Dashboard</h1>
          <Button variant="outline" onClick={handleLogout}>Logout</Button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Chart 1: Average Intelligence Scores */}
          <Card>
            <CardHeader>
              <CardTitle>Average Intelligence Scores</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ChartContainer className="h-full" config={chartConfig}>
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <ChartTooltip />
                  <Radar name="Average Score" dataKey="A" fill="#8884d8" fillOpacity={0.6} />
                </RadarChart>
              </ChartContainer>
            </CardContent>
          </Card>
          
          {/* Chart 2: Dominant Intelligence Types */}
          <Card>
            <CardHeader>
              <CardTitle>Dominant Intelligence Types</CardTitle>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={barChartData}>
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="count" fill="#8884d8" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>

        {/* Test Results Table */}
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Occupation</TableHead>
                    <TableHead>Linguistic</TableHead>
                    <TableHead>Logical</TableHead>
                    <TableHead>Musical</TableHead>
                    <TableHead>Bodily</TableHead>
                    <TableHead>Spatial</TableHead>
                    <TableHead>Interpersonal</TableHead>
                    <TableHead>Intrapersonal</TableHead>
                    <TableHead>Naturalistic</TableHead>
                    <TableHead>Dominant Type</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {testResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium">{result.name}</TableCell>
                      <TableCell>{result.occupation}</TableCell>
                      <TableCell>{result.results.linguistic}%</TableCell>
                      <TableCell>{result.results.logical}%</TableCell>
                      <TableCell>{result.results.musical}%</TableCell>
                      <TableCell>{result.results.bodily}%</TableCell>
                      <TableCell>{result.results.spatial}%</TableCell>
                      <TableCell>{result.results.interpersonal}%</TableCell>
                      <TableCell>{result.results.intrapersonal}%</TableCell>
                      <TableCell>{result.results.naturalistic}%</TableCell>
                      <TableCell>{result.dominantType}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedResult(result);
                              setModalOpen(true);
                            }}
                          >
                            View
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
                            Delete
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
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden">
            <DialogHeader>
              <DialogTitle>Test Result Details</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[calc(90vh-120px)]">
              {selectedResult && (
                <div className="p-4 space-y-6">
                  {/* User Profile Section */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="text-sm text-gray-500">Name:</p>
                      <p className="font-medium">{selectedResult.name}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Age:</p>
                      <p className="font-medium">{selectedResult.age} years</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Gender:</p>
                      <p className="font-medium">{selectedResult.gender}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Email:</p>
                      <p className="font-medium">{selectedResult.email}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Occupation:</p>
                      <p className="font-medium">{selectedResult.occupation}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Test Date:</p>
                      <p className="font-medium">{new Date(selectedResult.date).toLocaleDateString()}</p>
                    </div>
                  </div>
                  
                  {/* Results Visualization */}
                  <div>
                    <h3 className="font-bold text-lg mb-2">Intelligence Scores</h3>
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
                    <h3 className="font-bold text-lg mb-2">Dominant Intelligence: {selectedResult.dominantType}</h3>
                    <p className="mb-4">{intelligenceDescriptions[selectedResult.dominantType as IntelligenceType]}</p>
                    
                    <h4 className="font-semibold mt-4 mb-2">Characteristics:</h4>
                    <ul className="list-disc pl-5 space-y-1">
                      {intelligenceCharacteristics[selectedResult.dominantType.toLowerCase()]?.map((characteristic, idx) => (
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
