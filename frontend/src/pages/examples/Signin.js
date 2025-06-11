
import React,{ useState } from "react";
import { useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { LOGIN_MUTATION } from "../../graphql/mutations/login";
import { faAngleLeft, faEnvelope, faUnlockAlt } from "@fortawesome/free-solid-svg-icons";
import { faFacebookF, faGithub, faTwitter } from "@fortawesome/free-brands-svg-icons";
import { Col, Row, Form, Card, Button, FormCheck, Container, InputGroup,Image } from '@themesberg/react-bootstrap';
import { Link } from 'react-router-dom';
import logo from "../../assets/img/logo/icon+title(small).png"
import { Routes } from "../../routes";
import BgImage from "../../assets/img/illustrations/signin.svg";


export default () => {
 const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const history = useHistory();

  const [login, { loading, error }] = useMutation(LOGIN_MUTATION, {
    onCompleted: (data) => {
      const token = data.login;
      localStorage.setItem("token", token); 
      history.push("/dashboard/overview");  
    },
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login({ variables: { email, password } });
    } catch (err) {
      console.error("Login error", err);
    }
  }; 

  return (
    <main>
      <section className="d-flex align-items-center my-5 mt-lg-6 mb-lg-5">
        <Container>
          {/* <p className="text-center">
            <Card.Link as={Link} to={Routes.DashboardOverview.path} className="text-gray-700">
              <FontAwesomeIcon icon={faAngleLeft} className="me-2" /> Back to homepage
            </Card.Link>
          </p> */}
          <Row className="justify-content-center form-bg-image" style={{ backgroundImage: `url(${BgImage})` }}>
            <Col xs={12} className="d-flex align-items-center justify-content-center">
              <div className="shadow-soft border rounded border-light p-4 p-lg-5 w-100 fmxw-500" style={{backgroundColor :'#2e3650'}}>
                {/* <div className="text-center text-md-center mb-4 mt-md-0">
                  <h3 className="mb-0">Se connecter à notre plateforme</h3>
                </div> */}
                <Image src={logo} rounded />
                <Form className="mt-4" onSubmit={handleSubmit}>
                  <Form.Group id="email" className="mb-4">
                    <Form.Label style={{color :'white' , fontWeight:'bold'}}>Adresse Email</Form.Label>
                    <InputGroup>
                      <InputGroup.Text>
                        <FontAwesomeIcon icon={faEnvelope} />
                      </InputGroup.Text>
                      <Form.Control autoFocus required type="email" placeholder="example@company.com" value={email}onChange={(e) => setEmail(e.target.value)} />
                    </InputGroup>
                  </Form.Group>
                  <Form.Group>
                    <Form.Group id="password" className="mb-4">
                      <Form.Label style={{color :'white' ,fontWeight:'bold'}}>Mot De Passe</Form.Label>
                      <InputGroup>
                        <InputGroup.Text>
                          <FontAwesomeIcon icon={faUnlockAlt} />
                        </InputGroup.Text>
                        <Form.Control required type="password" placeholder="Mot De Passe" value={password}
                        onChange={(e) => setPassword(e.target.value)} />
                      </InputGroup>
                    </Form.Group>
                    {/* <div className="d-flex justify-content-between align-items-center mb-4">
                      <Form.Check type="checkbox">
                        <FormCheck.Input id="defaultCheck5" className="me-2" />
                        <FormCheck.Label htmlFor="defaultCheck5" className="mb-0">Remember me</FormCheck.Label>
                      </Form.Check>
                      <Card.Link className="small text-end">Lost password?</Card.Link>
                    </div> */}
                  </Form.Group>
                  {error && <div className="text-danger mb-3">Connexion échouée: {error.message}</div>}
                  <Button variant="primary" type="submit" className="w-100" disabled={loading}  style={{backgroundColor:'#43bcd9' , color:'#2e3650'}}>
                    {loading ? "Connexion en cours..." : "Se Connecter"}
                  </Button>
                </Form>

                {/* <div className="mt-3 mb-4 text-center">
                  <span className="fw-normal">or login with</span>
                </div>
                <div className="d-flex justify-content-center my-4">
                  <Button variant="outline-light" className="btn-icon-only btn-pill text-facebook me-2">
                    <FontAwesomeIcon icon={faFacebookF} />
                  </Button>
                  <Button variant="outline-light" className="btn-icon-only btn-pill text-twitter me-2">
                    <FontAwesomeIcon icon={faTwitter} />
                  </Button>
                  <Button variant="outline-light" className="btn-icon-only btn-pil text-dark">
                    <FontAwesomeIcon icon={faGithub} />
                  </Button>
                </div> */}
                <div className="d-flex justify-content-center align-items-center mt-4">
                  <span className="fw-normal" style={{color :'white'}}>
                   Pas encore inscrit ?
                    <Card.Link as={Link} to={Routes.Register.path} className="fw-bold" style={{color :'white'}}>
                      {` Créez un compte `}
                    </Card.Link>
                  </span>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </main>
  );
};
