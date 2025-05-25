import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { TooltipProvider, Tooltip, TooltipTrigger, TooltipContent } from "@/components/ui/tooltip";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { TestResult } from "@/data/testResultsTypes";
import { intelligenceTypes, IntelligenceType } from "@/data/testQuestions";
import { Eye, Trash, ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { FC, useState, useEffect } from "react";

interface ResultsTableProps {
  testResults: TestResult[];
  sortConfig: {
    key: string;
    direction: 'ascending' | 'descending' | null;
  };
  onSort: (key: string) => void;
  onView: (result: TestResult) => void;
  onDelete: (id: string) => void;
  error: string | null;
  isLoading: boolean;
  onRetry: () => void;
}

const ResultsTable: FC<ResultsTableProps> = ({
  testResults,
  sortConfig,
  onSort,
  onView,
  onDelete,
  error,
  isLoading,
  onRetry
}) => {
  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  
  // Calculate pagination values
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = testResults.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(testResults.length / itemsPerPage);
  
  // Reset to first page when test results change
  useEffect(() => {
    setCurrentPage(1);
  }, [testResults.length]);
  
  // Function to change page
  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };
  
  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pageNumbers: number[] = [];
    const maxPagesToShow = 5; // Max number of page buttons to show
    
    if (totalPages <= maxPagesToShow) {
      // Show all pages if they're fewer than maxPagesToShow
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      // Always show first page
      pageNumbers.push(1);
      
      if (currentPage <= 3) {
        // Near the beginning
        pageNumbers.push(2, 3);
        pageNumbers.push(-1); // Ellipsis
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near the end
        pageNumbers.push(-1); // Ellipsis
        pageNumbers.push(totalPages - 2, totalPages - 1, totalPages);
      } else {
        // Somewhere in the middle
        pageNumbers.push(-1); // Ellipsis
        pageNumbers.push(currentPage - 1, currentPage, currentPage + 1);
        pageNumbers.push(-1); // Ellipsis
        pageNumbers.push(totalPages);
      }
    }
    
    return pageNumbers;
  };
  return (
    <div className="overflow-x-auto mt-3">
      <TooltipProvider>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50" 
                onClick={() => onSort('name')}
              >
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-1">
                      <span>Nama</span>
                      {sortConfig.key === 'name' ? (
                        sortConfig.direction === 'ascending' ? 
                          <ArrowUp className="h-4 w-4 text-purple-600" /> : 
                          <ArrowDown className="h-4 w-4 text-purple-600" />
                      ) : (
                        <ArrowUpDown className="h-4 w-4 text-gray-400" />
                      )}
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p>Klik untuk mengurutkan berdasarkan nama</p>
                  </TooltipContent>
                </Tooltip>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => onSort('studentClass')}
              >
                <div className="flex items-center space-x-1">
                  <span>Kelas</span>
                  {sortConfig.key === 'studentClass' ? (
                    sortConfig.direction === 'ascending' ? 
                      <ArrowUp className="h-4 w-4 text-purple-600" /> : 
                      <ArrowDown className="h-4 w-4 text-purple-600" />
                  ) : (
                    <ArrowUpDown className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => onSort('date')}
              >
                <div className="flex items-center space-x-1">
                  <span>Tanggal</span>
                  {sortConfig.key === 'date' ? (
                    sortConfig.direction === 'ascending' ? 
                      <ArrowUp className="h-4 w-4 text-purple-600" /> : 
                      <ArrowDown className="h-4 w-4 text-purple-600" />
                  ) : (
                    <ArrowUpDown className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => onSort('results.linguistic')}
              >
                <div className="flex items-center space-x-1">
                  <span>Ling</span>
                  {sortConfig.key === 'results.linguistic' ? (
                    sortConfig.direction === 'ascending' ? 
                      <ArrowUp className="h-4 w-4 text-purple-600" /> : 
                      <ArrowDown className="h-4 w-4 text-purple-600" />
                  ) : (
                    <ArrowUpDown className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => onSort('results.logical')}
              >
                <div className="flex items-center space-x-1">
                  <span>Logi</span>
                  {sortConfig.key === 'results.logical' ? (
                    sortConfig.direction === 'ascending' ? 
                      <ArrowUp className="h-4 w-4 text-purple-600" /> : 
                      <ArrowDown className="h-4 w-4 text-purple-600" />
                  ) : (
                    <ArrowUpDown className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => onSort('results.musical')}
              >
                <div className="flex items-center space-x-1">
                  <span>Musi</span>
                  {sortConfig.key === 'results.musical' ? (
                    sortConfig.direction === 'ascending' ? 
                      <ArrowUp className="h-4 w-4 text-purple-600" /> : 
                      <ArrowDown className="h-4 w-4 text-purple-600" />
                  ) : (
                    <ArrowUpDown className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => onSort('results.bodily')}
              >
                <div className="flex items-center space-x-1">
                  <span>Kine</span>
                  {sortConfig.key === 'results.bodily' ? (
                    sortConfig.direction === 'ascending' ? 
                      <ArrowUp className="h-4 w-4 text-purple-600" /> : 
                      <ArrowDown className="h-4 w-4 text-purple-600" />
                  ) : (
                    <ArrowUpDown className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => onSort('results.spatial')}
              >
                <div className="flex items-center space-x-1">
                  <span>Spas</span>
                  {sortConfig.key === 'results.spatial' ? (
                    sortConfig.direction === 'ascending' ? 
                      <ArrowUp className="h-4 w-4 text-purple-600" /> : 
                      <ArrowDown className="h-4 w-4 text-purple-600" />
                  ) : (
                    <ArrowUpDown className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => onSort('results.interpersonal')}
              >
                <div className="flex items-center space-x-1">
                  <span>Inter</span>
                  {sortConfig.key === 'results.interpersonal' ? (
                    sortConfig.direction === 'ascending' ? 
                      <ArrowUp className="h-4 w-4 text-purple-600" /> : 
                      <ArrowDown className="h-4 w-4 text-purple-600" />
                  ) : (
                    <ArrowUpDown className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => onSort('results.intrapersonal')}
              >
                <div className="flex items-center space-x-1">
                  <span>Intra</span>
                  {sortConfig.key === 'results.intrapersonal' ? (
                    sortConfig.direction === 'ascending' ? 
                      <ArrowUp className="h-4 w-4 text-purple-600" /> : 
                      <ArrowDown className="h-4 w-4 text-purple-600" />
                  ) : (
                    <ArrowUpDown className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => onSort('results.naturalistic')}
              >
                <div className="flex items-center space-x-1">
                  <span>Natur</span>
                  {sortConfig.key === 'results.naturalistic' ? (
                    sortConfig.direction === 'ascending' ? 
                      <ArrowUp className="h-4 w-4 text-purple-600" /> : 
                      <ArrowDown className="h-4 w-4 text-purple-600" />
                  ) : (
                    <ArrowUpDown className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </TableHead>
              <TableHead 
                className="cursor-pointer hover:bg-gray-50"
                onClick={() => onSort('dominantType')}
              >
                <div className="flex items-center space-x-1">
                  <span>Tipe Dominan</span>
                  {sortConfig.key === 'dominantType' ? (
                    sortConfig.direction === 'ascending' ? 
                      <ArrowUp className="h-4 w-4 text-purple-600" /> : 
                      <ArrowDown className="h-4 w-4 text-purple-600" />
                  ) : (
                    <ArrowUpDown className="h-4 w-4 text-gray-400" />
                  )}
                </div>
              </TableHead>
              <TableHead>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {currentItems.map((result) => (
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
                      onClick={() => onView(result)}
                    >
                      <Eye />
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onDelete(result.id)}
                    >
                      <Trash />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TooltipProvider>
      
      {/* Error and empty states */}
      {error && (
        <div className="text-center py-8">
          <p className="text-red-500">{error}</p>
          <Button
            variant="outline"
            className="mt-2"
            onClick={onRetry}
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
      
      {/* Pagination */}
      {testResults.length > 0 && (
        <div className="mt-4">
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <div>
              Menampilkan {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, testResults.length)} dari {testResults.length} hasil
            </div>
            <div>
              Halaman {currentPage} dari {totalPages}
            </div>
          </div>
          
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious 
                  onClick={() => paginate(currentPage - 1)} 
                  className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  aria-disabled={currentPage === 1}
                />
              </PaginationItem>
              
              {getPageNumbers().map((number, idx) => (
                number === -1 ? (
                  <PaginationItem key={`ellipsis-${idx}`}>
                    <PaginationEllipsis />
                  </PaginationItem>
                ) : (
                  <PaginationItem key={number}>
                    <PaginationLink
                      onClick={() => paginate(number)}
                      isActive={currentPage === number}
                    >
                      {number}
                    </PaginationLink>
                  </PaginationItem>
                )
              ))}
              
              <PaginationItem>
                <PaginationNext 
                  onClick={() => paginate(currentPage + 1)} 
                  className={currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"}
                  aria-disabled={currentPage === totalPages}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default ResultsTable;
