import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { intelligenceTypes, IntelligenceType } from "@/data/testQuestions";
import { FC } from "react";

interface FilterProps {
  filters: {
    studentClass: string;
    startDate: string;
    endDate: string;
    searchName: string;
    dominantType: string;
  };
  availableClasses: string[];
  testResultsCount: number;
  onFilterChange: (key: string, value: string) => void;
  onResetFilters: () => void;
  isFilterActive: () => boolean;
}

const Filters: FC<FilterProps> = ({
  filters,
  availableClasses,
  testResultsCount,
  onFilterChange,
  onResetFilters,
  isFilterActive
}) => {
  return (
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
          Menampilkan {testResultsCount} hasil tes
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
              onValueChange={(value) => onFilterChange('studentClass', value)}
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
              onChange={(e) => onFilterChange('startDate', e.target.value)}
            />
          </div>

          {/* Filter by End Date */}
          <div>
            <Label htmlFor="end-date" className="text-xs mb-1 block">Tanggal Akhir</Label>
            <Input
              id="end-date"
              type="date"
              value={filters.endDate}
              onChange={(e) => onFilterChange('endDate', e.target.value)}
            />
          </div>

          {/* Search by Name */}
          <div>
            <Label htmlFor="search-name" className="text-xs mb-1 block">Cari Nama</Label>
            <Input
              id="search-name"
              placeholder="Nama siswa..."
              value={filters.searchName}
              onChange={(e) => onFilterChange('searchName', e.target.value)}
            />
          </div>

          {/* Filter by Dominant Type */}
          <div>
            <Label htmlFor="intelligence-type" className="text-xs mb-1 block">Tipe Kecerdasan</Label>
            <Select
              value={filters.dominantType}
              onValueChange={(value) => onFilterChange('dominantType', value)}
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
            onClick={onResetFilters}
          >
            Reset Filter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Filters;
