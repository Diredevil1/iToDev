import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { vi, expect } from "vitest";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Characters } from "../Characters";

const mockCharacters = [
  { name: "Luke Skywalker", url: "https://swapi.info/api/people/1/" },
  { name: "Darth Vader", url: "https://swapi.info/api/people/4/" },
  { name: "Leia Organa", url: "https://swapi.info/api/people/5/" },
];

const queryClient = new QueryClient();

globalThis.fetch = vi.fn((url: string) => {
  if (url.includes("people")) {
    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockCharacters),
    });
  }
  return Promise.reject("Unknown url");
}) as ReturnType<typeof vi.fn>;

describe("Characters Component", () => {
  it("filters characters by search term and paginates results", async () => {
    render(
      <MemoryRouter initialEntries={["/characters"]}>
        <QueryClientProvider client={queryClient}>
          <Routes>
            <Route path="/characters" element={<Characters />} />
          </Routes>
        </QueryClientProvider>
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText("Luke Skywalker")).toBeInTheDocument();
      expect(screen.getByText("Darth Vader")).toBeInTheDocument();
    });

    const input = screen.getByPlaceholderText(/name/i);
    await userEvent.type(input, "luke");

    await waitFor(() => {
      expect(screen.getByText("Luke Skywalker")).toBeInTheDocument();
      expect(screen.queryByText("Darth Vader")).not.toBeInTheDocument();
    });

    expect(screen.getByRole("button", { name: /prev/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /next/i })).toBeDisabled();
  });
});
