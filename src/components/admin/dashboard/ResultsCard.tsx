import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TestResult } from "@/data/testResultsTypes";
import { FC } from "react";
import Filters from "./Filters";
import SortIndicator from "./SortIndicator";
import ExportButtons from "./ExportButtons";
import ResultsTable from "./ResultsTable";

interface ResultsCardProps {
  testResults: TestResult[];
  availableClasses: string[];
  filters: {
    studentClass: string;
    startDate: string;
    endDate: string;
    searchName: string;
    dominantType: string;
  };
  sortConfig: {
    key: string;
    direction: 'ascending' | 'descending' | null;
  };
  isLoading: boolean;
  error: string | null;
  isFilterActive: () => boolean;
  onFilterChange: (key: string, value: string) => void;
  onResetFilters: () => void;
  onSort: (key: string) => void;
  onResetSort: () => void;
  onView: (result: TestResult) => void;
  onDelete: (id: string) => void;
  onRetry: () => void;
}

const ResultsCard: FC<ResultsCardProps> = ({
  testResults,
  availableClasses,
  filters,
  sortConfig,
  isLoading,
  error,
  isFilterActive,
  onFilterChange,
  onResetFilters,
  onSort,
  onResetSort,
  onView,
  onDelete,
  onRetry
}) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Hasil Tes</CardTitle>
        {isLoading && <div className="text-sm text-blue-600 animate-pulse">Memuat data...</div>}
      </CardHeader>

      {/* Filter Section */}
      <Filters 
        filters={filters}
        availableClasses={availableClasses}
        testResultsCount={testResults.length}
        onFilterChange={onFilterChange}
        onResetFilters={onResetFilters}
        isFilterActive={isFilterActive}
      />

      <CardContent>
        {/* Sort Indicator */}
        <SortIndicator 
          sortConfig={sortConfig}
          resetSort={onResetSort}
        />
        
        {/* Results Table */}
        <ResultsTable 
          testResults={testResults}
          sortConfig={sortConfig}
          onSort={onSort}
          onView={onView}
          onDelete={onDelete}
          error={error}
          isLoading={isLoading}
          onRetry={onRetry}
        />
        
        {/* Export Buttons - Moved below table */}
        <div className="mt-6 pt-3 border-t">
          <ExportButtons testResults={testResults} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ResultsCard;
