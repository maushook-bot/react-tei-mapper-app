import React from "react";
import "./ContactMap.css";
import axios from "axios";

const ContactMap = (props) => {
  const getMappingHandler = (event) => {
    event.preventDefault();

    if (props.onPostResponseStatus === 200) {
      console.log("Intiating Contact Mapping Process!");
      alert("Initiating Contact Mapping Process!");

      axios
        .get("/track/api/v1/contact-api-mapper")
        .then((response) => {
          console.log(response.status);
          alert("Contact API Mapper execution: Success");
        })
        .catch((error) => {
          console.log("response: ", error.response.data);
          alert(error.response.data.error);
        });
    } else {
      alert("Cannot Start Mapping Process: Post the Contact Form");
      console.log("Cannot Start Mapping Process: Post the Contact Form");
    }
  };

  return (
    <div className="contact-map">
      <div className="map-contact__actions">
        <button
          className="map-contact"
          type="submit"
          onClick={getMappingHandler}
        >
          Start Contact Mapping
        </button>
      </div>
    </div>
  );
};

export default ContactMap;
