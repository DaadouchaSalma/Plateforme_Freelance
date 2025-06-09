// src/components/MyCandidatures.js
import React ,{useState} from "react";
import { useQuery } from "@apollo/client";
import { GET_MY_CANDIDATURES } from "../../../graphql/mutations/candidature";
import {
  Card,
  Table,
  Badge,
  Container,
  Row,
  Col,
  Button,
  Modal
} from "@themesberg/react-bootstrap";
import { Nav, Image, Navbar } from '@themesberg/react-bootstrap';
import logo from "../../../assets/img/logo/icon+title(small).png"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFileAlt,
  faClock,
  faCheckCircle,
  faTimesCircle,
  faHourglassHalf,
  faEye
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

const MyCandidatures = () => {
  const { loading, error, data } = useQuery(GET_MY_CANDIDATURES);
  const [showModal, setShowModal] = useState(false);
  const [selectedExperiences, setSelectedExperiences] = useState([]);
  if (loading) return <p>Chargement en cours...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  const candidatures = data?.myCandidatures || [];
  console.log(candidatures)
  const handleShowExperiences = (experiences) => {
    console.log(experiences)
    setSelectedExperiences(experiences || []);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedExperiences([]);
  };

  return (
    <>
    <Navbar variant="dark" expand="lg" bg="dark" className="navbar-transparent navbar-theme-primary">
        <Container className="position-relative">
          <Navbar.Brand href="#home" className="me-lg-3">
            <Image src={logo} />
          </Navbar.Brand>

          <Navbar.Collapse id="navbar-default-primary" className="w-100">
            <Nav className="navbar-nav-hover align-items-lg-center">
              <Nav.Link href="#home">Home</Nav.Link>
              <Nav.Link href="#about">About</Nav.Link>
              <Nav.Link href="#contact">Contact</Nav.Link>
            </Nav>
          </Navbar.Collapse>

          <Navbar.Toggle aria-controls="navbar-default-primary" />
        </Container>
      </Navbar>
      <h1 className="h2 text-center" style={{ marginTop: '20px' }} >Mes Candidatures</h1>
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col xs={12}>
          <Card border="light" className="shadow-sm">
            <Card.Header>
              <Row className="align-items-center">
                    <Col>
                    <h5>
                        {candidatures.length === 0 
                        ? "Vous n'avez aucune candidature en cours"
                        : `Vous avez ${candidatures.length} candidature${candidatures.length > 1 ? 's' : ''} active${candidatures.length > 1 ? 's' : ''}`}
                    </h5>
                    <small className="text-muted">
                        {candidatures.length > 0 && "Retrouvez ci-dessous l'historique complet de vos candidatures"}
                    </small>
                    </Col>
                </Row>
            </Card.Header>
            <Card.Body>
              <Table hover responsive className="table-centered">
                <thead className="thead-light">
                  <tr>
                    <th>Offre</th>
                    <th>Entreprise</th> 
                    <th>Catégorie</th>
                    <th>Date</th>
                    <th>Statut</th>
                    {/* <th>Expériences</th> */}
                    
                  </tr>
                </thead>
                <tbody>
                  {candidatures.map((candidature) => (
                    <tr key={candidature.id}>
                      <td>
                        <strong>{candidature.offer?.title}</strong>
                        {/* <br />
                        <small className="text-muted">
                          {candidature.offer?.client.nom.substring(0, 50)}...
                        </small> */}
                      </td>
                      {/* <td>{candidature.motivation.substring(0, 50)}...</td> */}
                      <td>
                        {candidature.offer?.client.nom}
                      </td>
                      <td>
                        {candidature.offer?.categorie.title}
                      </td>
                      <td>
                        {new Date(candidature.dateApplication).toLocaleDateString()}
                      </td>
                      <td>
                        <Badge
                          bg={statusColors[candidature.statut] || "secondary"}
                          className="badge-lg"
                          style={{width : '50%'}}
                        >
                          <FontAwesomeIcon
                            icon={statusIcons[candidature.statut] || faClock}
                            className="me-1"
                          />
                          {candidature.statut}
                        </Badge>
                      </td>
                      {/* <td>
                          <Button 
                            variant="link" 
                            onClick={() => handleShowExperiences(candidature.experiences)}>
                            <FontAwesomeIcon icon={faEye} />
                          </Button>
                      </td> */}
                      {/* <td>
                        <Button variant="info" size="sm" className="me-2">
                          Détails
                        </Button>
                        <Button variant="danger" size="sm">
                          Annuler
                        </Button>
                      </td> */}
                    </tr>
                  ))}
                </tbody>
              </Table>
              {candidatures.length === 0 && (
                <div className="text-center py-4">
                  <FontAwesomeIcon icon={faFileAlt} size="3x" className="text-muted mb-3" />
                  <h5>Aucune candidature trouvée</h5>
                  <p className="text-muted">
                    Vous n'avez pas encore postulé à des offres.
                  </p>
                  <Button variant="primary">Postuler maintenant</Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
    {/* <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Détails des expériences</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedExperiences.length > 0 ? (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Société</th>
                  <th>Projet</th>
                  <th>Date de début</th>
                  <th>Date de fin</th>
                  <th>Description</th>
                </tr>
              </thead>
              <tbody>
                {selectedExperiences.map((exp, index) => (
                  <tr key={index}>
                    <td>{exp.nomSociete}</td>
                    <td>{exp.nomProjet}</td>
                    <td>{new Date(exp.dateDebut).toLocaleDateString()}</td>
                    <td>{exp.dateFin ? new Date(exp.dateFin).toLocaleDateString() : 'En cours'}</td>
                    <td>{exp.description || 'Non spécifiée'}</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          ) : (
            <p>Aucune expérience renseignée pour cette candidature.</p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Fermer
          </Button>
        </Modal.Footer>
      </Modal> */}
    </>
  );
};

export default MyCandidatures;