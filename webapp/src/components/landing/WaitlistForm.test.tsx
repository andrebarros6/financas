import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { WaitlistForm } from "./WaitlistForm";

// Mock fetch
const mockFetch = vi.fn();
global.fetch = mockFetch;

describe("WaitlistForm", () => {
  beforeEach(() => {
    mockFetch.mockReset();
  });

  it("renders the form with email input and submit button", () => {
    render(<WaitlistForm />);

    expect(screen.getByPlaceholderText("O teu email")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Avisar-me" })).toBeInTheDocument();
    expect(
      screen.getByText("Sem spam. Apenas um email quando lançarmos.")
    ).toBeInTheDocument();
  });

  it("submits the form with valid email", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<WaitlistForm />);

    const input = screen.getByPlaceholderText("O teu email");
    const button = screen.getByRole("button", { name: "Avisar-me" });

    fireEvent.change(input, { target: { value: "test@example.com" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "test@example.com" }),
      });
    });
  });

  it("shows success message after successful submission", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<WaitlistForm />);

    const input = screen.getByPlaceholderText("O teu email");
    const button = screen.getByRole("button", { name: "Avisar-me" });

    fireEvent.change(input, { target: { value: "test@example.com" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText("Obrigado!")).toBeInTheDocument();
      expect(
        screen.getByText("Vamos avisar-te quando o produto estiver disponível.")
      ).toBeInTheDocument();
    });
  });

  it("shows error message when submission fails", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: false,
      json: async () => ({ error: "Este email já está na lista de espera" }),
    });

    render(<WaitlistForm />);

    const input = screen.getByPlaceholderText("O teu email");
    const button = screen.getByRole("button", { name: "Avisar-me" });

    fireEvent.change(input, { target: { value: "existing@example.com" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(
        screen.getByText("Este email já está na lista de espera")
      ).toBeInTheDocument();
    });
  });

  it("trims whitespace from email before submission", async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    render(<WaitlistForm />);

    const input = screen.getByPlaceholderText("O teu email");
    const button = screen.getByRole("button", { name: "Avisar-me" });

    fireEvent.change(input, { target: { value: "  test@example.com  " } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(mockFetch).toHaveBeenCalledWith("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: "test@example.com" }),
      });
    });
  });

  it("disables input and button while loading", async () => {
    // Use a promise that we control to keep the loading state
    let resolvePromise: (value: unknown) => void;
    const promise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    mockFetch.mockReturnValueOnce(promise);

    render(<WaitlistForm />);

    const input = screen.getByPlaceholderText("O teu email");
    const button = screen.getByRole("button", { name: "Avisar-me" });

    fireEvent.change(input, { target: { value: "test@example.com" } });
    fireEvent.click(button);

    // Check that elements are disabled during loading
    expect(input).toBeDisabled();
    expect(button).toBeDisabled();

    // Resolve the promise to complete the test
    resolvePromise!({
      ok: true,
      json: async () => ({ success: true }),
    });
  });
});
