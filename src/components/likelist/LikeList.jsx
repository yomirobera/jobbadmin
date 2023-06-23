import { Avatar, Divider, List, Skeleton } from "antd";
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";

const LikeList = (props) => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const loadMoreData = () => {
    if (loading) {
      return;
    }
    setLoading(true);
    fetch(`http://localhost:8080/api/v1/stilling/${props.id}/users`)
      .then((res) => res.json())
      .then((body) => {
        setData([...data, ...body]);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };
  useEffect(() => {
    loadMoreData();
  }, []);

  return (
    <div
      id="scrollableDiv"
      style={{
        height: 400,
        overflow: "auto",
        padding: "0 16px",
        border: "1px solid rgba(140, 140, 140, 0.35)",
      }}
    >
      <InfiniteScroll
        dataLength={data.length}
        next={loadMoreData}
        hasMore={data.length < 50}
        loader={
          loading && (
            <Skeleton
              avatar
              paragraph={{
                rows: 1,
              }}
              active
            />
          )
        }
        endMessage={<Divider plain>It is all, nothing more 🤐</Divider>}
        scrollableTarget="scrollableDiv"
      >
        <List
          dataSource={data}
          renderItem={(item) => (
            <List.Item key={item.id}>
              <List.Item.Meta
                avatar={<Avatar src={item.url} />}
                title={
                  <a href={`/users/${item.id}`}>
                    {item.firstname}
                    {item.lastname}
                  </a>
                }
                description={item.email}
              />

              <div>{item.lastName}</div>
            </List.Item>
          )}
        />
      </InfiniteScroll>
    </div>
  );
};
export default LikeList;
