import React, { useState } from 'react';
import withAuth from '../../hoc/withAuth';
import { addStilling } from '../../api/LeggtilJobb';
import { getUser } from '../../api/user';
import './Leggetiljobb.css';

const Leggetiljobb = () => {
  const [stilling, setStilling] = useState({
    tittel: '',
    beskrivelse: '',
    krav: '',
    plassering: '',
    soknadsfrist: '',
    PDF: ''
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setStilling({ ...stilling, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Fetch the current user information
      const currentUser = await getUser();

      // Create a new job listing object with the user information
      const jobListing = {
        ...stilling,
        users: [currentUser],
      };

      const response = await addStilling(jobListing);
      console.log(response);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="Leggetiljobb-container">
    <div className="Leggetiljobb-card">
      <form onSubmit={handleSubmit}>
        <label className="Leggetiljobb-label">
          Tittel:
          <input type="text" name="tittel" maxLength={50} required onChange={handleInputChange} className="Leggetiljobb-input" />
        </label>

        <label className="Leggetiljobb-label">
          Beskrivelse:
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
          Krav:
          <input type="text" name="krav" maxLength={100} required onChange={handleInputChange} className="Leggetiljobb-input" />
        </label>

        <label className="Leggetiljobb-label">
          Plassering:
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
          Søknadsfrist:
          <input type="date" name="soknadsfrist" required onChange={handleInputChange} className="Leggetiljobb-input" />
        </label>

        <label className="Leggetiljobb-label">
          PDF:
          <input type="text" name="PDF" onChange={handleInputChange} className="Leggetiljobb-input" />
        </label>
        <button type="submit" className="Leggetiljobb-button">Legg til jobb</button>
      </form>
    </div>
  </div>
  );
};

export default withAuth(Leggetiljobb);
