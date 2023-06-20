import React, { useState, useEffect } from "react";
import "./Hjemmeside.css";
import { Card, Space } from "antd";
import SearchBar from "../Search/Search";
import BigCard from "../BigCard/BigCard";
import keycloak from "../keycloak/keycloak";
import { useNavigate } from "react-router-dom";
import withAuth from "../../hoc/withAuth";
import LikeList from "../likelist/LikeList";
import { ConsoleSqlOutlined } from "@ant-design/icons";

const Hjemmeside = () => {
  const [data, setData] = useState([]);
  const [searchWord, setSearchWord] = useState("");
  const [likesMap, setLikesMap] = useState(new Map());
  const [showPersonFromLike, setShowPersonFromLike] = useState(false);
  const [cardId, setCardId] = useState(null);

  useEffect(() => {
    fetchData();
    getAllLikesFromDB();
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

  let navigate = useNavigate();
  const routeChange = (path) => {
    navigate(path);
  };

  const postUserToStilling = async (stillingId) => {
    try {
      await fetch(
        `http://localhost:8080/api/v1/stilling/${stillingId}/users/${keycloak.tokenParsed.sub}`,
        {
          method: "PUT",
          /*body: JSON.stringify({
            // Add parameters here
          }),*/
          headers: {
            "Content-type": "application/json; charset=UTF-8",
            "Access-Control-Allow-Origin": "*",
          },
        }
      )
        .then((response) => {
          if (response.ok) {
            return response.json(); // Parse the JSON if response is successful
          } else {
            throw new Error("Request failed with status: " + response.status);
          }
        })
        .then((data) => {
          console.log(data);
          // Handle data
        })
        .catch((err) => {
          console.log(err.message);
        });

      await updateAndGetLikes(stillingId);
    } catch (error) {
      console.log(error);
    }
  };

  var filterData = () => {
    const filteredData = data.filter((stilling) =>
      stilling.tittel.includes(searchWord)
    );
    return filteredData.map((item) => {
      let likesCount = likesMap.get(item.id) || 0;
      return (
        <div className="card" key={item.id}>
          <Space direction="vertical" size={16}>
            <Card
              title={item.tittel}
              extra={
                <div>
                  <button
                    onClick={() => {
                      postUserToStilling(item.id);
                    }}
                  >
                    Like {likesCount}
                  </button>
                  <button
                    onClick={() => {
                      setShowPersonFromLike(!showPersonFromLike);
                      setCardId(item.id);
                    }}
                  >
                    {showPersonFromLike
                      ? "Hide people who liked"
                      : "Show people who liked"}
                  </button>
                </div>
              }
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

  const getAllLikesFromDB = async () => {
    const response = await fetch(`http://localhost:8080/api/v1/stilling`);
    const json = await response.json();

    if (json == null) {
      return;
    } else {
      json.map((item) => {
        console.log(item.id);
        console.log(item.users);
        setLikesMap((prevLikesMap) =>
          new Map(prevLikesMap).set(item.id, item.users.length)
        );
      });
    }
  };

  const updateAndGetLikes = async (id) => {
    console.log(id);

    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/stilling/${id}/users`
      );
      const json = await response.json();
      let likesCount = json.length;
      setLikesMap((prevLikesMap) => new Map(prevLikesMap).set(id, likesCount));

      console.log(likesMap);
      return likesCount;
    } catch (error) {
      console.log("Error fetching users", error);
      return 0;
    }
  };

  return (
    <div>
      <SearchBar
        SearchWord={searchWord}
        setSearchWord={setSearchWord}
        filterData={filterData}
      />
      <h2>Data Display</h2>

      <div className="cardContainer">{filterData()}</div>

      {showPersonFromLike ? (
        <LikeList postUserToStilling={postUserToStilling} id={cardId} />
      ) : null}
    </div>
  );
};

export default withAuth(Hjemmeside);
