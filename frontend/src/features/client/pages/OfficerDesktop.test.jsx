import {render, screen, waitFor} from "@testing-library/react";
import {beforeEach, describe, it, expect, vi} from "vitest";
import {getCounterServices, getQueues} from "../../../lib/api.js";
import OfficerDesktop from "./OfficerDesktop";

vi.mock("../../../lib/api.js", () => ({
  callNext: vi.fn(),
  getCounterServices: vi.fn(),
  getQueues: vi.fn(),
}));

describe("OfficerDesktop Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    getQueues.mockResolvedValue({
      Shipping: {tickets: Array(12).fill({})},
      Pickups: {tickets: []},
    });
    getCounterServices.mockResolvedValue([{id_service: "shipping", name: "Shipping"}]);
  });

  it("renders the header and counter status correctly", () => {
    render(<OfficerDesktop />);

    expect(screen.getByText("Post Office")).toBeInTheDocument();
    expect(screen.getByText("Counter Queue Management")).toBeInTheDocument();
  });

  it("highlights services enabled for this counter", async () => {
    render(<OfficerDesktop />);

    expect(screen.getByText("Active Queues")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("Enabled")).toBeInTheDocument());
    expect(screen.getByText("Shipping").closest("li")).toHaveAttribute("data-enabled", "true");
    expect(screen.getByText("Pickups").closest("li")).toHaveAttribute("data-enabled", "false");
    expect(screen.getByText("12")).toBeInTheDocument();
  });

  it("renders the currently serving area and action button", async () => {
    render(<OfficerDesktop />);

    expect(screen.getByText("Currently Serving")).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText("Enabled")).toBeInTheDocument());
    expect(screen.getByRole("heading", {name: "-", level: 2})).toBeInTheDocument();
    expect(screen.getByText("Call Next Customer")).toBeInTheDocument();
  });
});
