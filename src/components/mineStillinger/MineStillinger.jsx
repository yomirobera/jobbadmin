import React, { useEffect, useState } from "react";
import { getStillinger } from "../../api/LeggtilJobb";
import keycloak from "../keycloak/keycloak";
import { Card } from "antd";
import withAuth from "../../hoc/withAuth";

const MineStillinger = () => {
    //For å lagre stillingene
    const [stillinger, setStillinger] = useState([]);
    // Henter userId fra innlogget bruker
    const userId = keycloak.tokenParsed.sub;

    useEffect(() => {
        fetchStillinger();
    }, []);

    const fetchStillinger = async () => {
        try {
            // Henter stillinger fra API
            const response = await getStillinger();
            setStillinger(response); // Lagrer stillingene i tilstanden
        } catch (error) {
            console.error(error);
        }
    };

    const filterStillingerByUser = () => {
        return stillinger.filter((stilling) => {
            return stilling.users.includes(userId); // Filtrer stillinger som inneholder den innloggede brukeren
        });
    };

    const filteredStillinger = filterStillingerByUser(); // Filtrerte stillinger for den innloggede brukeren

    return (
        <div>
          <h3>Dine stillinger:</h3>
          {filteredStillinger.map((stilling) => (
            <Card key={stilling.id}>
              <h4>{stilling.frma}</h4>
              <p>{stilling.tittel}</p>
              <p>{stilling.kode}</p>
            </Card>
          ))}
        </div>
      );
    };

export default withAuth(MineStillinger);
