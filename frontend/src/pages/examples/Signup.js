import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleLeft, faEnvelope, faUnlockAlt, faBuilding, faUser, faLink } from "@fortawesome/free-solid-svg-icons";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { Col, Row, Form, Card, Button, Container, InputGroup, Image,Alert } from '@themesberg/react-bootstrap';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import logo from "../../assets/img/logo/icon+title(small).png";
import { Routes } from "../../routes";
import BgImage from "../../assets/img/illustrations/signin.svg";

const competencesOptions = [
  { value: 'react', label: 'React' },
  { value: 'node', label: 'Node.js' },
  { value: 'graphql', label: 'GraphQL' }
];

const secteursOptions = [
  { value: 'tech', label: 'Technologie' },
  { value: 'marketing', label: 'Marketing' }
];

export default () => {
  const [userType, setUserType] = useState('client');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    entreprise: '',
    secteurActivite: '',
    nom: '',
    prenom: '',
    competences: [],
    liens: [{ type: '', url: '' }]
  });
  const [errors, setErrors] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors = {};
    
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

    if (userType === 'client') {
      if (!formData.entreprise) newErrors.entreprise = 'Entreprise requise';
      if (!formData.secteurActivite) newErrors.secteurActivite = 'Secteur requis';
    } else {
      if (!formData.nom) newErrors.nom = 'Nom requis';
      if (!formData.prenom) newErrors.prenom = 'Prénom requis';
      if (formData.competences.length === 0) {
        newErrors.competences = 'Au moins une compétence requise';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      console.log('Données soumises:', { ...formData, userType });
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
      <main>
        <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
          <Container>
            <Row className="justify-content-center form-bg-image" style={{ backgroundImage: `url(${BgImage})` }}>
              <Col xs={12} className="d-flex align-items-center justify-content-center">
                <div className="mb-4 mb-lg-0 shadow-soft border rounded border-light p-4 p-lg-5" style={{backgroundColor: '#2e3650', width: '100%'}}>
                  <Image src={logo} rounded className="mb-4" />
                  <Alert variant="success" className="text-center">
                    <h4>Inscription réussie !</h4>
                    <p>Un email de confirmation a été envoyé à {formData.email}</p>
                    <Button as={Link} to={Routes.Signin.path} variant="primary" style={{backgroundColor: '#43bcd9', color: '#2e3650'}}>
                      Se connecter
                    </Button>
                  </Alert>
                </div>
              </Col>
            </Row>
          </Container>
        </section>
      </main>
    );
  }

  return (
    <main>
      <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
        <Container>
          <Row className="justify-content-center form-bg-image" style={{ backgroundImage: `url(${BgImage})` }}>
            <Col xs={12} className="d-flex align-items-center justify-content-center">
              <div className="mb-4 mb-lg-0 shadow-soft border rounded border-light p-4 p-lg-5" style={{backgroundColor: '#2e3650', width: '100%'}}>
                <Image src={logo} rounded className="mb-4" />
                <Form onSubmit={handleSubmit}>
                  {/* Champs communs */}
                  <Form.Group id="email" className="mb-4">
                    <Form.Label style={{color: 'white', fontWeight: 'bold'}}>
                      <FontAwesomeIcon icon={faEnvelope} className="me-2" />
                      Adresse Email
                    </Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faEnvelope} />
                      </InputGroup.Text>
                      <Form.Control 
                        name="email"
                        type="email" 
                        placeholder="example@company.com" 
                        value={formData.email}
                        onChange={handleChange}
                        isInvalid={!!errors.email}
                      />
                    </InputGroup>
                    <Form.Control.Feedback type="invalid">
                      {errors.email}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Row className="mb-4">
                    <Col md={6}>
                      <Form.Group id="password">
                        <Form.Label style={{color: 'white', fontWeight: 'bold'}}>
                          <FontAwesomeIcon icon={faUnlockAlt} className="me-2" />
                          Mot De Passe
                        </Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                            <FontAwesomeIcon icon={faUnlockAlt} />
                          </InputGroup.Text>
                          <Form.Control 
                            name="password"
                            type="password" 
                            placeholder="Mot De Passe" 
                            value={formData.password}
                            onChange={handleChange}
                            isInvalid={!!errors.password}
                          />
                        </InputGroup>
                        <Form.Control.Feedback type="invalid">
                          {errors.password}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group id="confirmPassword">
                        <Form.Label style={{color: 'white', fontWeight: 'bold'}}>
                          <FontAwesomeIcon icon={faUnlockAlt} className="me-2" />
                          Confirmation
                        </Form.Label>
                        <InputGroup>
                          <InputGroup.Text>
                            <FontAwesomeIcon icon={faUnlockAlt} />
                          </InputGroup.Text>
                          <Form.Control 
                            name="confirmPassword"
                            type="password" 
                            placeholder="Confirmer Mot De Passe" 
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            isInvalid={!!errors.confirmPassword}
                          />
                        </InputGroup>
                        <Form.Control.Feedback type="invalid">
                          {errors.confirmPassword}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Sélection du type d'utilisateur */}
                  <div className="d-flex gap-4 mb-4">
                    <Form.Check
                      type="radio"
                      label="Freelancer"
                      name="userType"
                      id="freelancer"
                      checked={userType === 'freelancer'}
                      onChange={() => setUserType('freelancer')}
                      style={{ color: "white", fontWeight: "bold" }}
                    />
                    <Form.Check
                      type="radio"
                      label="Client"
                      name="userType"
                      id="client"
                      checked={userType === 'client'}
                      onChange={() => setUserType('client')}
                      style={{ color: "white", fontWeight: "bold" }}
                    />
                  </div>

                  {/* Champs spécifiques */}
                  {userType === 'client' ? (
                    <>
                      <Form.Group className="mb-4">
                        <Form.Label style={{color: 'white', fontWeight: 'bold'}}>
                          <FontAwesomeIcon icon={faBuilding} className="me-2" />
                          Entreprise
                        </Form.Label>
                        <Form.Control
                          name="entreprise"
                          value={formData.entreprise}
                          onChange={handleChange}
                          isInvalid={!!errors.entreprise}
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.entreprise}
                        </Form.Control.Feedback>
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label style={{color: 'white', fontWeight: 'bold'}}>Secteur d'activité</Form.Label>
                        <Select
                          options={secteursOptions}
                          onChange={(option) => 
                            setFormData(prev => ({ ...prev, secteurActivite: option.value }))
                          }
                          className={errors.secteurActivite ? 'is-invalid' : ''}
                          styles={{
                            control: (provided) => ({
                              ...provided,
                              backgroundColor: '#3a4562',
                              borderColor: '#4a5568',
                              color: 'white'
                            }),
                            singleValue: (provided) => ({
                              ...provided,
                              color: 'white'
                            }),
                            input: (provided) => ({
                              ...provided,
                              color: 'white'
                            }),
                            menu: (provided) => ({
                              ...provided,
                              backgroundColor: '#3a4562'
                            }),
                            option: (provided, state) => ({
                              ...provided,
                              backgroundColor: state.isSelected ? '#43bcd9' : '#3a4562',
                              color: state.isSelected ? '#2e3650' : 'white'
                            })
                          }}
                        />
                        {errors.secteurActivite && (
                          <div className="invalid-feedback d-block">
                            {errors.secteurActivite}
                          </div>
                        )}
                      </Form.Group>
                    </>
                  ) : (
                    <>
                      <Row className="mb-4">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label style={{color: 'white', fontWeight: 'bold'}}>
                              <FontAwesomeIcon icon={faUser} className="me-2" />
                              Prénom
                            </Form.Label>
                            <Form.Control
                              name="prenom"
                              value={formData.prenom}
                              onChange={handleChange}
                              isInvalid={!!errors.prenom}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.prenom}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label style={{color: 'white', fontWeight: 'bold'}}>
                              <FontAwesomeIcon icon={faUser} className="me-2" />
                              Nom
                            </Form.Label>
                            <Form.Control
                              name="nom"
                              value={formData.nom}
                              onChange={handleChange}
                              isInvalid={!!errors.nom}
                            />
                            <Form.Control.Feedback type="invalid">
                              {errors.nom}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Col>
                      </Row>

                      <Form.Group className="mb-4">
                        <Form.Label style={{color: 'white', fontWeight: 'bold'}}>Compétences</Form.Label>
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
                          styles={{
                            control: (provided) => ({
                              ...provided,
                              backgroundColor: '#3a4562',
                              borderColor: '#4a5568',
                              color: 'white'
                            }),
                            multiValue: (provided) => ({
                              ...provided,
                              backgroundColor: '#43bcd9'
                            }),
                            multiValueLabel: (provided) => ({
                              ...provided,
                              color: '#2e3650'
                            }),
                            multiValueRemove: (provided) => ({
                              ...provided,
                              color: '#2e3650',
                              ':hover': {
                                backgroundColor: '#2e3650',
                                color: 'white'
                              }
                            }),
                            menu: (provided) => ({
                              ...provided,
                              backgroundColor: '#3a4562'
                            }),
                            option: (provided, state) => ({
                              ...provided,
                              backgroundColor: state.isSelected ? '#43bcd9' : '#3a4562',
                              color: state.isSelected ? '#2e3650' : 'white'
                            })
                          }}
                        />
                        {errors.competences && (
                          <div className="invalid-feedback d-block">
                            {errors.competences}
                          </div>
                        )}
                      </Form.Group>

                      <Form.Group className="mb-4">
                        <Form.Label style={{color: 'white', fontWeight: 'bold'}}>
                          <FontAwesomeIcon icon={faLink} className="me-2" />
                          Liens (Portfolio, GitHub, etc.)
                        </Form.Label>
                        {formData.liens.map((lien, index) => (
                          <div key={index} className="mb-2 d-flex align-items-center">
                            <Form.Select
                              className="me-2"
                              value={lien.type}
                              onChange={(e) => updateLien(index, 'type', e.target.value)}
                              style={{backgroundColor: '#3a4562', color: 'white', borderColor: '#4a5568'}}
                            >
                              <option value="" style={{color: 'white'}}>Type</option>
                              <option value="github" style={{color: 'white'}}>GitHub</option>
                              <option value="linkedin" style={{color: 'white'}}>LinkedIn</option>
                              <option value="portfolio" style={{color: 'white'}}>Portfolio</option>
                            </Form.Select>
                            <Form.Control
                              type="url"
                              placeholder="URL"
                              value={lien.url}
                              onChange={(e) => updateLien(index, 'url', e.target.value)}
                              style={{backgroundColor: '#3a4562', color: 'white', borderColor: '#4a5568'}}
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
                          className="mt-2"
                        >
                          + Ajouter un lien
                        </Button>
                      </Form.Group>
                    </>
                  )}

                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100" 
                    style={{backgroundColor: '#43bcd9', color: '#2e3650'}}
                  >
                    S'inscrire
                  </Button>

                  <div className="d-flex justify-content-center align-items-center mt-4">
                    <span className="fw-normal" style={{color: 'white'}}>
                      Vous avez déjà un compte ?
                      <Card.Link as={Link} to={Routes.Signin.path} className="fw-bold" style={{color: 'white'}}>
                        {` Cliquez ici pour vous connecter `}
                      </Card.Link>
                    </span>
                  </div>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};