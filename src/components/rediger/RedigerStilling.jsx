import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { getStillinger, updateStilling } from "../../api/LeggtilJobb";
import keycloak from "../keycloak/keycloak";
import withAuth from "../../hoc/withAuth";

import "./RedigerStilling.css";

const RedigerStilling = () => {
  const navigate = useNavigate();

  const TilbakeKnapp = () => {
    navigate('/MineStillinger');
  };

  const { id } = useParams();
  const [stilling, setStilling] = useState({
    id: "",
    firma: "",
    tittel: "",
    beskrivelse: "",
    krav: "",
    plassering: "",
    soknadsfrist: "",
    lenke: "",
    kode: "",
    users: keycloak.tokenParsed.sub,
  });

  useEffect(() => {
    fetchStilling();
  }, []);

  const fetchStilling = async () => {
    try {
      const stillinger = await getStillinger();
      const selectedStilling = stillinger.find((stilling) => stilling.id === parseInt(id));
      if (selectedStilling) {
        setStilling(selectedStilling);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleInputChange = (e) => {
    setStilling({
      ...stilling,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateStilling(stilling);
      alert("Du har oppdatert stillingsannonsen")
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="RedigerStilling-container">
      <h3>Rediger stilling:</h3>
      <form onSubmit={handleSubmit}>
        <label className="RedigerStilling-label">
        <span className="RedigerStilling-label-text">Firma:</span>
          <input
            className="RedigerStilling-input"
            type="text"
            name="firma"
            value={stilling.firma}
            onChange={handleInputChange}
          />
        </label>
        <label className="RedigerStilling-label">
        <span className="RedigerStilling-label-text">Tittel:</span>
          <input
            className="RedigerStilling-input"
            type="text"
            name="tittel"
            value={stilling.tittel}
            onChange={handleInputChange}
          />
        </label>
        <label className="RedigerStilling-label">
        <span className="RedigerStilling-label-text">Beskrivelse:</span>
          <textarea
            className="RedigerStilling-input"
            name="beskrivelse"
            value={stilling.beskrivelse}
            onChange={handleInputChange}
          />
        </label>
        <label className="RedigerStilling-label">
        <span className="RedigerStilling-label-text">Krav:</span>
          <textarea
            className="RedigerStilling-input"
            name="krav"
            value={stilling.krav}
            onChange={handleInputChange}
          />
        </label>
        <label className="RedigerStilling-label">
        <span className="RedigerStilling-label-text">Plassering:</span>
          <input
            className="RedigerStilling-input"
            type="text"
            name="plassering"
            value={stilling.plassering}
            onChange={handleInputChange}
          />
        </label>
        <label className="RedigerStilling-label">
        <span className="RedigerStilling-label-text">Søknadsfrist:</span>
          <input
            className="RedigerStilling-input"
            type="date"
            name="soknadsfrist"
            value={stilling.soknadsfrist}
            onChange={handleInputChange}
          />
        </label>
        <label className="RedigerStilling-label">
        <span className="RedigerStilling-label-text">Lenke:</span>
          <input
            className="RedigerStilling-input"
            type="text"
            name="lenke"
            value={stilling.lenke}
            onChange={handleInputChange}
          />
        </label>
        <label className="RedigerStilling-label">
        <span className="RedigerStilling-label-text">Kode:</span>
          <input
            className="RedigerStilling-input"
            type="text"
            name="kode"
            value={stilling.kode}
            onChange={handleInputChange}
          />
        </label>
        <button className="RedigerStilling-button" type="submit">Lagre endringer</button>
      </form>
      <button className="applicationKnapp" onClick={TilbakeKnapp}>Tilbake til dine stillingsannonser</button>
    </div>
  );
};

export default withAuth(RedigerStilling);
