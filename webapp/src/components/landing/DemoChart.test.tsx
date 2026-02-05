import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DemoChart } from "./DemoChart";

describe("DemoChart", () => {
  it("renders the chart title", () => {
    render(<DemoChart />);
    expect(screen.getByText("Rendimento Mensal")).toBeInTheDocument();
  });

  it("renders the year badge", () => {
    render(<DemoChart />);
    expect(screen.getByText("2025")).toBeInTheDocument();
  });

  it("renders all month labels", () => {
    render(<DemoChart />);

    // Check months that appear only once (not in best month)
    const uniqueMonths = [
      "Jan",
      "Fev",
      "Mar",
      "Abr",
      "Mai",
      "Jun",
      "Jul",
      "Ago",
      "Set",
      "Out",
      "Nov",
    ];

    uniqueMonths.forEach((month) => {
      expect(screen.getByText(month)).toBeInTheDocument();
    });

    // Dez appears twice (in chart and in "Melhor Mês")
    expect(screen.getAllByText("Dez")).toHaveLength(2);
  });

  it("renders summary statistics", () => {
    render(<DemoChart />);

    expect(screen.getByText("Total Anual")).toBeInTheDocument();
    expect(screen.getByText("Média Mensal")).toBeInTheDocument();
    expect(screen.getByText("Melhor Mês")).toBeInTheDocument();
  });

  it("shows total annual value formatted", () => {
    render(<DemoChart />);
    // Total of demo data: 2400+1800+3200+2800+3600+2100+3800+1500+4200+3400+2900+4800 = 36500
    // Locale formatting may vary, so we check for partial match
    expect(screen.getByText(/36.*500.*€/)).toBeInTheDocument();
  });

  it("shows correct best month in summary", () => {
    render(<DemoChart />);
    // December (Dez) has the highest value (4800)
    // Check that there's a Dez inside the summary section
    const summarySection = screen.getByText("Melhor Mês").parentElement;
    expect(summarySection?.textContent).toContain("Dez");
  });

  it("applies custom className", () => {
    const { container } = render(<DemoChart className="custom-class" />);
    expect(container.firstChild).toHaveClass("custom-class");
  });
});
