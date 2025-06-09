import React, { useState } from 'react';
import { Tab, Tabs, Form, Button, Card, Alert, Row, Col,Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faBuilding, faUser, faLink ,faImage,faCommentDots,faGlobe,faMap,faPhoneAlt,faIndustry,faInfoCircle} from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import Select from 'react-select';
import { Link } from 'react-router-dom';
import logo from "../../assets/img/logo/icon+title(small).png"
import { Routes } from "../../routes";





const competencesOptions = [
  { value: 'react', label: 'React' },
  { value: 'node', label: 'Node.js' },
  { value: 'graphql', label: 'GraphQL' }
];

const secteursOptions = [
  { value: 'tech', label: 'Technologie' },
  { value: 'marketing', label: 'Marketing' }
];

const InscriptionForm = ({ userType }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    entreprise: '',
    secteurActivite: '',
    photo:'',
    bio:'',
    nom: '',
    prenom: '',
    competences: [],
    liens: [{ type: '', url: '' }]
  });

  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};
    
    // Validation des champs communs
    if (!formData.email) newErrors.email = 'Email requis';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Email invalide';
    }

    if (!formData.password) newErrors.password = 'Mot de passe requis';
    else if (formData.password.length < 8) {
      newErrors.password = 'Minimum 8 caractères';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    // Validation conditionnelle
    if (userType === 'client') {
      if (!formData.entreprise) newErrors.entreprise = 'Entreprise requise';
      if (!formData.secteurActivite) newErrors.secteurActivite = 'Secteur requis';
    } else {
      if (!formData.nom) newErrors.nom = 'Nom requis';
      if (!formData.prenom) newErrors.prenom = 'Prénom requis';
      if (formData.competences.length === 0) {
        newErrors.competences = 'Au moins une compétence requise';
      }
      if (!formData.photo) newErrors.photo = 'Photo requise';
       if (!formData.photo) newErrors.photo = 'Photo requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Données valides:', {
        ...formData,
        userType
      });
      setSubmitted(true);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addLien = () => {
    setFormData(prev => ({
      ...prev,
      liens: [...prev.liens, { type: '', url: '' }]
    }));
  };

  const removeLien = (index) => {
    const newLiens = [...formData.liens];
    newLiens.splice(index, 1);
    setFormData(prev => ({ ...prev, liens: newLiens }));
  };

  const updateLien = (index, field, value) => {
    const newLiens = [...formData.liens];
    newLiens[index][field] = value;
    setFormData(prev => ({ ...prev, liens: newLiens }));
  };

  if (submitted) {
    return (
      <Alert variant="success" className="text-center">
        <h4>Inscription réussie !</h4>
        <p>Un email de confirmation a été envoyé à {formData.email}</p>
      </Alert>
    );
  }

  return (
  <Col xs={12} className="d-flex align-items-center justify-content-center">
    <Card className="shadow-sm mb-4 mb-lg-0 shadow-soft border rounded border-light p-4 p-lg-5  "style={{backgroundColor :'#2e3650',width: '10000px'}}>
      <Card.Body>
       <div className="d-flex justify-content-center mb-3">
          <Image src={logo} alt="Logo" style={{ height: '80px' ,marginTop:'-25px'}} rounded />
        </div>
        <Form onSubmit={handleSubmit}>
          {/* Champs communs */}
          <Form.Group className="mb-3">
            <Form.Label style={{color :'white' , fontWeight:'bold'}}>
              <FontAwesomeIcon icon={faEnvelope} className="me-2" />
              Email
            </Form.Label>
            <Form.Control
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              isInvalid={!!errors.email}
              required  placeholder="example@company.com"
            />
            <Form.Control.Feedback type="invalid">
              {errors.email}
            </Form.Control.Feedback>
          </Form.Group>

          <Row className="mb-3">
            <Col md={6}>
              <Form.Group>
                <Form.Label style={{color :'white' , fontWeight:'bold'}}>
                  <FontAwesomeIcon icon={faLock} className="me-2" />
                  Mot de passe
                </Form.Label>
                <Form.Control
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  isInvalid={!!errors.password}
                  required  placeholder="Mot De Passe"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.password}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group>
                <Form.Label style={{color :'white' , fontWeight:'bold'}}>
                  <FontAwesomeIcon icon={faLock} className="me-2" />
                  Confirmation
                </Form.Label>
                <Form.Control
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  isInvalid={!!errors.confirmPassword}
                  required placeholder="Confirmer Mot De Passe"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.confirmPassword}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

          {/* Champs spécifiques */}
          {userType === 'client' ? (
            <>
               <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label style={{color :'white' , fontWeight:'bold'}}>
                  <FontAwesomeIcon icon={faBuilding} className="me-2" />
                  Entreprise
                </Form.Label>
                <Form.Control
                  name="entreprise"
                  value={formData.entreprise}
                  onChange={handleChange}
                  isInvalid={!!errors.entreprise}
                  required placeholder="Entreprise"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.entreprise}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label style={{color :'white' , fontWeight:'bold'}}>
                  <FontAwesomeIcon icon={faGlobe} className="me-2" />
                  Site Web
                </Form.Label>
                <Form.Control
                  name="siteweb"
                  value={formData.siteweb}
                  onChange={handleChange}
                  isInvalid={!!errors.siteweb}
                  required placeholder="Site Web"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.siteweb}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
           <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label style={{color :'white' , fontWeight:'bold'}}>
                  <FontAwesomeIcon icon={faMap} className="me-2" />
                  Adresse
                </Form.Label>
                <Form.Control
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleChange}
                  isInvalid={!!errors.adresse}
                  required placeholder="Adresse"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.adresse}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label style={{color :'white' , fontWeight:'bold'}}>
                  <FontAwesomeIcon icon={faPhoneAlt} className="me-2" />
                  N° Téléphone
                </Form.Label>
                <Form.Control
                  name="tel"
                  value={formData.tel}
                  onChange={handleChange}
                  isInvalid={!!errors.tel}
                  required placeholder="N° Téléphone"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.tel}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>

              <Row className="mb-3">
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label style={{color :'white' , fontWeight:'bold'}}><FontAwesomeIcon icon={faIndustry} className="me-2" />Secteur d'activité</Form.Label>
                <Select
                  options={secteursOptions}
                  onChange={(option) => 
                    setFormData(prev => ({ ...prev, secteurActivite: option.value }))
                  }
                  className={errors.secteurActivite ? 'is-invalid' : ''}
                />
                {errors.secteurActivite && (
                  <div className="invalid-feedback d-block">
                    {errors.secteurActivite}
                  </div>
                )}
              </Form.Group>
            </Col>
            <Col md={6}>
              <Form.Group className="mb-3">
                <Form.Label style={{color :'white' , fontWeight:'bold'}}>
                  <FontAwesomeIcon icon={faImage} className="me-2" />
                 Photo
                </Form.Label>
                <Form.Control
                  name="photo_client"
                  value={formData.photo}
                  onChange={handleChange}
                  isInvalid={!!errors.photo}
                  required type='file'
                />
                <Form.Control.Feedback type="invalid">
                  {errors.tel}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
          <Form.Group className="mb-3">
                <Form.Label style={{color :'white' , fontWeight:'bold'}}>
                  <FontAwesomeIcon icon={faInfoCircle} className="me-2" />
                  À Propos
                </Form.Label>
                <Form.Control
                  name="about"
                  value={formData.about}
                  onChange={handleChange}
                  isInvalid={!!errors.about}
                  required
                  as="textarea" rows="4" placeholder="Ecrivez ici..." 
                />
                <Form.Control.Feedback type="invalid">
                  {errors.tel}
                </Form.Control.Feedback>
              </Form.Group>

            </>
          ) : (
            <>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={{color :'white' , fontWeight:'bold'}}>
                      <FontAwesomeIcon icon={faUser} className="me-2" />
                      Prénom
                    </Form.Label>
                    <Form.Control
                      name="prenom"
                      value={formData.prenom}
                      onChange={handleChange}
                      isInvalid={!!errors.prenom}
                       required placeholder="Prénom"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.prenom}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={{color :'white' , fontWeight:'bold'}}>
                      <FontAwesomeIcon icon={faUser} className="me-2" />
                      Nom
                    </Form.Label>
                    <Form.Control
                      name="nom"
                      value={formData.nom}
                      onChange={handleChange}
                      isInvalid={!!errors.nom}
                      required placeholder="Nom"
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.nom}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                
              </Row>
              <Row className="mb-3">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label style={{color :'white' , fontWeight:'bold'}}>
                      <FontAwesomeIcon icon={faImage} className="me-2" />
                      Photo
                    </Form.Label>
                    <Form.Control
                      name="photo"
                      type="file"
                      value={formData.photo}
                      onChange={handleChange}
                      isInvalid={!!errors.photo}
                      required 
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.photo}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                </Row>
                <Row className="mb-3">
                <Col md={12}>
                  <Form.Group>
                    <Form.Label style={{color :'white' , fontWeight:'bold'}}>
                      <FontAwesomeIcon icon={faCommentDots} className="me-2" />
                      Bio
                    </Form.Label>
                    <Form.Control
                      name="bio"
                      as="textarea" rows="4" placeholder="Ecrire votre bio..."
                      value={formData.bio}
                      onChange={handleChange}
                      isInvalid={!!errors.bio}
                      required 
                    />
                    <Form.Control.Feedback type="invalid">
                      {errors.bio}
                    </Form.Control.Feedback>
                  </Form.Group>
                </Col>
                </Row>
              <Form.Group className="mb-3">
                <Form.Label style={{color :'white' , fontWeight:'bold'}}>Compétences</Form.Label>
                <Select
                  isMulti
                  options={competencesOptions}
                  onChange={(options) => 
                    setFormData(prev => ({
                      ...prev,
                      competences: options.map(opt => opt.value)
                    }))
                  }
                  className={errors.competences ? 'is-invalid' : ''}
                />
                {errors.competences && (
                  <div className="invalid-feedback d-block">
                    {errors.competences}
                  </div>
                )}
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label style={{color :'white' , fontWeight:'bold'}}>
                  <FontAwesomeIcon icon={faLink} className="me-2" />
                  Liens (Portfolio, GitHub, etc.)
                </Form.Label>
                {formData.liens.map((lien, index) => (
                  <div key={index} className="mb-2 d-flex align-items-center">
                    <Form.Select
                      className="me-2"
                      value={lien.type}
                      onChange={(e) => updateLien(index, 'type', e.target.value)}
                    >
                      <option value="">Type</option>
                      <option value="github">GitHub</option>
                      <option value="linkedin">LinkedIn</option>
                      <option value="portfolio">Portfolio</option>
                    </Form.Select>
                    <Form.Control
                      type="url"
                      placeholder="URL"
                      value={lien.url}
                      onChange={(e) => updateLien(index, 'url', e.target.value)}
                    />
                    {formData.liens.length > 1 && (
                      <Button
                        variant="outline-danger"
                        className="ms-2"
                        onClick={() => removeLien(index)}
                      >
                        ×
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  variant="outline-secondary"
                  size="sm"
                  onClick={addLien}
                >
                  + Ajouter un lien
                </Button>
              </Form.Group>
            </>
          )}

          <Button 
            variant="primary" 
            type="submit" 
            className="w-100 mt-3"
            style={{backgroundColor:'#43bcd9' , color:'#2e3650'}}
          >
            S'inscrire
          </Button>
        </Form>
        <div className="d-flex justify-content-center align-items-center mt-4">
                  <span className="fw-normal" style={{color :'white'}}>
                    Vous avez déjà un compte ?
                    <Card.Link as={Link} to={Routes.Signin.path} className="fw-bold" style={{color :'white'}}>
                      {` Cliquez ici pour vous connecter `}
                    </Card.Link>
                  </span>
                </div>
      </Card.Body>
    </Card>
    </Col>
  );
};

const Inscription = () => {
  const [userType, setUserType] = useState('client');

  return (
   <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-lg-8">
          
          <div className="d-flex align-items-center justify-content-between mb-4">
            
            <Tabs
              activeKey={userType}
              onSelect={(k) => setUserType(k)}
              className="mb-0"
            >
              <Tab eventKey="client" title={
                <span>
                  <FontAwesomeIcon icon={faBuilding} className="me-2" />
                  Client
                </span>
              }>
                {/* Le contenu est géré par InscriptionForm */}
              </Tab>
            </Tabs>
            
           <div className="mx-3" style={{width:'455px'}}> 
              <h2 className="text-center" style={{
                marginTop:'24px',
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 600,
                fontSize: '2rem',
                letterSpacing: '0.5px'
              }}>Créer un Compte</h2>
              <h2 className="text-center" style={{
                marginTop:'-5px',
                fontFamily: "'Montserrat', sans-serif",
                fontWeight: 400,
                fontStyle: 'italic',
                fontSize: '1.8rem'
              }}>Chez</h2>
            </div>
            
            <Tabs
              activeKey={userType}
              onSelect={(k) => setUserType(k)}
              className="mb-0"
            >
              <Tab eventKey="freelancer" title={
                <span>
                  <FontAwesomeIcon icon={faUser} className="me-2" />
                  Freelancer
                </span>
              }>
                {/* Le contenu est géré par InscriptionForm */}
              </Tab>
            </Tabs>
          </div>
          
          <InscriptionForm userType={userType} />
        </div>
      </div>
    </div>
  );
};

export default Inscription;