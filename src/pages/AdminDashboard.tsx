import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableRow } from "@/components/ui/table";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Radar, Bar } from 'react-chartjs-2';
import { ScrollArea } from "@/components/ui/scroll-area";
import { intelligenceTypes, intelligenceDescriptions, IntelligenceType } from "@/data/testQuestions";
import { TestResult, intelligenceCharacteristics, getChartData } from "@/data/testResultsTypes";
import { registerChartComponents } from "@/utils/chartConfig";
import { getAllTestResults, deleteTestResult } from "@/integrations/supabase/api";
import { signOut } from "@/integrations/supabase/auth";
import { checkSupabaseConnection, getTestResultsCount, getUniqueClasses } from "@/integrations/supabase/utils";
import { useToast } from "@/components/ui/use-toast";
import { Eye, File, Trash, FileText, Sheet } from 'lucide-react';
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

// Register ChartJS components
registerChartComponents();

// Mock test results for development/testing
const mockTestResults: TestResult[] = [
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
  const [filteredResults, setFilteredResults] = useState<TestResult[]>([]);
  const [selectedResult, setSelectedResult] = useState<TestResult | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dbStatus, setDbStatus] = useState<'connecting' | 'connected' | 'error'>('connecting');
  const [resultCount, setResultCount] = useState<number>(0);
  const [availableClasses, setAvailableClasses] = useState<string[]>([]);

  // Filters state
  const [filters, setFilters] = useState({
    studentClass: 'all',
    startDate: '',
    endDate: '',
    searchName: '',
    dominantType: 'all'
  });

  const navigate = useNavigate();
  const { toast } = useToast();
  useEffect(() => {
    // Check if admin is logged in
    const isLoggedIn = localStorage.getItem("isAdminLoggedIn") === "true";

    if (!isLoggedIn) {
      navigate("/admin");
      return;
    }

    // Check database connection
    checkDbConnection();

    // Load test results from Supabase
    fetchTestResults();

    // Load available classes
    fetchUniqueClasses();
  }, [navigate]);

  const checkDbConnection = async () => {
    setDbStatus('connecting');
    const isConnected = await checkSupabaseConnection();

    if (isConnected) {
      setDbStatus('connected');
      const count = await getTestResultsCount();
      setResultCount(count);
    } else {
      setDbStatus('error');
    }
  };
  const fetchUniqueClasses = async () => {
    const classes = await getUniqueClasses();
    setAvailableClasses(classes);
  };

  const fetchTestResults = async () => {
    setIsLoading(true);
    setError(null);

    const { success, data, error } = await getAllTestResults(filters);

    if (success && data) {
      setTestResults(data);
      setFilteredResults(data);
    } else {
      console.error("Error fetching test results:", error);
      setError("Gagal memuat data hasil tes");
      toast({
        title: "Gagal memuat data",
        description: "Terjadi kesalahan saat mengambil data dari database",
        variant: "destructive",
      });

      // Use mock data if Supabase fetch fails
      setTestResults(mockTestResults);
      setFilteredResults(mockTestResults);
    }

    setIsLoading(false);
  };

  const handleLogout = async () => {
    try {
      localStorage.removeItem("isAdminLoggedIn");
      // Sign out from Supabase as well
      await signOut();
      navigate("/admin");
    } catch (error) {
      console.error("Error signing out:", error);
      navigate("/admin");
    }
  };

  // Handle delete test result
  const handleDeleteResult = async (id: string) => {
    if (confirm("Apakah Anda yakin ingin menghapus hasil tes ini?")) {
      setIsLoading(true);
      const { success, error } = await deleteTestResult(id);
      if (success) {
        // Update local state directly instead of re-fetching
        setTestResults(prev => prev.filter(item => item.id !== id));

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
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Apply filters when any filter changes
  useEffect(() => {
    // Apply server-side filtering by re-fetching data
    fetchTestResults();
  }, [filters]);

  // Calculate date for default date range (one month ago)
  const getDefaultStartDate = () => {
    const date = new Date();
    date.setMonth(date.getMonth() - 1);
    return date.toISOString().split('T')[0];
  };
  // Reset all filters
  const resetFilters = () => {
    setFilters({
      studentClass: 'all',
      startDate: '',
      endDate: '',
      searchName: '',
      dominantType: 'all'
    });

    toast({
      title: "Filter direset",
      description: "Menampilkan semua hasil tes"
    });
  };

  // Check if any filter is active
  const isFilterActive = () => {
    return filters.studentClass !== 'all' ||
      filters.startDate !== '' ||
      filters.endDate !== '' ||
      filters.searchName !== '' ||
      filters.dominantType !== 'all';
  };
  // Prepare chart data - charts will dynamically update based on filtered results
  const { barChartData, radarData } = getChartData(testResults);
  // Intelligence characteristics are now imported from shared types

  return (
    <div className="min-h-screen bg-gray-50 px-6">
      <div className="container mx-auto p-4">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-purple-800">Dashboard Admin</h1>
            <div className="mt-1 flex items-center">
              {dbStatus === 'connecting' && (
                <div className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full animate-pulse">
                  Memeriksa koneksi...
                </div>
              )}
              {dbStatus === 'connected' && (
                <div className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-1"></span>
                  Terhubung ke database ({resultCount} hasil tes)
                </div>
              )}
              {dbStatus === 'error' && (
                <div className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full flex items-center">
                  <span className="w-2 h-2 bg-red-500 rounded-full mr-1"></span>
                  Gagal terhubung ke database
                </div>
              )}
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>Keluar</Button>
        </div>

        {/* Quick Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">{testResults.length}</div>
              <p className="text-xs text-muted-foreground">Total Hasil Tes</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">
                {testResults.length > 0
                  ? Object.entries(intelligenceTypes).find(([key]) =>
                    key === (Object.entries(testResults.reduce((acc, curr) => {
                      acc[curr.dominantType] = (acc[curr.dominantType] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>))
                      .sort(([, a], [, b]) => b - a)[0]?.[0])
                  )?.[1] || '-'
                  : '-'
                }
              </div>
              <p className="text-xs text-muted-foreground">Kecerdasan Terbanyak</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="text-2xl font-bold">
                {testResults.length > 0
                  ? Math.round(testResults.reduce((acc, curr) => acc + curr.age, 0) / testResults.length)
                  : '-'}
              </div>
              <p className="text-xs text-muted-foreground">Rata-rata Usia</p>
            </CardContent>
          </Card>

          {/* <Card>
          <CardContent className="p-6">
            <div className="text-2xl font-bold">
              {testResults
                .filter(result => result.gender === 'Female' || result.gender === 'Perempuan')
                .length}:{testResults
                  .filter(result => result.gender === 'Male' || result.gender === 'Laki-laki')
                  .length}
            </div>
            <p className="text-xs text-muted-foreground">Rasio P:L</p>
          </CardContent>
        </Card> */}
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
        </div>        {/* Test Results Table */}        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Hasil Tes</CardTitle>
            {isLoading && <div className="text-sm text-blue-600 animate-pulse">Memuat data...</div>}
          </CardHeader>

          {/* Filter Section */}
          <div className="px-6 pb-4">
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-medium text-sm text-gray-700">Filter</h3>
                {isFilterActive() && (
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                    Filter Aktif
                  </span>
                )}
              </div>
              {/* Filter Summary Info */}
              <div className="mb-2 text-xs text-gray-500">
                Menampilkan {testResults.length} hasil tes
                {filters.studentClass !== 'all' && ` dari kelas "${filters.studentClass}"`}
                {filters.searchName && ` dengan nama mengandung "${filters.searchName}"`}
                {filters.dominantType !== 'all' && ` dengan tipe kecerdasan ${intelligenceTypes[filters.dominantType as IntelligenceType]}`}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {/* Filter by Class */}
                <div>
                  <Label htmlFor="class-filter" className="text-xs mb-1 block">Kelas/Jurusan</Label>
                  <Select
                    value={filters.studentClass}
                    onValueChange={(value) => handleFilterChange('studentClass', value)}
                  >
                    <SelectTrigger id="class-filter" className="w-full">
                      <SelectValue placeholder="Semua Kelas" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Kelas</SelectItem>
                      {availableClasses.map((cls) => (
                        <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Filter by Start Date */}
                <div>
                  <Label htmlFor="start-date" className="text-xs mb-1 block">Tanggal Mulai</Label>
                  <Input
                    id="start-date"
                    type="date"
                    value={filters.startDate}
                    onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  />
                </div>

                {/* Filter by End Date */}
                <div>
                  <Label htmlFor="end-date" className="text-xs mb-1 block">Tanggal Akhir</Label>
                  <Input
                    id="end-date"
                    type="date"
                    value={filters.endDate}
                    onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  />
                </div>

                {/* Search by Name */}
                <div>
                  <Label htmlFor="search-name" className="text-xs mb-1 block">Cari Nama</Label>
                  <Input
                    id="search-name"
                    placeholder="Nama siswa..."
                    value={filters.searchName}
                    onChange={(e) => handleFilterChange('searchName', e.target.value)}
                  />
                </div>

                {/* Filter by Dominant Type */}
                <div>
                  <Label htmlFor="intelligence-type" className="text-xs mb-1 block">Tipe Kecerdasan</Label>
                  <Select
                    value={filters.dominantType}
                    onValueChange={(value) => handleFilterChange('dominantType', value)}
                  >
                    <SelectTrigger id="intelligence-type" className="w-full">
                      <SelectValue placeholder="Semua Tipe" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Tipe</SelectItem>
                      {Object.entries(intelligenceTypes).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="mt-3 flex justify-end">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetFilters}
                >
                  Reset Filter
                </Button>
              </div>
            </div>
          </div>

          <CardContent>
            {/* Export data buttons */}
            <div className="flex justify-end gap-2 pt-4 pb-2">
              <p className="text-md pt-2 pb-1">Download :</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Create CSV data
                  const headers = ['Nama', 'Kelas', 'Tanggal', 'Usia', 'Gender', 'Email', 'Linguistik', 'Logis', 'Musikal', 'Kinestetik', 'Spasial', 'Interpersonal', 'Intrapersonal', 'Naturalis', 'Tipe Dominan'];

                  const csvRows = [headers.join(',')];
                  testResults.forEach(result => {
                    const row = [
                      `"${result.name}"`,
                      `"${result.studentClass}"`,
                      `"${new Date(result.date).toLocaleDateString('id-ID')}"`,
                      result.age,
                      `"${result.gender}"`,
                      `"${result.email}"`,
                      result.results.linguistic,
                      result.results.logical,
                      result.results.musical,
                      result.results.bodily,
                      result.results.spatial,
                      result.results.interpersonal,
                      result.results.intrapersonal,
                      result.results.naturalistic,
                      `"${intelligenceTypes[result.dominantType as IntelligenceType]}"`
                    ].join(',');
                    csvRows.push(row);
                  });

                  const csvContent = csvRows.join('\n');
                  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);

                  // Create download link and click it
                  const link = document.createElement('a');
                  const filename = `multiple-intelligence-results-${new Date().toISOString().split('T')[0]}.csv`;
                  link.setAttribute('href', url);
                  link.setAttribute('download', filename);
                  link.style.visibility = 'hidden';
                  document.body.appendChild(link);
                  link.click();
                  document.body.removeChild(link);

                  toast({
                    title: "Data diunduh",
                    description: `File ${filename} berhasil diunduh`
                  });
                }}
              >
                <File />
                CSV
              </Button>

              {/* Export to XLSX Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Prepare data for XLSX export
                  const headers = ['Nama', 'Kelas', 'Tanggal', 'Usia', 'Gender', 'Email', 'Linguistik', 'Logis', 'Musikal', 'Kinestetik', 'Spasial', 'Interpersonal', 'Intrapersonal', 'Naturalis', 'Tipe Dominan'];

                  const data = testResults.map(result => [
                    result.name,
                    result.studentClass,
                    new Date(result.date).toLocaleDateString('id-ID'),
                    result.age,
                    result.gender,
                    result.email,
                    result.results.linguistic,
                    result.results.logical,
                    result.results.musical,
                    result.results.bodily,
                    result.results.spatial,
                    result.results.interpersonal,
                    result.results.intrapersonal,
                    result.results.naturalistic,
                    intelligenceTypes[result.dominantType as IntelligenceType]
                  ]);

                  // Create workbook and worksheet
                  const ws = XLSX.utils.aoa_to_sheet([headers, ...data]);
                  const wb = XLSX.utils.book_new();
                  XLSX.utils.book_append_sheet(wb, ws, "Hasil Tes");

                  // Generate Excel file
                  const filename = `multiple-intelligence-results-${new Date().toISOString().split('T')[0]}.xlsx`;
                  XLSX.writeFile(wb, filename);

                  toast({
                    title: "Data diunduh",
                    description: `File Excel ${filename} berhasil diunduh`
                  });
                }}
              >
                <Sheet />
                Excel
              </Button>
              {/* Export to PDF Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  // Create new PDF document with landscape orientation for more space
                  const doc = new jsPDF({
                    orientation: 'landscape',
                    format: 'a4'
                  });

                  // Add title
                  doc.setFontSize(18);
                  doc.text("Hasil Tes Kecerdasan Majemuk", 14, 15);
                  doc.setFontSize(8);
                  doc.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID')}`, 14, 22);

                  // Manual table creation to fit everything on one page
                  // Configure table appearance
                  const margin = 12;
                  const pageWidth = doc.internal.pageSize.width;
                  const pageHeight = doc.internal.pageSize.height;
                  let startY = 30;

                  // Set column widths (must sum to pageWidth - 2*margin)
                  const colWidths = [
                    48, // Name
                    24, // Class
                    24, // Date
                    9,  // Lin
                    9,  // Log
                    9,  // Mus
                    9,  // Kin
                    9,  // Spl
                    9,  // Inter
                    9,  // Intra
                    9,  // Nat
                    24  // Dominant
                  ];

                  // Calculate row height based on content amount
                  const rowHeight = 7; // Reduced height for more rows

                  // Headers
                  const headers = ['Nama', 'Kelas', 'Tgl', 'Lin', 'Log', 'Mus', 'Kin', 'Spl', 'Inter', 'Intra', 'Nat', 'Dominan'];

                  // Draw header cells
                  doc.setFillColor(136, 132, 216);
                  doc.rect(margin, startY, pageWidth - (2 * margin), rowHeight, 'F');
                  doc.setTextColor(255, 255, 255);
                  doc.setFontSize(8);

                  let currentX = margin;
                  headers.forEach((header, i) => {
                    const textX = currentX + colWidths[i] / 2;
                    doc.text(header, textX, startY + 4.5, { align: 'center' });
                    currentX += colWidths[i];
                  });

                  // Draw data rows
                  startY += rowHeight;
                  doc.setTextColor(0, 0, 0);

                  // Limit rows per page to ensure it fits
                  const maxRows = Math.min(testResults.length, 30); // Limit to ensure single page

                  // Process each row of data
                  for (let i = 0; i < maxRows; i++) {
                    const result = testResults[i];

                    // Shade alternate rows for readability
                    if (i % 2 === 0) {
                      doc.setFillColor(246, 246, 252);
                      doc.rect(margin, startY, pageWidth - (2 * margin), rowHeight, 'F');
                    }

                    currentX = margin;

                    // Name (trim if too long)
                    const name = result.name.length > 20 ? result.name.substring(0, 18) + '...' : result.name;
                    doc.text(name, currentX + 3, startY + 4.5);
                    currentX += colWidths[0];

                    // Class (trim if too long)
                    const className = result.studentClass.length > 15 ? result.studentClass.substring(0, 13) + '...' : result.studentClass;
                    doc.text(className, currentX + 3, startY + 4.5);
                    currentX += colWidths[1];

                    // Date
                    const date = new Date(result.date).toLocaleDateString('id-ID').split('/').join('-');
                    doc.text(date, currentX + 3, startY + 4.5);
                    currentX += colWidths[2];

                    // Score cells
                    const scores = [
                      result.results.linguistic,
                      result.results.logical,
                      result.results.musical,
                      result.results.bodily,
                      result.results.spatial,
                      result.results.interpersonal,
                      result.results.intrapersonal,
                      result.results.naturalistic
                    ];

                    scores.forEach((score, j) => {
                      doc.text(String(score), currentX + colWidths[j + 3] / 2, startY + 4.5, { align: 'center' });
                      currentX += colWidths[j + 3];
                    });

                    // Dominant type (trim if too long)
                    const dominantType = intelligenceTypes[result.dominantType as IntelligenceType].replace(/[\p{Emoji_Presentation}\p{Emoji}\u200d]+/gu, '').trim();
                    const shortType = dominantType;
                    doc.text(shortType, currentX + 3, startY + 4.5);

                    // Move to next row
                    startY += rowHeight;
                  }

                  // Add truncation note if needed
                  if (testResults.length > maxRows) {
                    doc.setFontSize(8);
                    doc.setTextColor(100, 100, 100);
                    doc.text(
                      `* Menampilkan ${maxRows} dari ${testResults.length} hasil. Export ke Excel untuk data lengkap.`,
                      margin,
                      pageHeight - 10
                    );
                  }

                  // Draw borders around the entire table
                  doc.setDrawColor(210, 210, 210);
                  doc.rect(
                    margin,
                    30,
                    pageWidth - (2 * margin),
                    rowHeight * (maxRows + 1),
                    'S'
                  );

                  // Save the PDF
                  const filename = `multiple-intelligence-results-${new Date().toISOString().split('T')[0]}.pdf`;
                  doc.save(filename);

                  toast({
                    title: "Data diunduh",
                    description: `File PDF ${filename} berhasil diunduh`
                  });
                }}
              >
                <FileText />
                PDF
              </Button>
            </div>
            <div className="overflow-x-auto">
              <Table>
                <thead>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Kelas</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Ling</TableHead>
                    <TableHead>Logi</TableHead>
                    <TableHead>Musi</TableHead>
                    <TableHead>Kine</TableHead>
                    <TableHead>Spas</TableHead>
                    <TableHead>Inter</TableHead>
                    <TableHead>Intra</TableHead>
                    <TableHead>Natur</TableHead>
                    <TableHead>Tipe Dominan</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </thead>
                <TableBody>
                  {testResults.map((result) => (
                    <TableRow key={result.id}>
                      <TableCell className="font-medium">{result.name}</TableCell>
                      <TableCell>{result.studentClass}</TableCell>
                      <TableCell>{new Date(result.date).toLocaleDateString('id-ID')}</TableCell>
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
                            <Eye />
                          </Button>                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDeleteResult(result.id)}
                          >
                            <Trash />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {/* Error and empty states */}
              {error && (
                <div className="text-center py-8">
                  <p className="text-red-500">{error}</p>
                  <Button
                    variant="outline"
                    className="mt-2"
                    onClick={() => fetchTestResults()}
                  >
                    Coba Lagi
                  </Button>
                </div>
              )}

              {!isLoading && !error && testResults.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  Belum ada data hasil tes.
                </div>
              )}
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
                    </div>                    <div>
                      <p className="text-sm text-gray-500">Tanggal Tes:</p>
                      <p className="font-medium">{new Date(selectedResult.date).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}</p>
                    </div>
                  </div>                {/* Results Visualization - Radar Chart */}
                  <div>
                    <h3 className="font-bold text-lg mb-2">Skor Kecerdasan</h3>
                    <div className="h-64 w-full">
                      <Radar
                        data={{
                          labels: [
                            "Linguistik",
                            "Logis-Matematis",
                            "Musikal",
                            "Kinestetik-Tubuh",
                            "Spasial",
                            "Interpersonal",
                            "Intrapersonal",
                            "Naturalis"
                          ],
                          datasets: [
                            {
                              label: 'Skor',
                              data: [
                                selectedResult.results.linguistic,
                                selectedResult.results.logical,
                                selectedResult.results.musical,
                                selectedResult.results.bodily,
                                selectedResult.results.spatial,
                                selectedResult.results.interpersonal,
                                selectedResult.results.intrapersonal,
                                selectedResult.results.naturalistic,
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
                            }
                          },
                          maintainAspectRatio: false
                        }}
                      />
                    </div>

                    {/* Numerical scores table */}
                    <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                      {Object.entries(selectedResult.results)
                        .sort(([, a], [, b]) => b - a)
                        .map(([type, score]) => (
                          <div key={type} className="bg-gray-50 p-2 rounded">
                            <div className="text-sm text-gray-500">{intelligenceTypes[type as IntelligenceType]}</div>
                            <div className="font-medium text-purple-700">{score}%</div>
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
