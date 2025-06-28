import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FloatingButtonProps {
  onClick: () => void;
}

export function FloatingButton({ onClick }: FloatingButtonProps) {
  return (
    <Button
      onClick={onClick}
      className="fixed bottom-20 right-6 w-14 h-14 rounded-full bg-[#C6D600] hover:bg-[#B5C100] text-black shadow-lg hover:shadow-xl transition-all duration-300 z-50"
      size="icon"
    >
      <Plus className="h-6 w-6" />
    </Button>
  );
}
