import React, { useState } from "react";
import { useMutation } from "@apollo/client";
import { SEND_MESSAGE } from "../../../graphql/queries/messagerie";
import { Container, Row, Col, Card, ListGroup, Form, Button, Badge } from "react-bootstrap";
import { BiSmile, BiPaperclip, BiSend } from "react-icons/bi";

const MessageInput = ({ selectedContact, currentUser,onMessageSent  }) => {
  const [content, setContent] = useState("");
  const [sendMessage] = useMutation(SEND_MESSAGE);

  const handleSend = async () => {
    if (!content.trim()) return;
    await sendMessage({
      variables: {
        createMessageInput: {
          content,
          receiverId: parseInt(selectedContact.id, 10),
        },
      },
    });
    setContent("");
if (onMessageSent) onMessageSent();  
};
    const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e);
    }
  };

  return (
    <div className="p-3 bg-white">
      <Form onSubmit={handleSend} className="d-flex align-items-center">
        <Button variant="link" className="text-muted p-1">
          <BiSmile size={24} />
        </Button>
        
        <Button variant="link" className="text-muted p-1">
          <BiPaperclip size={24} />
        </Button>
        
        <Form.Control
          as="textarea"
          rows={1}
          value={content}
          onChange={(e) => setContent(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Écrivez un message..."
          className="border-0 bg-light mx-2 py-2"
          style={{ 
            resize: "none", 
            borderRadius: '1.5rem',
            padding: '10px 20px'
          }}
        />
        
        <Button 
          variant="primary" 
          type="submit"
          className="rounded-circle d-flex align-items-center justify-content-center p-0"
          disabled={!content.trim()}
          style={{ width: 40, height: 40 }}
        >
          <BiSend size={18} />
        </Button>
      </Form>
    </div>
  );
};

export default MessageInput;