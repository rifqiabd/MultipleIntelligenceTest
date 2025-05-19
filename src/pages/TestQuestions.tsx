
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { questions, IntelligenceType } from "@/data/testQuestions";
import { UserData } from "./TestEntryForm";

// Shuffle array using Fisher-Yates algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

type Answer = {
  questionId: string;
  value: number;
  type: IntelligenceType;
};

const TestQuestions = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [shuffledQuestions, setShuffledQuestions] = useState(questions);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<string>("0");
  const [progress, setProgress] = useState(0);
  
  const navigate = useNavigate();
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if user data exists
    const userData = sessionStorage.getItem("userData");
    if (!userData) {
      navigate("/test");
      return;
    }
    
    // Shuffle questions to mix up the different types
    setShuffledQuestions(shuffleArray(questions));
  }, [navigate]);
  
  useEffect(() => {
    // Update progress
    setProgress((currentQuestion / shuffledQuestions.length) * 100);
  }, [currentQuestion, shuffledQuestions.length]);
  
  const handleAnswer = (value: string) => {
    setCurrentAnswer(value);
  };
  
  const handleNext = () => {
    // Save current answer
    const answer: Answer = {
      questionId: shuffledQuestions[currentQuestion].id,
      value: parseInt(currentAnswer),
      type: shuffledQuestions[currentQuestion].type
    };
    
    setAnswers([...answers, answer]);
    
    // Move to next question or complete test
    if (currentQuestion < shuffledQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setCurrentAnswer("0"); // Reset for next question
    } else {
      // Calculate results
      calculateResults();
    }
  };
  
  const calculateResults = () => {
    // Get user data
    const userData = JSON.parse(sessionStorage.getItem("userData") || "{}") as UserData;
    
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
    
    // Create result object
    const result = {
      id: new Date().getTime().toString(),
      name: userData.name,
      age: userData.age,
      gender: userData.gender,
      email: userData.email,
      occupation: userData.occupation,
      date: new Date().toISOString().split("T")[0],
      results: percentageScores,
      dominantType
    };
    
    // Store result in localStorage (for admin dashboard)
    const existingResults = JSON.parse(localStorage.getItem("testResults") || "[]");
    localStorage.setItem("testResults", JSON.stringify([...existingResults, result]));
    
    // Also store in session storage for results page
    sessionStorage.setItem("testResult", JSON.stringify(result));
    
    // Navigate to results page
    navigate("/test/results");
  };

  // If questions aren't loaded yet
  if (shuffledQuestions.length === 0) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  const question = shuffledQuestions[currentQuestion];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-xl text-center">Multiple Intelligences Test</CardTitle>
          <CardDescription className="text-center">
            Question {currentQuestion + 1} of {shuffledQuestions.length}
          </CardDescription>
          <Progress value={progress} className="w-full" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-lg font-medium text-center mb-4">{question.text}</div>
          
          <RadioGroup 
            value={currentAnswer} 
            onValueChange={handleAnswer}
            className="space-y-3"
          >
            <div className="flex justify-between items-center">
              <div>Strongly Disagree</div>
              <div>Strongly Agree</div>
            </div>
            <div className="flex justify-between gap-2">
              {[1, 2, 3, 4, 5].map((value) => (
                <div key={value} className="flex flex-col items-center space-y-2">
                  <RadioGroupItem value={value.toString()} id={`rating-${value}`} />
                  <Label htmlFor={`rating-${value}`}>{value}</Label>
                </div>
              ))}
            </div>
          </RadioGroup>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button 
            onClick={handleNext} 
            disabled={!currentAnswer || currentAnswer === "0"}
          >
            {currentQuestion < shuffledQuestions.length - 1 ? "Next Question" : "Complete Test"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default TestQuestions;
