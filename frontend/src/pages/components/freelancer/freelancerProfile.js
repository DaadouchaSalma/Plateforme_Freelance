import React, { useMemo, useState } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAddressCard, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { useQuery, useMutation } from "@apollo/client";
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { useParams } from 'react-router-dom';
import {
  faGlobe, 
  faPlus,
  faStar,
  faStarHalfAlt,
  faGlobeEurope,
  faPhoneAlt,
  faLink
} from '@fortawesome/free-solid-svg-icons';
import { Col, Row, Card, Image, Button, ListGroup, Tab, Badge, Nav, Form, Modal, Toast } from '@themesberg/react-bootstrap';
import Profile1 from "../../../assets/img/team/profile-picture-1.jpg";
import { Navbar, Container } from '@themesberg/react-bootstrap';
import { GET_FREELANCER_BY_ID } from "../../../graphql/mutations/freelancer";
import { CREATE_FEEDBACK, GET_FEEDBACKS_BY_USER_ID } from "../../../graphql/mutations/feedback";

export default () => {
    const { id } = useParams();
    const { loading, error, data } = useQuery(GET_FREELANCER_BY_ID, {
        variables: { id: parseInt(id) },
        skip: !id,
    });
    const freelancer = data?.freelancerById;

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
                    userType: 'FREELANCER'
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

    const { data: feedbackData, loading: feedbackLoading, error: feedbackError } = useQuery(GET_FEEDBACKS_BY_USER_ID, {
            variables: { 
                userId: parseInt(id),
                userType: 'FREELANCER'
            },
        });
        const feedbacks = feedbackData?.getFeedbacksByUserId;
    
        const { averageRating, feedbackCount } = useMemo(() => {
            if (!feedbacks || feedbacks.length === 0) {
                return { averageRating: 0, feedbackCount: 0 };
            }
    
            const freelancerFeedbacks = feedbacks.filter(fb => fb.senderClient);
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
                receiverType: 'FREELANCER', 
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
    if (error) return <p>Erreur lors du chargement du freelancer: {error.message}</p>;

    return (
        <>
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
            <div className="freelancer-profile-page" style={{ margin: '0 20px' }}>
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
                src={"http://localhost:3000/uploads/"+freelancer.photo} 
                alt="freelancer" 
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
                <h3 style={{ marginTop: "-20px" }}>{freelancer.nom} {freelancer.prenom}</h3>
                <div className="mb-2" style={{ marginTop: "-10px" }}>
            <FontAwesomeIcon icon={faEnvelope} className="me-2 text-muted" />
            <a href={`mailto:${freelancer.user?.email}`} className="text-primary">
                {freelancer.user?.email || 'Email non disponible'}
            </a>
        </div>
                <Badge bg={freelancer.disponibilite ? "success" : "danger"} className="mb-3" pill={true}
style={{ height: '26px', padding: '4px 12px',
    fontSize: '0.9rem', }}>{freelancer.disponibilite ? "Disponible" : "Non disponible"}</Badge>
                
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
                <Button variant="primary" className="w-100">
                    <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                    Envoyer un message
                </Button>
            </div>
        </Card.Body>
    </Card>
                        
                        {/* Contact Info Card - Matches Profile Card Height */}
                        <Card className="flex-grow-1" style={{ height: '320px', marginTop: '40px', width: '425px' }}>
                          <Card.Body className="d-flex flex-column p-3" style={{ height: '100%' }}>
                            <h5 className="mb-3">
                              <FontAwesomeIcon icon={faAddressCard} className="me-2 text-primary" />
                              <b>Informations professionnelles</b>
                            </h5>
                            
                            {/* Scrollable content container */}
                            <div
                              style={{
                                flex: '1 1 auto',
                                overflowY: 'auto',
                                minHeight: 0,  // important for flexbox to allow shrinking
                              }}
                            >
            <Row>
                {/* Colonne Compétences */}
                <Col xs={12} md={6}>
                    <h6 className="mb-2"><b>Compétences</b></h6>
                    <div className="d-flex flex-wrap gap-2">
                        {freelancer.FreelancerCompetences.length > 0 ? (
                            freelancer.FreelancerCompetences.map((comp, index) => (
                                <Badge 
                                    key={index} 
                                    bg="light" 
                                    text="dark"
                                    className="border"
                                    style={{ 
                                        height: '26px', 
                                        padding: '4px 10px',
                                        fontSize: '0.85rem'
                                    }}
                                >
                                    {comp.competence?.nom 
  ? `${comp.competence.nom} (${comp.niveau || 'Niveau inconnu'})` 
  : 'Compétence inconnue'}

                                </Badge>
                            ))
                        ) : (
                            <p className="text-muted small">Aucune compétence renseignée</p>
                        )}
                    </div>
                </Col>

                {/* Colonne Liens Professionnels */}
                <Col xs={12} md={6}>
                    <h6 className="mb-2"><b>Réseaux Professionnels</b></h6>
                    {freelancer.liens?.length > 0 ? (
                        <ListGroup variant="flush">
                            {freelancer.liens.map((lien, index) => {
    let icon;
    if (lien.type.toLowerCase() === 'github') {
        icon = faGithub;
    } else if (lien.type.toLowerCase() === 'linkedin') {
        icon = faLinkedin;
    } else {
        icon = faGlobe;
    }

    return (
        <ListGroup.Item key={index} className="px-0 py-1 border-0">
            <a 
                href={lien.url} 
                target="_blank" 
                rel="noopener noreferrer"
                className="d-flex align-items-center text-primary"
            >
                <FontAwesomeIcon 
                    icon={icon} 
                    className="me-2"
                />
                {lien.type || 'Lien professionnel'}
            </a>
        </ListGroup.Item>
    );
})}

                        </ListGroup>
                    ) : (
                        <p className="text-muted small">Aucun lien professionnel</p>
                    )}
                    
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
                                            <Nav.Link eventKey="about">Biographie</Nav.Link>
                                        </Nav.Item>
                                        <Nav.Item>
                                            <Nav.Link eventKey="reviews">Avis ({feedbackCount})</Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </Card.Header>
                                
                                <Card.Body>
                                    <Tab.Content>
                                        <Tab.Pane eventKey="about">
                                            <h4 className="mb-3">Biographie</h4>
                                            <p>{freelancer.bio || 'Aucune description fournie.'}</p>
                                        </Tab.Pane>
                                        
                                        <Tab.Pane eventKey="reviews">
                                                                                    <div className="d-flex justify-content-between align-items-center mb-4">
                                                                                        <h4 className="mb-0">Avis des Clients</h4>
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
                                                                                    ) : feedbacks?.filter(fb => fb.senderClient).length > 0 ? (
                                                                                        feedbacks
                                                                                            .filter(fb => fb.senderClient)
                                                                                            .map((feedback) => (
                                                                                                <Card key={feedback.id} className="mb-3">
                                                                                                    <Card.Body>
                                                                                                        <div className="d-flex justify-content-between mb-2">
                                                                                                            <h5>{feedback.senderClient?.nom || 'Anonymous'} </h5>
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