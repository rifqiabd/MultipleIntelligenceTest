import { Question, IntelligenceType, intelligenceTypes } from "@/data/testQuestions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { PlusCircle, Search, Pencil, Trash2 } from "lucide-react";

interface QuestionsListProps {
  questions: Question[];
  isLoading: boolean;
  onAddClick: () => void;
  onEditClick: (question: Question) => void;
  onDeleteClick: (id: string) => void;
  onSearch: (term: string) => void;
  searchTerm: string;
  currentType?: IntelligenceType;
}

export function QuestionsList({
  questions,
  isLoading,
  onAddClick,
  onEditClick,
  onDeleteClick,
  onSearch,
  searchTerm,
  currentType
}: QuestionsListProps) {
  // Get badge color based on intelligence type
  const getBadgeVariant = (type: IntelligenceType) => {
    const variants: Record<IntelligenceType, "default" | "secondary" | "destructive" | "outline"> = {
      linguistic: "default",
      logical: "secondary",
      musical: "outline",
      bodily: "default",
      spatial: "secondary",
      interpersonal: "outline",
      intrapersonal: "default",
      naturalistic: "secondary"
    };
    
    return variants[type] || "default";
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari soal..."
            value={searchTerm}
            onChange={(e) => onSearch(e.target.value)}
            className="pl-8 focus-visible:ring-1 focus-visible:ring-primary"
          />
        </div>
        <Button 
          onClick={onAddClick} 
          size="sm"
          className="whitespace-nowrap transition-all duration-200"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          <span className="hidden xs:inline">
            {currentType 
              ? `Tambah Soal ${intelligenceTypes[currentType]}` 
              : "Tambah Soal Baru"}
          </span>
          <span className="xs:hidden">Tambah</span>
        </Button>
      </div>

      {isLoading ? (
        <div className="py-12 text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-b-2 border-t-2 border-primary"></div>
          <p className="mt-3 text-gray-500 text-sm font-medium">Memuat soal...</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="py-10 text-center bg-gray-50 rounded-lg border border-gray-100 shadow-sm">
          {searchTerm ? (
            <>
              <div className="text-gray-500 mb-2 font-medium">
                Tidak ditemukan soal yang sesuai.
              </div>
              <div className="text-sm text-gray-400">
                Coba kata kunci lain atau hapus filter pencarian.
              </div>
            </>
          ) : (
            <>
              <div className="text-gray-600 mb-2 font-medium">
                Belum ada soal tersedia.
              </div>
              <div className="text-sm text-gray-400 mb-4">
                Klik tombol Tambah untuk menambahkan soal baru.
              </div>
              <Button 
                onClick={onAddClick} 
                size="sm"
                className="transition-all duration-200"
              >
                <PlusCircle className="h-4 w-4 mr-2" />
                Tambah Soal Baru
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="border rounded-md overflow-hidden shadow-sm transition-all">
          {/* Tampilan tabel untuk desktop dan tablet */}
          <div className="hidden sm:block">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-24">ID</TableHead>
                  <TableHead>Teks Soal</TableHead>
                  <TableHead className="w-32">Tipe</TableHead>
                  <TableHead className="w-28 text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {questions.map((question) => (
                  <TableRow key={question.id} className="hover:bg-gray-50 transition-colors duration-150">
                    <TableCell className="font-mono text-sm text-gray-600">{question.id}</TableCell>
                    <TableCell className="leading-relaxed">{question.text}</TableCell>
                    <TableCell>
                      <Badge variant={getBadgeVariant(question.type)}>
                        {intelligenceTypes[question.type]}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onEditClick(question)}
                        className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onDeleteClick(question.id)}
                        className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {/* Tampilan kartu untuk mobile */}
          <div className="block sm:hidden">
            <div className="divide-y">
              {questions.map((question) => (
                <div key={question.id} className="p-4 bg-white hover:bg-gray-50 transition-colors duration-150">
                  <div className="flex justify-between items-start mb-3">
                    <Badge variant={getBadgeVariant(question.type)} className="mr-2">
                      {intelligenceTypes[question.type]}
                    </Badge>
                    <span className="font-mono text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">{question.id}</span>
                  </div>
                  
                  <p className="text-sm mb-4 leading-relaxed">{question.text}</p>
                  
                  <div className="flex justify-end gap-2 mt-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onEditClick(question)}
                      className="h-8 px-3 text-blue-600 border-blue-200 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                    >
                      <Pencil className="h-3 w-3 mr-1.5" />
                      Edit
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onDeleteClick(question.id)}
                      className="h-8 px-3 text-red-500 border-red-200 hover:bg-red-50 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-3 w-3 mr-1.5" />
                      Hapus
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
