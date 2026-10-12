import {fireEvent, render, screen} from "@testing-library/react";
import {MemoryRouter, Route, Routes} from "react-router-dom";
import {beforeEach, describe, expect, it} from "vitest";
import LanguageSelection from "./LanguageSelection";
import {LANGUAGE_STORAGE_KEY} from "../../../lib/language.js";

describe("LanguageSelection", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("saves the selected language and continues to service selection", () => {
    render(
      <MemoryRouter initialEntries={["/language-selection"]}>
        <Routes>
          <Route path="/language-selection" element={<LanguageSelection />} />
          <Route path="/services" element={<p>Service selection</p>} />
        </Routes>
      </MemoryRouter>,
    );

    fireEvent.click(screen.getByRole("button", {name: /IT Italiano/}));

    expect(localStorage.getItem(LANGUAGE_STORAGE_KEY)).toBe("IT");
    expect(screen.getByText("Service selection")).toBeInTheDocument();
  });
});
