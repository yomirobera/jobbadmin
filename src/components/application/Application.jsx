import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiUrl } from "../../api/user";
import withAuth from '../../hoc/withAuth';
import keycloak from '../keycloak/keycloak';
import { Card, Space } from "antd";
import "./Application.css";

const Application = () => {
  const [user, setUser] = useState(null);
  const [stilling, setStilling] = useState([]);
  const navigate = useNavigate();

  const TilbakeKnapp = () => {
    navigate('/Profil');
  };

  useEffect(() => {
    const fetchUserAndStilling = async () => {
      try {
        const userId = keycloak.tokenParsed.sub;
  
        const userResponse = await fetch(`${apiUrl}/${userId}`);
        if (!userResponse.ok) {
          throw new Error(`Feil med å hente bruker`);
        }
        const fetchedUser = await userResponse.json();
        setUser(fetchedUser);
  
        const stillingResponse = await fetch(`${apiUrl}/${userId}/getAllStilling`);
        if (!stillingResponse.ok) {
          throw new Error(`Feil med å hente stilling`);
        }
        const fetchedStilling = await stillingResponse.json();
        setStilling(fetchedStilling);
      } catch (error) {
      }
    };
  
    fetchUserAndStilling();
  }, []);

  return (
    <div className="application">
      <div>
      <h3>Dine favoritt stillinger:</h3>
      <Space direction="vertical" size={20}>
      <Card
          style={{ width: 300 }}
        >
        {stilling.map((item) => {
          if (item.users.includes(user.id)) {
            return (
              <div key={item.id}>
                <h4>{item.firma}</h4>
                <p>{item.tittel}</p>
                <p>{item.beskrivelse}</p>
              </div>
            );
          }
          return null;
        })}
        </Card>
        </Space>
      </div>
      
      <button className="applicationKnapp" onClick={TilbakeKnapp}>Tilbake til profil</button>
    </div>
  );
};

export default withAuth(Application);
