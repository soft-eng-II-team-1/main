import {render, screen} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import {MemoryRouter, Routes, Route} from "react-router";
import LandingPage from "./LandingPage";
import {describe, expect, test} from "vitest";
import ClientPage from "../../client/pages/ClientPage";
import LoginPage from "../../login/pages/LoginPage";

function renderPage() {
  return render(
    <MemoryRouter initialEntries={["/"]}>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/client" element={<ClientPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe("LandingPage", () => {
  test("renders client and operator options", () => {
    renderPage();
    expect(screen.getByRole("link", {name: /client/i})).toBeInTheDocument();
    expect(screen.getByRole("link", {name: /operator/i})).toBeInTheDocument();
  });

  test("links point to the correct routes", () => {
    renderPage();
    expect(screen.getByRole("link", {name: /client/i})).toHaveAttribute(
      "href",
      "/client",
    );
    expect(screen.getByRole("link", {name: /operator/i})).toHaveAttribute(
      "href",
      "/login",
    );
  });

  test("clicking Client navigates to the client page", async () => {
    renderPage();
    await userEvent.click(screen.getByRole("link", {name: /client/i}));
  });

  test("clicking Operator navigates to the login page", async () => {
    renderPage();
    await userEvent.click(screen.getByRole("link", {name: /operator/i}));
  });
});
