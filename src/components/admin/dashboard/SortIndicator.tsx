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
    <div className="mt-3">
      {/* Simplified Sort indicator */}
      <div className="flex items-center justify-between text-xs text-gray-600 border-t pt-2">
        <div className="flex items-center">
          <ArrowUpDown className="h-3 w-3 mr-1 text-purple-600" />
          <span>
            Diurut: {getSortKeyLabel(sortConfig.key)} • {sortConfig.direction === 'ascending' ? 'Naik' : 'Turun'}
          </span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-5 w-5 p-0 rounded-full hover:bg-purple-50" 
          onClick={resetSort}
          title="Reset pengurutan"
        >
          <span className="sr-only">Reset urutan</span>
          <Trash className="h-3 w-3 text-purple-500" />
        </Button>
      </div>
    </div>
  );
};

export default SortIndicator;
