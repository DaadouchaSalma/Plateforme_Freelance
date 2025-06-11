
import React, { useState } from "react";
import { Container, Row, Col, Card, ListGroup, Form, Button, Badge } from "react-bootstrap";
import { BiDotsVerticalRounded, BiCheckDouble } from "react-icons/bi";

const ContactList = ({ contacts, onSelect, selectedContact, currentUser }) => {
  console.log("contactt",contacts)
  return (
    <Card className="h-100 border-0 rounded-0">
      <Card.Header className="bg-light d-flex justify-content-between align-items-center py-3">
        <h5 className="mb-0 fw-bold">Messages</h5>
        <BiDotsVerticalRounded size={20} className="text-muted" />
      </Card.Header>
      
      <ListGroup 
        variant="flush" 
        className="overflow-auto"
        style={{ height: 'calc(100% - 60px)' }}
      >
        {contacts.map((user) => {
          const role=user.role
          const name = user.freelancer
            ? `${user.freelancer.nom} ${user.freelancer.prenom}`
            : user.client?.nom || user.email;

          return (
            <ListGroup.Item
              key={user.id}
              action
              active={selectedContact?.id === user.id}
              onClick={() => onSelect(user)}
              className="border-0 py-3 d-flex align-items-start"
              style={{
                backgroundColor: selectedContact?.id === user.id ? '#d3d8ea' : 'transparent'
              }}
            >
              {/* Avatar */}
              <div className="position-relative me-3">
                <div 
                  className="rounded-circle bg-primary d-flex align-items-center justify-content-center" 
                  style={{ width: 50, height: 50 }}
                >
                  <span className="text-white fw-bold fs-5">
                    {name.charAt(0)}
                  </span>
                </div>
                <Badge 
                  bg="success" 
                  pill 
                  className="position-absolute bottom-0 end-0 border-2 border-white"
                  style={{ width: 12, height: 12 }}
                />
              </div>

              {/* Contact Info */}
              <div className="flex-grow-1">
                <div className="d-flex justify-content-between">
                  <h6 className="mb-0 fw-bold">{name}</h6>
                  <small className="text-muted">{role}</small>
                </div>
                
                <div className="d-flex align-items-center mt-1">
                  <BiCheckDouble size={16} className="text-primary me-1" />
                  <small className="text-truncate text-muted" style={{ maxWidth: 150 }}>
                    {user.lastMessage || "Commencez la conversation"}
                  </small>
                  {/* <Badge pill bg="primary" className="ms-2">3</Badge> */}
                </div>
              </div>
            </ListGroup.Item>
          );
        })}
      </ListGroup>
    </Card>
  );
};

export default ContactList;