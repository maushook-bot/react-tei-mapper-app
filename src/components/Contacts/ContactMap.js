import React from "react";
import "./ContactMap.css";
import axios from "axios";
import Card from "../UI/Card";
import { useAlert } from "react-alert";

const ContactMap = (props) => {

  const alert = useAlert();
  const getMappingHandler = (event) => {
    event.preventDefault();

    if (props.onPostResponseStatus === 200) {
      console.log("Intiating Contact Mapping Process!");
      alert.show("Initiating Contact Mapping Process!");

      axios
        .get("/track/api/v1/contact-api-mapper")
        .then((response) => {
          console.log(response.status);
          alert.show("Contact API Mapper execution: Success");
        })
        .catch((error) => {
          console.log("response: ", error.response.data);
          alert.show(error.response.data.error);
        });
    } else {
      alert.show("Cannot Start Mapping Process: Post the Contact Form");
      console.log("Cannot Start Mapping Process: Post the Contact Form");
    }
  };

  return (
    <Card>
    <div className="contact-map">
      <div className="contact-map__actions">
        <button
          className="contact-map__background"
          type="submit"
          onClick={getMappingHandler}
        >
          Start Contact Mapping
        </button>
      </div>
    </div>
    </Card>
  );
};

export default ContactMap;
