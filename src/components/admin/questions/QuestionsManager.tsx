import { useState, useEffect } from "react";
import { Question, IntelligenceType, intelligenceTypes } from "@/data/testQuestions";
import apiService from "@/services/api";
import { useToast } from "@/components/ui/use-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { QuestionForm } from "./QuestionForm";
import { QuestionsList } from "./QuestionsList";
import { ImportExport } from "./ImportExport";

interface QuestionsManagerProps {
  isAdminLoggedIn: boolean;
}

export function QuestionsManager({ isAdminLoggedIn }: QuestionsManagerProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [filteredQuestions, setFilteredQuestions] = useState<Question[]>([]);
  const [activeType, setActiveType] = useState<string>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editQuestion, setEditQuestion] = useState<Question | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { toast } = useToast();

  // Fetch all questions
  const fetchQuestions = async () => {
    if (!isAdminLoggedIn) return;
    
    setIsLoading(true);
    try {
      const data = await apiService.questions.getAll();
      setQuestions(data);
      applyFilters(data, activeType, searchTerm);
    } catch (error) {
      console.error("Error fetching questions:", error);
      toast({
        title: "Gagal memuat soal",
        description: "Terjadi kesalahan saat memuat data soal.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Apply filters (type and search)
  const applyFilters = (allQuestions: Question[], type: string, search: string) => {
    let filtered = [...allQuestions];
    
    // Apply type filter
    if (type !== 'all') {
      filtered = filtered.filter(q => q.type === type);
    }
    
    // Apply search filter
    if (search) {
      const searchLower = search.toLowerCase();
      filtered = filtered.filter(q => 
        q.id.toLowerCase().includes(searchLower) ||
        q.text.toLowerCase().includes(searchLower)
      );
    }
    
    setFilteredQuestions(filtered);
  };

  // Handle tab change
  const handleTypeChange = (type: string) => {
    setActiveType(type);
    applyFilters(questions, type, searchTerm);
    
    // Scroll tab yang aktif ke tampilan
    setTimeout(() => {
      const activeTab = document.querySelector(`[data-state="active"].tabstrigger-${type}`);
      if (activeTab) {
        activeTab.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
      }
    }, 100);
  };

  // Handle search
  const handleSearch = (search: string) => {
    setSearchTerm(search);
    applyFilters(questions, activeType, search);
  };

  // Add new question
  const handleAddQuestion = async (question: Question) => {
    try {
      const { success, data, error } = await apiService.questions.add(question);
      
      if (success && data) {
        // Add to local state
        const updatedQuestions = [...questions, data];
        setQuestions(updatedQuestions);
        applyFilters(updatedQuestions, activeType, searchTerm);
        
        toast({
          title: "Soal berhasil ditambahkan",
          description: `Soal "${question.id}" telah ditambahkan.`
        });
        
        setIsFormOpen(false);
        return true;
      } else {
        throw error || new Error("Gagal menambahkan soal");
      }
    } catch (err) {
      console.error("Error adding question:", err);
      toast({
        title: "Gagal menambahkan soal",
        description: String(err),
        variant: "destructive",
      });
      return false;
    }
  };

  // Update existing question
  const handleUpdateQuestion = async (question: Question) => {
    try {
      const { success, error } = await apiService.questions.update(question);
      
      if (success) {
        // Update local state
        const updatedQuestions = questions.map(q => 
          q.id === question.id ? question : q
        );
        setQuestions(updatedQuestions);
        applyFilters(updatedQuestions, activeType, searchTerm);
        
        toast({
          title: "Soal berhasil diperbarui",
          description: `Soal "${question.id}" telah diperbarui.`
        });
        
        setIsFormOpen(false);
        setEditQuestion(null);
        return true;
      } else {
        throw error || new Error("Gagal memperbarui soal");
      }
    } catch (err) {
      console.error("Error updating question:", err);
      toast({
        title: "Gagal memperbarui soal",
        description: String(err),
        variant: "destructive",
      });
      return false;
    }
  };

  // Delete question
  const handleDeleteQuestion = async (id: string) => {
    if (!window.confirm("Apakah Anda yakin ingin menghapus soal ini?")) {
      return;
    }
    
    try {
      const { success, error } = await apiService.questions.delete(id);
      
      if (success) {
        // Remove from local state
        const updatedQuestions = questions.filter(q => q.id !== id);
        setQuestions(updatedQuestions);
        applyFilters(updatedQuestions, activeType, searchTerm);
        
        toast({
          title: "Soal berhasil dihapus",
          description: `Soal "${id}" telah dihapus.`
        });
      } else {
        throw error || new Error("Gagal menghapus soal");
      }
    } catch (err) {
      console.error("Error deleting question:", err);
      toast({
        title: "Gagal menghapus soal",
        description: String(err),
        variant: "destructive",
      });
    }
  };

  // Handle edit button click
  const handleEditClick = (question: Question) => {
    setEditQuestion(question);
    setIsFormOpen(true);
  };

  // Fetch questions on component mount and when logged in status changes
  useEffect(() => {
    if (isAdminLoggedIn) {
      fetchQuestions();
    }
  }, [isAdminLoggedIn]);
  
  // Setup horizontal scroll with wheel
  useEffect(() => {
    const tabsContainer = document.querySelector('.tabs-scroll-container');
    if (!tabsContainer) return;
    
    const handleWheel = (e: WheelEvent) => {
      if (e.deltaY !== 0) {
        e.preventDefault();
        tabsContainer.scrollLeft += e.deltaY;
      }
    };
    
    tabsContainer.addEventListener('wheel', handleWheel);
    
    return () => {
      tabsContainer.removeEventListener('wheel', handleWheel);
    };
  }, []);

  // Count questions by type
  const countByType = (type: string) => {
    return type === 'all' 
      ? questions.length 
      : questions.filter(q => q.type === type).length;
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader className="pb-4 sm:pb-6">
        <CardTitle className="text-xl font-bold text-center sm:text-left">
          Manajemen Soal Tes Kecerdasan
        </CardTitle>
        <CardDescription className="text-center sm:text-left">
          Kelola soal-soal berdasarkan tipe kecerdasan majemuk
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all" onValueChange={handleTypeChange}>
          <div className="relative mb-4">
            <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-white to-transparent pointer-events-none z-10"></div>
            <div className="overflow-x-auto pb-1 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent tabs-scroll-container">
              <TabsList className="inline-flex h-10 items-center rounded-md bg-muted p-1 text-muted-foreground w-max min-w-full">
                <TabsTrigger value="all" className="tabstrigger-all inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all hover:bg-gray-100 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground mx-0.5">
                  <span className="whitespace-nowrap">Semua ({countByType('all')})</span>
                </TabsTrigger>
                {Object.entries(intelligenceTypes).map(([key, label]) => (
                  <TabsTrigger key={key} value={key} className={`tabstrigger-${key} inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all hover:bg-gray-100 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground mx-0.5`}>
                    <span className="whitespace-nowrap">{label} ({countByType(key)})</span>
                  </TabsTrigger>
                ))}
              </TabsList>
            </div>
            <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-white to-transparent pointer-events-none z-10"></div>
          </div>

          {/* Tab contents (same component with different filters) */}
          <TabsContent value="all" className="mt-0">
            <QuestionsList
              questions={filteredQuestions}
              isLoading={isLoading}
              onAddClick={() => {
                setEditQuestion(null);
                setIsFormOpen(true);
              }}
              onEditClick={handleEditClick}
              onDeleteClick={handleDeleteQuestion}
              onSearch={handleSearch}
              searchTerm={searchTerm}
            />
          </TabsContent>

          {Object.keys(intelligenceTypes).map(type => (
            <TabsContent key={type} value={type} className="mt-0">
              <QuestionsList
                questions={filteredQuestions}
                isLoading={isLoading}
                onAddClick={() => {
                  setEditQuestion(null);
                  setIsFormOpen(true);
                }}
                onEditClick={handleEditClick}
                onDeleteClick={handleDeleteQuestion}
                onSearch={handleSearch}
                searchTerm={searchTerm}
                currentType={type as IntelligenceType}
              />
            </TabsContent>
          ))}
        </Tabs>

        {/* Question Form Dialog */}
        <QuestionForm
          isOpen={isFormOpen}
          onOpenChange={setIsFormOpen}
          question={editQuestion}
          onSave={editQuestion ? handleUpdateQuestion : handleAddQuestion}
          defaultType={activeType !== 'all' ? activeType as IntelligenceType : undefined}
        />

        {/* Import/Export Section */}
        <ImportExport 
          questions={questions}
          onImportSuccess={fetchQuestions}
        />
      </CardContent>
    </Card>
  );
}
