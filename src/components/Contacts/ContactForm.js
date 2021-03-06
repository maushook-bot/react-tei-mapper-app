import React, { useState } from "react";
import "./ContactForm.css";
import axios from "axios";
import ContactMap from "./ContactMap";
import { useAlert } from "react-alert";


const ContactForm = (props) => {
  const [enteredDomain, setDomain] = useState("");
  const [enteredLocaldb, setLocaldb] = useState("");
  const [enteredEnv, setEnv] = useState("");
  const [enteredSourceSql, setSourceSql] = useState("");
  const [enteredSourceEnv, setSourceEnv] = useState("");
  const [enteredDestTable, setDestTable] = useState("");
  const [enteredCustInfo, setCustInfo] = useState("");
  const [enteredMigPhase, setMigPhase] = useState("");
  const [ResponseCode, setResponseCode] = useState("");
  const alert = useAlert();

  const domainChangeHandler = (event) => {
    setDomain(event.target.value);
  };

  const localDbChangeHandler = (event) => {
    setLocaldb(event.target.value);
  };

  const envChangeHandler = (event) => {
    setEnv(event.target.value);
  };

  const sourceSqlChangeHandler = (event) => {
    setSourceSql(event.target.value);
  };

  const sourceEnvChangeHandler = (event) => {
    setSourceEnv(event.target.value);
  };

  const destTableChangeHandler = (event) => {
    setDestTable(event.target.value);
  };

  const custInfoChangeHandler = (event) => {
    setCustInfo(event.target.value);
  };

  const migPhaseChangeHandler = (event) => {
    setMigPhase(event.target.value);
  };

  const popupPostHandler = (event) => {
    if (ResponseCode === 200) {
      alert.show("Contact Mappings Posting: Successfull!");
    } else {
      alert.show("Posting Contact API Form");
    }
  };

  const submitHandler = (event) => {
    event.preventDefault();
    const payload = {
      domain: enteredDomain,
      local_db: enteredLocaldb,
      environment: enteredEnv,
      source_sql: enteredSourceSql,
      source_environment: enteredSourceEnv,
      destination_table: enteredDestTable,
      cust_info: enteredCustInfo,
      migration_phase: enteredMigPhase,
    };

    const headers = {
      "Acess-Control-Allow-Credentials": "true",
      "Access-Control-Allow-Origin": "*",
      "Content-Type": "application/json",
    };

    axios
      .post("/track/api/v1/contact-api-mapper", JSON.stringify(payload), {
        headers: headers,
      })
      .then((response) => {
        console.log(response.status);
        setResponseCode(response.status);
        if (response.status === 200) {
          alert.show("Contact API Mapping: Form Posted");
        }
      })
      .catch((error) => {
        alert.show("Contact API Mapping: Connection Refused");
      });

    console.log("payload: ", JSON.stringify(payload));

    setDomain("");
    setLocaldb("");
    setEnv("");
    setSourceSql("");
    setSourceEnv("");
    setDestTable("");
    setCustInfo("");
    setMigPhase("");
  };

  const cancelHandler = () => {
    props.onCancelCheck(false);
  };

  return (
    <div>
        <div className="contact-form">
          <h2>Contact Mapping</h2>

          <form onSubmit={submitHandler}>
            <div className="new-contact__control">
              <label>Domain</label>
              <input
                type="text"
                value={enteredDomain}
                onChange={domainChangeHandler}
              />
            </div>
            <div className="new-contact__control">
              <label>Local DB</label>
              <input
                type="text"
                value={enteredLocaldb}
                onChange={localDbChangeHandler}
              />
            </div>
            <div className="new-contact__control">
              <label>Environment</label>
              <input
                type="text"
                value={enteredEnv}
                onChange={envChangeHandler}
              />
            </div>
            <div className="new-contact__control">
              <label>Source SQL</label>
              <input
                type="text"
                value={enteredSourceSql}
                onChange={sourceSqlChangeHandler}
              />
            </div>
            <div className="new-contact__control">
              <label>Source Environment</label>
              <input
                type="text"
                value={enteredSourceEnv}
                onChange={sourceEnvChangeHandler}
              />
            </div>
            <div className="new-contact__control">
              <label>Destination Table</label>
              <input
                type="text"
                value={enteredDestTable}
                onChange={destTableChangeHandler}
              />
            </div>
            <div className="new-contact__control">
              <label>Customer Info</label>
              <input
                type="text"
                value={enteredCustInfo}
                onChange={custInfoChangeHandler}
              />
            </div>
            <div className="new-contact__control">
              <label>Migration Phase</label>
              <input
                type="text"
                value={enteredMigPhase}
                onChange={migPhaseChangeHandler}
              />
            </div>
            <div className="new-contact__actions">
              <button
                className="contact-form_post"
                type="submit"
                onClick={popupPostHandler}>
                Send Mappings
              </button>
              <button className="contact-form_post" onClick={cancelHandler}>Cancel</button>
            </div>
          </form>
        </div>
      <ContactMap onPostResponseStatus={ResponseCode} />
     
    </div>
  );
};

export default ContactForm;
