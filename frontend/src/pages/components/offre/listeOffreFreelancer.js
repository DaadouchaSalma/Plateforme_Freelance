import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import { useHistory } from "react-router-dom";
import { Modal } from "react-bootstrap";
import { Nav, Image, Navbar } from '@themesberg/react-bootstrap';
import { Container, Card, Spinner, Alert, Button, Form, Row, Col, Badge } from "@themesberg/react-bootstrap";
import moment from "moment";
import "moment/locale/fr"; 
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import { 
  faSearch, 
  faFilter, 
  faSortAmountDown, 
  faCalendarAlt,
  faDollarSign,
  faTags,
  faCheckCircle,
  faBriefcase
} from "@fortawesome/free-solid-svg-icons";

import logo from "../../../assets/img/logo/icon.png";
moment.locale('fr');

// Requête pour les catégories
const GET_CATEGORIES = gql`
  query {
    getAllCategories {
      id
      title
    }
  }
`;

// Requête pour les offres
const GET_OFFERS = gql`
  query {
    offers {
      id
      title
      description
      budget
      startDate
      endDate
      categorie {
        id
        title
      }
      client {
        nom
        photo
      }
      competences {
        id
        nom
      }
    }
  }
`;

const ListeOffreFreelancer = () => {
  const { loading: catLoading, error: catError, data: catData } = useQuery(GET_CATEGORIES);
  const { loading: offerLoading, error: offerError, data: offerData } = useQuery(GET_OFFERS);
  const history = useHistory();
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  // Filtrer les offres
  useEffect(() => {
    if (offerData?.offers) {
      let result = offerData.offers;
      
      // Filtre par catégorie
      if (selectedCategories.length > 0) {
        result = result.filter(offer => 
          offer.categorie && selectedCategories.includes(offer.categorie.id)
        );
      }
      
      // Filtre par recherche
      if (searchTerm) {
        const term = searchTerm.toLowerCase();
        result = result.filter(offer => 
          offer.title.toLowerCase().includes(term) || 
          offer.description.toLowerCase().includes(term) ||
          (offer.categorie?.title && offer.categorie.title.toLowerCase().includes(term)) ||
          (offer.competences?.some(c => c.nom.toLowerCase().includes(term)))
        );
      }
      
      setFilteredOffers(result);
    }
  }, [selectedCategories, offerData, searchTerm]);

  const handleCategoryChange = (categoryId) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handlePostuler = (offerId) => {
    history.push(`/candidature/${offerId}`);
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
              <Nav.Link href="#home">Accueil</Nav.Link>
              <Nav.Link href="#about">À propos</Nav.Link>
              <Nav.Link href="#contact">Contact</Nav.Link>
            </Nav>
          </Navbar.Collapse>

          <Navbar.Toggle aria-controls="navbar-default-primary" />
        </Container>
      </Navbar>
      
      <Container className="mt-4">
        {/* Titre professionnel avec phrase d'accroche */}
        <div className="text-center mb-4 " style={{ marginTop: '80px' }}>
          <h1 className="text-primary fw-bold mb-3">
            <FontAwesomeIcon icon={faBriefcase} className="me-2" />
            Opportunités Freelance
          </h1>
          <p className="text-muted fs-5" style={{ marginBottom: '50px' }}>
            Trouvez le projet qui correspond à vos compétences et démarrez votre mission
          </p>
        </div>
        
        <Row>
          {/* Colonne Filtres - Élargie et améliorée */}
          <Col md={4} className="mb-4 pe-5">
            <Card className="shadow-sm border-0 rounded-lg overflow-hidden">
              <Card.Header className="bg-primary text-white py-3">
                <div className="d-flex align-items-center">
                  <FontAwesomeIcon icon={faFilter} className="me-2 fs-5" />
                  <h5 className="mb-0 fw-bold">Filtres et Options</h5>
                </div>
              </Card.Header>
              
              <Card.Body>
                {/* Barre de recherche améliorée */}
                <div className="mb-4 position-relative">
                  <div className="position-absolute top-50 start-0 translate-middle-y ms-3">
                    <FontAwesomeIcon icon={faSearch} className="text-muted fs-5" />
                  </div>
                  <Form.Control 
                    type="text" 
                    placeholder="Rechercher des offres..." 
                    className="ps-5 py-2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                
                {/* Statistiques avec style amélioré */}
                <Card className="bg-light mb-4 border-0 shadow-sm">
                  <Card.Body className="p-3">
                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <div className="text-muted small">Offres trouvées</div>
                        <div className="h4 mb-0 fw-bold text-primary">{filteredOffers.length}</div>
                      </div>
                      <div className="bg-primary rounded-circle p-3">
                        <FontAwesomeIcon icon={faCheckCircle} className="text-white fs-4" />
                      </div>
                    </div>
                  </Card.Body>
                </Card>
                
                {/* Filtre par catégorie amélioré */}
                <div className="mb-4">
                  <div className="d-flex align-items-center mb-3">
                    <FontAwesomeIcon icon={faTags} className="text-primary me-2 fs-5" />
                    <h6 className="mb-0 fw-semibold">Filtrer par catégorie</h6>
                  </div>
                  
                  {catLoading && <Spinner animation="border" size="sm" />}
                  {catError && <Alert variant="danger">Erreur : {catError.message}</Alert>}
                  
                  <div className="filter-scroll" style={{ maxHeight: '300px', overflowY: 'auto' }}>
                    {catData?.getAllCategories?.map((category) => (
                      <div key={category.id} className="d-flex align-items-center mb-2">
                        <Form.Check 
                          type="checkbox"
                          id={`category-${category.id}`}
                          checked={selectedCategories.includes(category.id)}
                          onChange={() => handleCategoryChange(category.id)}
                          className="me-3"
                        />
                        <label 
                          htmlFor={`category-${category.id}`} 
                          className="mb-0 cursor-pointer"
                        >
                          {category.title}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Section de tri statique - Design informatif */}
<div className="mb-4">
  <div className="d-flex align-items-center mb-3">
    <FontAwesomeIcon icon={faSortAmountDown} className="text-primary me-2 fs-5" />
    <h6 className="mb-0 fw-semibold">Conseils de tri</h6>
  </div>
  
  <div className="d-grid gap-3">
    <Card className="border-0 shadow-sm bg-light">
      <Card.Body className="p-3">
        <div className="d-flex">
          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
               style={{ width: '30px', height: '30px' }}>
            1
          </div>
          <div>
            <strong className="d-block">Trier par date récente</strong>
            <small className="text-muted">Les nouvelles offres apparaissent en premier</small>
          </div>
        </div>
      </Card.Body>
    </Card>
    
    <Card className="border-0 shadow-sm bg-light">
      <Card.Body className="p-3">
        <div className="d-flex">
          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
               style={{ width: '30px', height: '30px' }}>
            2
          </div>
          <div>
            <strong className="d-block">Trier par budget élevé</strong>
            <small className="text-muted">Les projets les mieux rémunérés en premier</small>
          </div>
        </div>
      </Card.Body>
    </Card>
    
    <Card className="border-0 shadow-sm bg-light">
      <Card.Body className="p-3">
        <div className="d-flex">
          <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
               style={{ width: '30px', height: '30px' }}>
            3
          </div>
          <div>
            <strong className="d-block">Trier par pertinence</strong>
            <small className="text-muted">Basé sur vos compétences et préférences</small>
          </div>
        </div>
      </Card.Body>
    </Card>
  </div>
  
  <div className="mt-3 text-center">
    <small className="text-muted">
      <FontAwesomeIcon icon={faInfoCircle} className="me-1" />
      Ces options seront bientôt disponibles
    </small>
  </div>
</div>
                
                {/* Conseils pour les freelances amélioré */}
                <Card className="border-0 bg-light-subtle mt-4">
                  <Card.Body className="p-3">
                    <div className="d-flex align-items-center">
                      <FontAwesomeIcon icon={faCalendarAlt} className="text-primary me-2 fs-5" />
                      <div>
                        <h6 className="text-primary mb-1">Conseil professionnel</h6>
                        <p className="small mb-0">
                          Postulez rapidement pour augmenter vos chances d'être sélectionné !
                        </p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Card.Body>
            </Card>
          </Col>

          {/* Colonne Offres - Légèrement réduite */}
          <Col md={8} className="mb-4 ps-3">
            {/* En-tête des offres */}
            <div className="d-flex justify-content-between align-items-center mb-4 p-3 bg-light rounded-lg">
              <h5 className="text-dark mb-0">
                <span className="fw-bold text-primary">{filteredOffers.length}</span> offres disponibles
              </h5>
              <div className="text-muted small">
                Dernière mise à jour: {moment().format("DD MMM YYYY")}
              </div>
            </div>
            
            {offerLoading && <Spinner animation="border" variant="primary" className="d-block mx-auto my-4" />}
            {offerError && <Alert variant="danger">Erreur : {offerError.message}</Alert>}

            {filteredOffers.length === 0 ? (
              <Card className="text-center p-4 border-0 shadow-sm">
                <FontAwesomeIcon icon={faSearch} className="text-muted mb-3" size="2x" />
                <h4 className="text-muted mb-3">Aucune offre trouvée</h4>
                <p className="text-muted mb-4">Essayez d'élargir vos critères de recherche</p>
                <Button 
                  variant="outline-primary"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategories([]);
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              </Card>
            ) : (
              <Row>
                {filteredOffers.map((offer) => (
                  <Col key={offer.id} className="mb-4">
                    <Card className="shadow-sm h-100 border-0 rounded-lg overflow-hidden"style={{width:"750px"}}>
                      <Card.Body>
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div className="d-flex align-items-center">
                            <div className="bg-light rounded-circle overflow-hidden d-flex align-items-center justify-content-center me-2" 
                                style={{ width: '40px', height: '40px', flexShrink: 0 }}>
                              <img 
                                src={logo}
                                alt={offer.client?.nom || "Client"} 
                                className="w-100 h-100 object-fit-cover"
                              />
                            </div>
                            <span className="fw-semibold">{offer.client?.nom || "Anonyme"}</span>
                          </div>
                          <div className="text-muted small text-end">
                            <div>Publié {moment(offer.startDate).locale('fr').fromNow()}</div>
                          </div>
                        </div>

                        <Card.Title className="mb-2">{offer.title}</Card.Title>
                        
                        {/* Catégorie */}
                        <div className="mb-2">
                          <strong className="me-1">Catégorie:</strong>
                          <Badge bg="light" text="dark" className="me-1">
                            {offer.categorie?.title || "Sans catégorie"}
                          </Badge>
                        </div>
                        
                        {/* Compétences */}
                        <div className="mb-3 border-top pt-2">
                          <strong className="d-block mb-2">Compétences requises</strong>
                          <div className="d-flex flex-wrap">
                            {offer.competences?.length > 0 ? (
                              offer.competences?.map(competence => (
                                <div 
                                  key={competence.id} 
                                  className="me-2 mb-2 text-center"
                                 
                                  style={{ 
                                    minWidth: '120px',
                                    backgroundColor: '#1B998B', 
                                    color: 'white',
                                    borderRadius: '50px',
                                    padding: '3px 10px', 
                                    fontWeight: '500',
                                    height: '26px', 
                                    lineHeight: '20px', 
                                    fontSize: '0.85rem' 
                                  }}
                                >
                                  {competence.nom}
                                </div>
                              ))
                            ) : (
                              <span className="text-muted small">Aucune compétence spécifiée</span>
                            )}
                          </div>
                        </div>

                        <Card.Text className="text-truncate mb-3">
                          {offer.description}
                        </Card.Text>

                        <div className="d-flex justify-content-between align-items-center mt-auto">
                          <div className="fw-bold fs-5 d-flex align-items-center">
                            <FontAwesomeIcon icon={faDollarSign} className="me-2 text-success" />
                            {offer.budget} TND
                          </div>
                          <div>
                            <Button 
                              variant="outline-gray" 
                              className="me-2"
                              onClick={() => setSelectedOffer(offer)}
                            >
                              Détails
                            </Button>
                            <Button 
                              variant="primary"
                              onClick={() => handlePostuler(offer.id)}
                            >
                              Postuler
                            </Button>
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            )}
          </Col>
        </Row>

        {/* Modal Détails amélioré */}
        <Modal show={!!selectedOffer} onHide={() => setSelectedOffer(null)} centered size="lg">
          <Modal.Header closeButton className="bg-primary text-white py-3">
            <Modal.Title className="fw-bold">{selectedOffer?.title}</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-4">
            <div className="d-flex justify-content-between mb-3">
              <div>
                <strong style={{fontWeight:"bolder"}} >Client:</strong> {selectedOffer?.client?.nom || "Anonyme"}
              </div>
              <div>
                <strong style={{fontWeight:"bolder"}}>Budget:</strong> {selectedOffer?.budget} TND
              </div>
            </div>
            
            <div className="mb-3">
              <strong style={{fontWeight:"bolder"}}>Catégorie:</strong> 
              <Badge bg="light" text="dark" className="ms-2">
                {selectedOffer?.categorie?.title || "Sans catégorie"}
              </Badge>
            </div>
            
            <div className="mb-3">
              <strong className="d-block mb-2" style={{fontWeight:"bolder"}}>Compétences requises</strong>
              <div className="d-flex flex-wrap">
                {selectedOffer?.competences?.length > 0 ? (
                  selectedOffer.competences.map(competence => (
                    <div 
                      key={competence.id} 
                      className="me-2 mb-2 text-center"
                      style={{ 
                        minWidth: '120px',
                        backgroundColor: '#1B998B', 
                        color: 'white',
                        borderRadius: '50px',
                        padding: '3px 10px',
                        fontWeight: '500',
                        height: '26px',
                        lineHeight: '20px',
                        fontSize: '0.85rem'
                      }}
                    >
                      {competence.nom}
                    </div>
                  ))
                ) : (
                  <span className="text-muted small">Aucune compétence spécifiée</span>
                )}
              </div>
            </div>
            
            <div className="mb-3">
              <strong style={{fontWeight:"bolder"}}>Description:</strong>
              <p className="mt-2">{selectedOffer?.description}</p>
            </div>
            
            <div className="d-flex justify-content-between">
              <div>
                <strong style={{fontWeight:"bolder"}}>Début:</strong> {moment(selectedOffer?.startDate).format("DD/MM/YYYY")}
              </div>
              <div>
                <strong style={{fontWeight:"bolder"}}>Fin:</strong> {moment(selectedOffer?.endDate).format("DD/MM/YYYY")}
              </div>
            </div>
          </Modal.Body>
          <Modal.Footer className="py-3">
            <Button variant="outline-gray" onClick={() => setSelectedOffer(null)}>
              Fermer
            </Button>
            <Button variant="primary" onClick={() => handlePostuler(selectedOffer?.id)}>
              Postuler maintenant
            </Button>
          </Modal.Footer>
        </Modal>
      </Container>

      {/* Style supplémentaire */}
      <style jsx>{`
        .filter-scroll::-webkit-scrollbar {
          width: 6px;
        }
        
        .filter-scroll::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 10px;
        }
        
        .filter-scroll::-webkit-scrollbar-thumb {
          background: #c5c5c5;
          border-radius: 10px;
        }
        
        .filter-scroll::-webkit-scrollbar-thumb:hover {
          background: #a8a8a8;
        }
        
        .rounded-lg {
          border-radius: 0.75rem !important;
        }
        
        .bg-light-subtle {
          background-color: #f8f9fa !important;
        }
        
        .navbar-theme-primary {
          box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
        }
        
        .cursor-pointer {
          cursor: pointer;
        }
      `}</style>
    </>
  );
};

export default ListeOffreFreelancer;