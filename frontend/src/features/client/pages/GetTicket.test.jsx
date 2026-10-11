import {render, screen, fireEvent, waitFor} from "@testing-library/react";
import {MemoryRouter} from "react-router-dom";
import {describe, it, expect, vi, beforeEach, afterEach} from "vitest";
import GetTicket from "./GetTicket";

// Helper to render the component inside a Router
const renderComponent = () => {
  return render(
    <MemoryRouter>
      <GetTicket />
    </MemoryRouter>,
  );
};

describe("GetTicket Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders the service selection screen with all mock services", () => {
    renderComponent();

    // Verify header and title
    expect(screen.getByText("Select a service")).toBeInTheDocument();
    expect(screen.getByText("Post Office")).toBeInTheDocument();

    // Verify all mock services are rendered
    const expectedServices = [
      "Shipping",
      "Pickups",
      "Payments",
      "Financial Services",
      "Top-ups",
      "Identity Services",
    ];
    expectedServices.forEach((serviceName) => {
      expect(screen.getByText(serviceName)).toBeInTheDocument();
    });
  });

  it("transitions to the ticket issued screen when a service is selected", async () => {
    renderComponent();

    // Click on the 'Shipping' service button
    const shippingButton = screen.getByText("Shipping").closest("button");
    fireEvent.click(shippingButton);

    // Fast-forward timers to account for the setTimeout in handleServiceSelect
    vi.advanceTimersByTime(500);

    // Wait for the ticket screen to appear
    await waitFor(() => {
      expect(
        screen.getByText("Ticket issued successfully"),
      ).toBeInTheDocument();
    });

    // Verify ticket details are rendered properly based on the mock output
    expect(screen.getByText("A040")).toBeInTheDocument();
    expect(screen.getByText("Shipping")).toBeInTheDocument();
    expect(screen.getByText("10:38")).toBeInTheDocument();
  });
});
