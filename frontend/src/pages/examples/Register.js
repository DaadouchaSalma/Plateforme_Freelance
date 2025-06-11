import React, { useState } from 'react';
import { useMutation ,useQuery } from '@apollo/client';
import { Tab, Tabs, Form, Button, Card, Alert, Row, Col,Image } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock, faBuilding, faUser, faLink ,faImage,faCommentDots,faGlobe,faMap,faPhoneAlt,faIndustry,faInfoCircle,faLightbulb,faMapMarkedAlt, faMailBulk } from '@fortawesome/free-solid-svg-icons';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import Select from 'react-select';
import { Link } from 'react-router-dom';
import logo from "../../assets/img/logo/icon+title(small).png"
import { Routes } from "../../routes";
import { REGISTER_FREELANCER } from "../../../src/graphql/mutations/freelancer";
import { REGISTER_CLIENT } from "../../../src/graphql/mutations/client";

import { GET_ALL_COMPETENCES } from "../../../src/graphql/queries/getallcompetances";
import { useHistory } from 'react-router-dom';

const secteursOptions = [
  { value: 'Développement logiciel', label: 'Développement logiciel' },
  { value: 'Marketing digital', label: 'Marketing digital' },
  { value: 'Design graphique', label: 'Design graphique' },
  { value: 'Éducation & Formation', label: 'Éducation & Formation' },
  { value: 'Santé', label: 'Santé' },
  { value: 'Finance', label: 'Finance' },
];

