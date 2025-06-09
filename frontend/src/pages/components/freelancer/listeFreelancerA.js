import React from "react";
import { useQuery } from "@apollo/client";
import { GET_ALL_FREELANCERS } from "../../../graphql/mutations/freelancer";
import {
  Card,
  Table,
  Badge,
  Container,
  Row,
  Col,
  Button,
  Image,
  ListGroup,
  
} from "@themesberg/react-bootstrap";
import {Popover, OverlayTrigger } from 'react-bootstrap';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserTie,
  faGlobe,
  faCode,
  faStar,
  faCalendarAlt,faEllipsisH
} from "@fortawesome/free-solid-svg-icons";
import {
  faGithub,
  faLinkedin
} from "@fortawesome/free-brands-svg-icons";

const FreelancersList = () => {
  const { loading, error, data } = useQuery(GET_ALL_FREELANCERS);

  if (loading) return <p>Chargement en cours...</p>;
  if (error) return <p>Erreur : {error.message}</p>;

  const freelancers = data?.allFreelancers || [];

  return (
    <Container className="py-4">
      <Row className="justify-content-center">
        <Col xs={12}>
          <Card border="light" className="shadow-sm">
            <Card.Header>
              <Row className="align-items-center">
                <Col>
                  <h5>
                    <FontAwesomeIcon icon={faUserTie} className="me-2" />
                    Liste des Freelancers
                  </h5>
                  <small className="text-muted">
                    {freelancers.length} freelancer{freelancers.length !== 1 ? 's' : ''} disponible{freelancers.length !== 1 ? 's' : ''}
                  </small>
                </Col>
              </Row>
            </Card.Header>
            
            <Card.Body>
              <Table  responsive className="table-centered">
                <thead className="thead-light">
                  <tr>
                    <th>Profil</th>
                    <th>Compétences</th>
                    <th>Disponibilité</th>
                    <th>Liens</th>
                    {/* <th>Actions</th> */}
                  </tr>
                </thead>
                <tbody>
                  {freelancers.map((freelancer) => {
                    const competences = freelancer.FreelancerCompetences || [];
                    const firstTwoCompetences = competences.slice(0, 1);
                    const remainingCompetences = competences.slice(1);

                    return (
                      <tr key={freelancer.id}>
                        <td>
                          <div className="d-flex align-items-center" >
                            <Image 
                              src={freelancer.photo || '/default-profile.png'} 
                              roundedCircle 
                              width="50" 
                              height="50" 
                              className="me-3"
                            />
                            <div>
                              <strong>{freelancer.prenom} {freelancer.nom}</strong>
                            </div>
                          </div>
                        </td>
                        <td>
                         <div className="d-flex align-items-center flex-wrap gap-2">
                              <ListGroup variant="flush">
                            {firstTwoCompetences.map((comp, index) => (
                              <ListGroup.Item key={index} className="px-0 py-1">
                              {/* <FontAwesomeIcon icon={faCode} className="me-2 text-primary" /> */}
                              {comp.competence.nom} 
                              <Badge bg="light" text="dark" className="ms-2">
                                {comp.niveau}
                              </Badge>
                            </ListGroup.Item>
                            ))}
                              </ListGroup>
                            {remainingCompetences.length > 0 && (
                            <React.Fragment>
                              <OverlayTrigger
                                trigger="click"
                                placement="bottom"
                                overlay={
                                  <Popover>
                                    <Popover.Header as="h6">
                                      Autres compétences
                                    </Popover.Header>
                                    <Popover.Body>
                                      <ListGroup variant="flush">
                                        {remainingCompetences.map((comp, index) => (
                                          <ListGroup.Item key={index} className="px-0 py-1">
                                            {comp.competence.nom}
                                            <Badge bg="light" text="dark" className="ms-2">
                                              {comp.niveau}
                                            </Badge>
                                          </ListGroup.Item>
                                        ))}
                                      </ListGroup>
                                    </Popover.Body>
                                  </Popover>
                                }
                              >
                                <Button 
                                  variant="link" 
                                  size="sm" 
                                  className="p-0 text-muted"
                                >
                                  <FontAwesomeIcon icon={faEllipsisH} /> +{remainingCompetences.length}
                                </Button>
                              </OverlayTrigger>
                             </React.Fragment>
                            )}
                          
                         </div>
                        </td>
                        <td>
                          <Badge 
                            bg={freelancer.disponibilite ? "success" : "secondary"} 
                            className="badge-lg" 
                            pill={true}
                          >
                            {freelancer.disponibilite ? 'Disponible' : 'Indisponible'}
                          </Badge>
                        </td>
                        <td>
                          {freelancer.liens?.length > 0 ? (
                            <div className="d-flex flex-wrap gap-2">
                              {freelancer.liens.map((lien, index) => {
                                    // Détermine l'icône en fonction du type de lien
                                    let icon;
                                    if (lien.type.toLowerCase() === 'github') {
                                    icon = faGithub;
                                    } else if (lien.type.toLowerCase() === 'linkedin') {
                                    icon = faLinkedin;
                                    } else {
                                    icon = faGlobe;
                                    }

                                    return (
                                    <Button 
                                        key={index} 
                                        variant="outline-primary" 
                                        size="sm" 
                                        href={lien.url} 
                                        target="_blank"
                                    >
                                        <FontAwesomeIcon icon={icon} className="me-1" />
                                        {lien.type}
                                    </Button>
                                    );
                                })}
                            </div>
                          ) : (
                            <span className="text-muted">Aucun lien</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>

              </Table>

              {freelancers.length === 0 && (
                <div className="text-center py-4">
                  <FontAwesomeIcon icon={faUserTie} size="3x" className="text-muted mb-3" />
                  <h5>Aucun freelancer disponible</h5>
                  <p className="text-muted">
                    Aucun freelancer n'est actuellement inscrit sur la plateforme.
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default FreelancersList;