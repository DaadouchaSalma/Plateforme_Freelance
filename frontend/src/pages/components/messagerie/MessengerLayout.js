import React, { useState, useEffect } from "react";
import ContactList from "./ContactList";
import MessageThread from "./MessageThread";
import MessageInput from "./MessageInput";
import { useQuery } from "@apollo/client";
import { GET_CONTACTS,GET_CURRENT_USER } from "../../../graphql/queries/messagerie";
import { Container, Row, Col, Card, ListGroup, Form, Button, Badge } from "react-bootstrap";

const MessengerLayout = () => {
  const [selectedContact, setSelectedContact] = useState(null);
const [shouldRefetch, setShouldRefetch] = useState(false);
  // Récupérer l'utilisateur connecté
  const { data: userData, loading: loadingUser, error: errorUser } = useQuery(GET_CURRENT_USER);
  const { data: contactsData, loading: loadingContacts, error: errorContacts } = useQuery(GET_CONTACTS);

  if (loadingUser || loadingContacts) return <div>Chargement...</div>;
  if (errorUser) return <div>Erreur lors du chargement de l'utilisateur</div>;
  if (errorContacts) return <div>Erreur lors du chargement des contacts</div>;

  const currentUser = userData?.me;
  const contacts = contactsData?.getAvailableContacts || [];

  if (!currentUser) return <div>Utilisateur non authentifié</div>;

  return (
    <> 
    <div className="text-center" style={{marginBottom:'-15px', backgroundColor:'#eaedf2 !important',marginTop:'70px'}}>
                <h1 className=" fw-bold text-primary ">
                  Bienvenue dans votre messagerie interne !
                </h1>
                <p className=" text-muted fs-4">
                  Discutez en toute simplicité avec vos collaborateurs
                </p>
              </div>
   <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div 
        className="d-flex bg-white shadow-lg rounded-4 overflow-hidden" 
        style={{ 
          width: '90%', 
          maxWidth: '1400px', 
          height: '85vh',
          minHeight: '600px'
        }}
      >
        {/* Colonne des contacts (30%) */}
        <div className="h-100 border-end" style={{ width: "30%", minWidth: 300 }}>
          <ContactList
            contacts={contacts}
            onSelect={setSelectedContact}
            selectedContact={selectedContact}
            currentUser={currentUser}
          />
        </div>
        
        {/* Colonne de conversation (70%) */}
        <div className="flex-grow-1 d-flex flex-column">
          {selectedContact ? (
            <div className="d-flex flex-column h-100">
              {/* Thread de messages avec défilement */}
              <div className="flex-grow-1 overflow-hidden">
                <MessageThread
                  selectedContact={selectedContact}
                  currentUser={currentUser}
                  shouldRefetch={shouldRefetch}
                />
              </div>
              
              {/* Zone d'input FIXE en bas */}
              <div className="border-top bg-white" style={{ flexShrink: 0 }}>
                <MessageInput
                  selectedContact={selectedContact}
                  currentUser={currentUser}
                  onMessageSent={() => setShouldRefetch(prev => !prev)}
                />
              </div>
            </div>
          ) : (
            <div className="d-flex justify-content-center align-items-center h-100 bg-light">
              <div className="text-center p-5">
                <div className="bg-primary rounded-circle d-inline-flex align-items-center justify-content-center mb-3" 
                     style={{ width: 100, height: 100 }}>
                  <span className="text-white display-4">✉️</span>
                </div>
                <h3 className="mb-3">Sélectionnez un contact</h3>
                <p className="text-muted fs-5">
                  Choisissez un contact dans la liste pour commencer une conversation
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

export default MessengerLayout;