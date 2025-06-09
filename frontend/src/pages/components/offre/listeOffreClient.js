// src/pages/ListeOffreClient.js
import React, { useState,useEffect } from "react";
import { useQuery, gql ,useMutation} from "@apollo/client";
import {useHistory,useLocation } from "react-router-dom";
import {
  Container, Row, Col, Table, Spinner, Alert, ButtonGroup, Button,Modal,
} from "@themesberg/react-bootstrap";
import { DELETE_OFFER } from "../../../graphql/mutations/deleteOffre";
import moment from "moment";
import { Eye, Pencil, Trash } from "react-bootstrap-icons";



const GET_CLIENT_OFFERS = gql`
  query {
    offersForClient {
      id
      title
      status
      startDate
      categorie {
        title
      }
    }
  }
`;

const ListeOffreClient = () => {
  const { loading, error, data,refetch } = useQuery(GET_CLIENT_OFFERS);
  const history = useHistory();
  const [alert, setAlert] = useState({ show: false, variant: "", message: "" });
  const location = useLocation();

useEffect(() => {
  refetch();
}, [location.pathname]);

  const [deleteOffer] = useMutation(DELETE_OFFER, {
    onCompleted: () => {
      setAlert({ show: true, variant: "success", message: "Offre supprimée avec succès !" });
      refetch();
    },
    onError: (error) => {
      setAlert({ show: true, variant: "danger", message: "Échec de la suppression de l’offre." });
      console.error(error);
    }
  });
  
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [offerToDelete, setOfferToDelete] = useState(null);
  const handleViewCandidates = (id) => {
    console.log("Voir les candidatures de l'offre :", id);
  };

  const handleEditOffer = (id) => {
    history.push(`/offre/update/${id}`);
    console.log("Modifier l'offre :", id);
  };

 

  const confirmDeleteOffer = (id) => {
    setOfferToDelete(id);
    setShowDeleteModal(true);
  };

  // Appelé quand on confirme dans le modal
  const handleDeleteOffer = () => {
    if (offerToDelete) {
      deleteOffer({ variables: { offerId: offerToDelete } });
      setShowDeleteModal(false);
      setOfferToDelete(null);
    }
  };

  const handleCloseModal = () => {
    setShowDeleteModal(false);
    setOfferToDelete(null);
  };

  return (
    <article>
      <Container className="px-4">
        <Row className="d-flex flex-wrap flex-md-nowrap align-items-center py-4">
          <Col>
            <h1 className="h2">Mes Offres</h1>
            <p className="text-muted">Voici la liste des offres publiées sous votre compte.</p>
          </Col>
        </Row>

        <Row>
          <Col>
            {loading && <Spinner animation="border" variant="primary" />}
            {error && <Alert variant="danger">Erreur : {error.message}</Alert>}

            {data && (
              <div className="table-responsive">
                <Table className="custom-table align-middle text-center">
                  <thead className="bg-light">
                    <tr>
                      <th>Titre</th>
                      <th>Statut</th>
                      <th>Date de début</th>
                      <th>Catégorie</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {data.offersForClient.map((offer, index) => (
                      <tr key={index}>
                        <td className="fw-bold">{offer.title}</td>
                        <td>
                   <span
                      className={`badge ${
                        offer.status === "Active" ? "bg-success" :
                        offer.status === "Terminée" ? "bg-primary" :"bg-secondary"}`}
                      style={{ display: "inline-block", minWidth: "90px", textAlign: "center" }}>
                              {offer.status}
                  </span>
                        </td>
                        <td>{moment(offer.startDate).format("YYYY-MM-DD")}</td>
                        <td>{offer.categorie?.title || "—"}</td>
                        <td>
                          <ButtonGroup>
                            <Button
                              variant="outline-primary"
                              size="sm"
                              title="Voir les candidatures"
                              onClick={() => handleViewCandidates(offer.id)}
                              className="me-1"
                            >
                              <Eye />
                            </Button>
                            <Button
                              variant="outline-success"
                              size="sm"
                              title="Modifier l'offre"
                              onClick={() => handleEditOffer(offer.id)}
                              className="me-1"
                            >
                              <Pencil />
                            </Button>
                            <Button
                              variant="outline-danger"
                              size="sm"
                              title="Supprimer l'offre"
                              onClick={() => confirmDeleteOffer(offer.id)}
                            >
                              <Trash />
                            </Button>
                          </ButtonGroup>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            )}
          </Col>
        </Row>
        <Modal  show={showDeleteModal} onHide={handleCloseModal} dialogClassName="modal-top">
  <Modal.Header closeButton>
    <Modal.Title>Confirmer la suppression</Modal.Title>
  </Modal.Header>
  <Modal.Body>
    Êtes-vous sûr de vouloir supprimer cette offre ?
  </Modal.Body>
  <Modal.Footer>
    <Button variant="primary" onClick={handleCloseModal}>
      Annuler
    </Button>
    <Button variant="danger" onClick={handleDeleteOffer}>
      Supprimer
    </Button>
  </Modal.Footer>
</Modal>

        
      </Container>
    </article>
  );
  

};

export default ListeOffreClient;
