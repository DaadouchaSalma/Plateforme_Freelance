import React, { useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import {  useHistory} from "react-router-dom";
import { AJOUT_OFFRE } from "../../../graphql/mutations/ajoutoffre";
import { GET_ALL_CATEGORIES } from "../../../graphql/queries/getallcategories";
import { GET_COMPETENCES } from "../../../graphql/queries/getallcompetances";
import Datetime from "react-datetime";
import moment from "moment";
import { Card, Form, Button, Col, Row, InputGroup } from "@themesberg/react-bootstrap";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

export default function AjoutOffreForm() {
  const history = useHistory();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    startDate: null,
    endDate: null,
    status: "Active", 
    categorieId: null,
    competenceIds: [],
  });
  const { data: categoriesData, loading: loadingCategories } = useQuery(GET_ALL_CATEGORIES);
  const { data: competencesData, loading: loadingCompetences } = useQuery(GET_COMPETENCES);
  const validStartDate = (current) => {
  return current.isSameOrAfter(moment(), "day");
};

const validEndDate = (current) => {
  if (!formData.startDate) return true;
  return current.isSameOrAfter(moment(formData.startDate), "day");
};

  const [createOffer] = useMutation(AJOUT_OFFRE, {
    
    onCompleted: (data) => {
      
      console.log(data);
      history.push("/offre/listeClient");
    },
    onError: (error) => {
      alert("Erreur lors de la création !");
      console.error(error);
    }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  const handleCategorieChange = (e) => {
    setFormData(prev => ({ ...prev, categorieId: parseInt(e.target.value) }));
  };
  const handleCompetencesChange = (e) => {
    const options = e.target.options;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) selected.push(parseInt(options[i].value));
    }
    setFormData(prev => ({ ...prev, competenceIds: selected }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.categorieId) {
      alert("Veuillez sélectionner une catégorie");
      return;
    }

    if (formData.competenceIds.length === 0) {
      alert("Veuillez sélectionner au moins une compétence");
      return;
    }

    await createOffer({
      variables: {
        title: formData.title,
        description: formData.description,
        budget: parseFloat(formData.budget),
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString(),
        status: formData.status,
        categorieId: parseInt(formData.categorieId),
        competenceIds: formData.competenceIds,
      }
    });
  };

  return (
    <>
  <h3 className="mb-4">Trouver un Freelancer — Déposez une Offre</h3>

  <Card border="light" className="bg-white shadow-sm mb-4">
    <Card.Body>
      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label ><strong>Titre de l’offre</strong></Form.Label>
              <Form.Control
                required
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="Ex. : Développement d’un site vitrine"
              />
            </Form.Group>
          </Col>
          <Col md={6} className="mb-3">
            <Form.Group>
              <Form.Label>Budget estimé (TND)</Form.Label>
              <Form.Control
                required
                type="number"
                name="budget"
                value={formData.budget}
                onChange={handleChange}
                placeholder="Ex. : 1500"
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Description détaillée</Form.Label>
          <Form.Control
            required
            as="textarea"
            rows={4}
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Décrivez les besoins, objectifs et attentes du projet..."
          />
        </Form.Group>

        <Row>
          <Col md={6} className="mb-3">
            <Form.Label>Date de début prévue</Form.Label>           
            <Datetime
              timeFormat={false}
              value={formData.startDate}
              onChange={(date) => setFormData(prev => ({ ...prev, startDate: date }))}
              isValidDate={validStartDate}
              renderInput={(props, openCalendar) => (
            <InputGroup>
            <InputGroup.Text><FontAwesomeIcon icon={faCalendarAlt} /></InputGroup.Text>
      <Form.Control
            type="text"
            placeholder="YYYY-MM-DD"
            value={formData.startDate ? moment(formData.startDate).format("YYYY-MM-DD") : ""}
            onFocus={openCalendar}
            onChange={() => {}} />
    </InputGroup> )} />
          </Col>

          <Col md={6} className="mb-3">
            <Form.Label>Date de fin estimée</Form.Label>
            <Datetime timeFormat={false} value={formData.endDate} onChange={(date) => setFormData(prev => ({ ...prev, endDate: date }))} isValidDate={validEndDate}
               renderInput={(props, openCalendar) => (
            <InputGroup>
              <InputGroup.Text><FontAwesomeIcon icon={faCalendarAlt} /></InputGroup.Text>
        <Form.Control
            type="text"
            placeholder="YYYY-MM-DD"
            value={formData.endDate ? moment(formData.endDate).format("YYYY-MM-DD") : ""}
            onFocus={openCalendar}
            onChange={() => {}}
          />
          </InputGroup>
        )} />
          </Col>
          </Row>
          {/* Liste déroulante catégorie */}
            <Form.Group className="mb-3">
              <Form.Label>Catégorie</Form.Label>
              <Form.Control
                as="select"
                name="categorieId"
                value={formData.categorieId || ""}
                onChange={handleCategorieChange}
                required
                disabled={loadingCategories}
              >
                <option value="" disabled>-- Sélectionnez une catégorie --</option>
                {categoriesData?.getAllCategories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.title}</option>
                ))}
              </Form.Control>
            </Form.Group>

            {/* Liste multiple compétences */}
            <Form.Group className="mb-3">
  <Form.Label>Compétences</Form.Label>
  <Form.Control
    as="select"
    name="competenceIds"
    multiple
    value={formData.competenceIds.map(String)} // la valeur doit être un tableau de strings
    onChange={handleCompetencesChange}
    required
    disabled={loadingCompetences}
    style={{ height: '150px' }} // optionnel, pour mieux voir plusieurs options
  >
    {competencesData?.getCompetences.map(comp => (
      <option key={comp.id} value={comp.id.toString()}>
        {comp.nom}
      </option>
    ))}
  </Form.Control>
</Form.Group>


        <div className="mt-3">
          <Button variant="primary" type="submit">
            Publier l’offre
          </Button>
        </div>
      </Form>
    </Card.Body>
  </Card>
</>

  );
}
