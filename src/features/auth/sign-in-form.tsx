"use client";

import { signIn } from "next-auth/react";
import { FormEvent, useState } from "react";
import { Button } from "@/ui/button";

export default function SignInForm() {
  const [email, setEmail] = useState("");
  const [isLoading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setLoading(true);
    await signIn("email", { email });
    setLoading(false);
  };

  return (
    <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-soft">
      <h1 className="font-display text-3xl text-cacao-600">Bienvenido</h1>
      <p className="mt-2 text-sm text-cacao-500">Accede al panel administrativo con tu correo o Google.</p>
      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <label className="block space-y-1 text-sm">
          <span className="text-xs font-semibold uppercase text-cacao-400">Correo</span>
          <input
            type="email"
            required
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-2xl border border-ivory-200 px-4 py-2"
          />
        </label>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? "Enviando" : "Enviar enlace mágico"}
        </Button>
      </form>
      <div className="mt-6">
        <Button
          type="button"
          className="w-full bg-white text-cacao-600 shadow"
          variant="secondary"
          onClick={() => signIn("google")}
        >
          Continuar con Google
        </Button>
      </div>
    </div>
  );
}
