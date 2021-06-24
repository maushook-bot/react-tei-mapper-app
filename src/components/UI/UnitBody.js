import React, { useState } from "react";
import ContactForm from "../Contacts/ContactForm";
import Card from "./Card";
import "./UnitBody.css";

let bodyContactContent;

const UnitBody = () => {
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
      <button onClick={startContactEditHandler}>Add Unit Mappings</button>
    );
  }

  return (
    <div>
      <Card>
        <div className="new-unit">{bodyContactContent}</div>

      <div className="new-unit">
        <button>Unit Decoupler</button>
      </div>
    
      </Card>

    </div>
  );
};

export default UnitBody;
