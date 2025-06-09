import React, { useState } from "react";
import { useQuery,useMutation  } from "@apollo/client";
import { GET_CANDIDATURES_BY_OFFRE, ACCEPTER_CANDIDATURE, REJETER_CANDIDATURE  } from "../../../graphql/mutations/candidature";
import {
  Card,
  Table,
  Badge,
  Container,
  Row,
  Col,
  Button,
  Modal,
  Image,
  ListGroup
} from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserTie,
  faBuilding,
  faCalendarAlt,
  faFileAlt,
  faEye,
  faCheckCircle,
  faTimesCircle,
  faHourglassHalf
} from "@fortawesome/free-solid-svg-icons";

const statusIcons = {
  "En attente": faHourglassHalf,
  "Accepté": faCheckCircle,
  "Refusé": faTimesCircle,
};

const statusColors = {
  "En attente": "warning",
  "Accepté": "success",
  "Refusé": "danger",
};

const ClientCandidaturesList = () => {
    const offreId = 1;
  const { loading, error, data ,refetch } = useQuery(GET_CANDIDATURES_BY_OFFRE, {
    variables: { offreId: Number(offreId)  }
  });
  
  const [accepterCandidature] = useMutation(ACCEPTER_CANDIDATURE);
  const [rejeterCandidature] = useMutation(REJETER_CANDIDATURE);
  const [selectedCandidature, setSelectedCandidature] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  if (loading) return <p>Chargement en cours...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  const candidatures = data?.candidaturesByOffre || [];

  const openDetailModal = (candidature) => {
    setSelectedCandidature(candidature);
    setShowDetailModal(true);
  };

  const closeDetailModal = () => {
    setShowDetailModal(false);
    setSelectedCandidature(null);
  };

const handleAccepter = async (id) => {
  try {
    await accepterCandidature({
      variables: { id },
      update: (cache) => {
        // Mise à jour optimiste du cache
        const existingCandidatures = cache.readQuery({
          query: GET_CANDIDATURES_BY_OFFRE,
          variables: { offreId: Number(offreId) }
        });
        
        const updatedCandidatures = existingCandidatures.candidaturesByOffre.map(c => 
          c.id === id ? { ...c, statut: "Accepté" } : c
        );
        
        cache.writeQuery({
          query: GET_CANDIDATURES_BY_OFFRE,
          variables: { offreId: Number(offreId) },
          data: { candidaturesByOffre: updatedCandidatures }
        });
      }
    });
    closeDetailModal(); 
    await refetch(); 
  } catch (err) {
    console.error("Erreur lors de l'acceptation:", err);
  }
};

const handleRejeter = async (id) => {
  try {
    await rejeterCandidature({
      variables: { id },
      update: (cache) => {
        // Mise à jour optimiste du cache
        const existingCandidatures = cache.readQuery({
          query: GET_CANDIDATURES_BY_OFFRE,
          variables: { offreId: Number(offreId) }
        });
        
        const updatedCandidatures = existingCandidatures.candidaturesByOffre.map(c => 
          c.id === id ? { ...c, statut: "Refusé" } : c
        );
        
        cache.writeQuery({
          query: GET_CANDIDATURES_BY_OFFRE,
          variables: { offreId: Number(offreId) },
          data: { candidaturesByOffre: updatedCandidatures }
        });
      }
    });
    closeDetailModal(); // Fermer le modal après rejet
    await refetch(); // Rafraîchir les données
  } catch (err) {
    console.error("Erreur lors du rejet:", err);
  }
};

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col xs={12}>
          <Card border="light" className="shadow-sm">
            <Card.Header>
              <Row className="align-items-center">
                <Col>
                  <h5>
                    <FontAwesomeIcon icon={faFileAlt} className="me-2" />
                    Candidatures reçues
                  </h5>
                  <small className="text-muted">
                    {candidatures.length} candidature{candidatures.length !== 1 ? 's' : ''} enregistrée{candidatures.length !== 1 ? 's' : ''}
                  </small>
                </Col>
              </Row>
            </Card.Header>
            
            <Card.Body>
              <Table hover responsive className="table-centered">
                <thead className="thead-light">
                  <tr>
                    <th>Freelancer</th>
                    {/* <th>Motivation</th> */}
                    <th>Date</th>
                    <th>Statut</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {candidatures.map((candidature) => (
                    <tr key={candidature.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <Image 
                            src={candidature.freelancer.photo || '/default-profile.png'} 
                            roundedCircle 
                            width="40" 
                            height="40" 
                            className="me-3"
                          />
                          <div>
                            <strong>{candidature.freelancer.prenom} {candidature.freelancer.nom}</strong>
                          </div>
                        </div>
                      </td>
                      {/* <td>{candidature.motivation.substring(0, 50)}...</td> */}
                      <td>
                        {new Date(candidature.dateApplication).toLocaleDateString()}
                      </td>
                      <td>
                        <Badge
                          bg={statusColors[candidature.statut] || "secondary"}
                          className="badge-lg"
                          style={{width : '40%'}}
                        >
                          <FontAwesomeIcon
                            icon={statusIcons[candidature.statut]}
                            className="me-1"
                          />
                          {candidature.statut}
                        </Badge>
                      </td>
                      <td>
                        <Button 
                          variant="info" 
                          size="sm" 
                          onClick={() => openDetailModal(candidature)}
                        >
                          <FontAwesomeIcon icon={faEye} className="me-1" />
                          Détails
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {candidatures.length === 0 && (
                <div className="text-center py-4">
                  <FontAwesomeIcon icon={faFileAlt} size="3x" className="text-muted mb-3" />
                  <h5>Aucune candidature reçue</h5>
                  <p className="text-muted">
                    Aucun freelancer n'a encore postulé à votre offre.
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Modal de détails */}
      <Modal show={showDetailModal} onHide={closeDetailModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Détails de la candidature
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedCandidature && (
            <>
              <Row className="mb-4">
                <Col md={3}>
                  <Image 
                    src={selectedCandidature.freelancer.photo || '/default-profile.png'} 
                    roundedCircle 
                    width="100" 
                    height="100" 
                  />
                </Col>
                <Col md={9}>
                  <h4>{selectedCandidature.freelancer.prenom} {selectedCandidature.freelancer.nom}</h4>
                 <p className="text-muted">
                    {selectedCandidature.freelancer.FreelancerCompetences?.length > 0
                      ? selectedCandidature.freelancer.FreelancerCompetences.map(fc => 
                          `${fc.competence.nom}(${fc.niveau})`
                        ).join(', ')
                      : 'Aucune compétence renseignée'}
                  </p>
                  <Badge
                    bg={statusColors[selectedCandidature.statut] || "secondary"}
                    className="badge-lg"
                    
                  >
                    {selectedCandidature.statut}
                  </Badge>
                </Col>
              </Row>

              <h5 className="mb-3">
                <FontAwesomeIcon icon={faFileAlt} className="me-2" />
                Motivation
              </h5>
              <p>{selectedCandidature.motivation}</p>

              <h5 className="mb-3 mt-4">
                <FontAwesomeIcon icon={faBuilding} className="me-2" />
                Expériences professionnelles
              </h5>
              
              {selectedCandidature.experiences?.length > 0 ? (
                <ListGroup variant="flush">
                  {selectedCandidature.experiences.map((exp, index) => (
                    <ListGroup.Item key={index}>
                      <div className="d-flex justify-content-between">
                        <div>
                          <h6>{exp.nomProjet}-{exp.nomSociete}</h6>
                          {/* <p className="mb-1">{exp.nomSociete}</p> */}
                          <p>{exp.description}</p>
                        </div>
                        <div>
                          <small className="text-muted">
                            {new Date(exp.dateDebut).toLocaleDateString()} - {exp.dateFin ? new Date(exp.dateFin).toLocaleDateString() : 'Présent'}
                          </small>
                        </div>
                      </div>
                    </ListGroup.Item>
                  ))}
                </ListGroup>
              ) : (
                <p>Aucune expérience renseignée</p>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" onClick={closeDetailModal} style={{width:'15%'}}>
            Fermer
          </Button>
          {/* <Button variant="primary">
            <FontAwesomeIcon icon={faCheckCircle} className="me-1" />
            Accepter la candidature
          </Button> */}
           {selectedCandidature?.statut === "En attente" && (
    <>
      <Button 
        variant="danger" 
        onClick={() => handleRejeter(selectedCandidature.id)}
        className="me-2"
        style={{width:'15%'}}
      >
        <FontAwesomeIcon icon={faTimesCircle} className="me-1" />
        Rejeter
      </Button>
      
      <Button 
        variant="success" 
        onClick={() => handleAccepter(selectedCandidature.id)}
        style={{width:'15%'}}
      >
        <FontAwesomeIcon icon={faCheckCircle} className="me-1" />
        Accepter
      </Button>
    </>
  )}
  
  {selectedCandidature?.statut === "Accepté" && (
    <Button variant="success" disabled>
      <FontAwesomeIcon icon={faCheckCircle} className="me-1" />
      Candidature acceptée
    </Button>
  )}
  
  {selectedCandidature?.statut === "Refusé" && (
    <Button variant="danger" disabled>
      <FontAwesomeIcon icon={faTimesCircle} className="me-1" />
      Candidature refusée
    </Button>
  )}
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ClientCandidaturesList;