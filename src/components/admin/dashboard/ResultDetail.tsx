import { TestResult, intelligenceCharacteristics } from "@/data/testResultsTypes";
import { intelligenceTypes, intelligenceDescriptions, IntelligenceType } from "@/data/testQuestions";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Radar } from 'react-chartjs-2';
import { FC } from "react";

interface ResultDetailProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  result: TestResult | null;
}

const ResultDetail: FC<ResultDetailProps> = ({ isOpen, onOpenChange, result }) => {
  if (!result) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle>Detail Hasil Tes</DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(90vh-120px)]">
          <div className="p-4 space-y-6">
            {/* User Profile Section */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div>
                <p className="text-sm text-gray-500">Nama:</p>
                <p className="font-medium">{result.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Usia:</p>
                <p className="font-medium">{result.age} tahun</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Gender:</p>
                <p className="font-medium">{result.gender}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Kelas/Jurusan:</p>
                <p className="font-medium">{result.studentClass}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Tanggal Tes:</p>
                <p className="font-medium">{new Date(result.date).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>
            </div>
          
            {/* Results Visualization - Radar Chart */}
            <div>
              <h3 className="font-bold text-lg mb-2">Skor Kecerdasan</h3>
              <div className="h-64 w-full">
                <Radar
                  data={{
                    labels: [
                      "Linguistik",
                      "Logis-Matematis",
                      "Musikal",
                      "Kinestetik-Tubuh",
                      "Spasial",
                      "Interpersonal",
                      "Intrapersonal",
                      "Naturalis"
                    ],
                    datasets: [
                      {
                        label: 'Skor',
                        data: [
                          result.results.linguistic,
                          result.results.logical,
                          result.results.musical,
                          result.results.bodily,
                          result.results.spatial,
                          result.results.interpersonal,
                          result.results.intrapersonal,
                          result.results.naturalistic,
                        ],
                        backgroundColor: 'rgba(136, 132, 216, 0.2)',
                        borderColor: 'rgba(136, 132, 216, 1)',
                        borderWidth: 1,
                        pointBackgroundColor: 'rgba(136, 132, 216, 1)',
                      }
                    ]
                  }}
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
                          label: function (context) {
                            return `${context.dataset.label}: ${context.raw}%`;
                          }
                        }
                      }
                    },
                    maintainAspectRatio: false
                  }}
                />
              </div>
            </div>

            {/* Scores Table */}
            <div>
              <h3 className="font-bold text-lg mb-2">Rincian Skor (Dari Tertinggi)</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {Object.entries(result.results)
                  .sort(([, a], [, b]) => b - a)
                  .map(([key, score], idx) => (
                    <div key={key} className="bg-white p-3 rounded-lg border border-gray-200 shadow-sm">
                      <div className="text-sm text-gray-500">{intelligenceTypes[key as IntelligenceType]}</div>
                      <div className="font-medium text-purple-700">{score}%</div>
                    </div>
                  ))}
              </div>
            </div>

            {/* Dominant Intelligence Description */}
            <div className="bg-purple-50 p-4 rounded-lg">
              <h3 className="font-bold text-lg mb-2">Kecerdasan Dominan: {intelligenceTypes[result.dominantType as IntelligenceType]}</h3>
              <p className="mb-4">{intelligenceDescriptions[result.dominantType as IntelligenceType]}</p>
              
              {/* Characteristics */}
              <div>
                <h4 className="font-semibold mb-2">Karakteristik:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {intelligenceCharacteristics[result.dominantType as IntelligenceType]?.map((characteristic, idx) => (
                    <li key={idx}>{characteristic}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default ResultDetail;
