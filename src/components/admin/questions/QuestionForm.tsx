import { useState, useEffect } from "react";
import { Question, IntelligenceType, intelligenceTypes } from "@/data/testQuestions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface QuestionFormProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  question: Question | null;
  onSave: (question: Question) => Promise<boolean>;
  defaultType?: IntelligenceType;
}

export function QuestionForm({ 
  isOpen, 
  onOpenChange, 
  question,
  onSave,
  defaultType 
}: QuestionFormProps) {
  const [formData, setFormData] = useState<Question>({
    id: "",
    text: "",
    type: defaultType || "linguistic"
  });
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = Boolean(question);

  // Generate next ID in sequence for a type
  const generateNextId = (type: string) => {
    const prefix = type.charAt(0).toUpperCase();
    if (type === 'logical') return `M1`;  // Logical uses M prefix (Mathematical)
    if (type === 'intrapersonal') return `Ia1`; // Special case for intrapersonal
    if (type === 'interpersonal') return `I1`;
    if (type === 'musical') return `Mu1`; // Special case for musical
    return `${prefix}1`;
  };

  // Reset form when modal opens/closes or question changes
  useEffect(() => {
    if (isOpen) {
      if (question) {
        // Edit mode - use existing question data
        setFormData({ ...question });
      } else {
        // Add mode - set defaults
        setFormData({
          id: "",
          text: "",
          type: defaultType || "linguistic"
        });
      }
      setValidationErrors({});
    }
  }, [isOpen, question, defaultType]);

  // Update ID when type changes in add mode
  useEffect(() => {
    if (isOpen && !isEditMode) {
      setFormData(prev => ({
        ...prev,
        id: generateNextId(prev.type)
      }));
    }
  }, [formData.type, isOpen, isEditMode]);

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.id.trim()) {
      errors.id = "ID soal harus diisi";
    }

    if (!formData.text.trim()) {
      errors.text = "Teks soal harus diisi";
    }

    if (!formData.type) {
      errors.type = "Tipe kecerdasan harus dipilih";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    try {
      const success = await onSave(formData);
      if (success) {
        onOpenChange(false);
      }
    } catch (error) {
      console.error("Error saving question:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-5 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl">
            {isEditMode ? "Edit Soal" : "Tambah Soal Baru"}
          </DialogTitle>
          <DialogDescription className="text-gray-500">
            {isEditMode 
              ? "Perbarui informasi soal tes kecerdasan" 
              : "Tambahkan soal baru untuk tes kecerdasan"}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-5 mt-2">
          <div className="space-y-2">
            <Label htmlFor="type" className="text-sm font-medium">Tipe Kecerdasan</Label>
            <Select 
              value={formData.type} 
              onValueChange={(value: IntelligenceType) => 
                setFormData({ ...formData, type: value })
              }
              disabled={isEditMode}
            >
              <SelectTrigger className="transition-all focus-visible:ring-2 focus-visible:ring-primary">
                <SelectValue placeholder="Pilih tipe kecerdasan" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(intelligenceTypes).map(([key, label]) => (
                  <SelectItem key={key} value={key} className="focus:bg-primary/10">
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {validationErrors.type && (
              <p className="text-sm text-red-500 mt-1 animate-pulse">{validationErrors.type}</p>
            )}
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="id" className="text-sm font-medium">ID Soal</Label>
              <Input
                id="id"
                value={formData.id}
                onChange={(e) => setFormData({ ...formData, id: e.target.value })}
                disabled={isEditMode}
                placeholder="Contoh: L1, M2, S3"
                className="font-mono text-sm transition-all focus-visible:ring-2 focus-visible:ring-primary"
              />
              {validationErrors.id && (
                <p className="text-sm text-red-500 mt-1 animate-pulse">{validationErrors.id}</p>
              )}
            </div>
            
            <div className="space-y-2 hidden sm:block">
              <Label className="text-sm font-medium text-gray-500">Tipe Soal</Label>
              <div className="h-10 flex items-center px-2 bg-gray-50 rounded-md border text-sm text-gray-500">
                {isEditMode ? intelligenceTypes[formData.type] : 'Otomatis dari ID'}
              </div>
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="text" className="text-sm font-medium">Teks Soal</Label>
            <Textarea
              id="text"
              value={formData.text}
              onChange={(e) => setFormData({ ...formData, text: e.target.value })}
              placeholder="Masukkan teks soal"
              rows={5}
              className="resize-y min-h-[100px] transition-all focus-visible:ring-2 focus-visible:ring-primary"
            />
            {validationErrors.text && (
              <p className="text-sm text-red-500 mt-1 animate-pulse">{validationErrors.text}</p>
            )}
          </div>
        </div>
        
        <DialogFooter className="flex flex-col-reverse xs:flex-row gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="w-full xs:w-auto transition-all duration-200"
          >
            Batal
          </Button>
          <Button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full xs:w-auto transition-all duration-200"
          >
            {isSubmitting ? (
              <span className="flex items-center">
                <span className="inline-block animate-spin rounded-full h-3 w-3 border-b-2 border-t-2 border-white mr-2"></span>
                Menyimpan...
              </span>
            ) : isEditMode ? "Simpan Perubahan" : "Tambah Soal"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
