import React, { useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import axios from "axios";
import { flagTournaments } from "../Helpers/Utilities";
import { instance } from "../Api/Request";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretRight } from "@fortawesome/free-solid-svg-icons";

export default function CountriesList({ countries, sport, fetchUrl }) {
  let countryId = 0;
  const [listVisibility, setListVisibility] = useState(false);

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

  function renderImage(path) {
    try {
      return require(`../Assets/Countries/${path}.png`);
    } catch (err) {
      return "https://www.seekpng.com/png/small/28-289657_espn-soccer-team-logo-default.png";
    }
  }

  if (isError) {
    return (
      <div className="error-container">
        Too many requests, come back after some time or another day. :(
      </div>
    );
  }

  return (
    <div className="countriesList-container">
      <div className="countriesList-container__header">
        <h4>Leagues by country</h4>
        {listVisibility && (
          <i
            onClick={() => setListVisibility(!listVisibility)}
            className="fas fa-arrow-left"
          ></i>
        )}
      </div>
      <div className="countriesList-container__body">
        <div
          className={
            listVisibility
              ? "countriesList-container__body--countries"
              : "countriesList-container__body--countries active--countries"
          }
        >
          {countries?.map((country, index) => (
            <div
              onClick={() => {
                setListVisibility(!listVisibility);
                sport === "cricket" || sport === "american-football"
                  ? (countryId = country?.id)
                  : (fetchUrl.params.country = country.name);
                refetchLeagues();
              }}
              key={index}
              className="list__content__box"
            >
              <img
                src={
                  sport === "cricket" || sport === "american-football"
                    ? renderImage(country?.name)
                    : country.flag
                }
                alt="country-img"
              />
              <h4>{country.name}</h4>
              <FontAwesomeIcon className="icon" icon={faCaretRight} />
            </div>
          ))}
        </div>
        <div
          style={{ gap: "0.75em" }}
          className={
            listVisibility
              ? "countriesList-container__body--leagues active--leagues"
              : "countriesList-container__body--leagues"
          }
        >
          {listVisibility &&
          (sport === "cricket" || sport === "american-football")
            ? leaguesData?.data?.groups?.[0]?.uniqueTournaments?.map(
                (league) => (
                  <Link
                    to={`/${sport}/league/${league?.id}`}
                    key={league?.id}
                    className="link"
                  >
                    <div className="list__content__box">
                      <img
                        src={flagTournaments?.[league?.name]}
                        alt="league-img"
                      />
                      <h4>{league?.name}</h4>
                    </div>
                  </Link>
                )
              )
            : listVisibility &&
              leaguesData?.data?.response.map((league) => (
                <Link
                  to={`/${sport}/league/${league?.league?.id ?? league?.id}`}
                  key={league?.league?.id | league?.id}
                  className="link"
                >
                  <div className="list__content__box">
                    <img
                      src={league?.league?.logo || league?.logo}
                      alt="league-img"
                    />
                    <h4>{league?.league?.name || league?.name}</h4>
                  </div>
                </Link>
              ))}
        </div>
      </div>
    </div>
  );
}
