
export type IntelligenceType = 
  | "linguistic" 
  | "logical" 
  | "musical" 
  | "bodily" 
  | "spatial" 
  | "interpersonal" 
  | "intrapersonal" 
  | "naturalistic";

export type Question = {
  id: string;
  text: string;
  type: IntelligenceType;
};

export const intelligenceTypes: Record<IntelligenceType, string> = {
  linguistic: "Linguistic Intelligence",
  logical: "Logical-Mathematical Intelligence",
  musical: "Musical Intelligence",
  bodily: "Bodily-Kinesthetic Intelligence",
  spatial: "Spatial Intelligence",
  interpersonal: "Interpersonal Intelligence",
  intrapersonal: "Intrapersonal Intelligence",
  naturalistic: "Naturalistic Intelligence"
};

export const intelligenceDescriptions: Record<IntelligenceType, string> = {
  linguistic: "Sensitivity to the meaning and order of words. Skills in reading, writing, storytelling, and verbal expression.",
  logical: "Ability to work with numbers, logical patterns, and reasoning. Skills in problem-solving, analysis, and scientific investigation.",
  musical: "Sensitivity to pitch, melody, rhythm, and tone. Skills in musical performance, composition, and appreciation.",
  bodily: "Control of one's body movements and the capacity to handle objects skillfully. Skills in physical activities, crafts, and coordination.",
  spatial: "Capacity to perceive the visual-spatial world accurately. Skills in visualization, artistic design, and spatial reasoning.",
  interpersonal: "Ability to understand and interact effectively with others. Skills in communication, empathy, and relationship building.",
  intrapersonal: "Capacity for self-awareness and understanding of one's own feelings. Skills in reflection, self-regulation, and personal growth.",
  naturalistic: "Ability to recognize and categorize plants, animals, and natural phenomena. Skills in observing, understanding, and organizing patterns in nature."
};

// Questions for the test - 5 questions per intelligence type
export const questions: Question[] = [
  // Linguistic Intelligence
  {
    id: "L1",
    text: "I enjoy reading books and articles in my free time",
    type: "linguistic"
  },
  {
    id: "L2",
    text: "I find it easy to explain complex ideas to others",
    type: "linguistic"
  },
  {
    id: "L3",
    text: "I enjoy word games like crosswords or Scrabble",
    type: "linguistic"
  },
  {
    id: "L4",
    text: "I'm good at remembering quotes or phrases",
    type: "linguistic"
  },
  {
    id: "L5",
    text: "I express myself well in writing",
    type: "linguistic"
  },
  
  // Logical-Mathematical Intelligence
  {
    id: "M1",
    text: "I can easily perform calculations in my head",
    type: "logical"
  },
  {
    id: "M2",
    text: "I enjoy solving puzzles or brain teasers",
    type: "logical"
  },
  {
    id: "M3",
    text: "I like to analyze problems systematically",
    type: "logical"
  },
  {
    id: "M4",
    text: "I'm good at recognizing patterns and relationships",
    type: "logical"
  },
  {
    id: "M5",
    text: "I ask questions about how things work",
    type: "logical"
  },
  
  // Musical Intelligence
  {
    id: "Mu1",
    text: "I can easily recognize different musical instruments in a song",
    type: "musical"
  },
  {
    id: "Mu2",
    text: "I often have tunes or songs stuck in my head",
    type: "musical"
  },
  {
    id: "Mu3",
    text: "I can tell when a note is off-key",
    type: "musical"
  },
  {
    id: "Mu4",
    text: "I enjoy creating or listening to music",
    type: "musical"
  },
  {
    id: "Mu5",
    text: "I can remember melodies easily",
    type: "musical"
  },
  
  // Bodily-Kinesthetic Intelligence
  {
    id: "B1",
    text: "I enjoy physical activities and sports",
    type: "bodily"
  },
  {
    id: "B2",
    text: "I'm good at crafts or activities requiring precise hand movements",
    type: "bodily"
  },
  {
    id: "B3",
    text: "I learn better by doing something physically rather than reading about it",
    type: "bodily"
  },
  {
    id: "B4",
    text: "I use body language and gestures when communicating",
    type: "bodily"
  },
  {
    id: "B5",
    text: "I have good coordination and balance",
    type: "bodily"
  },
  
  // Spatial Intelligence
  {
    id: "S1",
    text: "I can easily visualize objects from different perspectives",
    type: "spatial"
  },
  {
    id: "S2",
    text: "I have a good sense of direction",
    type: "spatial"
  },
  {
    id: "S3",
    text: "I enjoy visual arts, such as painting or photography",
    type: "spatial"
  },
  {
    id: "S4",
    text: "I can easily read maps and diagrams",
    type: "spatial"
  },
  {
    id: "S5",
    text: "I notice visual details that others might miss",
    type: "spatial"
  },
  
  // Interpersonal Intelligence
  {
    id: "I1",
    text: "I enjoy social activities and meeting new people",
    type: "interpersonal"
  },
  {
    id: "I2",
    text: "People often come to me for advice",
    type: "interpersonal"
  },
  {
    id: "I3",
    text: "I can sense how others are feeling",
    type: "interpersonal"
  },
  {
    id: "I4",
    text: "I'm good at resolving conflicts between people",
    type: "interpersonal"
  },
  {
    id: "I5",
    text: "I prefer group activities over doing things alone",
    type: "interpersonal"
  },
  
  // Intrapersonal Intelligence
  {
    id: "Ia1",
    text: "I often reflect on my thoughts and feelings",
    type: "intrapersonal"
  },
  {
    id: "Ia2",
    text: "I have a good understanding of my strengths and weaknesses",
    type: "intrapersonal"
  },
  {
    id: "Ia3",
    text: "I prefer working independently",
    type: "intrapersonal"
  },
  {
    id: "Ia4",
    text: "I set goals and plan for my future",
    type: "intrapersonal"
  },
  {
    id: "Ia5",
    text: "I'm comfortable with who I am",
    type: "intrapersonal"
  },
  
  // Naturalistic Intelligence
  {
    id: "N1",
    text: "I enjoy outdoor activities and being in nature",
    type: "naturalistic"
  },
  {
    id: "N2",
    text: "I can recognize and classify different types of plants or animals",
    type: "naturalistic"
  },
  {
    id: "N3",
    text: "I'm interested in environmental issues",
    type: "naturalistic"
  },
  {
    id: "N4",
    text: "I notice patterns and changes in nature",
    type: "naturalistic"
  },
  {
    id: "N5",
    text: "I enjoy learning about natural phenomena",
    type: "naturalistic"
  }
];
