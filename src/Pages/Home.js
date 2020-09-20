import React from "react";
import { NavLink } from "react-router-dom";
import home from "../images/Home";

//Just a dummy Home Page

const Home = () => {
  return (
    <div className="jumbotron text-center container my-n5">
      <h1 className="display-3">Events Lists</h1>
      <img
        alt="Home "
        style={{ maxHeight: "50%", maxWidth: "50%" }}
        className="image-fluid"
        src={home}
      />
      <hr className="my-4" />
      <p>
        You are just one click away from seeing all the Events, Paricipate and
        win exciting Prizes
      </p>
      <NavLink className="btn btn-primary btn-lg" to="/events" role="button">
        Event List
      </NavLink>
    </div>
  );
};

export default Home;
