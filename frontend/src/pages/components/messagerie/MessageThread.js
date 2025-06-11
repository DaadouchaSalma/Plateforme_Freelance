import React ,{ useRef, useEffect }from "react";
import { useQuery } from "@apollo/client";
import { GET_CONVERSATION } from "../../../graphql/queries/messagerie";
import { Container, Row, Col, Card, ListGroup, Form, Button, Badge } from "react-bootstrap";
import { BiCheckDouble } from "react-icons/bi";

const MessageThread = ({ selectedContact, currentUser ,shouldRefetch  }) => {
  // Debug logs
  console.log("Current User ID:", currentUser?.id);
  console.log("Selected Contact ID:", selectedContact?.id);
console.log('Type de selectedContact.id:', typeof selectedContact.id);

  const { data, loading, error ,refetch } = useQuery(GET_CONVERSATION, {
    variables: { 
      withUserId: parseInt(selectedContact?.id)
    },
    context: {
      headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    },
    skip: !selectedContact?.id,
    fetchPolicy: "network-only"
  });
  useEffect(() => {
  if (selectedContact?.id) {
    refetch();
  }
}, [shouldRefetch]);

  if (loading) return <div className="p-4">Chargement des messages...</div>;
  
  if (error) {
    console.error("Détails de l'erreur:", {
      message: error.message,
      graphQLErrors: error.graphQLErrors,
      networkError: error.networkError
    });
    return <div className="p-4 text-red-500">Erreur de chargement des messages</div>;
  }

  const messages = data?.getConversation || [];
  return (
    <div className="d-flex flex-column h-100 bg-light">
      {/* En-tête FIXE */}
      <div 
        className="bg-white py-3 px-4 border-bottom d-flex align-items-center" 
        style={{ flexShrink: 0 }}
      >
        <div className="position-relative me-3">
          <div 
            className="rounded-circle bg-primary d-flex align-items-center justify-content-center" 
            style={{ width: 45, height: 45 }}
          >
            <span className="text-white fw-bold">
              {selectedContact.freelancer 
                ? `${selectedContact.freelancer.nom.charAt(0)}${selectedContact.freelancer.prenom.charAt(0)}`
                : selectedContact.client?.nom.charAt(0) || selectedContact.email.charAt(0)}
            </span>
          </div>
          <Badge 
            bg="success" 
            pill 
            className="position-absolute bottom-0 end-0 border-2 border-white"
            style={{ width: 10, height: 10 }}
          />
        </div>
        <div>
          <h6 className="mb-0 fw-bold">
            {selectedContact.freelancer 
              ? `${selectedContact.freelancer.nom} ${selectedContact.freelancer.prenom}`
              : selectedContact.client?.nom || selectedContact.email}
          </h6>
          {/* <small className="text-muted">En ligne</small> */}
        </div>
      </div>

      {/* Messages avec défilement */}
      <div 
        className="flex-grow-1 overflow-auto p-3" 
        style={{ 
          backgroundImage: 'url("https://www.transparenttextures.com/patterns/45-degree-fabric-light.png")',
          paddingBottom: '20px'
        }}
      >
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`d-flex mb-3 ${msg.sender.id === currentUser.id ? 'justify-content-end' : 'justify-content-start'}`}
          >
            <div 
              className={`p-3 position-relative ${
                msg.sender.id === currentUser.id 
                  ? 'bg-primary text-white rounded-end rounded-bottom-4' 
                  : 'bg-white rounded-start rounded-bottom-4'
              }`}
              style={{ 
                maxWidth: "75%", 
                borderRadius: '1.5rem',
                boxShadow: '0 1px 0.5px rgba(0,0,0,0.13)'
              }}
            >
              <p className="mb-1">{msg.content}</p>
              <div className={`d-flex justify-content-end ${msg.sender.id === currentUser.id ? 'text-white-50' : 'text-muted'}`}>
                <small>
                  {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </small>
                {msg.sender.id === currentUser.id && (
                  <BiCheckDouble size={16} className="ms-1" />
                )}
              </div>
            </div>
          </div>
        ))}
        
      </div>
    </div>
  );
};

export default MessageThread;