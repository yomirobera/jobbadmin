import React, { useState } from "react";
import withAuth from "../../../hoc/withAuth";
import { addStilling } from "../../../api/LeggtilJobb";
import { getUser } from "../../../api/user";
import "./Leggetiljobb.css";
import keycloak from "../../keycloak/keycloak";

const Leggetiljobb = () => {
  const [stilling, setStilling] = useState({
    firma: "",
    tittel: "",
    beskrivelse: "",
    krav: "",
    plassering: "",
    soknadsfrist: "",
    lenke: "",
    kode: "",
    madeByUser: keycloak.tokenParsed.sub,
    users: [],
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setStilling({ ...stilling, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Fetch the current user information
      //const currentUser = await getUser(keycloak.tokenParsed.sub);

      // Create a new job listing object with the user information
      const jobListing = {
        ...stilling,
        //users: [currentUser.id],
      };
      //stilling.users = currentUser.id;

      const response = await addStilling(jobListing);
      console.log(response);
      alert("Stillingsannonsen har blitt registrert");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="Leggetiljobb-container">
      <h3 className="jobb">Legge til en jobb</h3>
      <p className="jobb">
        Du vet hva du leter etter. Vi hjelper deg å finne dem. Legg ut ledige
        stillinger og ansett raskt det beste talentet
      </p>
      <div className="Leggetiljobb-card">
        <form onSubmit={handleSubmit}>
          <label className="Leggetiljobb-label">
            <span className="Leggetiljobb-label-text">Firma:</span>
            <input
              type="text"
              name="firma"
              maxLength={50}
              required
              onChange={handleInputChange}
              className="Leggetiljobb-input"
            />
          </label>

          <label className="Leggetiljobb-label">
            <span className="Leggetiljobb-label-text">Tittel:</span>
            <input
              type="text"
              name="tittel"
              maxLength={50}
              required
              onChange={handleInputChange}
              className="Leggetiljobb-input"
            />
          </label>

          <label className="Leggetiljobb-label">
            <span className="Leggetiljobb-label-text">Beskrivelse:</span>
            <input
              type="text"
              name="beskrivelse"
              maxLength={500}
              required
              onChange={handleInputChange}
              className="Leggetiljobb-input"
            />
          </label>

          <label className="Leggetiljobb-label">
            <span className="Leggetiljobb-label-text">Krav:</span>
            <input
              type="text"
              name="krav"
              maxLength={100}
              required
              onChange={handleInputChange}
              className="Leggetiljobb-input"
            />
          </label>

          <label className="Leggetiljobb-label">
            <span className="Leggetiljobb-label-text">Plassering:</span>
            <input
              type="text"
              name="plassering"
              maxLength={50}
              required
              onChange={handleInputChange}
              className="Leggetiljobb-input"
            />
          </label>

          <label className="Leggetiljobb-label">
            <span className="Leggetiljobb-label-text">Søknadsfrist:</span>
            <input
              type="date"
              name="soknadsfrist"
              required
              onChange={handleInputChange}
              className="Leggetiljobb-input"
            />
          </label>

          <label className="Leggetiljobb-label">
            <span className="Leggetiljobb-label-text">Ekstern lenke:</span>
            <input
              type="text"
              name="lenke"
              onChange={handleInputChange}
              className="Leggetiljobb-input"
            />
          </label>

          <label className="Leggetiljobb-label">
            <span className="Leggetiljobb-label-text">Kodeområde:</span>
            <input
              type="text"
              name="kode"
              onChange={handleInputChange}
              className="Leggetiljobb-input"
            />
          </label>

          <button type="submit" className="Leggetiljobb-button">
            Legg til jobb
          </button>
        </form>
      </div>
    </div>
  );
};

export default withAuth(Leggetiljobb);
