import React, { useState, useEffect } from "react";
import "./Hjemmeside.css";
import { Card, Space, Button } from "antd";
import SearchBar from "../Search/Search";
//import BigCard from "../BigCard/BigCard";
import keycloak from "../keycloak/keycloak";
//import { useNavigate } from "react-router-dom";
import withAuth from "../../hoc/withAuth";

import { ConsoleSqlOutlined } from "@ant-design/icons";

import LikeList from "../likeList/LikeList";
import { fetchData } from "../../api/HjemmesideAPI";

const Hjemmeside = () => {
  const [data, setData] = useState([]);
  const [searchWord, setSearchWord] = useState("");
  const [likesMap, setLikesMap] = useState(new Map());
  //const [showPersonFromLike, setShowPersonFromLike] = useState(false);
  const [cardId, setCardId] = useState(null);
  const [showPersonFromLikeMap, setShowPersonFromLikeMap] = useState(new Map());
  const [anyCardShowingLikes, setAnyCardShowingLikes] = useState(false);
  const [showLikesForCard, setShowLikesForCard] = useState(null);

  useEffect(() => {
    fetchData().then((fetchedData) => setData(fetchedData));
    getAllLikesFromDB();
  }, []);

  /* let navigate = useNavigate();
  const routeChange = (path) => {
    navigate(path);
  };*/

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
        <div>
          <div className="card" key={item.id}>
            <Space direction="vertical" size={16}>
              <Card
                title={<div hidden={true}>{item.tittel}</div>}
                extra={
                  <div>
                    <Button
                      type="primary"
                      onClick={() => {
                        postUserToStilling(item.id);
                      }}
                    >
                      Like, {likesCount}
                    </Button>
                    <Button
                      /*  onClick={() => {
                        setShowPersonFromLikeMap((prev) => {
                          const clone = new Map(prev);
                          clone.set(item.id, !clone.get(item.id));
                          return clone;
                        });
                        if (showPersonFromLikeMap.get(item.id)) {
                          setAnyCardShowingLikes(false);
                        } else {
                          setAnyCardShowingLikes(true);
                        }
                        setCardId(item.id);
                      }}
                      disabled={
                        anyCardShowingLikes &&
                        !showPersonFromLikeMap.get(item.id)
                      }*/

                      onClick={() => {
                        if (showLikesForCard === item.id) {
                          // If this card is already showing the likes, hide them
                          setShowLikesForCard(null);
                        } else {
                          // Otherwise show them
                          setShowLikesForCard(item.id);
                        }
                      }}
                    >
                      {showLikesForCard === item.id
                        ? "Hide people who liked"
                        : "Show people who liked"}
                    </Button>
                  </div>
                }
                style={{ width: 300 }}
              >
                <h1>{item.tittel}</h1>
                <p>{item.beskrivelse}</p>
                <p>{item.krav}</p>
              </Card>
            </Space>
          </div>
          {/* Place the LikeList component here */}
          {showLikesForCard === item.id ? (
            <LikeList postUserToStilling={postUserToStilling} id={item.id} />
          ) : null}
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
        setLikesMap((prevLikesMap) =>
          new Map(prevLikesMap).set(item.id, item.users.length)
        );
      });
    }
  };

  const updateAndGetLikes = async (id) => {
    try {
      const response = await fetch(
        `http://localhost:8080/api/v1/stilling/${id}/users`
      );
      const json = await response.json();
      let likesCount = json.length;
      console.log(likesCount);
      setLikesMap((prevLikesMap) => new Map(prevLikesMap).set(id, likesCount));

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
      <h2>Stillinger</h2>

      <div className="cardContainer">{filterData()}</div>

      {showPersonFromLikeMap.get(cardId) ? (
        <LikeList
          postUserToStilling={postUserToStilling}
          id={cardId}
          key={cardId}
        />
      ) : null}
    </div>
  );
};

export default withAuth(Hjemmeside);
