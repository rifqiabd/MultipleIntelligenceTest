
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";

export type UserData = {
  name: string;
  age: number;
  gender: string;
  email: string;
  studentClass: string;
};

const TestEntryForm = () => {
  const [userData, setUserData] = useState<UserData>({
    name: "",
    age: 0,
    gender: "",
    email: "",
    studentClass: "",
  });
  
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: name === "age" ? parseInt(value) || 0 : value,
    });
  };

  const handleGenderChange = (value: string) => {
    setUserData({
      ...userData,
      gender: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
      // Validation
    if (!userData.name || userData.age <= 0 || !userData.gender || !userData.email || !userData.studentClass) {
      toast({
        title: "Formulir Tidak Lengkap",
        description: "Mohon isi semua kolom yang diperlukan",
        variant: "destructive",
      });
      return;
    }
    
    // Store user data in session storage to use later
    sessionStorage.setItem("userData", JSON.stringify(userData));
    
    // Navigate to the test page
    navigate("/test/questions");
  };
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="text-2xl text-center">Sebelum Anda Mulai</CardTitle>
          <CardDescription className="text-center">
            Silakan berikan informasi Anda untuk memulai Tes Kecerdasan Majemuk
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama Lengkap</Label>
              <Input 
                id="name"
                name="name"
                value={userData.name}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="age">Usia</Label>
              <Input 
                id="age"
                name="age"
                type="number"
                min="1"
                max="120"
                value={userData.age || ""}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="space-y-2">
              <Label>Jenis Kelamin</Label>
              <RadioGroup 
                value={userData.gender} 
                onValueChange={handleGenderChange}
                className="flex flex-col space-y-1"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Laki-laki" id="male" />
                  <Label htmlFor="male">Laki-laki</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Perempuan" id="female" />
                  <Label htmlFor="female">Perempuan</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Non-biner" id="non-binary" />
                  <Label htmlFor="non-binary">Non-biner</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="Tidak ingin menyebutkan" id="prefer-not-to-say" />
                  <Label htmlFor="prefer-not-to-say">Tidak ingin menyebutkan</Label>
                </div>
              </RadioGroup>
            </div>
              <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input 
                id="email"
                name="email"
                type="email"
                value={userData.email}
                onChange={handleChange}
                required
              />
            </div>
              <div className="space-y-2">
              <Label htmlFor="studentClass">Kelas</Label>
              <Input 
                id="studentClass"
                name="studentClass"
                value={userData.studentClass}
                onChange={handleChange}
                required
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full">Mulai Tes</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default TestEntryForm;
