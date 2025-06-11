import React,{ useState } from 'react';
import { useQuery } from '@apollo/client';
import { gql} from 'graphql-tag';
import { useMutation } from "@apollo/client";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faUsers, 
  faUserTie, 
  faBriefcase, 
  faFileAlt, 
  faChartPie,
  faStar,
  faPlus,
  faChartBar,
  faCalendarWeek,
  faEllipsisV
} from '@fortawesome/free-solid-svg-icons';

import { Col, Row, Card, ProgressBar, Dropdown, Button, ButtonGroup,Modal, Form } from '@themesberg/react-bootstrap';

// Requêtes GraphQL (inchangé)
const GET_STATS = gql`
  query {
    getStats {
      clients
      freelancers
      activeOffers
      candidatures
    }
    getOffresParCategorie {
      categorie
      nombre
    }
    getTopFreelancers {
      nom
      prenom
      photo
      nombre
    }
    getCompetenceStats {
      nom
      count
      percentage
    }
    getActivityByWeekday {
      day
      offers
      candidatures
    }
    getClientStatsByDomaine {
      domaine
      totalClients
    }
  }
`;
const CREATE_CATEGORIE = gql`
  mutation CreateCategorie($title: String!) {
    createCategorie(title: $title) {
      id
      title
    }
  }
`;
const CREATE_COMPETENCE = gql`
  mutation CreateCompetence($nom: String!) {
    createCompetence(nom: $nom) {
      id
      nom
    }
  }
`;
// Composant CounterWidget amélioré
const CounterWidget = ({ category, title, icon, iconColor, color }) => {
  return (
    <Card className="shadow-sm border-0" style={{ borderRadius: '12px' }}>
      <Card.Body className="p-3">
        <div className="d-flex justify-content-between align-items-center">
          <div>
            <h6 className="text-uppercase text-muted mb-1 small">{category}</h6>
            <h3 className="mb-0 fw-bold">{title}</h3>
          </div>
          <div className={`icon icon-shape bg-${color}-light text-${color} rounded-circle p-3`}>
            <FontAwesomeIcon icon={icon} className="fa-lg" />
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

// Composant PieChartWidget amélioré
const PieChartWidget = ({ title, data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card className="shadow-sm border-0" style={{ borderRadius: '14px' }}>
      <Card.Body style={{ padding: '1.5rem' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0 fw-semibold" style={{ fontSize: '1.25rem', color: '#2c3e50' }}>
            {title}
          </h5>
          <Dropdown>
            <Dropdown.Toggle variant="link" className="text-muted p-0" style={{ fontSize: '1.1rem' }}>
              <FontAwesomeIcon icon={faEllipsisV} />
            </Dropdown.Toggle>
          </Dropdown>
        </div>

        <div className="d-flex flex-wrap justify-content-center gap-4">
          {data.map((item, index) => (
            <div key={index} className="text-center" style={{ minWidth: 90 }}>
              <div
                className="rounded-circle d-flex align-items-center justify-content-center shadow"
                style={{
                  width: 56,
                  height: 56,
                  background: `linear-gradient(145deg, ${item.color}cc, ${item.color})`,
                  color: 'white',
                  boxShadow: `0 6px 10px ${item.color}66`,
                  fontWeight: '700',
                  fontSize: '1.1rem',
                  userSelect: 'none',
                  margin: '0 auto',
                }}
              >
                {Math.round((item.value / total) * 100)}%
              </div>
              <div className="mt-2" style={{ fontSize: '0.9rem', fontWeight: '600', color: '#34495e' }}>
                {item.label}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#7f8c8d' }}>{item.value} offres</div>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};


// Composant BarChartWidget amélioré (Activité Hebdomadaire)
const BarChartWidget = ({ title, data, labels, seriesNames }) => {
  const maxValue = Math.max(...data.flat());

  return (
    <Card className="border-0" style={{ borderRadius: 12, backgroundColor: '#fff' }}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0 fw-bold" style={{ color: '#222' }}>{title}</h5>
          <Dropdown>
            <Dropdown.Toggle variant="link" className="text-muted p-0">
              <FontAwesomeIcon icon={faEllipsisV} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>Cette semaine</Dropdown.Item>
              <Dropdown.Item>Ce mois</Dropdown.Item>
              <Dropdown.Item>Cette année</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div>
          {labels.map((label, i) => (
            <div key={i} className="mb-3">
              <div className="d-flex justify-content-between align-items-center mb-1">
                <span className="small fw-semibold" style={{ color: '#2c3e50' }}>{label}</span>
                <span className="small fw-bold" style={{ color: '#2c3e50' }}>
                  <span>{data[0][i]}</span> • <span>{data[1][i]}</span>
                </span>
              </div>

              <div style={{ display: 'flex', height: 12, borderRadius: 6, overflow: 'hidden', backgroundColor: '#eee' }}>
                <div 
                  style={{
                    width: `${(data[0][i] / maxValue) * 100}%`,
                    backgroundColor: '#2c3e50',
                    transition: 'width 0.3s ease',
                  }}
                />
                <div 
                  style={{
                    width: `${(data[1][i] / maxValue) * 100}%`,
                    backgroundColor: '#2c3e50',
                    opacity: 0.7,
                    transition: 'width 0.3s ease',
                  }}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="d-flex justify-content-center mt-4" style={{ gap: 24 }}>
          {seriesNames.map((name, idx) => (
            <div key={idx} className="d-flex align-items-center" style={{ gap: 8 }}>
              <div style={{
                width: 14,
                height: 14,
                borderRadius: '50%',
                backgroundColor: '#2c3e50',
                opacity: idx === 0 ? 1 : 0.7,
              }} />
              <span className="small fw-bold" style={{ color: '#2c3e50' }}>{name}</span>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};




// Composant TopFreelancersWidget amélioré
const TopFreelancersWidget = ({ title, data }) => {
  return (
    <Card className="shadow-sm border-0" style={{ borderRadius: '14px', padding: '4px' }}>
      <Card.Body style={{ padding: '1.5rem' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0 fw-semibold" style={{ fontSize: '1.2rem', color: '#2e2e2e' }}>{title}</h5>
          <Dropdown>
            <Dropdown.Toggle variant="link" className="text-muted p-0" style={{ fontSize: '1.1rem' }}>
              <FontAwesomeIcon icon={faEllipsisV} />
            </Dropdown.Toggle>
          </Dropdown>
        </div>

        <div className="d-flex flex-column gap-3">
          {data.map((freelancer, index) => (
            <div
              key={index}
              className="d-flex align-items-center justify-content-between p-2"
              style={{
                height:'64px',
                backgroundColor: '#f8f9fa',
                borderRadius: '10px',
                boxShadow: 'inset 0 0 1px rgba(0,0,0,0.05)',
              }}
            >
              <div className="d-flex align-items-center">
                <div className="position-relative me-3">
                  {freelancer.photo ? (
                    <img
                      src={freelancer.photo}
                      alt={freelancer.prenom}
                      className="rounded-circle shadow-sm"
                      width="48"
                      height="48"
                      style={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <div
                      className="bg-light rounded-circle d-flex align-items-center justify-content-center shadow-sm"
                      style={{ width: '48px', height: '48px' }}
                    >
                      <FontAwesomeIcon icon={faUserTie} className="text-muted" />
                    </div>
                  )}
                  {index < 3 && (
                    <div className="position-absolute top-0 start-100 translate-middle">
                      <FontAwesomeIcon icon={faStar} className="text-warning" />
                    </div>
                  )}
                </div>
                <div>
                  <div className="fw-semibold" style={{ fontSize: '1rem', color: '#333' }}>
                    {freelancer.prenom} {freelancer.nom}
                  </div>
                  <div className="text-muted" style={{ fontSize: '0.875rem' }}>
                    {freelancer.nombre} mission{freelancer.nombre > 1 ? 's' : ''}
                  </div>
                </div>
              </div>
              <div
                className="badge bg-primary bg-opacity-10 text-white rounded-pill px-2"
                style={{
                  backgroundColor: 'rgba(78, 115, 223, 0.15)',
                  color: '#4e73df',
                  fontWeight: 600,
                  fontSize: '0.85rem',
                  minWidth: 70,
                  textAlign: 'center',
                }}
              >
                Top {index + 1}
              </div>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};


// Composant CompetenceStatsWidget amélioré
const CompetenceStatsWidget = ({ title, data }) => {
  return (
    <Card className="shadow-sm border-0" style={{ borderRadius: 12 }}>
      <Card.Body style={{ padding: '1.5rem' }}>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5
            className="mb-0"
            style={{
              fontWeight: 700,
              fontSize: '1.25rem',
              color: '#2c3e50',
              letterSpacing: '0.02em',
            }}
          >
            {title}
          </h5>
          <Dropdown>
            <Dropdown.Toggle
              variant="link"
              className="text-muted p-0"
              style={{ fontSize: '1.2rem', lineHeight: 1 }}
            >
              <FontAwesomeIcon icon={faEllipsisV} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>Actualiser</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        {data.map((competence, index) => (
          <div key={index} className="mb-4">
            <div
              className="d-flex justify-content-between align-items-center mb-2"
              style={{ fontWeight: 600, fontSize: '0.95rem', color: '#34495e' }}
            >
              <span>{competence.nom}</span>
              <span style={{ color: '#3a87ad' }}>{competence.percentage.toFixed(1)}%</span>
            </div>
            <div
              style={{
                height: 10,
                borderRadius: 5,
                backgroundColor: '#e1e7ed',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${competence.percentage}%`,
                  height: '100%',
                  backgroundColor: '#3a87ad',
                  borderRadius: 5,
                  transition: 'width 0.3s ease-in-out',
                }}
              />
            </div>
            <div
              className="text-muted"
              style={{ fontSize: '0.85rem', marginTop: 6, letterSpacing: '0.02em' }}
            >
              {competence.count} freelancers
            </div>
          </div>
        ))}
      </Card.Body>
    </Card>
  );
};



// Composant DomaineStatsWidget amélioré (Clients par Domaine)
const DomaineStatsWidget = ({ title, data }) => {
  const colors = ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b', '#858796'];

  return (
    <Card className="border-0" style={{ borderRadius: 12, backgroundColor: '#fff', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="mb-0 fw-bold" style={{ color: '#222' }}>{title}</h5>
          <Dropdown>
            <Dropdown.Toggle variant="link" className="text-muted p-0">
              <FontAwesomeIcon icon={faEllipsisV} />
            </Dropdown.Toggle>
            <Dropdown.Menu>
              <Dropdown.Item>Voir tout</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </div>

        <div className="row g-3">
          {data.map((domaine, index) => (
            <div key={index} className="col-6">
              <div 
                className="p-3 rounded" 
                style={{
                  backgroundColor: '#f8f9fa',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  height: '100%',
                  boxShadow: 'inset 0 0 6px rgba(0,0,0,0.03)'
                }}
              >
                <div className="d-flex align-items-center mb-2">
                  <div 
                    className="rounded-circle me-3" 
                    style={{
                      width: 14, 
                      height: 14, 
                      backgroundColor: colors[index % colors.length],
                      flexShrink: 0
                    }}
                  />
                  <div className="fw-bold text-truncate" style={{ fontSize: '1rem', color: '#2c3e50' }}>
                    {domaine.domaine}
                  </div>
                </div>

                <div className="d-flex align-items-baseline justify-content-between">
                  <div className="text-primary fw-bold" style={{ fontSize: '1.25rem' }}>
                    {domaine.totalClients}
                  </div>
                  <div className="small text-muted" style={{ fontWeight: 600 }}>
                    clients
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </Card.Body>
    </Card>
  );
};


export default function Dashboard() {
    const [showCreateModal, setShowCreateModal] = useState(false);
  const [categorieTitle, setCategorieTitle] = useState("");
  const [showCompetenceModal, setShowCompetenceModal] = useState(false);
  const [competenceNom, setCompetenceNom] = useState("");

  const [createCategorie] = useMutation(CREATE_CATEGORIE, {
    onCompleted: () => {
      setShowCreateModal(false);
      setCategorieTitle("");
    },
  });
const [createCompetence] = useMutation(CREATE_COMPETENCE, {
    onCompleted: () => {
      setShowCompetenceModal(false);
      setCompetenceNom("");
    },
  });
  const handleShowModal = () => setShowCompetenceModal(true);
  const handleCloseModal = () => setShowCompetenceModal(false);
  const handleAddCompetence = async () => {
    if (competenceNom.trim() === "") return;
    await createCompetence({ variables: { nom: competenceNom } });
  };

  const handleShowCreateModal = () => setShowCreateModal(true);
  const handleCloseCreateModal = () => setShowCreateModal(false);

  const handleAddCategorie = async () => {
    if (categorieTitle.trim() === "") return;
    await createCategorie({ variables: { title: categorieTitle } });
  };

  const { loading, error, data } = useQuery(GET_STATS);
  
  if (loading) return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Chargement...</span>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="alert alert-danger m-4">
      Erreur : {error.message}
    </div>
  );
  
  const stats = data.getStats;
  const offresParCategorie = data.getOffresParCategorie;
  const topFreelancers = data.getTopFreelancers;
  const competenceStats = data.getCompetenceStats;
  const weeklyActivity = data.getActivityByWeekday;
  const domaineStats = data.getClientStatsByDomaine;
  
  // Préparer les données pour les graphiques
  const offresCategorieData = offresParCategorie.map((item, index) => ({
    label: item.categorie,
    value: item.nombre,
    color: ['#4e73df', '#1cc88a', '#36b9cc', '#f6c23e', '#e74a3b'][index % 5]
  }));
  
  const weeklyActivityData = {
    labels: weeklyActivity?.map(item => item.day) ?? [],
    data: [
      weeklyActivity?.map(item => item.offers) ?? [],
      weeklyActivity?.map(item => item.candidatures) ?? []
    ],
    seriesNames: ['Offres', 'Candidatures']
  };
  const getCurrentDate = () => {
  const now = new Date();
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  return now.toLocaleDateString('fr-FR', options);
};
  return (
    <>
    <div className="py-4 px-3 bg-light">
    <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pb-4">
      <div>
        <h1 className="h3 fw-bold mb-1">Tableau de Bord Admin</h1>
        <p className="text-muted mb-0">Aperçu des statistiques et activités</p>
        <div className="d-flex align-items-center mt-2">
          <FontAwesomeIcon icon={faCalendarWeek} className="text-primary me-2" />
          <span className="text-sm text-muted">{getCurrentDate()}</span>
        </div>
      </div>
      
      <div className="d-flex gap-2">
        <ButtonGroup>
          <Button variant="primary" size="sm" className="d-flex align-items-center" onClick={handleShowCreateModal}>
        <FontAwesomeIcon icon={faPlus} className="me-2" /> Catégorie
      </Button>
          <Button variant="success" size="sm" className="d-flex align-items-center" onClick={handleShowModal}>
        <FontAwesomeIcon icon={faPlus} className="me-2" /> Compétence
      </Button>
        </ButtonGroup>
        
        
        
      </div>
    </div>
    
    {/* Statistiques principales avec style amélioré */}
    <Row className="mb-4 g-3">
      {[
        { category: "Clients", value: stats.clients, icon: faUsers, color: "primary" },
        { category: "Freelancers", value: stats.freelancers, icon: faUserTie, color: "success" },
        { category: "Offres Actives", value: stats.activeOffers, icon: faBriefcase, color: "info" },
        { category: "Candidatures", value: stats.candidatures, icon: faFileAlt, color: "warning" }
      ].map((item, index) => (
        <Col xs={12} sm={6} lg={3} key={index}>
          <Card className="bg-white shadow-sm border-0 rounded-lg overflow-hidden h-100">
            <Card.Body className="p-3">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <h6 className="text-uppercase text-muted mb-1">{item.category}</h6>
                  <h3 className="fw-bold mb-0">{item.value}</h3>
                </div>
                <div className={`icon-shape bg-${item.color}-light text-${item.color} rounded-circle p-3`}>
                  <FontAwesomeIcon icon={item.icon} size="lg" />
                </div>
              </div>
              <div className="mt-2">
                <ProgressBar 
                  now={index === 0 ? 75 : index === 1 ? 60 : index === 2 ? 85 : 40} 
                  variant={item.color} 
                  className="progress-thin"
                />
              </div>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
      {/* Section principale */}
      <Row className="g-3">
        {/* Colonne gauche */}
        <Col lg={8}>
          <Row className="g-3">
            {/* Activité hebdomadaire */}
            <Col xs={12}>
              <BarChartWidget 
                title="Activité Hebdomadaire"
                data={weeklyActivityData.data}
                labels={weeklyActivityData.labels}
                seriesNames={weeklyActivityData.seriesNames}
              />
            </Col>
            
            {/* Compétences populaires */}
            
            <Col xs={12}>
              <DomaineStatsWidget 
                title="Clients par Domaine" 
                data={domaineStats} 
              />
            </Col>
          </Row>
        </Col>
        
        {/* Colonne droite */}
        <Col lg={4}>
          <Row className="g-3">
            {/* Top Freelancers */}
            <Col xs={12}>
              <TopFreelancersWidget 
                title="Top Freelancers" 
                data={topFreelancers} 
              />
            </Col>
            
            {/* Offres par catégorie */}
            <Col xs={12}>
              <PieChartWidget 
                title="Offres par Catégorie" 
                data={offresCategorieData} 
              />
            </Col>
            
            {/* Clients par domaine */}
            <Col xs={12}>
              <CompetenceStatsWidget 
                title="Compétences des Freelancers" 
                data={competenceStats} 
              />
            </Col>
            
          </Row>
        </Col>
      </Row>
    </div>
    <Modal show={showCreateModal} onHide={handleCloseCreateModal} dialogClassName="modal-top">
        <Modal.Header closeButton>
          <Modal.Title>Ajouter une catégorie</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Titre de la catégorie</Form.Label>
            <Form.Control
              type="text"
              placeholder="Nom de la catégorie"
              value={categorieTitle}
              onChange={(e) => setCategorieTitle(e.target.value)}
            />
          </Form.Group>
          {error && <p className="text-danger mt-2 small">{error.message}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseCreateModal}>
            Annuler
          </Button>
          <Button variant="primary" onClick={handleAddCategorie} disabled={loading}>
            {loading ? "Ajout en cours..." : "Ajouter"}
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal show={showCompetenceModal} onHide={handleCloseModal} dialogClassName="modal-top">
        <Modal.Header closeButton>
          <Modal.Title>Ajouter une compétence</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Nom de la compétence</Form.Label>
            <Form.Control
              type="text"
              placeholder="Ex : React, Photoshop..."
              value={competenceNom}
              onChange={(e) => setCompetenceNom(e.target.value)}
            />
          </Form.Group>
          {error && <p className="text-danger mt-2 small">{error.message}</p>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Annuler
          </Button>
          <Button variant="success" onClick={handleAddCompetence} disabled={loading}>
            {loading ? "Ajout en cours..." : "Ajouter"}
          </Button>
        </Modal.Footer>
      </Modal>
      </>
  );
}