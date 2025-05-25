import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { TestResult } from "@/data/testResultsTypes";
import { intelligenceTypes, IntelligenceType } from "@/data/testQuestions";
import { File, Sheet, FileText, Loader2 } from "lucide-react";
import { FC, useState } from "react";
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';

interface ExportButtonsProps {
  testResults: TestResult[];
}

const ExportButtons: FC<ExportButtonsProps> = ({ testResults }) => {
  const { toast } = useToast();
  const [isExporting, setIsExporting] = useState<{csv: boolean; excel: boolean; pdf: boolean}>({
    csv: false,
    excel: false,
    pdf: false
  });

  // Export to CSV
  const exportToCsv = () => {
    return new Promise<void>((resolve, reject) => {
      try {
        const headers = ['Nama', 'Kelas', 'Tanggal', 'Usia', 'Gender', 'Linguistik', 'Logis', 'Musikal', 'Kinestetik', 'Spasial', 'Interpersonal', 'Intrapersonal', 'Naturalis', 'Tipe Dominan'];

        const csvRows = [headers.join(',')];
        testResults.forEach(result => {
          const row = [
            `"${result.name}"`,
            `"${result.studentClass}"`,
            `"${new Date(result.date).toLocaleDateString('id-ID')}"`,
            result.age,
            `"${result.gender}"`,
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
          title: "Export CSV Berhasil",
          description: `File "${filename}" berhasil diunduh dengan ${testResults.length} data.`,
          variant: "default",
          className: "bg-blue-50 border-blue-200",
        });
        
        setTimeout(resolve, 500); // Allow time for browser to process download
      } catch (error) {
        reject(error);
      }
    });
  };

  // Export to Excel
  const exportToExcel = () => {
    return new Promise<void>((resolve, reject) => {
      try {
        // Prepare data for XLSX export
        const headers = ['Nama', 'Kelas', 'Tanggal', 'Usia', 'Gender', 'Linguistik', 'Logis', 'Musikal', 'Kinestetik', 'Spasial', 'Interpersonal', 'Intrapersonal', 'Naturalis', 'Tipe Dominan'];

        const data = testResults.map(result => [
          result.name,
          result.studentClass,
          new Date(result.date).toLocaleDateString('id-ID'),
          result.age,
          result.gender,
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
          title: "Export Excel Berhasil",
          description: `File "${filename}" berhasil diunduh dengan ${testResults.length} data.`,
          variant: "default",
          className: "bg-green-50 border-green-200",
        });

        setTimeout(resolve, 500); // Allow time for browser to process download
      } catch (error) {
        reject(error);
      }
    });
  };

  // Export to PDF
  const exportToPdf = () => {
    return new Promise<void>((resolve, reject) => {
      try {
        // Create new PDF document with landscape orientation for more space
        const doc = new jsPDF({
          orientation: 'landscape',
          format: 'a4'
        });

        // Add title with styling
        doc.setFontSize(18);
        doc.setTextColor(136, 132, 216);
        doc.text("Hasil Tes Kecerdasan Majemuk", 14, 15);
        
        // Add subtitle with date
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text(`Dicetak pada: ${new Date().toLocaleDateString('id-ID')} - ${new Date().toLocaleTimeString('id-ID')}`, 14, 22);

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
        const maxRowsPerPage = 30;
        const totalPages = Math.ceil(testResults.length / maxRowsPerPage);
        let dataProcessed = 0;
        
        // Function to add a page of data
        const addDataPage = (pageNum: number) => {
          if (pageNum > 0) {
            doc.addPage();
            startY = 20;
            
            // Add small header for continuation pages
            doc.setFontSize(12);
            doc.setTextColor(136, 132, 216);
            doc.text("Hasil Tes Kecerdasan Majemuk", 14, 15);
            
            // Draw header cells again
            doc.setFillColor(136, 132, 216);
            doc.rect(margin, startY, pageWidth - (2 * margin), rowHeight, 'F');
            doc.setTextColor(255, 255, 255);
            doc.setFontSize(8);
            
            currentX = margin;
            headers.forEach((header, i) => {
              const textX = currentX + colWidths[i] / 2;
              doc.text(header, textX, startY + 4.5, { align: 'center' });
              currentX += colWidths[i];
            });
            
            startY += rowHeight;
            doc.setTextColor(0, 0, 0);
          }
          
          // Calculate which slice of data to process
          const startIdx = pageNum * maxRowsPerPage;
          const endIdx = Math.min(startIdx + maxRowsPerPage, testResults.length);
          
          // Process rows for this page
          for (let i = startIdx; i < endIdx; i++) {
            const result = testResults[i];
            dataProcessed++;

            // Shade alternate rows for readability
            if ((i - startIdx) % 2 === 0) {
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
            doc.text(dominantType, currentX + 3, startY + 4.5);

            // Move to next row
            startY += rowHeight;
          }
          
          // Draw borders around the entire table
          doc.setDrawColor(210, 210, 210);
          doc.rect(
            margin,
            pageNum === 0 ? 30 : 20,
            pageWidth - (2 * margin),
            rowHeight * ((endIdx - startIdx) + 1),
            'S'
          );
          
          // Add page number
          doc.setFontSize(8);
          doc.setTextColor(100, 100, 100);
          doc.text(
            `Halaman ${pageNum + 1} dari ${totalPages}`,
            pageWidth - margin,
            pageHeight - 10,
            { align: 'right' }
          );
        };
        
        // Generate all pages
        for (let page = 0; page < totalPages; page++) {
          addDataPage(page);
        }

        // Save the PDF
        const filename = `multiple-intelligence-results-${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(filename);

        toast({
          title: "Export PDF Berhasil",
          description: `File "${filename}" berhasil diunduh dengan ${testResults.length} data${totalPages > 1 ? ` (${totalPages} halaman)` : ''}.`,
          variant: "default",
          className: "bg-red-50 border-red-200",
        });
        
        setTimeout(resolve, 500); // Allow time for browser to process download
      } catch (error) {
        reject(error);
      }
    });
  };

  // Handle empty data case
  const handleEmptyData = () => {
    toast({
      title: "Tidak Ada Data untuk Diexport",
      description: "Tidak ada data hasil tes yang tersedia untuk diexport. Tunggu hingga ada siswa yang mengikuti tes.",
      variant: "destructive",
      className: "border-red-200",
    });
  };

  // Check if we have data to export
  const hasData = testResults && testResults.length > 0;

  // Export to CSV with empty data check
  const handleExportToCsv = async () => {
    if (!hasData) {
      handleEmptyData();
      return;
    }
    
    try {
      setIsExporting(prev => ({ ...prev, csv: true }));
      await exportToCsv();
    } catch (error) {
      console.error("Error exporting to CSV:", error);
      toast({
        title: "Export Gagal",
        description: "Terjadi kesalahan saat mengexport data ke CSV.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(prev => ({ ...prev, csv: false }));
    }
  };

  // Export to Excel with empty data check
  const handleExportToExcel = async () => {
    if (!hasData) {
      handleEmptyData();
      return;
    }
    
    try {
      setIsExporting(prev => ({ ...prev, excel: true }));
      await exportToExcel();
    } catch (error) {
      console.error("Error exporting to Excel:", error);
      toast({
        title: "Export Gagal",
        description: "Terjadi kesalahan saat mengexport data ke Excel.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(prev => ({ ...prev, excel: false }));
    }
  };

  // Export to PDF with empty data check
  const handleExportToPdf = async () => {
    if (!hasData) {
      handleEmptyData();
      return;
    }
    
    try {
      setIsExporting(prev => ({ ...prev, pdf: true }));
      await exportToPdf();
    } catch (error) {
      console.error("Error exporting to PDF:", error);
      toast({
        title: "Export Gagal",
        description: "Terjadi kesalahan saat mengexport data ke PDF.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(prev => ({ ...prev, pdf: false }));
    }
  };

  return (
    <div>
      <div className="flex items-center mb-3">
        <h3 className="text-sm font-medium text-gray-700">Export Data</h3>
        <div className="ml-3 text-xs font-medium bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full border border-gray-200">
          {hasData ? (
            <span className="flex items-center">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
              {testResults.length} data siap export
            </span>
          ) : (
            <span className="flex items-center">
              <span className="w-2 h-2 bg-red-500 rounded-full mr-1.5"></span>
              Tidak ada data
            </span>
          )}
        </div>
      </div>
      
      <p className="text-sm mb-2 text-gray-600">Pilih format export:</p>
      
      <div className="flex flex-wrap gap-2">
        <Button
          variant="outline"
          size="sm"
          className="bg-white hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-sm"
          onClick={handleExportToCsv}
          disabled={!hasData || isExporting.csv}
          title={hasData ? `Export ${testResults.length} data ke CSV` : "Tidak ada data untuk diexport"}
        >
          <File className="h-4 w-4 mr-2 text-blue-500" />
          <span className="font-medium">CSV</span>
          {isExporting.csv && <Loader2 className="ml-2 h-3 w-3 animate-spin" />}
        </Button>

        <Button
          variant="outline"
          size="sm"
          className="bg-white hover:bg-green-50 hover:text-green-600 hover:border-green-200 transition-all shadow-sm"
          onClick={handleExportToExcel}
          disabled={!hasData || isExporting.excel}
          title={hasData ? `Export ${testResults.length} data ke Excel` : "Tidak ada data untuk diexport"}
        >
          <Sheet className="h-4 w-4 mr-2 text-green-500" />
          <span className="font-medium">Excel</span>
          {isExporting.excel && <Loader2 className="ml-2 h-3 w-3 animate-spin" />}
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="bg-white hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all shadow-sm"
          onClick={handleExportToPdf}
          disabled={!hasData || isExporting.pdf}
          title={hasData ? `Export ${testResults.length} data ke PDF${testResults.length > 30 ? ' (multi-halaman)' : ''}` : "Tidak ada data untuk diexport"}
        >
          <FileText className="h-4 w-4 mr-2 text-red-500" />
          <span className="font-medium">PDF</span>
          {isExporting.pdf && <Loader2 className="ml-2 h-3 w-3 animate-spin" />}
        </Button>
      </div>
    </div>
  );
};

export default ExportButtons;
