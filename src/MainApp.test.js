import React from "react";
import { render, screen } from "@testing-library/react";

import MainApp from "./MainApp";

describe("MainApp suite", () => {
  it("renders correctly", () => {
    render(<MainApp />);

    expect(screen.getByText("Hello world!")).toBeInTheDocument();
  });
});
