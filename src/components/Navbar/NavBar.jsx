import keycloak from "../keycloak/keycloak";
import { NavLink, useNavigate } from "react-router-dom";
import { addUsers, getUser } from "../../api/user";

const NavBar = () => {
  const navigate = useNavigate();

  if (keycloak.authenticated) {
    console.log(keycloak.tokenParsed.sub)
    getUser(keycloak.tokenParsed.sub)
      .then(result => {
        console.log(result)
        if (!result) {
          console.log("POST")
          addUsers();
        } else {
          // do nothing
          console.log("User exists, NO POST")
        }
      })
      .catch(error => {
        console.error(error);
      });
  }

  return (
    <div className="registrer">
      {!keycloak.authenticated && (
        <>
          <button
            onClick={() => keycloak.login()}
          >
            Logg inn
          </button>

          <button
            onClick={() => keycloak.register()}
          >
            Ny bruker
          </button>
        </>
      )}

      {keycloak.authenticated && (
        <div className="navbar__item">
          <NavLink className="tekst" to="/">
            <button>
              Stillingsannonser
            </button>
          </NavLink>
        </div>
      )}

      {keycloak.authenticated && (
        <div className="navbar__item">
          <NavLink className="tekst" to="/leggetiljobb">
            <button>
              Legg til jobb
            </button>

          </NavLink>
        </div>
      )}

      {keycloak.authenticated && (
        <div className="navbar__item">
          <NavLink className="tekst" to="/Profil">
            <button>
              Profil
            </button>

          </NavLink>
        </div>
      )}

      {keycloak.authenticated && (
        <button
          className="navbar__item logout-button"
          onClick={() => {
            keycloak.logout();
            navigate("/");
          }}
        >
          Logg ut
        </button>
      )}
    </div>
  )
}
export default NavBar;