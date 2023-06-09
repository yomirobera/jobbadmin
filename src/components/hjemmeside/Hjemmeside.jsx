import React, { useState, useEffect } from "react";
import "./Hjemmeside.css";

const Hjemmeside = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/v1/stilling");
      const json = await response.json();
      setData(json);
    } catch (error) {
      console.log("Error fetching data", error);
    }
  };
  return (
    <div>
      <h1>Hjemmeside</h1>

      <div class="row" id="cardContainer">
        <h2>Data Display</h2>

        {data.map((item, index) => (
          <div class="card" key={index}>
            <div class="card-body">
              <h5 class="card-title">{item.tittel}</h5>
              <h6 class="card-subtitle mb-2 text-muted">{item.beskrivelse}</h6>
              <p class="card-text">{item.krav}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hjemmeside;
