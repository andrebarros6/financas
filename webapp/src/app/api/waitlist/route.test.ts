import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock the Supabase client
const mockInsert = vi.fn();
const mockFrom = vi.fn(() => ({ insert: mockInsert }));
const mockCreateClient = vi.fn(() => ({ from: mockFrom }));

vi.mock("@/lib/supabase/server", () => ({
  createClient: () => mockCreateClient(),
}));

// Import the route handler after mocking
import { POST } from "./route";

describe("POST /api/waitlist", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 if email is missing", async () => {
    const request = new Request("http://localhost/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({}),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Email é obrigatório");
  });

  it("returns 400 if email is invalid", async () => {
    const request = new Request("http://localhost/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "not-an-email" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe("Email inválido");
  });

  it("returns 409 if email already exists", async () => {
    mockInsert.mockResolvedValueOnce({
      error: { code: "23505", message: "duplicate key" },
    });

    const request = new Request("http://localhost/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "existing@example.com" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.error).toBe("Este email já está na lista de espera");
  });

  it("returns success for valid new email", async () => {
    mockInsert.mockResolvedValueOnce({ error: null });

    const request = new Request("http://localhost/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "new@example.com" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(mockFrom).toHaveBeenCalledWith("waitlist");
    expect(mockInsert).toHaveBeenCalledWith({ email: "new@example.com" });
  });

  it("returns 500 on database error", async () => {
    mockInsert.mockResolvedValueOnce({
      error: { code: "OTHER", message: "Database error" },
    });

    const request = new Request("http://localhost/api/waitlist", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: "test@example.com" }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe("Erro ao registar email");
  });
});
