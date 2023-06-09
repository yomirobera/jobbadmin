import withAuth from "../../hoc/withAuth";
import { useEffect, useState, useCallback } from 'react';
import keycloak from "../keycloak/keycloak";
import { apiUrl } from "../../api/user";

import './Profil.css';

const Profil = () => {
  const [user, setUser] = useState(null);
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');

  const fetchUser = useCallback(async () => {
    try {
      // Update token and get user ID
      await keycloak.updateToken(5);
      const userId = keycloak.tokenParsed.sub;

      // Fetch user data with token in Authorization header 
      const response = await fetch(`${apiUrl}/${userId}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch user. Status code: ${response.status}`);
      }

      const fetchedUser = await response.json();
      setUser(fetchedUser);
      setFirstName(fetchedUser.firstName);
      setLastName(fetchedUser.lastName);
      setEmail(fetchedUser.email);
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

    if (name === 'firstName') {
      setFirstName(value);
    } else if (name === 'lastName') {
      setLastName(value);
    } else if (name === 'email') {
      setEmail(value);
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch(`${apiUrl}/${keycloak.tokenParsed.sub}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          id: keycloak.tokenParsed.sub,
          firstName: firstName,
          lastName: lastName,
          email: email
        })
      });

      if (!response.ok) {
        throw new Error(`Failed to update user. Status code: ${response.status}`);
      }

      setUser(response);
      alert('User updated successfully');
    } catch (error) {
      alert(`Failed to update user: ${error.message}`);
    }
  };
  
  return (
    <div className="profil-container">
      {user ? (
        <form className="profil-form" onSubmit={handleFormSubmit}>
          <div>
            <label className="profil-label" htmlFor="firstName">Fornavn:</label>
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
            <label className="profil-label" htmlFor="lastName">Etternavn:</label>
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
            <label className="profil-label" htmlFor="email">Email:</label>
            <input
              className="profil-input"
              type="email"
              name="email"
              id="email"
              value={email}
              onChange={handleInputChange}
            />
          </div>
          <button className="profil-submit-btn" type="submit">Oppdater</button>
          <button className="profil-application-btn" type="application">Se dine søknader</button>
        </form>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default withAuth(Profil);
