import React, { useState, useEffect } from "react";
import "./Hjemmeside.css";
import { Card, Space } from "antd";
import SearchBar from "../Search/Search";

const Hjemmeside = () => {
  const [data, setData] = useState([]);
  const [searchWord, setSearchWord] = useState("");

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

  var filterData = () => {
    const filteredData = data.filter((stilling) =>
      stilling.tittel.includes(searchWord)
    );
    return filteredData.map((item) => {
      return (
        <div className="card" key={item.id}>
          <Space direction="vertical" size={16}>
            <Card
              title={item.tittel}
              extra={<a href="#">More</a>}
              style={{ width: 300 }}
            >
              <p>{item.beskrivelse}</p>
              <p>{item.krav}</p>
            </Card>
          </Space>
        </div>
      );
    });
  };

  return (
    <div>
      <h1>Hjemmeside</h1>
      <SearchBar
        SearchWord={searchWord}
        setSearchWord={setSearchWord}
        filterData={filterData}
      />
      <h2>Data Display</h2>
      <div className="cardContainer">{filterData()}</div>
    </div>
  );
};

export default Hjemmeside;
