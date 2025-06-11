import React, { useState,useEffect, } from "react";
import { useHistory ,useParams} from "react-router-dom";
import { useMutation } from "@apollo/client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBoxOpen, faCartArrowDown, faChartPie, faChevronDown, faClipboard, faCommentDots, faFileAlt, faPlus, faRocket, faStore,faBriefcase, faUser  } from '@fortawesome/free-solid-svg-icons';
import { ChoosePhotoWidget, ProfileCardWidget } from "../../../components/Widgets";
import { faBell, faCog, faEnvelopeOpen, faSearch, faSignOutAlt, faUserShield } from "@fortawesome/free-solid-svg-icons";
import { faUserCircle } from "@fortawesome/free-regular-svg-icons";
import { 
  faCheckCircle, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
import moment from "moment-timezone";
import Datetime from "react-datetime";
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { Badge,Toast,Col, Row, Card, Form, Button, InputGroup, Nav, Image, Navbar, Dropdown, Container, ListGroup } from '@themesberg/react-bootstrap';
import logo from "../../../assets/img/logo/icon+title(small).png"
import Profile3 from "../../../assets/img/team/profile-picture-3.jpg";
import { CREATE_CANDIDATURE } from "../../../graphql/mutations/candidature";
import NavbarFreelancer from "../../../components/NavbarFreelancer";

export default () => {
const { offreId } = useParams();
const history = useHistory();
const [showToast, setShowToast] = useState(false);
const [toastMessage, setToastMessage] = useState("");
const [toastVariant, setToastVariant] = useState("success");
  const validStartDate = (current) => {
    return current.isSameOrAfter(moment(), "day");
  };
 
 const [experiences, setExperiences] = useState([
    { companyName: "", projectName: "", startDate: "", endDate: "", description: "" }
  ]);
  const [motivation, setMotivation] = useState("");

const [createCandidature] = useMutation(CREATE_CANDIDATURE);

  const handleExperienceChange = (index, field, value) => {
  const updatedExperiences = [...experiences];
  updatedExperiences[index][field] = value;
  setExperiences(updatedExperiences);
};

const prepareExperiences = experiences.map((exp) => ({
  nomSociete: exp.companyName,
  nomProjet: exp.projectName,
  dateDebut: exp.startDate ? new Date(exp.startDate).toISOString() : null,
  dateFin: exp.endDate ? new Date(exp.endDate).toISOString() : null,
  description: exp.description
})
);




  const handleSubmit = async (e) => {
  e.preventDefault();
  const input = {
    motivation,
    statut: "En attente", 
    dateApplication: new Date().toISOString(),
    offerId:parseInt(offreId, 10),
    experiences: prepareExperiences.filter(exp => 
      exp.nomSociete && exp.nomProjet && exp.dateDebut
    )
  };

  try {
    const { data } = await createCandidature({ variables: { input } });
    console.log('Candidature créée :', data);
   
    // Afficher le toast de succès
    setToastMessage("Votre candidature a été envoyée avec succès !");
    setToastVariant("success");
    setShowToast(true);
    
    // Réinitialiser le formulaire si nécessaire
    setMotivation("");
    setExperiences([{ companyName: "", projectName: "", startDate: "", endDate: "", description: "" }]);

     setTimeout(() => {
      history.push("/offre/listeOffreFreelancer");
    }, 500);
  } catch (error) {
    console.error('Erreur lors de la soumission :', error);
     // Afficher le toast d'erreur
    setToastMessage("Erreur lors de l'envoi de la candidature : " + error.message);
    setToastVariant("danger");
    setShowToast(true);
  }
};

  const addExperience = () => {
    setExperiences([...experiences, { companyName: "", projectName: "", startDate: "", endDate: "", description: "" }]);
  };


  return (
    <>
     <NavbarFreelancer></NavbarFreelancer>
      <Toast style={{position: 'fixed', top: '4px', right: '20px', zIndex: 9999}}
        show={showToast} 
        onClose={() => setShowToast(false)} 
        className={`bg-${toastVariant} text-white my-3`}
        delay={500} 
        autohide
      >
        <Toast.Header className={`text-${toastVariant}`} closeButton={false}>
          <FontAwesomeIcon icon={toastVariant === "success" ? faCheckCircle : faExclamationTriangle} />
          <strong className="me-auto ms-2">Notification</strong>
          <small>{new Date().toLocaleTimeString()}</small>
          <Button variant="close" size="xs" onClick={() => setShowToast(false)} />
        </Toast.Header>
        <Toast.Body>
          {toastMessage}
        </Toast.Body>
      </Toast>
      <h1 className="h2 text-center" style={{ marginTop: '20px' }} >Postuler</h1>
      <Row style={{ marginTop: '20px' }} className="justify-content-md-center">
        <Col xs={12} xl={8}>
          <Card border="light" className="bg-white shadow-sm mb-4">
            <Card.Body>
              <Form onSubmit={handleSubmit}>
              {experiences.map((exp, index) => (
                <div key={index}>
                  <div className="d-flex justify-content-between align-items-center mb-4">
                    <h5 className="mb-0">Expérience</h5>
                    {index > 0 && (
                      <Button variant="danger" size="sm" onClick={() => {
                        const newExps = [...experiences];
                        newExps.splice(index, 1);
                        setExperiences(newExps);
                      }}>
                        Supprimer
                      </Button>
                    )}
                  </div> 
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Group id={`companyName-${index}`}>
                          <Form.Label>Nom De La Société</Form.Label>
                          <Form.Control required type="text" placeholder="Nom De La Société"  value={exp.companyName}
                             onChange={(e) => handleExperienceChange(index, "companyName", e.target.value)}/>
                        </Form.Group>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Group id={`projectName-${index}`}>
                          <Form.Label>Nom Du Projet</Form.Label>
                          <Form.Control required type="text" placeholder="Nom Du Projet" value={exp.projectName}
                            onChange={(e) => handleExperienceChange(index, "projectName", e.target.value)}/>
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row className="align-items-center">
                      <Col md={6} className="mb-3">
                        <Form.Group id={`startDate-${index}`}>
                          <Form.Label>Date De Début</Form.Label>
                          <Datetime
                            timeFormat={false}
                            value={exp.startDate}
                            onChange={(date) => handleExperienceChange(index, "startDate", date)}
                             isValidDate={validStartDate}
                             renderInput={(props, openCalendar) => {
                                const isValidDate = moment(exp.startDate).isValid();
                                return (
                                  <InputGroup>
                                    <InputGroup.Text>
                                      <FontAwesomeIcon icon={faCalendarAlt} />
                                    </InputGroup.Text>
                                    <Form.Control
                                      {...props}
                                      value={isValidDate ? moment(exp.startDate).format("MM/DD/YYYY") : ""}
                                      placeholder="Date De Début"
                                      onFocus={openCalendar}
                                     
                                    />
                                  </InputGroup>
                                );
                              }} />
                        </Form.Group>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Group id={`endDate-${index}`}>
                          <Form.Label>Date De Fin</Form.Label>
                          <Datetime
                            timeFormat={false}
                            value={exp.endDate}
                            onChange={(date) => handleExperienceChange(index, "endDate", date)}
                            renderInput={(props, openCalendar) => {
                              const isValidDate = moment(exp.endDate).isValid() && moment(exp.endDate)>=moment(exp.startDate);
                              return (
                                <InputGroup>
                                  <InputGroup.Text>
                                    <FontAwesomeIcon icon={faCalendarAlt} />
                                  </InputGroup.Text>
                                  <Form.Control
                                    {...props}
                                    value={isValidDate ? moment(exp.endDate).format("MM/DD/YYYY") : ""}
                                    placeholder="Date De Fin"
                                    onFocus={openCalendar}
                                  />
                                </InputGroup>
                              );
                            }}
                          />
                        </Form.Group>
                      </Col>
                    </Row>
                    <Row>
                      <Col md={12} className="mb-3">
                        <Form.Group id={`description-${index}`}>
                          <Form.Label>Description</Form.Label>
                          <Form.Control as="textarea" rows="4" placeholder="Description" value={exp.description}
                              onChange={(e) => handleExperienceChange(index, "description", e.target.value)} />
                        </Form.Group>
                      </Col>
                    </Row>
                    </div>
                    ))}
                    <Button variant="primary" onClick={addExperience} className="mt-3">
                <FontAwesomeIcon icon={faPlus} className="me-2" />
                Ajouter une autre expérience
              </Button>

              <h5 className="my-4">Motivation</h5>
              <Row>
                <Col md={12} className="mb-3">
                  <Form.Group>
                    <Form.Label>Motivation</Form.Label>
                    <Form.Control as="textarea" rows="4" placeholder="Motivation" value={motivation}
                        onChange={(e) => setMotivation(e.target.value)}/>
                  </Form.Group>
                </Col>
              </Row>
              <div className="mt-3">
                <Button variant="primary" type="submit">Postuler</Button>
              </div>
                  </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
    </>
  );
};