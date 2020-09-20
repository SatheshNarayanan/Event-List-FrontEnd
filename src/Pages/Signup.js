import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import swal from "sweetalert";
import { useHistory, useRouteMatch } from "react-router-dom";
import dateFormat from "dateformat";
import axios from "axios";
import ReactLoading from "react-loading";
import { Row, Col, Label } from "reactstrap";
import { getEventsLink } from "../Reusables/Links";
import "../styles.css";

const api = axios.create({
  baseURL: getEventsLink
});

const FormUpdates = () => {
  //react-hook-forms
  const { register, handleSubmit, errors } = useForm();
  //state declarations
  const [eventData, setEventData] = useState({
    eventName: "",
    date: "",
    seatsAvailable: "",
    eventImage: ""
  });
  const [seats, setSeats] = useState(1);
  const [nameOfAttendee, setNameOfAttendee] = useState([]);
  const [loading, setLoading] = useState(true);
  const [booked, setBooked] = useState(false);
  const [seatmsg, setSeatmsg] = useState("");
  //For getting id form params
  const { params } = useRouteMatch();
  //For going back to previous page - react-reouter-dom
  const { goBack } = useHistory();

  //Function for updting the seats and creating new name fields for
  //other Attendee
  const seatsSelect = (e) => {
    const value = parseInt(e.target.value);
    setSeats(value);
    const array = [...nameOfAttendee];
    if (value <= eventData.seatsAvailable) {
      setSeatmsg("");
      if (value - 1 > array.length) {
        for (let count = array.length; count < value - 1; count++) {
          array.push("");
        }
      } else {
        array.length = value - 1;
      }
    } else {
      setSeatmsg("Number of seats selected is more than available seats");
      array.length = 0;
    }
    setNameOfAttendee(array);
  };

  //Posting the data to the Server
  const submitForm = (data) => {
    //using react-hhok-forms stores everything in an object structure
    //for extra attendee names I have stored the index of array as name
    //Sepeating the attendee name and attaching it to a dummy array starts here
    const attendeeNaKey = Object.keys(data);
    let attendeeName = [];
    attendeeNaKey.forEach((element) => {
      const integer = parseInt(element);
      if (isNaN(integer)) return;
      attendeeName.push(data[`${integer}`]);
    });
    //Sepeating the attendee name and attaching it to a dummy array starts here

    const result = {
      name: data.name,
      email: data.email,
      phoneNo: data.phoneNo,
      noOfSeats: seats,
      attendeeName: attendeeName,
      event: params.id
    };
    //Posting the data to the API
    api
      .post(`/${params.id}`, result)
      .then((data) => {
        console.log(data.data.result);
        swal("Success", "Post has been added Successfully", "success").then(
          () => {
            setBooked(true);
          }
        );
      })
      .catch((error) => {
        console.log(error);
        swal("Error", "Please check the data", "error");
      });
  };

  useEffect(() => {
    //fetching the data of theindividual events
    api
      .get(`/${params.id}`)
      .then((res) => {
        const data = res.data.event;
        setLoading(false);
        setEventData({
          ...eventData,
          eventName: data.eventName,
          date: data.date,
          seatsAvailable: data.seatsAvailable,
          eventImage: data.eventImage
        });
      })
      .catch((err) => {
        console.log(err);
      });
    //Have added booked as a dependency as this will help in displaying the
    //current seats available after booking
  }, [booked]);

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

  return (
    <form
      onSubmit={handleSubmit(submitForm)}
      className="my-5 container"
      autocomplete="off"
    >
      <div className="text-center">
        <h1>{eventData.eventName}</h1>
        {booked ? (
          <h3 style={{ color: "#28a745" }}> Tickets Booked Successfully</h3>
        ) : null}
        <h5>{dateFormat(eventData.date, "dddd, mmmm dS, yyyy")}</h5>
        <h6> Number of Seats Available : {eventData.seatsAvailable} </h6>
      </div>
      <Row>
        <Col sm={4} md={6} className="my-4">
          <img
            alt="eventpic"
            width="90%"
            height="90%"
            className="img-fluid "
            src={eventData.eventImage}
          />
        </Col>
        <Col sm={6} md={6} className="my-5">
          <div className="form-group row">
            <Label className="col-sm-4 col-form-label">Name</Label>
            <div className="col-sm-8">
              <input
                className="form-control"
                name="name"
                type="text"
                ref={register({
                  required: true,
                  pattern: {
                    value: /^[A-Za-z]*$/,
                    message: "Only Letters and spaces"
                  }
                })}
                disabled={booked || eventData.seatsAvailable < 1}
              />
              {errors.name ? (
                errors.name.message ? (
                  <span> {errors.name.message}</span>
                ) : (
                  <span>Please enter your name</span>
                )
              ) : null}
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-4 col-form-label">Email </label>
            <div className="col-sm-8">
              <input
                name="email"
                className="form-control"
                type="email"
                ref={register({
                  required: true,
                  pattern: {
                    value: /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/,
                    message: "Invalid email"
                  }
                })}
                disabled={booked || eventData.seatsAvailable < 1}
              />
              {errors.email ? (
                errors.email.message ? (
                  <span> {errors.email.message}</span>
                ) : (
                  <span>Please enter your email</span>
                )
              ) : null}
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-4 col-form-label">Phone Number</label>
            <div className="col-sm-8">
              <input
                name="phoneNo"
                className="form-control"
                type="text"
                ref={register({
                  required: true,
                  pattern: {
                    value: /^\d{10}$/,
                    message: "Please enter a valid 10 Digit Phone Number"
                  }
                })}
                disabled={booked || eventData.seatsAvailable < 1}
              />
              {errors.phoneNo ? (
                errors.phoneNo.message ? (
                  <span> {errors.phoneNo.message}</span>
                ) : (
                  <span>Please enter the Phone Number</span>
                )
              ) : null}
            </div>
          </div>
          <div className="form-group row">
            <label className="col-sm-4 col-form-label">Number of Seats</label>
            <div className="col-sm-8">
              <select
                name="noOfSeats"
                className="form-control"
                id="noOfSeats"
                onChange={seatsSelect}
                required
                disabled={booked || eventData.seatsAvailable < 1}
              >
                <option value={1}>1</option>
                <option value={2}>2</option>
                <option value={3}>3</option>
                <option value={4}>4</option>
                <option value={5}>5</option>
                <option value={6}>6</option>
              </select>
              <span>{seatmsg}</span>
            </div>
          </div>
          {nameOfAttendee.map((element, index) => {
            const attendeePos = index + 2;
            return (
              <div key={`attendee${attendeePos}`} className="form-group row">
                <label className="col-sm-4 col-form-label">
                  Name of Attendee #{attendeePos}
                </label>
                <div className="col-sm-8">
                  <input
                    type="text"
                    name={index}
                    className="form-control"
                    key={`attendee${attendeePos}`}
                    ref={register({
                      required: true,
                      pattern: {
                        value: /^[A-Za-z]*$/,
                        message: "Only Letters and spaces"
                      }
                    })}
                    id={index}
                    disabled={booked || eventData.seatsAvailable < 1}
                  />
                  {errors[`${index}`] ? (
                    errors[`${index}`].message ? (
                      <span> {errors[`${index}`].message}</span>
                    ) : (
                      <span>
                        Please enter the Name of Attendee # {attendeePos}
                      </span>
                    )
                  ) : null}
                </div>
              </div>
            );
          })}
          <button
            type="submit"
            className=" mb-5 mx-5 btn btn-success"
            disabled={booked || eventData.seatsAvailable < 1}
          >
            Submit
          </button>
          <button
            className="mb-5 btn btn-dark"
            onClick={goBack}
            disabled={booked || eventData.seatsAvailable < 1}
          >
            Cancel
          </button>
        </Col>
      </Row>
    </form>
  );
};

export default FormUpdates;
