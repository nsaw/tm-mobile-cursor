import { Check, Save, AlertCircle } from "lucide-react";

interface AutoSaveIndicatorProps {
  status: "idle" | "saving" | "saved" | "error";
}

export function AutoSaveIndicator({ status }: AutoSaveIndicatorProps) {
  if (status === "idle") return null;

  return (
    <div className="flex items-center gap-2 text-xs text-gray-400 mt-2">
      {status === "saving" && (
        <>
          <Save className="w-3 h-3 animate-pulse" />
          <span>Saving...</span>
        </>
      )}
      {status === "saved" && (
        <>
          <Check className="w-3 h-3 text-green-400" />
          <span className="text-green-400">Saved</span>
        </>
      )}
      {status === "error" && (
        <>
          <AlertCircle className="w-3 h-3 text-red-400" />
          <span className="text-red-400">Save failed</span>
        </>
      )}
    </div>
  );
}