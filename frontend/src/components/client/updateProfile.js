import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard, faEnvelope, faEdit, faSave } from '@fortawesome/free-solid-svg-icons';
import { GET_CURRENT_CLIENT_QUERY, UPDATE_CLIENT_MUTATION } from "../../graphql/mutations/client";
import { useQuery, useMutation } from "@apollo/client";
import { 
  faMapMarkerAlt,
  faStar,
  faStarHalfAlt,
  faGlobeEurope,
  faPhoneAlt,
  faLink
} from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Card, Image, Button, ListGroup, Tab, Badge, Nav, Form } from '@themesberg/react-bootstrap';
import Profile1 from "../../assets/img/team/profile-picture-1.jpg";

export default () => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        nom: '',
        about: '',
        adresse: '',
        codePostal: '',
        tel: '',
        siteweb: '',
        domaine: ''
    });

    const { loading, error, data, refetch } = useQuery(GET_CURRENT_CLIENT_QUERY);
    const [updateClient] = useMutation(UPDATE_CLIENT_MUTATION);

    const client = data?.me;

    useEffect(() => {
        if (client) {
            setFormData({
                nom: client.nom || '',
                about: client.about || '',
                adresse: client.adresse || '',
                codePostal: client.codePostal || '',
                tel: client.tel || '',
                siteweb: client.siteweb || '',
                domaine: client.domaine || ''
            });
        }
    }, [client]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        
        
        
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            const variables = await updateClient({
                variables: {
                    nom: formData.nom,
                    about: formData.about,
                    adresse: formData.adresse,
                    codePostal: formData.codePostal,
                    tel: formData.tel,
                    siteweb: formData.siteweb,
                    domaine: formData.domaine
                }
            });
            console.log("Updating client with:", variables);
            await refetch();
            setIsEditing(false);
        } catch (err) {
            console.error("Error updating client:", err);
            // Handle error (show toast/message to user)
        }
    };

    const toggleEdit = () => {
        if (isEditing) {
            handleSave();
        } else {
            setIsEditing(true);
        }
    };

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>Erreur : {error.message}</p>;
    if (!client) return <p>Client non connecté ou non trouvé</p>;

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
            <div className="d-flex justify-content-end  me-4" style={{ marginRigth: '100px', marginTop: "30px" }}>
  <Button 
    variant={isEditing ? "success" : "primary"} 
    className="ms-3 d-flex align-items-center justify-content-center"
    style={{ width: '42px', height: '42px' }} // Optional: makes it square
    onClick={toggleEdit}
  >
    <FontAwesomeIcon icon={isEditing ? faSave : faEdit} />
  </Button>
</div>


            <div className="client-profile-page" style={{ margin: '0 20px' }}>
                <Row className="mb-4">
                    <Col xs={12} className="d-flex flex-column flex-md-row gap-4 mb-4">
                        {/* Profile Card */}
                        <Card className="text-center flex-grow-1" style={{ 
                            height: '320px',
                            marginTop: '40px',
                            paddingTop: '75px',
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
                            <Card.Body className="d-flex flex-column">
                                <h3>{client.nom}</h3>
                                <div className="d-flex justify-content-center">
  <Badge bg="success" className="mb-3" pill={true}
 style={{
    height: '26px',
    width: '180px',
    padding: '4px 12px',
    fontSize: '0.9rem',
  }}>
    {client.domaine}
  </Badge>
</div>
                                
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
                                
                                <div className="mt-auto">
                                    <Button variant="primary" className="w-100">
                                        <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                                        Envoyer un message
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                        
                        {/* Contact Info Card */}
                        <Card className="flex-grow-1" style={{ height: '320px', marginTop: '40px' }}>
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
                                                            {isEditing ? (
                                                                <Form.Control
                                                                    type="text"
                                                                    name="adresse"
                                                                    value={formData.adresse}
                                                                    onChange={handleInputChange}
                                                                    className="mb-0"
                                                                />
                                                            ) : (
                                                                <p className="mb-0 text-muted">{client.adresse || 'Non spécifié'}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </ListGroup.Item>

                                                <ListGroup.Item className="px-0 py-2">
                                                    <div className="d-flex align-items-center">
                                                        <FontAwesomeIcon icon={faGlobeEurope} className="me-3 text-info" style={{ width: "20px" }} />
                                                        <div>
                                                            <h6 className="mb-1">Code postal</h6>
                                                            {isEditing ? (
                                                                <Form.Control
                                                                    type="text"
                                                                    name="codePostal"
                                                                    value={formData.codePostal}
                                                                    onChange={handleInputChange}
                                                                    className="mb-0"
                                                                />
                                                            ) : (
                                                                <p className="mb-0 text-muted">{client.codePostal || 'Non spécifié'}</p>
                                                            )}
                                                        </div>
                                                    </div>
                                                </ListGroup.Item>

                                                <ListGroup.Item className="px-0 py-2">
                                                    <div className="d-flex align-items-center">
                                                        <FontAwesomeIcon icon={faPhoneAlt} className="me-3 text-success" style={{ width: "20px" }} />
                                                        <div>
                                                            <h6 className="mb-1">Téléphone</h6>
                                                            {isEditing ? (
                                                                <Form.Control
                                                                    type="text"
                                                                    name="tel"
                                                                    value={formData.tel}
                                                                    onChange={handleInputChange}
                                                                    className="mb-0"
                                                                />
                                                            ) : (
                                                                <p className="mb-0 text-muted">{client.tel || 'Non spécifié'}</p>
                                                            )}
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
                                                            {isEditing ? (
                                                                <Form.Control
                                                                    type="text"
                                                                    name="siteweb"
                                                                    value={formData.siteweb}
                                                                    onChange={handleInputChange}
                                                                    className="mb-0"
                                                                />
                                                            ) : (
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
                                                            )}
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
                                <Card.Header className="border-bottom" style={{ backgroundColor:'#f5f8fb', boxShadow: 'none' }}>
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
                                            {isEditing ? (
                                                <Form.Group controlId="formAbout">
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={5}
                                                        name="about"
                                                        value={formData.about}
                                                        onChange={handleInputChange}
                                                    />
                                                </Form.Group>
                                            ) : (
                                                <p>{client.about || 'Aucune description fournie.'}</p>
                                            )}
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