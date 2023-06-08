import keycloak from "../keycloak/keycloak";
import { NavLink, useNavigate } from "react-router-dom";
import { addUsers, getUser } from "../../api/user";

import './NavBar.css';

const NavBar = () => {
  const navigate = useNavigate();

  if (keycloak.authenticated) {
    console.log(keycloak.tokenParsed.sub);
    getUser(keycloak.tokenParsed.sub)
      .then(result => {
        console.log(result);
        if (!result) {
          console.log("POST");
          addUsers();
        } else {
          // do nothing
          console.log("User exists, NO POST");
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  return (
    <div className="navbar">
      {!keycloak.authenticated && (
        <div className="navbar__item navbar__item--right">
          <button className="navbar__button" onClick={() => keycloak.login()}>
            Logg inn
          </button>
          <button className="navbar__button" onClick={() => keycloak.register()}>
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

      {keycloak.authenticated && (
        <div className="navbar__item">
          <NavLink className="navbar__link" activeClassName="active" to="/leggetiljobb">
            Legg til jobb
          </NavLink>
        </div>
      )}

      {keycloak.authenticated && (
        <div className="navbar__item">
          <NavLink className="navbar__link" activeClassName="active" to="/Profil">
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
