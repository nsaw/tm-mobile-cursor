import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function SearchBar({ value, onChange, placeholder = "Search thoughtmarks..." }: SearchBarProps) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search className="h-5 w-5 text-gray-400" />
      </div>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="search-input w-full pl-10 pr-4 py-3 bg-gray-800 border-gray-600 rounded-xl text-white placeholder-gray-400 focus:ring-[#C6D600] focus:border-[#C6D600]"
        placeholder={placeholder}
      />
    </div>
  );
}
