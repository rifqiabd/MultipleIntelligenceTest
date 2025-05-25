import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { intelligenceTypes, IntelligenceType } from "@/data/testQuestions";
import { FC, useState } from "react";

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
  const [showFilters, setShowFilters] = useState<boolean>(false);
  
  // Fungsi untuk mendapatkan ringkasan filter yang aktif
  const getActiveFilterSummary = () => {
    const activeFilters = [];
    if (filters.studentClass !== 'all') activeFilters.push(`Kelas: ${filters.studentClass}`);
    if (filters.searchName) activeFilters.push(`Nama: ${filters.searchName}`);
    if (filters.dominantType !== 'all') activeFilters.push(`Tipe: ${intelligenceTypes[filters.dominantType as IntelligenceType]}`);
    if (filters.startDate) activeFilters.push(`Dari: ${filters.startDate}`);
    if (filters.endDate) activeFilters.push(`Sampai: ${filters.endDate}`);
    
    return activeFilters.length > 0 ? activeFilters.join(' • ') : '';
  };
  
  return (
    <div className="px-6 pb-4">
      {showFilters ? (
        <div className="bg-white border border-gray-100 rounded-lg shadow-sm mb-4">
          <div className="flex justify-between items-center p-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-500 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <h3 className="font-medium text-sm text-gray-700">Filter Data</h3>
              </div>
              {isFilterActive() && (
                <span className="bg-blue-100 text-blue-700 text-xs font-medium px-2 py-1 rounded-full">
                  Filter Aktif
                </span>
              )}
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              className="h-7 text-xs hover:bg-gray-100"
              onClick={() => setShowFilters(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
              Tutup
            </Button>
          </div>
          
          {isFilterActive() && (
            <div className="px-3 py-2 bg-blue-50 text-xs text-blue-700 border-b border-blue-100 flex items-start">
              <div className="shrink-0 mr-2 mt-0.5">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>{getActiveFilterSummary()}</div>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            {isFilterActive() && (
              <span className="bg-blue-50 border border-blue-200 text-blue-700 text-xs font-medium px-2 py-1 rounded-full flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                {getActiveFilterSummary() || 'Filter Aktif'}
              </span>
            )}
          </div>
          <Button
            variant={isFilterActive() ? "default" : "outline"}
            size="sm"
            onClick={() => setShowFilters(true)}
            className="text-xs h-7 px-2.5 gap-1.5"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filter
          </Button>
        </div>
      )}
        
        {showFilters && (
          <div className="p-4">
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-x-4 gap-y-3">
              {/* Filter by Class */}
              <div>
                <Label htmlFor="class-filter" className="text-xs font-medium text-gray-700 mb-1 block">Kelas/Jurusan</Label>
                <Select
                  value={filters.studentClass}
                  onValueChange={(value) => onFilterChange('studentClass', value)}
                >
                  <SelectTrigger id="class-filter" className="h-8 text-xs">
                    <SelectValue placeholder="Semua Kelas" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Kelas</SelectItem>
                    {availableClasses.map((cls) => (
                      <SelectItem key={cls} value={cls}>{cls}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {filters.studentClass !== 'all' && (
                  <div className="mt-1 text-xs text-blue-600">Aktif: {filters.studentClass}</div>
                )}
              </div>

              {/* Filter by Name */}
              <div>
                <Label htmlFor="search-name" className="text-xs font-medium text-gray-700 mb-1 block">Cari Nama</Label>
                <Input
                  id="search-name"
                  placeholder="Nama siswa..."
                  value={filters.searchName}
                  onChange={(e) => onFilterChange('searchName', e.target.value)}
                  className="h-8 text-xs"
                />
                {filters.searchName && (
                  <div className="mt-1 text-xs text-blue-600">Aktif: "{filters.searchName}"</div>
                )}
              </div>

              {/* Filter by Intelligence Type */}
              <div>
                <Label htmlFor="intelligence-type" className="text-xs font-medium text-gray-700 mb-1 block">Tipe Kecerdasan</Label>
                <Select
                  value={filters.dominantType}
                  onValueChange={(value) => onFilterChange('dominantType', value)}
                >
                  <SelectTrigger id="intelligence-type" className="h-8 text-xs">
                    <SelectValue placeholder="Semua Tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Tipe</SelectItem>
                    {Object.entries(intelligenceTypes).map(([key, label]) => (
                      <SelectItem key={key} value={key}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {filters.dominantType !== 'all' && (
                  <div className="mt-1 text-xs text-blue-600">
                    Aktif: {intelligenceTypes[filters.dominantType as IntelligenceType]}
                  </div>
                )}
              </div>

              {/* Filter by Date Range */}
              <div className="md:col-span-2">
                <Label className="text-xs font-medium text-gray-700 mb-1 block">Rentang Tanggal</Label>
                <div className="flex gap-2">
                  <div className="flex-1">
                    <Input
                      id="start-date"
                      type="date"
                      value={filters.startDate}
                      onChange={(e) => onFilterChange('startDate', e.target.value)}
                      className="h-8 text-xs"
                      placeholder="Tanggal mulai"
                    />
                  </div>
                  <div className="flex items-center text-gray-400">-</div>
                  <div className="flex-1">
                    <Input
                      id="end-date"
                      type="date"
                      value={filters.endDate}
                      onChange={(e) => onFilterChange('endDate', e.target.value)}
                      className="h-8 text-xs"
                      placeholder="Tanggal akhir"
                    />
                  </div>
                </div>
                {(filters.startDate || filters.endDate) && (
                  <div className="mt-1 text-xs text-blue-600">
                    Aktif: {filters.startDate ? filters.startDate : 'Awal'} - {filters.endDate ? filters.endDate : 'Sekarang'}
                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-4 pt-3 border-t flex justify-between">
              <div className="text-xs text-gray-500">
                {isFilterActive() ? 
                  <span className="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5 mr-1 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    Menampilkan {testResultsCount} hasil dengan filter aktif
                  </span> 
                  :
                  <span>Menampilkan semua {testResultsCount} hasil</span>
                }
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={onResetFilters}
                className="h-7 text-xs flex items-center gap-1"
                disabled={!isFilterActive()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reset Filter
              </Button>
            </div>
          </div>
        )}
    </div>
  );
};

export default Filters;
