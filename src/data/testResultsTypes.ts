import { IntelligenceType, intelligenceTypes, intelligenceDescriptions } from './testQuestions';

// Types for our test data
export type TestResult = {
  id: string;
  name: string;
  age: number;
  gender: string;
  email: string;
  studentClass: string;
  date: string;
  results: Record<IntelligenceType, number>;
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

// Transform data for visualization
export const getChartData = (testResults: TestResult[]) => {  
  // For bar chart - count occurrences of dominant types
  const dominantTypeCounts: Record<string, number> = {};
  testResults.forEach(result => {
    const type = result.dominantType;
    dominantTypeCounts[type] = (dominantTypeCounts[type] || 0) + 1;
  });
  
  // Prepare data for Chart.js bar chart
  const barLabels = Object.keys(dominantTypeCounts);
  const barCounts = barLabels.map(type => dominantTypeCounts[type]);
  
  const barChartData = {
    labels: barLabels,
    datasets: [
      {
        label: 'Jumlah',
        data: barCounts,
        backgroundColor: 'rgba(136, 132, 216, 0.8)',
      }
    ]
  };

  // For radar chart - average scores across all participants
  const totalScores = {
    linguistic: 0,
    logical: 0,
    musical: 0,
    bodily: 0,
    spatial: 0,
    interpersonal: 0,
    intrapersonal: 0,
    naturalistic: 0
  };

  testResults.forEach(result => {
    totalScores.linguistic += result.results.linguistic;
    totalScores.logical += result.results.logical;
    totalScores.musical += result.results.musical;
    totalScores.bodily += result.results.bodily;
    totalScores.spatial += result.results.spatial;
    totalScores.interpersonal += result.results.interpersonal;
    totalScores.intrapersonal += result.results.intrapersonal;
    totalScores.naturalistic += result.results.naturalistic;
  });
 
  const radarLabels = ["Linguistik", "Logis", "Musikal", "Kinestetik", "Spasial", "Interpersonal", "Intrapersonal", "Naturalistik"];
  
  // For Chart.js radar chart
  const radarData = {
    labels: radarLabels,
    datasets: [
      {
        label: 'Rata-rata Skor',
        data: [
          testResults.length > 0 ? totalScores.linguistic / testResults.length : 0,
          testResults.length > 0 ? totalScores.logical / testResults.length : 0,
          testResults.length > 0 ? totalScores.musical / testResults.length : 0,
          testResults.length > 0 ? totalScores.bodily / testResults.length : 0,
          testResults.length > 0 ? totalScores.spatial / testResults.length : 0,
          testResults.length > 0 ? totalScores.interpersonal / testResults.length : 0,
          testResults.length > 0 ? totalScores.intrapersonal / testResults.length : 0,
          testResults.length > 0 ? totalScores.naturalistic / testResults.length : 0,
        ],
        backgroundColor: 'rgba(136, 132, 216, 0.2)',
        borderColor: 'rgba(136, 132, 216, 1)',
        borderWidth: 1,
      },
    ],
  };

  return { barChartData, radarData };
};
