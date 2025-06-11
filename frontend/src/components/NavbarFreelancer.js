 import React, { useState,useEffect, } from "react";
 import { useHistory ,useParams} from "react-router-dom";
 import { useMutation,useQuery } from "@apollo/client";
 import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
 import { faBoxOpen, faCartArrowDown, faChartPie, faChevronDown, faClipboard, faCommentDots, faFileAlt, faPlus, faRocket, faStore,faBriefcase, faUser  } from '@fortawesome/free-solid-svg-icons';
//  import { ChoosePhotoWidget, ProfileCardWidget } from "../../../components/Widgets";
 import { faBell, faCog, faEnvelopeOpen, faSearch, faSignOutAlt, faUserShield } from "@fortawesome/free-solid-svg-icons";
 import { faUserCircle } from "@fortawesome/free-regular-svg-icons";
 import { 
   faCheckCircle, faExclamationTriangle } from "@fortawesome/free-solid-svg-icons";
 import moment from "moment-timezone";
 import Datetime from "react-datetime";
 import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
 import { Badge,Toast,Col, Row, Card, Form, Button, InputGroup, Nav, Image, Navbar, Dropdown, Container, ListGroup } from '@themesberg/react-bootstrap';
 import logo from "../assets/img/logo/icon+title(small).png"
//  import Profile3 from "../../../assets/img/team/profile-picture-3.jpg";
 import {GET_CURRENT_FREELANCER} from "../graphql/mutations/freelancer"
 
 
 export default () => {
    const [notificationsCount, setNotificationsCount] = useState(3);
const history = useHistory();

    const handleLogout = () => {
  localStorage.removeItem('token');   
  history.push('/examples/sign-in');           
};
    
 const { data, loading, error } = useQuery(GET_CURRENT_FREELANCER);
console.log('data', data);
console.log('error', error);
  const freelancer = data?.getCurrentFreelancer;
  console.log("freelancer",freelancer)
  const profilePhoto = freelancer?.photo || null;
  
 return (
    <>
      <Navbar variant="dark" expand="lg"  className="navbar-theparent  shadow-sm" style={{backgroundColor:'#2e3650'}}>
      <Container fluid>
        <Navbar.Brand href="/offre/listeOffreFreelancer" className="me-lg-5">
          <Image src={logo} height={40} />
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="#/offre/listeOffreFreelancer" className="d-flex align-items-center">
              <FontAwesomeIcon icon={faBriefcase} className="me-2" />
              Offres
              {/* <Badge bg="primary" pill className="ms-2">12</Badge> */}
            </Nav.Link>
            
            <Nav.Link href="#/candidature/listF" className="d-flex align-items-center">
              <FontAwesomeIcon icon={faFileAlt} className="me-2" />
              Mes Candidatures
            </Nav.Link>
          </Nav>

          <Nav className="align-items-center">
            {/* <Dropdown as={Nav.Item}>
              <Dropdown.Toggle as={Nav.Link} className="pt-1 px-0">
                <div className="d-flex align-items-center">
                  <FontAwesomeIcon icon={faBell} className="me-2" />
                  {notificationsCount > 0 && (
                    <Badge bg="danger" pill className="position-absolute top-0 start-100 translate-middle">
                      {notificationsCount}
                    </Badge>
                  )}
                </div>
              </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu-end mt-2 shadow-sm">
                <Dropdown.Item className="fw-bold">
                  Notifications ({notificationsCount})
                </Dropdown.Item>
                <Dropdown.Divider />
                <Dropdown.Item>
                  <small>Nouvelle offre correspondant à votre profil</small>
                </Dropdown.Item>
                <Dropdown.Item>
                  <small>Votre candidature a été acceptée</small>
                </Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown> */}
        <Dropdown as={Nav.Item} style={{marginRight:'30px'}}>
          <Dropdown.Toggle as={Nav.Link} className="pt-1 px-0">
            <div className="d-flex align-items-center">
              {profilePhoto ? (
                <Image 
                  src={"http://localhost:3000/uploads/"+profilePhoto} 
                  roundedCircle 
                  width={32}
                  height={32}
                  className="me-2 object-fit-cover"
                  alt={`${freelancer?.prenom} ${freelancer?.nom}`}
                />
              ) : (
                <div className="avatar avatar-sm rounded-circle me-2 bg-primary text-white d-flex align-items-center justify-content-center">
                  <FontAwesomeIcon icon={faUser} />
                </div>
              )}
              <span className="d-none d-lg-inline">
                {freelancer ? `${freelancer.prenom} ${freelancer.nom}` : 'Mon Profil'}
              </span>
            </div>
          </Dropdown.Toggle>
              <Dropdown.Menu className="dropdown-menu-end mt-2 shadow-sm">
                <Dropdown.Header className="fw-bold">
                  Compte Freelancer
                </Dropdown.Header>
                <Dropdown.Item href="#/freelancer/update">
                  <FontAwesomeIcon icon={faUser} className="me-2" />
                  Profil
                </Dropdown.Item>
                {/* <Dropdown.Item href="/parametres">
                  <FontAwesomeIcon icon={faCog} className="me-2" />
                  Paramètres
                </Dropdown.Item> */}
                <Dropdown.Divider />
                <Dropdown.Item onClick={handleLogout} style={{ cursor: 'pointer' }}>
                  <FontAwesomeIcon icon={faSignOutAlt} className="me-2" />
                  Déconnexion
                </Dropdown.Item>
              </Dropdown.Menu>
        </Dropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </>
    )
 }