const InscriptionForm = ({ userType }) => {
  const { loading: loadingComp, error: errorComp, data: dataComp } = useQuery(GET_ALL_COMPETENCES);
const competencesOptions = dataComp?.getCompetences?.map(c => ({
  value: c.id,
  label: c.nom
})) || [];
  const [registerFreelancer] = useMutation(REGISTER_FREELANCER);
  const [registerClient] = useMutation(REGISTER_CLIENT);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    photo:undefined,
    bio:'',
    nom: '',
    prenom: '',
    competencesNiveaux: [{ competence: '', niveau: '' }],
    liens: [{ type: '', url: '' }],

    // Champs client
    entreprise: '',
    siteweb: '',
    adresse: '',
    tel: '',
    secteurActivite: '',
    photo_client: undefined,
    about: '',
    code_postal:''
  });
  const history = useHistory();
  const [errors, setErrors] = useState({});
  const [error, setError] = useState({});

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
      if (!formData.email) newErrors.email = 'Email requis';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email invalide';

    if (!formData.password) newErrors.password = 'Mot de passe requis';

    if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirmation requise';
    else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';

    if (!formData.entreprise) newErrors.entreprise = 'Entreprise requise';

    if (!formData.secteurActivite) newErrors.secteurActivite = 'Secteur requis';

    if (!formData.siteweb) newErrors.siteweb = 'Site Web requis';

    if (!formData.adresse) newErrors.adresse = 'Adresse requise';

    if (!formData.tel) newErrors.tel = 'N° Téléphone requis';
    else if (!/^\+?\d{7,15}$/.test(formData.tel)) newErrors.tel = 'N° Téléphone invalide';

    if (!formData.photo_client) newErrors.photo = 'Photo requise';

    if (!formData.about) newErrors.about = 'Champ À Propos requis';

    if (!formData.code_postal) newErrors.code_postal = 'Code postal requis';
    } else {
      if (!formData.nom) newErrors.nom = 'Nom requis';
      if (!formData.prenom) newErrors.prenom = 'Prénom requis';
      if (formData.competencesNiveaux.length === 0 || 
        formData.competencesNiveaux.some(item => !item.competence || !item.niveau)) {
      newErrors.competences = 'Au moins une compétence avec niveau requis';
    }
      if (!formData.photo) newErrors.photo = 'Photo requise';
       if (!formData.photo) newErrors.photo = 'Photo requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0]; 

  if (file) {
    setFormData(prev => ({ ...prev, photo: file }));
  }
  };
  const handleFileChange_client = (e) => {
    const file = e.target.files[0]; 

  if (file) {
    setFormData(prev => ({ ...prev, photo_client: file }));
  }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
        console.log(formData);
      
    if (!validate()) return;

    try {
    setError(null);
    if (userType === 'freelancer') {
      // Préparer les données pour le backend
        const competences = formData.competencesNiveaux.map(item => Number(item.competence));
        const niveaux = formData.competencesNiveaux.map(item => item.niveau);
        // Préparer les liens
      const liensProf = formData.liens
        .filter(lien => lien.type && lien.url)
        .map(lien => ({ type: lien.type, url: lien.url }));
      const variables = {
        email: formData.email,
        password: formData.password,
        nom: formData.nom,
        prenom: formData.prenom,
        photo: formData.photo,
        liensProf,
        competences,
        niveaux,
        disponibilite:true,
        bio: formData.bio,
      };

      console.log('Variables sent to registerFreelancer:', variables);
      delete variables.competencesNiveaux;
      const { data } = await registerFreelancer({
        variables,
        context: {
          headers: {
            'Apollo-Require-Preflight': 'true', 
          },
        },
      });

      console.log('Registration successful:', data);
      setSubmitted(true);
      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        entreprise: '',
        secteurActivite: '',
        photo: null,
        bio: '',
        nom: '',
        prenom: '',
        competences: [],
        liens: [{ type: '', url: '' }]
      });
      history.push('/examples/sign-in');
    }
    if (userType === 'client') {
      const clientData = {
        email: formData.email,
        password: formData.password,
        nom: formData.entreprise,           
        domaine: formData.secteurActivite,
        siteweb: formData.siteweb,
        adresse: formData.adresse,
        tel: formData.tel,
        photo: formData.photo_client,
        about: formData.about,
        codePostal: formData.code_postal,
      };

      console.log('Données envoyées pour client :', clientData);

      // Appel API ou mutation GraphQL ici (exemple générique)
      const { data } = await registerClient({
        variables: clientData,
        context: {
          headers: {
            'Apollo-Require-Preflight': 'true',
          },
        },
      });

      console.log('Inscription client réussie:', data);
      setSubmitted(true);

      setFormData({
        email: '',
        password: '',
        confirmPassword: '',
        entreprise: '',
        secteurActivite: '',
        siteweb: '',
        adresse: '',
        tel: '',
        photo: null,
        about: '',
      });

      history.push('/examples/sign-in');
    }
   
  }catch (error) {
      console.error('Registration error:', error);
       setError(error.message || 'An error occurred during registration');
      // Handle error (show error message to user)
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
  const addCompetenceNiveau = () => {
  setFormData(prev => ({
    ...prev,
    competencesNiveaux: [...prev.competencesNiveaux, { competence: '', niveau: '' }]
  }));
};

const removeCompetenceNiveau = (index) => {
  setFormData(prev => ({
    ...prev,
    competencesNiveaux: prev.competencesNiveaux.filter((_, i) => i !== index)
  }));
};

const updateCompetenceNiveau = (index, field, value) => {
  setFormData(prev => {
    const updated = [...prev.competencesNiveaux];
    updated[index] = { ...updated[index], [field]: value };
    return { ...prev, competencesNiveaux: updated };
  });
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
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label style={{color :'white' , fontWeight:'bold'}}>
                  <FontAwesomeIcon icon={faMapMarkedAlt} className="me-2" />
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
            <Col md={4}>
              <Form.Group className="mb-3">
                <Form.Label style={{color :'white' , fontWeight:'bold'}}>
                  <FontAwesomeIcon icon={faMailBulk} className="me-2" />
                  Code Postal
                </Form.Label>
                <Form.Control
                  name="code_postal"
                  value={formData.code_postal}
                  onChange={handleChange}
                  isInvalid={!!errors.code_postal}
                  required placeholder="Code Postal"
                />
                <Form.Control.Feedback type="invalid">
                  {errors.code_postal}
                </Form.Control.Feedback>
              </Form.Group>
            </Col>
            <Col md={4}>
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
                  onChange={handleFileChange_client}
                  isInvalid={!!errors.photo_client}
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
                      onChange={handleFileChange}
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
                {/* <Select
                  isMulti
                  options={competencesOptions}
                  onChange={(options) => 
                    setFormData(prev => ({
                      ...prev,
                      competences: options.map(opt => opt.value)
                    }))
                  }
                  className={errors.competences ? 'is-invalid' : ''}
                /> */}
                {formData.competencesNiveaux.map((item, index) => (
                      <div key={index} className="mb-2 d-flex align-items-center">
                        <Form.Select
                          className="me-2"
                          value={item.competence}
                          onChange={(e) => updateCompetenceNiveau(index, 'competence', e.target.value)}
                          isInvalid={!!errors.competences && index === 0}
                        >
                          <option value="">Sélectionner une compétence</option>
                          {competencesOptions.map(opt => (
                            <option key={opt.value} value={opt.value.toString()}>{opt.label}</option>
                          ))}
                        </Form.Select>
                        
                        <Form.Select
                          className="me-2"
                          value={item.niveau}
                          onChange={(e) => updateCompetenceNiveau(index, 'niveau', e.target.value)}
                          isInvalid={!!errors.niveaux && index === 0}
                        >
                          <option value="">Niveau</option>
                          <option value="Débutant">Débutant</option>
                          <option value="Intermédiaire">Intermédiaire</option>
                          <option value="Avancé">Avancé</option>
                          <option value="Expert">Expert</option>
                        </Form.Select>
                        
                        {formData.competencesNiveaux.length > 1 && (
                          <Button
                            variant="outline-danger"
                            onClick={() => removeCompetenceNiveau(index)}
                          >
                            ×
                          </Button>
                        )}
                      </div>
                    ))}
                    
                    <Button
                      variant="outline-secondary"
                      size="sm"
                      onClick={addCompetenceNiveau}
                      className="mt-2"
                    >
                      + Ajouter une compétence
                    </Button>
                    
                    {errors.competences && (
                      <div className="invalid-feedback d-block">
                        {errors.competences}
                      </div>
                    )}
                    {errors.niveaux && (
                      <div className="invalid-feedback d-block">
                        {errors.niveaux}
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