import { Card, CardContent } from "@/components/ui/card";
import { TestResult } from "@/data/testResultsTypes";
import { intelligenceTypes, IntelligenceType } from "@/data/testQuestions";
import { FC } from "react";

interface QuickStatsProps {
  testResults: TestResult[];
}

const QuickStats: FC<QuickStatsProps> = ({ testResults }) => {
  // Find most common intelligence type
  const getMostCommonIntelligence = () => {
    if (testResults.length === 0) return '-';

    const counts: Record<string, number> = {};
    testResults.forEach(result => {
      counts[result.dominantType] = (counts[result.dominantType] || 0) + 1;
    });
    
    const mostCommonType = Object.entries(counts)
      .sort(([, a], [, b]) => b - a)[0]?.[0];
      
    return intelligenceTypes[mostCommonType as IntelligenceType] || '-';
  };

  // Calculate average age
  const getAverageAge = () => {
    if (testResults.length === 0) return '-';
    
    const totalAge = testResults.reduce((acc, curr) => acc + curr.age, 0);
    return Math.round(totalAge / testResults.length);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 md:gap-4 mb-4 md:mb-6">
      <Card>
        <CardContent className="p-6">
          <div className="text-2xl font-bold">{testResults.length}</div>
          <p className="text-xs text-muted-foreground">Total Hasil Tes</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="text-2xl font-bold">
            {getMostCommonIntelligence()}
          </div>
          <p className="text-xs text-muted-foreground">Kecerdasan Terbanyak</p>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="text-2xl font-bold">
            {getAverageAge()}
          </div>
          <p className="text-xs text-muted-foreground">Rata-rata Usia</p>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuickStats;
