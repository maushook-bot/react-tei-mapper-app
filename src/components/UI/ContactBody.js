import React, { useState } from "react";
import ContactForm from "../Contacts/ContactForm";
import Card from "./Card";
import "./ContactBody.css";

let bodyContactContent;

const ContactBody = () => {
  const [isContactEdit, setIsContactEdit] = useState(false);

  const startContactEditHandler = (data) => {
    setIsContactEdit(true);
    bodyContactContent = (
      <ContactForm onCancelCheck={startContactEditHandler} />
    );
    if (data === false) {
      setIsContactEdit(false);
    }
  };

  if (isContactEdit === false) {
    bodyContactContent = (
      <button onClick={startContactEditHandler}>Add Contact Mappings</button>
    );
  }

  return (
    <div>
      <Card>
        <div className="new-contact">{bodyContactContent}</div>

        <div className="new-contact">
          <button>Contact Decoupler</button>
        </div>
      </Card>
    </div>
  );
};

export default ContactBody;
