import { IntelligenceType, intelligenceTypes, intelligenceDescriptions } from './testQuestions';

/**
 * Test result interface
 */
export interface TestResult {
  /** Unique identifier for the test result */
  id: string;
  /** Name of the test taker */
  name: string;
  /** Age of the test taker */
  age: number;
  /** Gender of the test taker */
  gender: string;
  /** Class or group of the test taker */
  studentClass: string;
  /** Date when the test was taken */
  date: string;
  /** Scores for each intelligence type */
  results: Record<IntelligenceType, number>;
  /** The dominant intelligence type based on scores */
  dominantType: IntelligenceType;
};

// Intelligence characteristics for each type
export const intelligenceCharacteristics: Record<IntelligenceType, string[]> = {
  linguistic: [
    "Pintar bermain dengan kata-kata",
    "Memiliki kosakata yang luas",
    "Pandai bercerita dan menulis",
    "Menikmati membaca dan berdiskusi",
    "Berkomunikasi dengan jelas dan efektif"
  ],
  logical: [
    "Mudah memahami pola dan konsep abstrak",
    "Menyukai angka dan kalkulasi",
    "Pemikir sistematis dan analitis",
    "Senang memecahkan teka-teki",
    "Pendekatan metodis dalam memecahkan masalah"
  ],
  musical: [
    "Sensitif terhadap nada dan ritme",
    "Mudah mengingat melodi",
    "Sering mengekspresikan diri melalui musik",
    "Dapat memainkan instrumen musik",
    "Memiliki pemahaman yang baik tentang struktur musik"
  ],
  bodily: [
    "Koordinasi fisik yang baik",
    "Belajar lebih baik melalui gerakan dan pengalaman",
    "Terampil dalam kerajinan tangan",
    "Menggunakan bahasa tubuh saat berkomunikasi",
    "Menikmati aktivitas fisik dan olahraga"
  ],
  spatial: [
    "Kemampuan visualisasi yang kuat",
    "Mudah membaca peta dan diagram",
    "Memiliki orientasi ruang yang baik",
    "Menikmati seni visual dan desain",
    "Berpikir dalam gambar dan citra"
  ],
  interpersonal: [
    "Mudah berempati dengan orang lain",
    "Berkomunikasi dan bernegosiasi dengan baik",
    "Dapat memotivasi dan mempengaruhi orang lain",
    "Terampil dalam bekerja dalam tim",
    "Membangun hubungan dengan mudah"
  ],
  intrapersonal: [
    "Pemahaman diri yang mendalam",
    "Reflektif dan introspektif",
    "Kesadaran akan nilai dan tujuan pribadi",
    "Mandiri dan disiplin diri",
    "Peka terhadap perasaan dan emosi sendiri"
  ],
  naturalistic: [
    "Hubungan yang kuat dengan dunia alam",
    "Kemampuan mengidentifikasi flora dan fauna",
    "Kesadaran akan pola-pola alam",
    "Kepedulian terhadap lingkungan",
    "Menikmati kegiatan di alam terbuka"
  ]
};

/**
 * Chart data structure for visualization
 */
export interface ChartData {
  /** Bar chart data for dominant intelligence types */
  barChartData: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor: string | string[];
    }>;
  };
  /** Radar chart data for average intelligence scores */
  radarData: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor: string;
      borderColor: string;
      borderWidth: number;
    }>;
  };
}

/**
 * Transform test results data into chart-ready formats
 * @param testResults - Array of test results
 * @returns Formatted data for charts
 */
export const getChartData = (testResults: TestResult[]): ChartData => {  
  // For bar chart - count occurrences of dominant types
  const dominantTypeCounts: Record<string, number> = {};
  
  // Initialize with all possible intelligence types to avoid empty chart
  Object.keys(intelligenceTypes).forEach(type => {
    dominantTypeCounts[type] = 0;
  });
  
  // Count occurrences of dominant types
  testResults.forEach(result => {
    const type = result.dominantType;
    dominantTypeCounts[type] = (dominantTypeCounts[type] || 0) + 1;
  });
  
  // Prepare data for Chart.js bar chart with consistent colors
  const barLabels = Object.keys(dominantTypeCounts);
  const barCounts = barLabels.map(type => dominantTypeCounts[type]);
  
  const barColors = [
    'rgba(99, 102, 241, 0.8)',   // Indigo
    'rgba(16, 185, 129, 0.8)',   // Emerald
    'rgba(239, 68, 68, 0.8)',    // Red
    'rgba(245, 158, 11, 0.8)',   // Amber
    'rgba(59, 130, 246, 0.8)',   // Blue
    'rgba(139, 92, 246, 0.8)',   // Purple
    'rgba(236, 72, 153, 0.8)',   // Pink
    'rgba(5, 150, 105, 0.8)'     // Green
  ];
  
  const barChartData = {
    labels: barLabels.map(type => intelligenceTypes[type as IntelligenceType]),
    datasets: [
      {
        label: 'Jumlah',
        data: barCounts,
        backgroundColor: barColors.slice(0, barLabels.length),
      }
    ]
  };

  // For radar chart - average scores across all participants
  const totalScores: Record<IntelligenceType, number> = {
    linguistic: 0,
    logical: 0,
    musical: 0,
    bodily: 0,
    spatial: 0,
    interpersonal: 0,
    intrapersonal: 0,
    naturalistic: 0
  };
  
  const resultsCount = testResults.length || 1; // Avoid division by zero

  // Sum all scores
  testResults.forEach(result => {
    Object.entries(result.results).forEach(([type, score]) => {
      totalScores[type as IntelligenceType] += score;
    });
  });
  
  // Calculate averages
  const averageScores = Object.entries(totalScores).map(
    ([_, total]) => Math.round(total / resultsCount)
  );
 
  const radarLabels = [
    "Linguistik", 
    "Logis-Matematis", 
    "Musikal", 
    "Kinestetik", 
    "Spasial", 
    "Interpersonal", 
    "Intrapersonal", 
    "Naturalistik"
  ];
  
  // For Chart.js radar chart
  const radarData = {
    labels: radarLabels,
    datasets: [
      {
        label: 'Rata-rata Skor',
        data: averageScores,
        backgroundColor: 'rgba(136, 132, 216, 0.2)',
        borderColor: 'rgba(136, 132, 216, 1)',
        borderWidth: 1,
      },
    ],
  };

  return { barChartData, radarData };
};
