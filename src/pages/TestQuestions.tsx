import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { questions, IntelligenceType } from "@/data/testQuestions";
import { UserData } from "./TestEntryForm";
import { saveTestResult } from "@/integrations/supabase/api";
import { TestResult } from "@/data/testResultsTypes";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Award, Clock, Brain, MoveRight, MoveLeft } from "lucide-react";
import confetti from "canvas-confetti";

// Import utility functions
import { shuffleArray } from "@/utils/arrays";
import { formatTime } from "@/utils/formatters";
import { STORAGE_KEYS } from "@/utils/constants";

/**
 * Answer type for tracking user responses
 */
interface Answer {
  questionId: string;
  value: number;
  type: IntelligenceType;
}

/**
 * TestQuestions component
 * Handles the test flow, questions, answers, and result calculation
 */
const TestQuestions = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState(questions);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<string>("0");
  const [progress, setProgress] = useState(0);
  const [isSaving, setIsSaving] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Timer untuk melacak waktu yang dihabiskan
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(timer);
  }, []);
  
  /**
   * Save test result to Supabase and handle response
   * @param resultData Test result data to save
   */
  const saveResultToSupabase = async (resultData: TestResult) => {
    setIsSaving(true);
    try {
      const { success, error } = await saveTestResult(resultData);
      
      if (success) {
        // Set flag untuk menunjukkan hasil sudah disimpan ke Supabase
        sessionStorage.setItem(STORAGE_KEYS.resultSaved, "true");
        toast({
          title: "Hasil tersimpan",
          description: "Hasil tes berhasil disimpan ke database",
        });
      } else {
        toast({
          title: "Penyimpanan hasil",
          description: "Hasil tes sedang disimpan di latar belakang",
        });
      }
    } catch (err) {
      console.error("Error saving test result to Supabase:", err);
    } finally {
      setIsSaving(false);
    }
  };
  
  // Load initial data and shuffle questions
  useEffect(() => {
    // Check if user data exists
    const userData = sessionStorage.getItem(STORAGE_KEYS.userData);
    if (!userData) {
      navigate("/test");
      return;
    }
    
    // Shuffle questions to mix up the different types
    setShuffledQuestions(shuffleArray(questions));
  }, [navigate]);
  
  // Update progress as user answers questions
  useEffect(() => {
    // Update progress
    setProgress((currentQuestion / shuffledQuestions.length) * 100);
  }, [currentQuestion, shuffledQuestions.length]);
  
  
  /**
   * Get the selected value for the current question
   * @returns The selected answer value as a string
   */
  const getCurrentSelectedValue = () => {
    const existingAnswer = answers.find(
      answer => answer.questionId === shuffledQuestions[currentQuestion].id
    );
    return existingAnswer ? existingAnswer.value.toString() : currentAnswer;
  };
  
  /**
   * Check if the current question has been answered
   * @returns Boolean indicating if the question is answered
   */
  const isQuestionAnswered = () => {
    return currentAnswer !== "0" || answers.some(
      answer => answer.questionId === shuffledQuestions[currentQuestion].id
    );
  };
  
  /**
   * Handle answer selection
   * @param value Selected answer value
   */
  const handleAnswer = (value: string) => {
    setCurrentAnswer(value);
  };
  
  /**
   * Handle next question button click
   * Saves current answer and moves to next question or calculates results
   */
  const handleNext = () => {
    // Save current answer
    const existingAnswerIndex = answers.findIndex(
      answer => answer.questionId === shuffledQuestions[currentQuestion].id
    );
    
    const answer: Answer = {
      questionId: shuffledQuestions[currentQuestion].id,
      value: parseInt(currentAnswer),
      type: shuffledQuestions[currentQuestion].type
    };
    
    if (existingAnswerIndex >= 0) {
      // Update existing answer
      const updatedAnswers = [...answers];
      updatedAnswers[existingAnswerIndex] = answer;
      setAnswers(updatedAnswers);
    } else {
      // Add new answer
      setAnswers([...answers, answer]);
    }
    
    // Move to next question or complete test
    if (currentQuestion < shuffledQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setCurrentAnswer("0"); // Reset for next question
    } else {
      // Calculate results
      calculateResults();
    }
  };
  
  /**
   * Handle previous question button click
   * Moves to previous question and restores previous answer
   */
  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      
      // Set answer from previous question if it exists
      const previousAnswer = answers.find(
        answer => answer.questionId === shuffledQuestions[currentQuestion - 1].id
      );
      
      if (previousAnswer) {
        setCurrentAnswer(previousAnswer.value.toString());
      } else {
        setCurrentAnswer("0");
      }
    }
  };
  
  /**
   * Calculate test results and save to storage
   * Shows confetti animation and navigates to results page
   */
  const calculateResults = () => {
    setIsSubmitting(true);
    
    // Show confetti animation
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    });
    
    // Get user data
    const userData = JSON.parse(sessionStorage.getItem(STORAGE_KEYS.userData) || "{}") as UserData;
    
    // Calculate scores for each intelligence type
    const scores: Record<IntelligenceType, number> = {
      linguistic: 0,
      logical: 0,
      musical: 0,
      bodily: 0,
      spatial: 0,
      interpersonal: 0,
      intrapersonal: 0,
      naturalistic: 0
    };
    
    // Count questions per type to calculate average
    const questionCounts: Record<string, number> = {
      linguistic: 0,
      logical: 0,
      musical: 0,
      bodily: 0,
      spatial: 0,
      interpersonal: 0,
      intrapersonal: 0,
      naturalistic: 0
    };
    
    // Sum up scores by type
    answers.forEach(answer => {
      scores[answer.type] += answer.value;
      questionCounts[answer.type]++;
    });
    
    // Calculate percentage scores (0-100)
    const percentageScores: Record<string, number> = {};
    
    Object.keys(scores).forEach(key => {
      const typedKey = key as IntelligenceType;
      const maxPossibleScore = questionCounts[typedKey] * 5; // 5 is max value per question
      percentageScores[typedKey] = Math.round((scores[typedKey] / maxPossibleScore) * 100);
    });
    
    // Find dominant intelligence type
    let dominantType: IntelligenceType = "linguistic"; // Default
    let highestScore = 0;
    
    Object.keys(percentageScores).forEach(key => {
      const typedKey = key as IntelligenceType;
      if (percentageScores[typedKey] > highestScore) {
        highestScore = percentageScores[typedKey];
        dominantType = typedKey;
      }
    });
    // Create result object with UUID id for Supabase compatibility
    const result: TestResult = {
      id: crypto.randomUUID(),
      name: userData.name,
      age: userData.age,
      gender: userData.gender,
      studentClass: userData.studentClass,
      date: new Date().toISOString(),
      results: percentageScores as Record<IntelligenceType, number>,
      dominantType
    };
    
    // Save result to sessionStorage
    sessionStorage.setItem(STORAGE_KEYS.testResult, JSON.stringify(result));
    
    // Save result directly to Supabase
    saveResultToSupabase(result);
    
    // Navigate to results page
    navigate("/test/results");
  };

  // If questions aren't loaded yet
  if (shuffledQuestions.length === 0) {
    return <div className="flex justify-center items-center min-h-screen">Memuat...</div>;
  }

  const question = shuffledQuestions[currentQuestion];
  // Count total answered questions
  const totalAnswered = answers.length;
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-purple-50 to-blue-50 py-8 px-1">
      <div className="container mx-auto max-w-3xl">
        {/* Header with statistics */}
        <div className="flex items-center justify-between mb-4 text-sm text-gray-600">
          <div className="flex items-center">
            <Brain className="h-4 w-4 mr-1 text-purple-500" />
            <span>Tes Kecerdasan Majemuk</span>
          </div>
          <div className="flex items-center">
            <Clock className="h-4 w-4 mr-1 text-blue-500" />
            <span>{formatTime(timeSpent)}</span>
          </div>
        </div>
        
        {/* Progress bar */}
        <div className="mb-6">
          <div className="flex justify-between text-xs text-gray-600 mb-1">
            <span>Kemajuan</span>
            <span>{totalAnswered} dari {shuffledQuestions.length} pertanyaan</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentQuestion}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card className="shadow-lg border border-gray-100">
              <div className="bg-gradient-to-r from-purple-600 to-blue-500 p-5 text-white">
                <h2 className="text-sm font-medium">Pertanyaan {currentQuestion + 1} dari {shuffledQuestions.length}</h2>
              </div>
              
              <CardContent className="p-4">
                <p className="text-lg font-medium mb-3">{question.text}</p>
                
                <RadioGroup 
                  value={getCurrentSelectedValue()} 
                  onValueChange={handleAnswer}
                  className="space-y-1"
                >
                  {[1, 2, 3, 4, 5].map((value) => {
                    const isSelected = getCurrentSelectedValue() === value.toString();
                    
                    return (
                      <div
                        key={value}
                        className={`flex items-center p-3 rounded-lg cursor-pointer transition-all ${
                          isSelected
                            ? "bg-purple-100 border-purple-300 border"
                            : "bg-white border border-gray-200 hover:bg-gray-50"
                        }`}
                        onClick={() => handleAnswer(value.toString())}
                      >
                        <RadioGroupItem 
                          value={value.toString()} 
                          id={`rating-${value}`}
                          className="mr-3"
                        />
                        <Label 
                          htmlFor={`rating-${value}`}
                          className="flex-1 cursor-pointer flex items-center"
                        >
                          {value === 1 && "Sangat Tidak Setuju"}
                          {value === 2 && "Tidak Setuju"}
                          {value === 3 && "Netral"}
                          {value === 4 && "Setuju"}
                          {value === 5 && "Sangat Setuju"}
                        </Label>
                        {isSelected && <CheckCircle2 className="h-4 w-4 text-purple-500" />}
                      </div>
                    );
                  })}
                </RadioGroup>
              </CardContent>
              
              <CardFooter className="px-4 py-3 pt-1 flex justify-between border-t border-gray-100">
                <Button 
                  onClick={handleNext} 
                  disabled={!isQuestionAnswered()}
                  className={`shadow-sm ${
                    currentQuestion === shuffledQuestions.length - 1
                      ? "bg-green-600 hover:bg-green-700"
                      : "bg-purple-600 hover:bg-purple-700"
                  }`}
                >
                  {currentQuestion < shuffledQuestions.length - 1 ? (
                    <>
                      Selanjutnya
                      <MoveRight className="ml-3 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      {isSubmitting ? (
                        <span className="animate-pulse">Memproses...</span>
                      ) : (
                        <>
                          <Award className="mr-2 h-4 w-4" />
                          Selesaikan Tes
                        </>
                      )}
                    </>
                  )}
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        </AnimatePresence>
        
        {/* Informasi bantuan/tips */}
        <div className="mt-6 text-center text-xs text-gray-500">
          <p>Pilih jawaban terbaik yang mencerminkan diri Anda. Tidak ada jawaban benar atau salah.</p>
        </div>
      </div>
    </div>
  );
};

export default TestQuestions;
