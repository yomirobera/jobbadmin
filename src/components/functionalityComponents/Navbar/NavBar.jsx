import keycloak from "../../keycloak/keycloak";
import { NavLink, useNavigate } from "react-router-dom";
import { addUsers, getUser } from "../../../api/user";
import React, { useState, useEffect } from "react";

import "./NavBar.css";

const NavBar = () => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState("");

  useEffect(() => {
    const fetchUserRole = async () => {
      try {
        const user = await getUser(keycloak.tokenParsed.sub);
        setUserRole(user && user.selger ? user.selger : false);
      } catch (error) {
        console.error(error);
      }
    };

    if (keycloak.authenticated) {
      getUser(keycloak.tokenParsed.sub)
        .then((result) => {
          if (!result) {
            console.log("POST");
            addUsers();
          } else {
            // do nothing
            console.log("User exists, NO POST");
          }
        })
        .catch((error) => {
          console.error(error);
        });
      fetchUserRole();
    }
  }, []);

  return (
    <div className="navbar">
      {!keycloak.authenticated && (
        <div className="navbar__item navbar__item--right">
          <button className="navbar__button" onClick={() => keycloak.login()}>
            Logg inn
          </button>
          <button
            className="navbar__button"
            onClick={() => keycloak.register()}
          >
            Ny bruker
          </button>
        </div>
      )}

      {keycloak.authenticated && (
        <div className="navbar__item">
          <NavLink className="navbar__link" activeClassName="active" to="/">
            Stillingsannonser
          </NavLink>
        </div>
      )}

      {keycloak.authenticated && userRole && userRole !== "Selger" && (
        <div className="navbar__item">
          <NavLink
            className="navbar__link"
            activeClassName="active"
            to="/leggetiljobb"
          >
            Legg til jobb
          </NavLink>
        </div>
      )}

      {keycloak.authenticated && userRole && userRole !== "Selger" && (
        <div className="navbar__item">
          <NavLink
            className="navbar__link"
            activeClassName="active"
            to="/MineStillinger"
          >
            Mine Stillinger
          </NavLink>
        </div>
      )}

      {keycloak.authenticated && (
        <div className="navbar__item">
          <NavLink
            className="navbar__link"
            activeClassName="active"
            to="/Profil"
          >
            Profil
          </NavLink>
        </div>
      )}

      {keycloak.authenticated && (
        <button
          className="navbar__item navbar__button logout-button"
          onClick={() => {
            keycloak.logout();
            navigate("/");
          }}
        >
          Logg ut
        </button>
      )}
    </div>
  );
};

export default NavBar;
