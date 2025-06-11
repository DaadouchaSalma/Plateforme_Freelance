import React, { useState, useEffect, useMemo  } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useHistory } from "react-router-dom";
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { 
  faGlobe,
  faCalendarTimes,
  faAddressCard, 
  faEnvelope, 
  faEdit, 
  faSave,
  faStar,
  faStarHalfAlt,
  faLink,
  faLaptopCode,
  faCalendarCheck
} from '@fortawesome/free-solid-svg-icons';
import { useQuery, useMutation } from "@apollo/client";
import { Col, Row, Card, Image, Button, ListGroup, Tab, Badge, Nav, Form } from '@themesberg/react-bootstrap';
import Profile1 from "../../../assets/img/team/profile-picture-1.jpg";
import { GET_ALL_COMPETENCES, GET_CURRENT_FREELANCER_QUERY, UPDATE_FREELANCER } from "../../../graphql/mutations/freelancer";
import { Navbar, Container } from '@themesberg/react-bootstrap';
import logo from "../../../assets/img/logo/icon+title(small).png";
import { GET_MY_FEEDBACKS } from "../../../graphql/mutations/feedback";
import NavbarFreelancer from "../../../components/NavbarFreelancer";


export default () => {
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        nom: '',
        prenom: '',
        bio: '',
        disponibilite: false
    });
    const [competences, setCompetences] = useState([]);
    const [newCompetence, setNewCompetence] = useState({ id: '', niveau: '' });
    const [links, setLinks] = useState([]);
    const [newLink, setNewLink] = useState({ type: '', url: '' });

    const { loading, error, data, refetch } = useQuery(GET_CURRENT_FREELANCER_QUERY);
    const history = useHistory();
    const { data: competencesData } = useQuery(GET_ALL_COMPETENCES);
    const [updateFreelancer] = useMutation(UPDATE_FREELANCER);
    const freelancer = data?.meFreelancer;
    const { data: feedbackData, loading: feedbackLoading, error: feedbackError } = useQuery(GET_MY_FEEDBACKS);
    const feedbacks = feedbackData?.getMyFeedbacks;
    console.log('feedbacks', feedbackData)
    console.log('feedbacksdata', feedbacks)
    const { averageRating, feedbackCount } = useMemo(() => {
  if (!feedbacks || feedbacks.length === 0) {
    return { averageRating: 0, feedbackCount: 0 };
  }

  const clientFeedbacks = feedbacks.filter(fb => fb.senderClient);
  const totalRating = clientFeedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);
  const average = totalRating / clientFeedbacks.length;
  
  return {
    averageRating: Math.round(average * 10) / 10,
    feedbackCount: clientFeedbacks.length
  };
}, [feedbacks]);
    
    useEffect(() => {
    if (freelancer) {
        setFormData({
            nom: freelancer.nom || '',
            prenom: freelancer.prenom || '',
            bio: freelancer.bio || '',
            disponibilite: freelancer.disponibilite || false
        });
        
        if (freelancer.FreelancerCompetences) {
            setCompetences(freelancer.FreelancerCompetences.map(c => ({
                id: c.competence.id,
                nom: c.competence.nom,
                niveau: c.niveau
            })));
        }
        
        if (freelancer.liens) {
            setLinks(freelancer.liens.map(l => ({
                id: l.id,
                type: l.type,
                url: l.url
            })));
        }
    }
}, [freelancer]);


    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleAddCompetence = () => {
        if (newCompetence.id && newCompetence.niveau) {
            const competence = competencesData?.getCompetences?.find(c => c.id === parseInt(newCompetence.id));
            if (competence) {
                setCompetences([...competences, {
                    id: newCompetence.id,
                    nom: competence.nom,
                    niveau: newCompetence.niveau
                }]);
                setNewCompetence({ id: '', niveau: '' });
            }
        }
    };

    const handleUpdateCompetenceLevel = (index, niveau) => {
        const updated = [...competences];
        updated[index].niveau = niveau;
        setCompetences(updated);
    };

    const handleAddLink = () => {
        if (newLink.type && newLink.url) {
            setLinks([...links, { ...newLink }]);
            setNewLink({ type: '', url: '' });
        }
    };

    const handleSave = async () => {
    try {
        await updateFreelancer({
            variables: {
                nom: formData.nom,
                prenom: formData.prenom,
                bio: formData.bio,
                disponibilite: formData.disponibilite,
                competences: competences.map(c => parseInt(c.id)),
                niveaux: competences.map(c => c.niveau),
                liensProf: links.map(l => ({
                    id: l.id,
                    type: l.type,
                    url: l.url
                }))
            }
        });
        await refetch();
        setIsEditing(false);
    } catch (err) {
        console.error("Error updating freelancer:", err);
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
    if (!freelancer)  {
        console.log("freelancer: ", freelancer)
        return <p>Freelancer non connecté ou non trouvé</p>
};


    return (
        <>
        <NavbarFreelancer></NavbarFreelancer>
            
            <br></br>
            <div className="d-flex justify-content-end me-4" style={{ marginTop: "30px" }}>
                <Button 
                    variant={isEditing ? "success" : "primary"} 
                    className="ms-3 d-flex align-items-center justify-content-center"
                    style={{ width: '42px', height: '42px' }}
                    onClick={toggleEdit}
                >
                    <FontAwesomeIcon icon={isEditing ? faSave : faEdit} />
                </Button>
            </div>

            <div className="freelancer-profile-page" style={{ margin: '0 20px' }}>
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
                                    src={"http://localhost:3000/uploads/"+freelancer.photo}
                                    alt="Freelancer" 
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
                                <h3>{freelancer.prenom} {freelancer.nom}</h3>
                                
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
                                
                                <div className="mt-auto">
                                    <div className="d-flex align-items-center justify-content-center mb-2" style={{ marginTop: '-120px' }}>
  {isEditing ? (
    <>
      <FontAwesomeIcon
        icon={formData.disponibilite ? faCalendarCheck : faCalendarTimes}
        className="me-2"
      />
      <Form.Check
        type="switch"
        id="disponibilite-switch"
        label={formData.disponibilite ? "Disponible" : "Non disponible"}
        checked={formData.disponibilite}
        onChange={(e) =>
          setFormData({ ...formData, disponibilite: e.target.checked })
        }
      />
    </>
  ) : (
    <Badge bg={freelancer.disponibilite ? "success" : "danger"} className="mb-3" pill={true}
    style={{ height: '26px', padding: '4px 12px',
        fontSize: '0.9rem', }}>{freelancer.disponibilite ? "Disponible" : "Non disponible"}</Badge>
  )}
</div>

                                    <Button variant="primary" className="w-100" style={{ marginTop: '20px', cursor: 'pointer' }} onClick={() => history.push(`/messagerie/msg`)} >
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

          {isEditing ? (
            <div>
              {competences.map((competence, index) => (
                <div key={index} className="d-flex align-items-center mb-2">
                  <span className="me-2">{competence.nom}</span>
                  <Form.Select
                    size="sm"
                    value={competence.niveau}
                    onChange={(e) => handleUpdateCompetenceLevel(index, e.target.value)}
                    style={{ width: '120px' }}
                  >
                    <option value="Débutant">Débutant</option>
                    <option value="Intermédiaire">Intermédiaire</option>
                    <option value="Avancé">Avancé</option>
                    <option value="Expert">Expert</option>
                  </Form.Select>
                </div>
              ))}
              <div className="d-flex align-items-center mt-2">
                <Form.Select
                  size="sm"
                  value={newCompetence.id}
                  onChange={(e) => setNewCompetence({...newCompetence, id: e.target.value})}
                  style={{ width: '150px' }}
                >
                  <option value="">Sélectionner</option>
                  {competencesData?.getCompetences?.map(comp => (
                    <option key={comp.id} value={comp.id.toString()}>{comp.nom}</option>
                  ))}
                </Form.Select>
                <Form.Select
                  size="sm"
                  value={newCompetence.niveau}
                  onChange={(e) => setNewCompetence({...newCompetence, niveau: e.target.value})}
                  className="ms-2"
                  style={{ width: '120px' }}
                >
                  <option value="">Niveau</option>
                  <option value="Débutant">Débutant</option>
                  <option value="Intermédiaire">Intermédiaire</option>
                  <option value="Avancé">Avancé</option>
                  <option value="Expert">Expert</option>
                </Form.Select>
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="ms-2"
                  onClick={handleAddCompetence}
                >
                  Ajouter
                </Button>
              </div>
            </div>
          ) : (
            <div className="d-flex flex-wrap gap-2">
              {competences.length > 0 ? (
                competences.map((competence, index) => (
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
                    {competence.nom} ({competence.niveau})
                  </Badge>
                ))
              ) : (
                <p className="text-muted small">Aucune compétence renseignée</p>
              )}
            </div>
          )}
        </Col>

        {/* Colonne Liens Professionnels */}
        <Col xs={12} md={6}>
          <h6 className="mb-2"><b>Réseaux Professionnels</b></h6>

          {isEditing ? (
            <div>
              {links.map((link, index) => (
                <div key={index} className="d-flex align-items-center mb-2">
                  <Form.Select
                    size="sm"
                    value={link.type}
                    onChange={(e) => {
                      const updated = [...links];
                      updated[index].type = e.target.value;
                      setLinks(updated);
                    }}
                    style={{ width: '120px' }}
                  >
                    <option value="github">GitHub</option>
                    <option value="linkedin">LinkedIn</option>
                    <option value="portfolio">Portfolio</option>
                  </Form.Select>
                  <Form.Control
                    size="sm"
                    type="text"
                    value={link.url}
                    onChange={(e) => {
                      const updated = [...links];
                      updated[index].url = e.target.value;
                      setLinks(updated);
                    }}
                    className="ms-2"
                    placeholder="URL"
                  />
                  
                </div>
              ))}
              <div className="d-flex align-items-center mt-2">
                <Form.Select
                  size="sm"
                  value={newLink.type}
                  onChange={(e) => setNewLink({...newLink, type: e.target.value})}
                  style={{ width: '120px' }}
                >
                  <option value="">Type</option>
                  <option value="github">GitHub</option>
                  <option value="linkedin">LinkedIn</option>
                  <option value="portfolio">Portfolio</option>
                </Form.Select>
                <Form.Control
                  size="sm"
                  type="text"
                  value={newLink.url}
                  onChange={(e) => setNewLink({...newLink, url: e.target.value})}
                  className="ms-2"
                  placeholder="URL"
                />
                <Button 
                  variant="primary" 
                  size="sm" 
                  className="ms-2"
                  onClick={handleAddLink}
                >
                  Ajouter
                </Button>
              </div>
            </div>
          ) : (
            <>
              {links.length > 0 ? (
                <ListGroup variant="flush">
                  {links.map((lien, index) => {
                    let icon;
                    if (lien.type.toLowerCase() === 'github') {
                      icon = faGithub;
                    } else if (lien.type.toLowerCase() === 'linkedin') {
                      icon = faLinkedin;
                    } else {
                      icon = faGlobe;
                    }

                    return (
                      <ListGroup.Item key={lien.id || index} className="px-0 py-1 border-0">
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
            </>
          )}
        </Col>
      </Row>
      <br></br>
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
                                            <Nav.Link eventKey="reviews">Avis ({feedbacks ? feedbacks.length : 0})</Nav.Link>
                                        </Nav.Item>
                                    </Nav>
                                </Card.Header>
                                
                                <Card.Body>
                                    <Tab.Content>
                                        <Tab.Pane eventKey="about">
                                            <h4 className="mb-3">Biographie</h4>
                                            {isEditing ? (
                                                <Form.Group controlId="formBio">
                                                    <Form.Control
                                                        as="textarea"
                                                        rows={5}
                                                        name="bio"
                                                        value={formData.bio}
                                                        onChange={handleInputChange}
                                                    />
                                                </Form.Group>
                                            ) : (
                                                <p>{freelancer.bio || 'Aucune bio fournie.'}</p>
                                            )}
                                        </Tab.Pane>
                                        <Tab.Pane eventKey="reviews">
  <h4 className="mb-4">Avis des clients</h4>

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
              <h5>{feedback.senderClient?.nom || 'Anonymous'}</h5>
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
        </>
    );
};