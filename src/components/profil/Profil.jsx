import withAuth from "../../hoc/withAuth";
import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import keycloak from "../keycloak/keycloak";
import { apiUrl } from "../../api/user";
import { UserOutlined } from "@ant-design/icons";
import { Avatar } from "antd";

import "./Profil.css";

const Profil = () => {
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [selger, setSelger] = useState(false);

  const navigate = useNavigate();

  const handleApplicationClick = () => {
    navigate("/Application");
  };

  const fetchUser = useCallback(async () => {
    try {
      await keycloak.updateToken(5);
      const userId = keycloak.tokenParsed.sub;

      const response = await fetch(`${apiUrl}/${userId}`);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch user. Status code: ${response.status}`
        );
      }

      const fetchedUser = await response.json();
      setUser(fetchedUser);
      setFirstName(fetchedUser.firstName);
      setLastName(fetchedUser.lastName);
      setEmail(fetchedUser.email);
      setSelger(fetchedUser.selger);
    } catch (error) {
      // Handle error
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const handleInputChange = (event) => {
    const target = event.target;
    const value = target.value;
    const name = target.name;

    if (name === "firstName") {
      setFirstName(value);
    } else if (name === "lastName") {
      setLastName(value);
    } else if (name === "email") {
      setEmail(value);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const submitButton = event.nativeEvent.submitter;
    const isOppdaterButton =
      submitButton.classList.contains("profil-submit-btn");

    try {
      const response = await fetch(`${apiUrl}/${keycloak.tokenParsed.sub}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id: keycloak.tokenParsed.sub,
          firstName: firstName,
          lastName: lastName,
          email: email,
          selger: selger,
        }),
      });

      if (!response.ok) {
        throw new Error(`Feil med bruker oppdatering. ${response.status}`);
      }
      setUser(response);

      if (isOppdaterButton) {
        alert(`Du har oppdatert brukerinfromasjon`);
        window.location.reload();
      }
    } catch (error) {
      alert(`Feil med oppdatering av bruker: ${error.message}`);
    }
  };

  return (
    <div className="profil-container">
      {user ? (
        <form className="profil-form" onSubmit={handleFormSubmit}>
          <div>
            <div className="avatar-container">
              <Avatar size={150} icon={<UserOutlined />} />
            </div>
            <label className="profil-label" htmlFor="firstName">
              Fornavn:
            </label>
            <input
              className="profil-input"
              type="text"
              name="firstName"
              id="firstName"
              value={firstName}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="profil-label" htmlFor="lastName">
              Etternavn:
            </label>
            <input
              className="profil-input"
              type="text"
              name="lastName"
              id="lastName"
              value={lastName}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="profil-label" htmlFor="email">
              Email:
            </label>
            <input
              className="profil-input"
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label className="profil-label" htmlFor="selger">
              Bli selger for å kunne legge til Stillingsannonser:
            </label>
            <input
              className="profil-input"
              type="checkbox"
              name="selger"
              id="selger"
              checked={selger}
              onChange={() => setSelger(!selger)}
            />
          </div>
          <button className="profil-submit-btn" type="submit">
            Oppdater
          </button>
          <button
            className="profil-application-btn"
            type="application"
            onClick={handleApplicationClick}
          >
            Se dine favoritt Stillingsannonser
          </button>
        </form>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default withAuth(Profil);
