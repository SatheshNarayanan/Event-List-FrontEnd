import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import PageErrorBoundary from "./Components/PageErrorBoundary";
import { Switch, Route } from "react-router-dom";
import Header from "./Components/Header";
import Events from "./Pages/EventList";
import Signup from "./Pages/Signup";
import Home from "./Pages/Home";

export default function App() {
  return (
    <>
      <Header />
      <Switch>
        <Route exact path="/">
          <PageErrorBoundary>
            <Home />
          </PageErrorBoundary>
        </Route>
        <Route exact path="/events">
          <PageErrorBoundary>
            <Events />
          </PageErrorBoundary>
        </Route>
        <Route exact path="/events/:id">
          <PageErrorBoundary>
            <Signup />
          </PageErrorBoundary>
        </Route>
      </Switch>
    </>
  );
}
