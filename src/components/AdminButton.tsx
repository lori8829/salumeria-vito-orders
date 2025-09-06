import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

export function AdminButton() {
  const handleAdminAccess = () => {
    window.location.href = "/admin";
  };

  return (
    <div className="fixed top-4 right-4 z-50">
      <Button
        variant="outline"
        size="sm"
        onClick={handleAdminAccess}
        className="bg-card/95 backdrop-blur-sm border border-border shadow-card"
      >
        <Settings className="h-4 w-4 mr-2" />
        Admin
      </Button>
    </div>
  );
}