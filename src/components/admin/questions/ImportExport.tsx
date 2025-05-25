import { useState } from "react";
import { Question } from "@/data/testQuestions";
import { useToast } from "@/components/ui/use-toast";
import apiService from "@/services/api";
import { Button } from "@/components/ui/button";
import { 
  Card,
  CardContent,
  CardDescription,
  CardTitle
} from "@/components/ui/card";
import { Upload, Download, AlertCircle } from "lucide-react";

interface ImportExportProps {
  questions: Question[];
  onImportSuccess: () => void;
}

export function ImportExport({ questions, onImportSuccess }: ImportExportProps) {
  const [isImporting, setIsImporting] = useState(false);
  const { toast } = useToast();
  
  // Handle file import
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    setIsImporting(true);
    try {
      const { success, error } = await apiService.questions.import(file);
      
      if (success) {
        toast({
          title: "Import berhasil",
          description: "Soal-soal berhasil diimpor.",
        });
        onImportSuccess(); // Refresh questions list
      } else {
        throw error || new Error("Gagal mengimpor soal");
      }
    } catch (err) {
      console.error("Error importing questions:", err);
      toast({
        title: "Import gagal",
        description: String(err),
        variant: "destructive",
      });
    } finally {
      setIsImporting(false);
      // Reset file input
      event.target.value = '';
    }
  };
  
  // Handle export
  const handleExport = () => {
    if (questions.length === 0) {
      toast({
        title: "Tidak ada data",
        description: "Tidak ada soal yang dapat diekspor.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      // Create JSON blob
      const jsonData = JSON.stringify(questions, null, 2);
      const blob = new Blob([jsonData], { type: "application/json" });
      
      // Create download link
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `kecerdasan-majemuk-soal-${new Date().toISOString().split('T')[0]}.json`;
      
      // Trigger download
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Export berhasil",
        description: `${questions.length} soal berhasil diekspor.`,
      });
    } catch (err) {
      console.error("Error exporting questions:", err);
      toast({
        title: "Export gagal",
        description: String(err),
        variant: "destructive",
      });
    }
  };

  return (
    <Card className="mt-6 bg-slate-50">
      <CardContent className="pt-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle className="text-lg">Import & Export Data Soal</CardTitle>
            <CardDescription className="mt-1">
              Impor soal dari file JSON atau ekspor soal yang ada
            </CardDescription>
          </div>
          
          <div className="flex flex-wrap gap-2 w-full sm:w-auto">
            <Button
              variant="outline"
              onClick={() => document.getElementById("import-file")?.click()}
              disabled={isImporting}
              className="flex-1 sm:flex-auto justify-center transition-all duration-200 hover:border-primary/70 hover:shadow-sm"
            >
              <Upload className={`h-4 w-4 mr-2 ${isImporting ? '' : 'animate-bounce'}`} />
              {isImporting ? 
                <span className="flex items-center">
                  <span className="inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-t-2 border-current mr-2"></span>
                  <span className="hidden xs:inline">Mengimport...</span>
                  <span className="xs:hidden">Import...</span>
                </span> 
                : 
                <>
                  <span className="hidden xs:inline">Import Soal</span>
                  <span className="xs:hidden">Import</span>
                </>
              }
            </Button>
            <input
              id="import-file"
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            
            <Button 
              variant="secondary" 
              onClick={handleExport}
              disabled={questions.length === 0}
              className="flex-1 sm:flex-auto justify-center transition-all duration-200 hover:shadow-sm"
            >
              <Download className="h-4 w-4 mr-2" />
              <span className="hidden xs:inline">Export Soal</span>
              <span className="xs:hidden">Export</span>
              {questions.length > 0 && (
                <span className="ml-1 text-xs bg-secondary-foreground/20 px-1.5 py-0.5 rounded-full hidden xs:inline-block">
                  {questions.length}
                </span>
              )}
            </Button>
          </div>
        </div>
        
        <div className="mt-4 flex items-start text-sm text-amber-600 bg-amber-50 p-3 rounded-md overflow-hidden shadow-sm border border-amber-100">
          <AlertCircle className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
          <div className="overflow-x-auto text-xs sm:text-sm">
            <p><strong>Format Import:</strong> File JSON harus berisi array objek dengan struktur <code className="text-xs bg-amber-100 px-1 py-0.5 rounded">{`{id, text, type}`}</code>.</p>
            <p className="mt-1 relative">
              <span className="hidden xs:inline">Contoh:</span> 
              <div className="overflow-x-auto pb-1">
                <code className="text-xs bg-amber-100/50 px-1.5 py-1 rounded block whitespace-nowrap">{`[{"id":"L1","text":"Saya suka membaca buku","type":"linguistic"}]`}</code>
              </div>
              <div className="absolute -bottom-0.5 right-0 h-6 w-12 bg-gradient-to-l from-amber-50 to-transparent pointer-events-none xs:hidden"></div>
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
