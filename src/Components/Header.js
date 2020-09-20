import React from "react";
import { Navbar } from "reactstrap";

//Just a Header since no links are needed here have just displayed events
//and redirected it to Home Page

import { NavLink } from "react-router-dom";
const Header = () => {
  return (
    <div>
      <Navbar color="dark" dark expand="md" className="mb-5">
        <NavLink
          className="navbar-brand h1 text-center "
          to="/"
          style={{ width: "100vw" }}
        >
          Event
        </NavLink>
      </Navbar>
    </div>
  );
};

export default Header;
