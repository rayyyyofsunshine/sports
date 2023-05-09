import React, { useContext, useEffect, useState } from "react";
import {
  faAngleRight,
  faArrowLeft,
  faBars,
  faEarth,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link, useLocation } from "react-router-dom";
import { DataContext } from "../../Helpers/DataContext";
import { useQuery } from "react-query";
import axios from "axios";
import { instance } from "../../Api/Request";
import { flagTournaments } from "../../Helpers/Utilities";
import { getFutLeagues } from "../../Api/FutRequest";
import { getBskLeagues } from "../../Api/BskRequest";
import { getBsbLeagues } from "../../Api/BsbRequest";
import { getHkyLeagues } from "../../Api/HkyRequest";
import { getRgyLeagues } from "../../Api/RgyRequest";

const NavBar = () => {
  const location = useLocation();
  let sport = location.pathname.split("/")[1];

  const [isNavBarOpen, setIsNavBarOpen] = useState(false);
  const [isListVisible, setIslistVisible] = useState(false);
  const [isLeagueVisible, setIsLeagueVisible] = useState(false);

  const { countriesList } = useContext(DataContext);

  let countryId = 0;
  let fetchUrl;

  if (sport === "football") {
    fetchUrl = getFutLeagues;
  } else if (sport === "basketball") {
    fetchUrl = getBskLeagues;
  } else if (sport === "baseball") {
    fetchUrl = getBsbLeagues;
  } else if (sport === "hockey") {
    fetchUrl = getHkyLeagues;
  } else if (sport === "rugby") {
    fetchUrl = getRgyLeagues;
  }

  const {
    data: leaguesData,
    refetch: refetchLeagues,
    isError,
  } = useQuery(
    "leagueData",
    () =>
      sport !== "cricket" && sport !== "american-football"
        ? axios(fetchUrl)
        : instance.get(`/${sport}/tournament/all/category/${countryId}`),
    {
      refetchOnWindowFocus: false,
      enabled: false,
    }
  );

  useEffect(() => {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 100) {
        document
          .querySelector(".navbar-container")
          .classList.add("navbar-container--bg");
      } else {
        document
          .querySelector(".navbar-container")
          .classList.remove("navbar-container--bg");
      }
    });
    return () => {
      window.removeEventListener("scroll", () => console.log("Remove Scroll"));
    };
  }, []);

  function renderImage(path) {
    try {
      return require(`../../Assets/Countries/${path}.png`);
    } catch (err) {
      return "https://www.seekpng.com/png/small/28-289657_espn-soccer-team-logo-default.png";
    }
  }

  const renderLeagueLink = (sport, league) => {
    const id = league?.league?.id ?? league?.id;
    const name = league?.league?.name || league?.name;
    const logo = league?.league?.logo || league?.logo;
    const flag = flagTournaments?.[name];

    return (
      <Link to={`/${sport}/league/${id}`} key={id} className="link">
        <img src={flag || logo} alt="league-img" />
        <p>{name}</p>
        <FontAwesomeIcon className="icon" icon={faAngleRight} />
      </Link>
    );
  };

  if (isError) {
    return (
      <div className="error-container">
        Too many requests, come back after some time or another day. :(
      </div>
    );
  }

  return (
    <div className="navbar-container">
      <div className="menu">
        <FontAwesomeIcon
          onClick={() => setIsNavBarOpen((v) => !v)}
          className="icon"
          icon={faBars}
        />
        <Link className="link" to={sport}>
          {sport}
        </Link>
        <FontAwesomeIcon
          onClick={() => setIslistVisible((v) => !v)}
          className="icon"
          icon={faEarth}
        />
      </div>
      <div className={`nav--list ${isNavBarOpen ? "nav--list__active" : ""}`}>
        <Link
          onClick={() => setIsNavBarOpen(false)}
          className="nav--links link"
          to={"/football"}
        >
          <p>Football</p>
          <FontAwesomeIcon className="icon" icon={faAngleRight} />
        </Link>
        <Link
          onClick={() => setIsNavBarOpen(false)}
          className="nav--links link"
          to={"/basketball"}
        >
          <p>Basketball</p>
          <FontAwesomeIcon className="icon" icon={faAngleRight} />
        </Link>
        <Link
          onClick={() => setIsNavBarOpen(false)}
          className="nav--links link"
          to={"/baseball"}
        >
          <p>Baseball</p>
          <FontAwesomeIcon className="icon" icon={faAngleRight} />
        </Link>
        <Link
          onClick={() => setIsNavBarOpen(false)}
          className="nav--links link"
          to={"/cricket"}
        >
          <p>Cricket</p>
          <FontAwesomeIcon className="icon" icon={faAngleRight} />
        </Link>
        <Link
          onClick={() => setIsNavBarOpen(false)}
          className="nav--links link"
          to={"/rugby"}
        >
          <p>Rugby</p>
          <FontAwesomeIcon className="icon" icon={faAngleRight} />
        </Link>
        <Link
          onClick={() => setIsNavBarOpen(false)}
          className="nav--links link"
          to={"/hockey"}
        >
          <p>Hockey</p>
          <FontAwesomeIcon className="icon" icon={faAngleRight} />
        </Link>
        <Link
          onClick={() => setIsNavBarOpen(false)}
          className="nav--links link"
          to={"/american-football"}
        >
          <p>American Football</p>
          <FontAwesomeIcon className="icon" icon={faAngleRight} />
        </Link>
      </div>
      <div className={`nav--list ${isListVisible ? "nav--list__active" : ""}`}>
        <h4>Browse leagues by country -</h4>
        <ul>
          {countriesList?.[sport]?.map((country, index) => (
            <li
              onClick={() => {
                sport === "cricket" || sport === "american-football"
                  ? (countryId = country?.id)
                  : (fetchUrl.params.country = country.name);
                refetchLeagues();
                setIsLeagueVisible(true);
              }}
              key={index}
            >
              <img
                src={
                  sport === "cricket" || sport === "american-football"
                    ? renderImage(country?.name)
                    : country.flag
                }
                alt="country-img"
              />
              <p>{country?.name}</p>
              <FontAwesomeIcon className="icon" icon={faAngleRight} />
            </li>
          ))}
        </ul>
      </div>
      <div
        className={`nav--list ${
          isLeagueVisible ? "nav--list__active league--active" : ""
        }`}
      >
        <div onClick={() => setIsLeagueVisible(false)} className="list--header">
          <FontAwesomeIcon className="icon goBack--icon" icon={faArrowLeft} />
          <p>Go Back</p>
        </div>
        <ul>
          {leaguesData?.data?.response?.map((league) =>
            renderLeagueLink(sport, league)
          )}
          {leaguesData?.data?.groups?.[0]?.uniqueTournaments?.map((league) =>
            renderLeagueLink(sport, league)
          )}
        </ul>
      </div>
    </div>
  );
};

export default NavBar;
