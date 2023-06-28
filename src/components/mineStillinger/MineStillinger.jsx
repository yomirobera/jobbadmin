import React, { useEffect, useState } from "react";
import { getStillinger, deleteStilling } from "../../api/LeggtilJobb";
import keycloak from "../keycloak/keycloak";
import { Card, Button, Space, Modal } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { Link } from "react-router-dom";

const MineStillinger = () => {
  const [stillinger, setStillinger] = useState([]);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [stillingToDelete, setStillingToDelete] = useState(null);
  const userId = keycloak.tokenParsed.sub;

  useEffect(() => {
    fetchStillinger();
  }, []);

  const fetchStillinger = async () => {
    try {
      const response = await getStillinger();
      setStillinger(response);
    } catch (error) {
      console.error(error);
    }
  };

  const filterStillingerByUser = () => {
    return stillinger.filter((stilling) => {
      return stilling.madeByUser.includes(userId);
    });
  };

  const filteredStillinger = filterStillingerByUser();

  const bekreftSlett = (stilling) => {
    setStillingToDelete(stilling);
    setDeleteModalVisible(true);
  };

  const handleDelete = async () => {
    try {
      if (stillingToDelete) {
        await deleteStilling(stillingToDelete.id);
        setStillingToDelete(null);
        setDeleteModalVisible(false);
        fetchStillinger(); // Refresh stillinger etter sletting
      }
    } catch (error) {
      console.error(error);
    }
  };

  const cancelDelete = () => {
    setStillingToDelete(null);
    setDeleteModalVisible(false);
  };

  return (
    <div>
      <h3>Dine stillinger</h3>
      {filteredStillinger.map((stilling) => (
        <Card key={stilling.id}>
          <h4>{stilling.firma}</h4>
          <p>{stilling.tittel}</p>
          <p>{stilling.beskrivelse}</p>
          <p>{stilling.kode}</p>
          <Space>
            <Link to={`/edit-stilling/${stilling.id}`}>
              <Button type="primary" icon={<EditOutlined />}>
                Rediger
              </Button>
            </Link>
            <Button
              type="danger"
              icon={<DeleteOutlined />}
              onClick={() => bekreftSlett(stilling)}
            >
              Slett
            </Button>
          </Space>
        </Card>
      ))}
      <Modal
        title="Bekreft Slett"
        visible={deleteModalVisible}
        onOk={handleDelete}
        onCancel={cancelDelete}
      >
        <p>Er du sikker på at du vil slette denne stilling?</p>
      </Modal>
    </div>
  );
};

export default MineStillinger;
