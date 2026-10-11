import {render, screen} from "@testing-library/react";
import {describe, it, expect} from "vitest";
import OfficerDesktop from "./OfficerDesktop";

describe("OfficerDesktop Component", () => {
  it("renders the header and counter status correctly", () => {
    render(<OfficerDesktop />);

    expect(screen.getByText("Post Office")).toBeInTheDocument();
    expect(screen.getByText("Counter Queue Management")).toBeInTheDocument();
    expect(screen.getByText("Counter 04 - Ready")).toBeInTheDocument();
  });

  it("renders the active queues sidebar with service names and counts", () => {
    render(<OfficerDesktop />);

    expect(screen.getByText("Active Queues")).toBeInTheDocument();
    expect(screen.getByText("Shipping")).toBeInTheDocument();
    expect(screen.getByText("12")).toBeInTheDocument(); // Shipping count
    expect(screen.getByText("Pickups")).toBeInTheDocument();
    expect(screen.getByText("Financial Services")).toBeInTheDocument();
  });

  it("renders currently serving ticket information and action buttons", () => {
    render(<OfficerDesktop />);

    expect(screen.getByText("Currently Serving")).toBeInTheDocument();
    expect(screen.getByText("A-204")).toBeInTheDocument();
    expect(screen.getByText("Call Next Customer")).toBeInTheDocument();
    expect(screen.getByText("Close Ticket")).toBeInTheDocument();
    expect(screen.getByText("No Show")).toBeInTheDocument();
  });
});
