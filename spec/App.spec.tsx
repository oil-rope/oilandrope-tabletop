import React from "react";
import { render, screen } from "@testing-library/react";

import App from "../src/App";

describe("App component suite", () => {
  it("renders correctly", () => {
    render(<App />);

    expect(screen.getByText(/Hello world!/)).toBeInTheDocument();
  });
});
