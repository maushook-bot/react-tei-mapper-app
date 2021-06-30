import React, { useState } from "react";
import "./ContactMap.css";
import axios from "axios";
import Card from "../UI/Card";
import CardObj from "../UI/CardObj";
import { useAlert } from "react-alert";

const ContactMap = (props) => {
  const alert = useAlert();
  let [minElapsed, setMinElapsed] = useState(0);
  let [percentComplete, setPercentComplete] = useState(0);
  let [preTrackCount, setPreTrackCount] = useState(0);
  let [postTrackCount, setPosttrackCount] = useState(0);

  const getStatsHandler = (event) => {
    event.preventDefault();

    if (props.onPostResponseStatus === 200) {
      axios
        .get("/track/api/v1/contact-api-mapper/stats")
        .then((response) => {
          console.log(response.data);
          setPercentComplete(response.data.data["percent_complete"]);
          setMinElapsed(response.data.data["minutes_elapsed"]);
          setPreTrackCount(response.data.data["Pre-TRACK Count"]);
          setPosttrackCount(response.data.data["Post TRACK Count"]);
        })
        .catch((error) => {
          console.log("response: ", error.response.data);
          setPercentComplete(0);
          setMinElapsed(0);
          setPreTrackCount(0);
          setPosttrackCount(0);
        });
    } else {
          setPercentComplete(0);
          setMinElapsed(0);
          setPreTrackCount(0);
          setPosttrackCount(0);
    }
  };

  const getMappingHandler = (event) => {
    event.preventDefault();

    if (props.onPostResponseStatus === 200) {
      console.log("Intiating Contact Mapping Process!");
      alert.show("Initiating Contact Mapping Process!");

      axios
        .get("/track/api/v1/contact-api-mapper")
        .then((response) => {
          console.log(response.status);
          console.log(response.data);
          console.log(response.data.data["Post TRACK Count"]);
          console.log(response.data.data["Pre-TRACK Count"]);
          console.log(response.data.data["minutes_elapsed"]);
          console.log(response.data.data["percent_complete"]);
          setPercentComplete(response.data.data["percent_complete"]);
          setMinElapsed(response.data.data["minutes_elapsed"]);
          setPreTrackCount(response.data.data["Pre-TRACK Count"]);
          setPosttrackCount(response.data.data["Post TRACK Count"]);
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
        <CardObj>
          <div className="contact-stats__header">Statistics</div>

          <div className="contact-map__actions">
            <button
              className="contact-map__awesome_background"
              type="submit"
              size="auto"
              onClick={getStatsHandler}
            >
              Refresh
            </button>
          </div>

          <div className="contact-stats">
            <div>
              <div className="contact-stats__head">Minutes Elapsed</div>
              <div className="contact-stats__body">{minElapsed}</div>
            </div>

            <div>
              <div className="contact-stats__head_1">Percent Complete</div>
              <div className="contact-stats__body_1">{percentComplete}%</div>
            </div>

            <div>
              <div className="contact-stats__head">Pre TRACK Count</div>
              <div className="contact-stats__body">{preTrackCount}</div>
            </div>

            <div>
              <div className="contact-stats__head_1">Post TRACK Count</div>
              <div className="contact-stats__body_1">{postTrackCount}</div>
            </div>
          </div>
        </CardObj>
      </div>
    </Card>
  );
};

export default ContactMap;
