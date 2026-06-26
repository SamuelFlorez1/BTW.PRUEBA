"use client";

import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import { Search, LogOut } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/auth";

const TITLES: Record<string, string> = {
  "/inicio": "Inicio",
  "/clientes": "Clientes",
  "/top150": "Top 150",
  "/acuerdos": "Acuerdos de Pago",
};

export default function Header() {
  const pathname = usePathname();
  const { user, signOut } = useAuth();
  const router = useRouter();
  const title = Object.entries(TITLES).find(([k]) => pathname.startsWith(k))?.[1] ?? "Dashboard";

  const handleLogout = async () => {
    await signOut();
    router.replace("/login");
  };

  return (
    <header className="sticky top-0 z-20 flex h-14 items-center justify-between border-b border-[#E5E7EB] bg-white px-6">
      <h1 className="text-base font-semibold text-[#111827]">{title}</h1>

      <div className="relative w-80">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#9CA3AF]" />
        <Input
          placeholder="Buscar cliente o NIT..."
          className="h-9 border-[#E5E7EB] bg-[#F9FAFB] pl-9 text-sm placeholder:text-[#9CA3AF]"
        />
      </div>

      <div className="flex items-center gap-3">
        <span className="text-xs text-[#9CA3AF]">{user?.email}</span>
        <Button variant="ghost" size="sm" onClick={handleLogout} className="h-8 text-xs text-[#6B7280]">
          <LogOut className="mr-1 h-3.5 w-3.5" /> Salir
        </Button>
      </div>
    </header>
  );
}
