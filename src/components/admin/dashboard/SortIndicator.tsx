import { Button } from "@/components/ui/button";
import { ArrowUpDown, Trash } from "lucide-react";
import { FC } from "react";

interface SortIndicatorProps {
  sortConfig: {
    key: string;
    direction: 'ascending' | 'descending' | null;
  };
  resetSort: () => void;
}

const SortIndicator: FC<SortIndicatorProps> = ({ sortConfig, resetSort }) => {
  // Function to get user-friendly label for sort key
  const getSortKeyLabel = (key: string) => {
    const labelMap: Record<string, string> = {
      'name': 'Nama',
      'studentClass': 'Kelas',
      'date': 'Tanggal',
      'dominantType': 'Tipe Dominan',
      'results.linguistic': 'Skor Linguistik',
      'results.logical': 'Skor Logis',
      'results.musical': 'Skor Musikal',
      'results.bodily': 'Skor Kinestetik',
      'results.spatial': 'Skor Spasial',
      'results.interpersonal': 'Skor Interpersonal',
      'results.intrapersonal': 'Skor Intrapersonal',
      'results.naturalistic': 'Skor Naturalistik'
    };
    
    return labelMap[key] || key;
  };

  if (!sortConfig.key) return null;

  return (
    <div className="px-6 pb-2">
      {/* Sort indicator */}
      <div className="flex items-center bg-purple-50 p-2 rounded-md mb-4">
        <ArrowUpDown className="h-4 w-4 text-purple-600 mr-2" />
        <span className="text-sm text-purple-700">
          Diurutkan berdasarkan: <span className="font-medium">
            {getSortKeyLabel(sortConfig.key)}
          </span> ({sortConfig.direction === 'ascending' ? 'Naik' : 'Turun'})
        </span>
        <Button 
          variant="ghost" 
          size="sm" 
          className="ml-auto h-8 w-8 p-0" 
          onClick={resetSort}
        >
          <span className="sr-only">Reset urutan</span>
          <Trash className="h-4 w-4 text-purple-600" />
        </Button>
      </div>
      
      {/* Sorting instruction */}
      <div className="bg-blue-50 border-l-4 border-blue-400 p-2.5 mb-4 flex items-center">
        <div className="text-blue-700 text-sm">
          <span className="font-semibold">Tip:</span> Klik pada header tabel untuk mengurutkan data. Klik sekali lagi untuk mengubah urutan.
        </div>
      </div>
    </div>
  );
};

export default SortIndicator;
