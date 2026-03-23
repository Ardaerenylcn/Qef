import { Loader2 } from "lucide-react";

export default function AdminLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
        <p className="text-sm text-gray-400">Yükleniyor...</p>
      </div>
    </div>
  );
}
