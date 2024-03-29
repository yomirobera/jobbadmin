import React, { useState, useEffect } from "react";
import "./Hjemmeside.css";
import { Card, Space, Button } from "antd";
import SearchBar from "../../functionalityComponents/Search/Search";
//import BigCard from "../BigCard/BigCard";
import keycloak from "../../keycloak/keycloak";
//import { useNavigate } from "react-router-dom";
import withAuth from "../../../hoc/withAuth";
import BotChat from "../../functionalityComponents/UserAndBotChat/BotChat";

import LikeList from "../../functionalityComponents/likeList/LikeList";
import Chat from "../../functionalityComponents/WebChat/WebChat";
import { fetchData } from "../../../api/HjemmesideAPI";
import UserBotChat from "../../functionalityComponents/UserAndBotChat/UserChat";

const Hjemmeside = () => {
  const [data, setData] = useState([]);
  const [searchWord, setSearchWord] = useState("");
  const [likesMap, setLikesMap] = useState(new Map());
  //const [showPersonFromLike, setShowPersonFromLike] = useState(false);
  const [cardId, setCardId] = useState(null);
  const [showPersonFromLikeMap, setShowPersonFromLikeMap] = useState(new Map());
  const [anyCardShowingLikes, setAnyCardShowingLikes] = useState(false);
  const [showLikesForCard, setShowLikesForCard] = useState(null);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData().then((fetchedData) => {
      setData(fetchedData);
      setLoading(false);
    });
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
            return response; // Parse the JSON if response is successful
          } else {
            throw new Error("Request failed with status: " + response.status);
          }
        })
        //.then((data) => {
        //console.log(data);
        // Handle data
        //})
        .catch((err) => {
          console.log(err.message);
        });

      await updateAndGetLikes(stillingId);
    } catch (error) {
      console.log(error);
    }
  };

  var filterData = () => {
    if (!data) {
      // Data is undefined, so return an empty array
      return [];
    }
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
                <h1>{item.firma}</h1>
                <h3>{item.tittel}</h3>
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

      {loading ? (
        <p>Loading...</p> // This is a placeholder, you can replace it with a spinner or something else.
      ) : (
        <div className="cardContainer">{filterData()}</div>
      )}

      {showPersonFromLikeMap.get(cardId) ? (
        <div>
          <LikeList
            postUserToStilling={postUserToStilling}
            id={cardId}
            key={cardId}
          />
        </div>
      ) : null}
      <BotChat />
    </div>
  );
};

export default withAuth(Hjemmeside);
