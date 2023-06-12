import { Card, Space } from "antd";

const bigCard = () => {
  return (
    <div className="bigCard">
      <Space direction="vertical" size={20}>
        <Card
          title="Tittel"
          extra={<a href="#">More</a>}
          style={{ width: 300 }}
        >
          <p>Beskrivels"</p>
          <p>Krav</p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque
            porttitor, eros vitae consequat luctus, turpis lacus aliquet orci,
            sit amet vulputate augue mi id nulla. Proin sollicitudin ultricies
            sapien vel auctor. Ut pellentesque sapien nisl, at rutrum mauris
            tempus et. Integer sit amet ex justo. Praesent nec dolor sit amet
            arcu mattis dictum. Nulla facilisi. Nam tincidunt blandit arcu vel
            venenatis. Curabitur ullamcorper magna magna, in facilisis ligula
            mollis at.{" "}
          </p>
        </Card>
      </Space>
    </div>
  );
};

export default bigCard;
