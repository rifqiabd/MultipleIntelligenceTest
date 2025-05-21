import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { FC } from "react";

interface ProfileUpdateProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  displayName: string;
  userEmail: string;
  isUpdating: boolean;
  onDisplayNameChange: (name: string) => void;
  onSave: () => void;
}

const ProfileUpdate: FC<ProfileUpdateProps> = ({
  isOpen,
  onOpenChange,
  displayName,
  userEmail,
  isUpdating,
  onDisplayNameChange,
  onSave
}) => {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Perbarui Profil</DialogTitle>
          <DialogDescription>
            Ubah informasi profil admin yang akan ditampilkan pada dashboard.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="display-name">Nama Tampilan</Label>
            <Input
              id="display-name"
              value={displayName}
              onChange={(e) => onDisplayNameChange(e.target.value)}
              placeholder="Masukkan nama tampilan"
            />
          </div>
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              value={userEmail}
              disabled
              placeholder="Email"
            />
          </div>
        </div>
        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Batal
          </Button>
          <Button
            onClick={onSave}
            disabled={isUpdating}
          >
            {isUpdating ? "Menyimpan..." : "Simpan"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileUpdate;
