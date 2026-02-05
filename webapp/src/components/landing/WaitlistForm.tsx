"use client";

import { useState, type FormEvent } from "react";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";

interface WaitlistFormProps {
  className?: string;
}

type FormState = "idle" | "loading" | "success" | "error";

export function WaitlistForm({ className = "" }: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<FormState>("idle");
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setState("loading");
    setErrorMessage("");

    try {
      const response = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Erro ao registar email");
      }

      setState("success");
      setEmail("");
    } catch (err) {
      setState("error");
      setErrorMessage(
        err instanceof Error ? err.message : "Erro ao registar email"
      );
    }
  };

  if (state === "success") {
    return (
      <div
        className={`rounded-lg bg-green-50 p-6 text-center ${className}`}
        role="alert"
      >
        <div className="mb-2 text-2xl">🎉</div>
        <h3 className="mb-1 text-lg font-semibold text-green-800">
          Obrigado!
        </h3>
        <p className="text-green-700">
          Vamos avisar-te quando o produto estiver disponível.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`w-full max-w-md ${className}`}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <Input
          type="email"
          name="email"
          placeholder="O teu email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={state === "loading"}
          aria-label="Endereço de email"
        />
        <Button
          type="submit"
          variant="primary"
          size="md"
          loading={state === "loading"}
          className="whitespace-nowrap"
        >
          Avisar-me
        </Button>
      </div>
      {state === "error" && (
        <p className="mt-2 text-sm text-red-500" role="alert">
          {errorMessage}
        </p>
      )}
      <p className="mt-2 text-xs text-gray-500">
        Sem spam. Apenas um email quando lançarmos.
      </p>
    </form>
  );
}
