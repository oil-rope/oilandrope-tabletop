import React from "react";

import Main from "./Main";
import Cube from "./Cube";

const App: React.FC = () => {
  return (
    <>
      <Main>
        <h1 className="font-ds text-center">
          Welcome to Oil &amp; Rope Tabletop!
          <br />
          <small className="small text-muted" style={{ fontSize: "1.5rem" }}>
            (Pre-Alpha version)
          </small>
        </h1>
        <hr />
        <Cube />
      </Main>
    </>
  );
};

export default App;
