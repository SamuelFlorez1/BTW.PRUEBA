"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      setError("Credenciales incorrectas");
      setLoading(false);
      return;
    }

    router.push("/inicio");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#F9FAFB]">
      <form onSubmit={handleLogin} className="w-full max-w-sm space-y-5 rounded-xl border border-[#E5E7EB] bg-white p-8 shadow-sm">
        <div className="flex flex-col items-center gap-2">
          <Image src="/btw_logo.png" alt="BTW" width={48} height={48} className="rounded-full" />
          <h1 className="text-lg font-semibold text-[#111827]">RECAUDA</h1>
          <p className="text-xs text-[#9CA3AF]">Ingresa con tu cuenta de gestor</p>
        </div>

        <div className="space-y-3">
          <div>
            <label className="mb-1 block text-xs font-medium text-[#111827]">Correo</label>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="gestor@empresa.com"
              className="border-[#E5E7EB]"
              required
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-medium text-[#111827]">Contraseña</label>
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-[#E5E7EB]"
              required
            />
          </div>
        </div>

        {error && <p className="text-center text-xs text-[#DC2626]">{error}</p>}

        <Button
          type="submit"
          disabled={loading}
          className="w-full bg-[#F26522] text-white hover:bg-[#D94520]"
        >
          {loading ? "Ingresando..." : "Ingresar"}
        </Button>
      </form>
    </div>
  );
}
