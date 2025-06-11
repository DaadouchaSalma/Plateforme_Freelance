import React from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { GET_CLIENT_BY_ID_QUERY } from "../../graphql/mutations/client";
import { useQuery } from "@apollo/client";
import { useParams } from 'react-router-dom';
import { 
  faMapMarkerAlt,
  faStar,
  faStarHalfAlt,
  faGlobeEurope,
  faPhoneAlt,
  faLink
} from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Card, Image, Button, ListGroup, Tab, Badge, Nav } from '@themesberg/react-bootstrap';
import Profile1 from "../../assets/img/team/profile-picture-1.jpg";
import { Navbar, Container } from '@themesberg/react-bootstrap';
import logo from "../../assets/img/logo/icon+title(small).png";
import NavbarFreelancer from "../NavbarFreelancer";

export default () => {
    const { id } = useParams();
    const { loading, error, data } = useQuery(GET_CLIENT_BY_ID_QUERY, {
        variables: { id: parseInt(id) },
        skip: !id,
    });

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>Erreur lors du chargement du client: {error.message}</p>;

    const client = data?.clientById;

    const reviews = [
        {
            id: 1,
            freelancer: "John Smith",
            rating: 4.5,
            comment: "Excellent client avec qui travailler. Exigences claires et paiements rapides.",
            date: "Mars 2023"
        }
    ];

    return (
        <>
           <NavbarFreelancer></NavbarFreelancer>
            
            <br></br>

            <div className="client-profile-page" style={{ margin: '0 20px' }}>
                <Row className="mb-4">
                    {/* Profile and Contact Info Columns */}
                        <Col xs={12} className="d-flex flex-column flex-md-row gap-4 mb-4">
                            {/* Profile Card - Fixed Height */}
                            <Card className="text-center flex-grow-1" style={{ 
        height: '280px',
        marginTop: '70px',  // Half of the image height (150px/2)
        paddingTop: '75px',  // Compensate for the negative margin
        position: 'relative',
        zIndex: 1
    }}>
        <div style={{
            position: 'absolute',
            top: 0,
            left: '50%',
            transform: 'translate(-50%, -50%)',
            zIndex: 2
        }}>
            <img 
                src={Profile1} 
                alt="Client" 
                className="rounded-circle img-thumbnail" 
                style={{ 
                    width: "150px", 
                    height: "150px", 
                    objectFit: "cover",
                    border: '3px solid white',
                    boxShadow: '0 0.125rem 0.25rem rgba(0, 0, 0, 0.075)'
                }}
            />
        </div>
        <Card.Body className="d-flex flex-column" >
            <div>
                <h3>{client.nom}</h3>
                <Badge bg="success" className="mb-3" pill={true}
style={{ height: '26px', padding: '4px 12px',
    fontSize: '0.9rem', }}>{client.domaine}</Badge>
                
                <div className="d-flex justify-content-center mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <FontAwesomeIcon 
                            key={star}
                            icon={star <= 4 ? faStar : (star === 5 ? faStarHalfAlt : faStar)}
                            className={star <= 4.5 ? "text-warning" : "text-muted"}
                        />
                    ))}
                    <span className="ms-2">4.5 (12 avis)</span>
                </div>
            </div>
            
            <div className="mt-auto">
                <Button variant="primary" className="w-100">
                    <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                    Envoyer un message
                </Button>
            </div>
        </Card.Body>
    </Card>
                        
                        {/* Contact Info Card - Matches Profile Card Height */}
                        <Card className="flex-grow-1" style={{ height: '280px', marginTop: '70px' }}>
                            <Card.Body className="d-flex flex-column p-3"> 
                                <h5 className="mb-3">
                                    <FontAwesomeIcon icon={faAddressCard} className="me-2 text-primary" />
                                    Informations de contact
                                </h5>
                                
                                <div className="flex-grow-1">
                                    <Row>
                                        <Col xs={12} md={6}>
                                            <ListGroup variant="flush" className="mb-0">
                                                <ListGroup.Item className="px-0 py-2">
                                                    <div className="d-flex align-items-center">
                                                        <FontAwesomeIcon icon={faMapMarkerAlt} className="me-3 text-primary" style={{ width: "20px" }} />
                                                        <div>
                                                            <h6 className="mb-1">Adresse</h6>
                                                            <p className="mb-0 text-muted">{client.adresse}</p>
                                                        </div>
                                                    </div>
                                                </ListGroup.Item>

                                                <ListGroup.Item className="px-0 py-2">
                                                    <div className="d-flex align-items-center">
                                                        <FontAwesomeIcon icon={faGlobeEurope} className="me-3 text-info" style={{ width: "20px" }} />
                                                        <div>
                                                            <h6 className="mb-1">Code postal</h6>
                                                            <p className="mb-0 text-muted">{client.codePostal || 'Non spécifié'}</p>
                                                        </div>
                                                    </div>
                                                </ListGroup.Item>

                                                <ListGroup.Item className="px-0 py-2">
                                                    <div className="d-flex align-items-center">
                                                        <FontAwesomeIcon icon={faPhoneAlt} className="me-3 text-success" style={{ width: "20px" }} />
                                                        <div>
                                                            <h6 className="mb-1">Téléphone</h6>
                                                            <p className="mb-0 text-muted">{client.tel || 'Non spécifié'}</p>
                                                        </div>
                                                    </div>
                                                </ListGroup.Item>
                                            </ListGroup>
                                        </Col>

                                        <Col xs={12} md={6} style={{ marginTop: '40px' }}>
                                            <ListGroup variant="flush" className="mb-0">
                                                <ListGroup.Item className="px-0 py-2">
                                                    <div className="d-flex align-items-center">
                                                        <FontAwesomeIcon icon={faLink} className="me-3 text-warning" style={{ width: "20px" }} />
                                                        <div>
                                                            <h6 className="mb-1">Site web</h6>
                                                            <p className="mb-0">
                                                                {client.siteweb ? (
                                                                    <a
                                                                        href={client.siteweb.startsWith('http') ? client.siteweb : `https://${client.siteweb}`}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="text-primary"
                                                                    >
                                                                        {client.siteweb}
                                                                    </a>
                                                                ) : (
                                                                    <span className="text-muted">Non spécifié</span>
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </ListGroup.Item>

                                                <ListGroup.Item className="px-0 py-2">
                                                    <div className="d-flex align-items-center">
                                                        <FontAwesomeIcon icon={faEnvelope} className="me-3 text-primary" style={{ width: "20px" }} />
                                                        <div>
                                                            <h6 className="mb-1">Email</h6>
                                                            <p className="mb-0">
                                                                {client.user?.email ? (
                                                                    <a href={`mailto:${client.user.email}`} className="text-primary">
                                                                        {client.user.email}
                                                                    </a>
                                                                ) : (
                                                                    <span className="text-muted">Non spécifié</span>
                                                                )}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </ListGroup.Item>
                                            </ListGroup>
                                        </Col>
                                    </Row>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>

                    {/* Main Content Section */}
                    <Col xs={12}>
                        <Tab.Container defaultActiveKey="about">
                            <Card>
                                <Card.Header className="border-bottom" style={{ backgroundColor:'#f5f8fb', boxShadow: 'none' }} >
                                    <Nav variant="tabs" className="card-header-tabs">
                                        <Nav.Item>
                                            <Nav.Link eventKey="about">À propos</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="reviews">Avis ({reviews.length})</Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </Card.Header>
                                
                                <Card.Body>
                                    <Tab.Content>
                                        <Tab.Pane eventKey="about">
                                            <h4 className="mb-3">À propos</h4>
                                            <p>{client.about || 'Aucune description fournie.'}</p>
                                        </Tab.Pane>
                                        
                                        <Tab.Pane eventKey="reviews">
                                            <h4 className="mb-4">Avis des clients</h4>
                                            {reviews.length > 0 ? (
                                                <>
                                                    {reviews.map((review) => (
                                                        <Card key={review.id} className="mb-3">
                                                            <Card.Body>
                                                                <div className="d-flex justify-content-between mb-2">
                                                                    <h5>{review.freelancer}</h5>
                                                                    <div>
                                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                                            <FontAwesomeIcon 
                                                                                key={star}
                                                                                icon={star <= review.rating ? faStar : faStar}
                                                                                className={star <= review.rating ? "text-warning" : "text-muted"}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                <p className="text-muted">{review.date}</p>
                                                                <p>{review.comment}</p>
                                                            </Card.Body>
                                                        </Card>
                                                    ))}
                                                    
                                                    <div className="mt-4 p-4 bg-light rounded">
                                                        <h5>Laisser un avis</h5>
                                                        <p className="text-muted">Cette fonctionnalité sera bientôt disponible.</p>
                                                    </div>
                                                </>
                                            ) : (
                                                <p>Aucun avis pour le moment.</p>
                                            )}
                                        </Tab.Pane>
                                    </Tab.Content>
                                </Card.Body>
                            </Card>
                        </Tab.Container>
                    </Col>
                </Row>
            </div>
        </>
    );
};