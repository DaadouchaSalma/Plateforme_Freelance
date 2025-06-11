import React, { useMemo, useState } from "react";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { GET_CLIENT_BY_ID_QUERY } from "../../graphql/mutations/client";
import { useQuery, useMutation } from "@apollo/client";
import { useParams } from 'react-router-dom';
import { 
  faMapMarkerAlt,
  faStar,
  faStarHalfAlt,
  faGlobeEurope,
  faPhoneAlt,
  faLink,
  faPlus
} from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Card, Image, Button, ListGroup, Tab, Badge, Nav, Form, Modal, Toast } from '@themesberg/react-bootstrap';
import Profile1 from "../../assets/img/team/profile-picture-1.jpg";
import { Navbar, Container } from '@themesberg/react-bootstrap';
import logo from "../../assets/img/logo/icon+title(small).png";
import NavbarFreelancer from "../NavbarFreelancer";
import { GET_FEEDBACKS_BY_USER_ID, CREATE_FEEDBACK } from "../../graphql/mutations/feedback";


export default () => {
    const { id } = useParams();
    const { loading, error, data } = useQuery(GET_CLIENT_BY_ID_QUERY, {
        variables: { id: parseInt(id) },
        skip: !id,
    });

    
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastVariant, setToastVariant] = useState('success');
    const [showFeedbackModal, setShowFeedbackModal] = useState(false);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [hoverRating, setHoverRating] = useState(0);
    const handleCloseToast = () => setShowToast(false);

    const [createFeedback, { loading: submittingFeedback }] = useMutation(CREATE_FEEDBACK, {
    refetchQueries: [
        {
            query: GET_FEEDBACKS_BY_USER_ID,
            variables: { 
                userId: parseInt(id),
                userType: 'CLIENT'
            }
        }
    ],
    onCompleted: () => {
        setShowFeedbackModal(false);
        setRating(0);
        setComment('');
        setToastMessage("Avis envoyé avec succès!");
        setToastVariant('success');
        setShowToast(true);
    },
    onError: (error) => {
        console.error("Mutation error details:", error);
        setToastMessage(`Erreur: ${error.message}`);
        setToastVariant('danger');
        setShowToast(true);
    }
});

    const client = data?.clientById;
    const { data: feedbackData, loading: feedbackLoading, error: feedbackError } = useQuery(GET_FEEDBACKS_BY_USER_ID, {
        variables: { 
            userId: parseInt(id),
            userType: 'CLIENT'
        },
    });
    const feedbacks = feedbackData?.getFeedbacksByUserId;

    const { averageRating, feedbackCount } = useMemo(() => {
        if (!feedbacks || feedbacks.length === 0) {
            return { averageRating: 0, feedbackCount: 0 };
        }

        const freelancerFeedbacks = feedbacks.filter(fb => fb.senderfreelancer);
        const totalRating = freelancerFeedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
        const average = totalRating / freelancerFeedbacks.length;
        
        return {
            averageRating: Math.round(average * 10) / 10,
            feedbackCount: freelancerFeedbacks.length
        };
    }, [feedbacks]);

    const handleSubmitFeedback = () => {
    // Validate inputs
    if (rating === 0) {
        setToastMessage("Veuillez sélectionner une note");
        setToastVariant('danger');
        setShowToast(true);
        return;
    }
    
    if (!comment.trim()) {
        setToastMessage("Veuillez saisir un commentaire");
        setToastVariant('danger');
        setShowToast(true);
        return;
    }

    createFeedback({
        variables: {
            receiverId: parseInt(id),
            receiverType: 'CLIENT', 
            rating: parseFloat(rating),
            comment: comment.trim()
        }
    });
};

    React.useEffect(() => {
    if (showToast) {
        const timer = setTimeout(() => {
            setShowToast(false);
        }, 5000); // 5 seconds
        return () => clearTimeout(timer);
    }
}, [showToast]);

    if (loading) return <p>Chargement...</p>;
    if (error) return <p>Erreur lors du chargement du client: {error.message}</p>;
    const history = useHistory();

    return (
        <>

           <NavbarFreelancer></NavbarFreelancer>

            <Toast 
    show={showToast} 
    onClose={handleCloseToast} 
    className="position-fixed top-0 end-0 m-3"
    style={{ zIndex: 9999 }}  // Ensure it appears above other elements
    bg={toastVariant}
>
    <Toast.Header className={`bg-${toastVariant} text-white`} closeButton>
        <strong className="me-auto">Notification</strong>
    </Toast.Header>
    <Toast.Body className={toastVariant === 'success' ? 'bg-success text-white' : 'bg-danger text-white'}>
        {toastMessage}
    </Toast.Body>
</Toast>
            
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
                src={"http://localhost:3000/uploads/"+client.photo}
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
                    {[1, 2, 3, 4, 5].map((star) => {
                        let isFilled = star <= Math.floor(averageRating);
                        let isHalf = star > averageRating && star - 0.5 <= averageRating;

                        return (
                            <FontAwesomeIcon 
                                key={star}
                                icon={isHalf ? faStarHalfAlt : faStar}
                                className={isFilled || isHalf ? "text-warning" : "text-muted"}
                            />
                        );
                    })}
                    <span className="ms-2">
                        {averageRating.toFixed(1)} ({feedbackCount} avis)
                    </span>
                </div>
            </div>
            
            <div className="mt-auto">
                <Button variant="primary" className="w-100" style={{ cursor: 'pointer' }} onClick={() => history.push(`/messagerie/msg`)}>
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
                                        <Nav.Link eventKey="reviews">Avis ({feedbackCount})</Nav.Link>                                        </Nav.Item>
                                    </Nav>
                                </Card.Header>
                                
                                <Card.Body>
                                    <Tab.Content>
                                        <Tab.Pane eventKey="about">
                                            <h4 className="mb-3">À propos</h4>
                                            <p>{client.about || 'Aucune description fournie.'}</p>
                                        </Tab.Pane>
                                        
                                        <Tab.Pane eventKey="reviews">
                                            <div className="d-flex justify-content-between align-items-center mb-4">
                                                <h4 className="mb-0">Avis des freelancers</h4>
                                                <Button 
                                                    variant="primary" 
                                                    size="sm" 
                                                    onClick={() => setShowFeedbackModal(true)}
                                                >
                                                    <FontAwesomeIcon icon={faPlus} className="me-2" />
                                                    Ajouter un avis
                                                </Button>
                                            </div>
                                            {feedbackLoading ? (
                                                <p>Chargement des avis...</p>
                                            ) : feedbackError ? (
                                                <p>Erreur lors du chargement des avis</p>
                                            ) : feedbacks?.filter(fb => fb.senderfreelancer).length > 0 ? (
                                                feedbacks
                                                    .filter(fb => fb.senderfreelancer)
                                                    .map((feedback) => (
                                                        <Card key={feedback.id} className="mb-3">
                                                            <Card.Body>
                                                                <div className="d-flex justify-content-between mb-2">
                                                                    <h5>{feedback.senderfreelancer?.nom || 'Anonymous'} {feedback.senderfreelancer?.prenom || 'Anonymous'}</h5>
                                                                    <div>
                                                                        {[1, 2, 3, 4, 5].map((star) => (
                                                                            <FontAwesomeIcon
                                                                                key={star}
                                                                                icon={faStar}
                                                                                className={star <= feedback.rating ? "text-warning" : "text-muted"}
                                                                            />
                                                                        ))}
                                                                    </div>
                                                                </div>
                                                                <p className="text-muted">{new Date(feedback.createdAt).toLocaleDateString()}</p>
                                                                <p>{feedback.comment}</p>
                                                            </Card.Body>
                                                        </Card>
                                                    ))
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

            {/* Feedback Modal */}
            <Modal show={showFeedbackModal} onHide={() => setShowFeedbackModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Ajouter un avis</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form>
                        <Form.Group className="mb-3">
                            <Form.Label>Note</Form.Label>
                            <div className="d-flex">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <FontAwesomeIcon
                                        key={star}
                                        icon={faStar}
                                        className={`mx-1 ${(hoverRating || rating) >= star ? "text-warning" : "text-muted"}`}
                                        style={{ cursor: "pointer", fontSize: "1.5rem" }}
                                        onClick={() => setRating(star)}
                                        onMouseEnter={() => setHoverRating(star)}
                                        onMouseLeave={() => setHoverRating(0)}
                                    />
                                ))}
                            </div>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Commentaire</Form.Label>
                            <Form.Control
                                as="textarea"
                                rows={3}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                            />
                        </Form.Group>
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowFeedbackModal(false)}>
                        Annuler
                    </Button>
                    <Button 
    variant="primary" 
    onClick={handleSubmitFeedback}
    disabled={submittingFeedback}
>
    {submittingFeedback ? "Envoi en cours..." : "Envoyer l'avis"}
</Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};