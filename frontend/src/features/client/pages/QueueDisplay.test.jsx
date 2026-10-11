import {render, screen} from "@testing-library/react";
import {describe, it, expect} from "vitest";
import QueueDisplay from "./QueueDisplay";

describe("QueueDisplay Component", () => {
  it("renders the header and current call ticket details", () => {
    render(<QueueDisplay />);

    // Check that header is rendered
    expect(screen.getByTestId("mock-header")).toBeInTheDocument();

    // Check current call details
    expect(screen.getByText("Last Called")).toBeInTheDocument();
    expect(screen.getByText("A-204")).toBeInTheDocument();
    expect(screen.getByText("Counter 04")).toBeInTheDocument();
    expect(screen.getByText("Shipping")).toBeInTheDocument();
  });

  it("renders all recent calls with their counter numbers and services", () => {
    render(<QueueDisplay />);

    // Recent calls section header (checking case-insensitively or via heading)
    const recentCallHeadings = screen.getAllByText("Recent Calls");
    expect(recentCallHeadings.length).toBeGreaterThan(0);

    // Check recent call numbers
    expect(screen.getByText("A-203")).toBeInTheDocument();
    expect(screen.getByText("Counter 02")).toBeInTheDocument();
    expect(screen.getByText("Pickups")).toBeInTheDocument();

    expect(screen.getByText("P-087")).toBeInTheDocument();
    expect(screen.getByText("Counter 01")).toBeInTheDocument();
    expect(screen.getByText("Payments")).toBeInTheDocument();

    expect(screen.getByText("T-112")).toBeInTheDocument();
    expect(screen.getByText("Counter 05")).toBeInTheDocument();
    expect(screen.getByText("Top-ups")).toBeInTheDocument();
  });
});
