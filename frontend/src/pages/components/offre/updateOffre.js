import React, { useEffect, useState } from "react";
import { useMutation, useQuery } from "@apollo/client";
import { useParams, useHistory} from "react-router-dom";
import { GET_OFFER_BY_ID } from "../../../graphql/queries/getOffreById";
import { UPDATE_OFFRE } from "../../../graphql/mutations/updateOffre";
import { Card, Form, Button, Col, Row, InputGroup, Spinner, Alert } from "@themesberg/react-bootstrap";
import Datetime from "react-datetime";
import moment from "moment";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

export default function ModifierOffreForm() {
  const { id } = useParams();
  const history = useHistory();
  const { loading, error, data } = useQuery(GET_OFFER_BY_ID, {
  variables: { id: parseInt(id) }
});


  const [formData, setFormData] = useState({
    title: "",
    description: "",
    budget: "",
    startDate: null,
    endDate: null,
    status: "",
  });
const validStartDate = (current) => {
  return current.isSameOrAfter(moment(), "day");
};

const validEndDate = (current) => {
  if (!formData.startDate) return true;
  return current.isSameOrAfter(moment(formData.startDate), "day");
};
 
  const [updateOffer] = useMutation(UPDATE_OFFRE, {
    onCompleted: () => {
      
      history.push("/offre/listeClient");
    },
    onError: (err) => {
      
      console.error(err);
    },
  });

  useEffect(() => {
    console.log("DATA BRUTE :", data);
    if (data?.getOfferById) {
     console.log("Offre reçue depuis GraphQL :", data.getOfferById);
      const { title, description, budget, startDate, endDate, status } = data.getOfferById;
      setFormData({
        title,
        description,
        budget: budget.toString(),
        startDate: new Date(startDate),
        endDate: new Date(endDate),
        status,
      });
    }
  }, [data]);
  

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    

    e.preventDefault();
    updateOffer({
      variables: {
        id: parseInt(id),
        title: formData.title,
        description: formData.description,
        budget: parseInt(formData.budget, 10),
        startDate: formData.startDate.toISOString(),
        endDate: formData.endDate.toISOString(),
        status: formData.status,
      }
    });
  };

 
  return (
    <>
      <h3 className="mb-4">Mise à jour de l’Offre</h3>
      <Card border="light" className="bg-white shadow-sm mb-4">
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Group>
                  <Form.Label><strong>Titre de l’offre</strong></Form.Label>
                  <Form.Control
                    required
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleChange}
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
      />
    </Form.Group>
     </Col>
    </Row>
  <Row>
  

  {/* Statut de l'offre */}
  <Col md={8} className="mb-3">
    <Form.Group>
      <Form.Label>Statut de l'offre</Form.Label>
      <Form.Control
        as="select"
        name="status"
        value={formData.status}
        onChange={handleChange}
        required
      >
        <option value="">-- Sélectionnez un statut --</option>
        <option value="Active">Active</option>
        <option value="Terminée">Terminée</option>
      </Form.Control>
    </Form.Group>
  </Col>
</Row> 
<Row>
              <Col md={8} className="mb-3">
            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                required
                as="textarea"
                rows={4}
                name="description"
                value={formData.description}
                onChange={handleChange}
              />
            </Form.Group>
</Col>
 </Row>

           <Row>
  <Col md={6} className="mb-3">
    <Form.Label>Date de début</Form.Label>
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
            value={formData.startDate ? moment(formData.startDate).format("YYYY-MM-DD") : ""}
            onFocus={openCalendar}
            onChange={() => {}}
          />
        </InputGroup>
      )}
    />
  </Col>

  <Col md={6} className="mb-3">
    <Form.Label>Date de fin</Form.Label>
    <Datetime
      timeFormat={false}
      value={formData.endDate}
      onChange={(date) => setFormData(prev => ({ ...prev, endDate: date }))}
      isValidDate={validEndDate}
      renderInput={(props, openCalendar) => (
        <InputGroup>
          <InputGroup.Text><FontAwesomeIcon icon={faCalendarAlt} /></InputGroup.Text>
          <Form.Control
            type="text"
            value={formData.endDate ? moment(formData.endDate).format("YYYY-MM-DD") : ""}
            onFocus={openCalendar}
            onChange={() => {}}
          />
        </InputGroup>
      )}
    />
  </Col>
</Row>

            <div className="mt-3">
              <Button variant="primary" type="submit">
                Mettre à jour l’offre
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>
    </>
  );
}
