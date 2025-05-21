import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { TestResult, getChartData } from "@/data/testResultsTypes";
import { intelligenceTypes, IntelligenceType } from "@/data/testQuestions";
import { FC } from "react";
import { Radar, Bar } from 'react-chartjs-2';

interface ChartsProps {
  testResults: TestResult[];
}

const Charts: FC<ChartsProps> = ({ testResults }) => {
  // Check if there are test results before generating chart data
  const hasData = Array.isArray(testResults) && testResults.length > 0;

  // Generate radar chart data
  const radarChartData = hasData ? getChartData(testResults).radarData : {
    labels: [
      "Linguistik", 
      "Logis-Matematis", 
      "Musikal", 
      "Kinestetik", 
      "Spasial", 
      "Interpersonal", 
      "Intrapersonal", 
      "Naturalistik"
    ],
    datasets: [
      {
        label: 'Rata-rata Skor',
        data: [0, 0, 0, 0, 0, 0, 0, 0],
        backgroundColor: 'rgba(136, 132, 216, 0.2)',
        borderColor: 'rgba(136, 132, 216, 1)',
        borderWidth: 1,
      },
    ],
  };

  // Generate bar chart data for dominant intelligence types
  const barChartData = hasData ? {
    labels: Object.values(intelligenceTypes),
    datasets: [
      {
        label: 'Jumlah Siswa',
        data: Object.keys(intelligenceTypes).map(key => {
          return testResults.filter(r => r.dominantType === key).length;
        }),
        backgroundColor: 'rgba(136, 132, 216, 0.6)',
        borderColor: 'rgba(136, 132, 216, 1)',
        borderWidth: 1,
      },
    ],
  } : {
    labels: Object.values(intelligenceTypes),
    datasets: [
      {
        label: 'Jumlah Siswa',
        data: Array(Object.keys(intelligenceTypes).length).fill(0),
        backgroundColor: 'rgba(136, 132, 216, 0.6)',
        borderColor: 'rgba(136, 132, 216, 1)',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
      {/* Chart 1: Average Intelligence Scores */}
      <Card>
        <CardHeader>
          <CardTitle>Rata-rata Skor Kecerdasan</CardTitle>
        </CardHeader>
        <CardContent className="h-80">
          <div className="h-full w-full">
            <Radar
              data={radarChartData}
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
                      label: function(context) {
                        return `${context.dataset.label}: ${context.raw}%`;
                      }
                    }
                  }
                },
                maintainAspectRatio: false
              }}
            />
          </div>
        </CardContent>
      </Card>
      
      {/* Chart 2: Dominant Intelligence Types */}
      <Card>
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
    </div>
  );
};

export default Charts;
