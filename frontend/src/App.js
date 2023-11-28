import React from "react";
import "./App.css";
import { Route, Switch } from "react-router-dom";
import LandingPage from "./Components/LandingPage";
import VideoViewPage from "./Components/VideoViewPage";

export const config = {
  // endpoint: `https://2a178982-e78f-4e99-b706-1cac814c6d8d.mock.pstmn.io/v1`,
  // endpoint: `https://ed4470b8-8fa7-462a-88c9-306459bb9c98.mock.pstmn.io/v1`,
  endpoint: `http://localhost:8082`,
};

function App() {
  return (
    <div className="App">
      <React.StrictMode>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="/video/:id" component={VideoViewPage} />
        </Switch>
      </React.StrictMode>
      {/* <LandingPage /> */}
    </div>
  );
}

export default App;