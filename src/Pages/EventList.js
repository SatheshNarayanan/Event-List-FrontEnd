import React, { useState, useEffect } from "react";
import axios from "axios";
import ReactLoading from "react-loading";
import {
  Row,
  Col,
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
  Button,
  Input
} from "reactstrap";
import { useRouteMatch, useHistory } from "react-router-dom";
import { getEventsLink } from "../Reusables/Links";
import dateFormat from "dateformat";

const api = axios.create({
  baseURL: getEventsLink
});

const EventsList = () => {
  //states used by app
  const [loading, setLoading] = useState(true);
  const [eventList, seteventList] = useState([]);
  const [search, setSearch] = useState([]);
  //path and history for routing to booking screen
  const { path } = useRouteMatch();
  const history = useHistory();

  //routing using histoiry in react-router-dom
  const bookSeats = (e) => {
    const path = e.target.value;
    history.push(path);
  };

  //search functionality using previously fetched data
  const searchEvent = (e) => {
    const value = e.target.value;
    const result =
      value !== ""
        ? eventList.filter((element) =>
            element.eventName.toLowerCase().includes(value.toLowerCase())
          )
        : eventList;
    setSearch(result);
  };

  useEffect(() => {
    //fetching all the event list details
    api
      .get("/")
      .then((res) => {
        const data = res.data.event;
        setLoading(false);
        seteventList(data);
        setSearch(data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  //Displaying an animation when data is being fetched
  if (loading) {
    return (
      <div
        className="row justify-content-center align-items-center"
        style={{
          maxWidth: "100vw",
          marginTop: "13%"
        }}
      >
        <ReactLoading
          type="spin"
          color="#7e8a97"
          height={"10%"}
          width={"10%"}
        />
      </div>
    );
  }

  //I limited cards to 3 event per Row as when I tried displaying 4 events per row
  //it was a bit small and I found 3 events per row more appealing
  return (
    <div className="container">
      <Input
        type="text"
        name="search"
        placeholder="Look for Specific Events..."
        onChange={searchEvent}
      />
      <Row className="mx-2 my-5">
        {search.length < 1 ? (
          <h1>No results Found!</h1>
        ) : (
          search.map((element, index) => {
            return (
              <Col md={4} className="my-3" key={index}>
                <Card>
                  <CardImg
                    top
                    width="50%"
                    height="50%"
                    src={element.eventImage}
                    alt="Card image cap"
                  />
                  <CardBody>
                    <CardTitle>
                      <h3 className="text-center">{element.eventName}</h3>
                    </CardTitle>
                    <CardSubtitle className="my-2">
                      {element.eventDesc}
                    </CardSubtitle>
                    <CardText>
                      <b>Date :</b>{" "}
                      {dateFormat(element.date, "dddd, mmmm dS, yyyy")} <br />
                      <b>Seats Available :</b> {element.seatsAvailable} <br />
                    </CardText>
                    <div className="text-center">
                      {element.seatsAvailable < 1 ? (
                        <b style={{ color: "#ff0000", fontSize: "1.5rem" }}>
                          Sold Out
                        </b>
                      ) : (
                        <Button
                          value={`${path}/${element._id}`}
                          onClick={bookSeats}
                        >
                          Book Seats
                        </Button>
                      )}
                    </div>
                  </CardBody>
                </Card>
              </Col>
            );
          })
        )}
      </Row>
    </div>
  );
};

export default EventsList;
