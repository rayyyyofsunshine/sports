import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFutbol } from "@fortawesome/free-regular-svg-icons";
import {
  faBars,
  faBaseball,
  faBasketball,
  faFootball,
  faHockeyPuck,
} from "@fortawesome/free-solid-svg-icons";
import { Link, useLocation } from "react-router-dom";

const SideBar = () => {
  const location = useLocation();
  return (
    <div className="sidebar">
      <div className="logo__content">
        <FontAwesomeIcon className="icon" icon={faBars} />
      </div>
      <ul className="nav__list">
        <li className={location.pathname.includes("football") ? "active" : ""}>
          <Link className="link" to={"/football"}>
            <FontAwesomeIcon className="icon" icon={faFutbol} />
          </Link>
          <span className="tooltip">Football</span>
        </li>
        <li
          className={location.pathname.includes("basketball") ? "active" : ""}
        >
          <Link className="link" to={"/basketball"}>
            <FontAwesomeIcon className="icon" icon={faBasketball} />
          </Link>
          <span className="tooltip">Basketball</span>
        </li>
        <li
          className={
            location.pathname.includes("cricket")
              ? "cricket--list active"
              : "cricket--list"
          }
        >
          <Link className="link" to={"/cricket"}>
            <img
              className="cricket--icon"
              src={require("../../Assets/cricket-ball.png")}
              alt=""
            />
          </Link>
          <span className="tooltip">Cricket</span>
        </li>
        <li className={location.pathname.includes("rugby") ? "active" : ""}>
          <Link className="link" to={"/rugby"}>
            <FontAwesomeIcon className="icon" icon={faFootball} />
          </Link>
          <span className="tooltip">Rugby</span>
        </li>
        <li className={location.pathname.includes("baseball") ? "active" : ""}>
          <Link className="link" to={"/baseball"}>
            <FontAwesomeIcon className="icon" icon={faBaseball} />
          </Link>
          <span className="tooltip">Baseball</span>
        </li>
        <li className={location.pathname.includes("hockey") ? "active" : ""}>
          <Link className="link" to={"/hockey"}>
            <FontAwesomeIcon className="icon" icon={faHockeyPuck} />
          </Link>
          <span className="tooltip">Hockey</span>
        </li>
        <li
          className={
            location.pathname.includes("american-football") ? "active" : ""
          }
        >
          <Link className="link" to={"/american-football"}>
            <FontAwesomeIcon className="icon" icon={faFootball} />
          </Link>
          <span className="tooltip">American Football</span>
        </li>
      </ul>
    </div>
  );
};

export default SideBar;
