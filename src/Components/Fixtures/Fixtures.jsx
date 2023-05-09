import React, { forwardRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import moment from "moment/moment";

const Fixtures = forwardRef(({ sport, fixture }, ref) => {
  const navigate = useNavigate();

  function renderImage(path) {
    try {
      return sport === "cricket"
        ? require(`../../Assets/Cricket Teams/${path}.png`)
        : require(`../../Assets/A-Football Teams/${path}.gif`);
    } catch (err) {
      return "https://www.seekpng.com/png/small/28-289657_espn-soccer-team-logo-default.png";
    }
  }

  function getScore(side) {
    if (sport === "football") {
      return fixture?.goals?.[side];
    } else if (sport === "baseball" || sport === "basketball") {
      return fixture?.scores?.[side]?.total;
    } else if (sport !== "cricket" && sport !== "american-football") {
      return fixture?.scores?.[side];
    } else {
      if (sport === "cricket" && fixture?.[side]?.innings !== undefined) {
        return `${fixture?.[side]?.innings?.inning1?.score} / ${fixture?.[side]?.innings?.inning1?.wickets}`;
      } else if (sport === "american-football") {
        return fixture?.[side]?.display;
      } else {
        return null;
      }
    }
  }

  return (
    <div
      ref={ref}
      key={fixture?.id ? fixture?.id || fixture?.fixture?.id : Math.random()}
      onClick={() => {
        navigate(`/${sport}/fixture/${fixture?.fixture?.id || fixture?.id}`, {
          state: fixture,
        });
      }}
      className="fixturesTab-container__body__box"
    >
      <div className="fixturesTab-container__body__box__row">
        <div className="fixturesTab-container__body__box__row--left">
          <Link
            onClick={(e) => e.stopPropagation()}
            className="link"
            to={`/${sport}/team/${
              fixture?.teams?.home?.id || fixture?.homeTeam?.id
            }`}
          >
            <div className="teamInfo">
              <img
                src={
                  sport === "cricket" || sport === "american-football"
                    ? renderImage(fixture?.homeTeam?.name)
                    : fixture?.teams?.home?.logo
                }
                alt={fixture?.teams?.home?.name || fixture?.homeTeam?.name}
              />
              <h3>{fixture?.teams?.home?.name || fixture?.homeTeam?.name}</h3>
            </div>
          </Link>
          <div className="scoreInfo">
            <span
              className={
                sport === "cricket" || sport === "american-football"
                  ? fixture.winnerCode === 1
                    ? "active"
                    : ""
                  : getScore("home") > getScore("away")
                  ? "active"
                  : ""
              }
            >
              {getScore(
                sport === "cricket" || sport === "american-football"
                  ? "homeScore"
                  : "home"
              )}
            </span>
          </div>
        </div>
        <span className="vs-container">V</span>
        <div className="fixturesTab-container__body__box__row--right">
          <div className="scoreInfo">
            <span
              className={
                sport === "cricket" || sport === "american-football"
                  ? fixture.winnerCode === 2
                    ? "active"
                    : ""
                  : getScore("home") < getScore("away")
                  ? "active"
                  : ""
              }
            >
              {getScore(
                sport === "cricket" || sport === "american-football"
                  ? "awayScore"
                  : "away"
              )}
            </span>
          </div>
          <Link
            onClick={(e) => e.stopPropagation()}
            className="link"
            to={`/${sport}/team/${
              fixture?.teams?.away?.id || fixture?.awayTeam?.id
            }`}
          >
            <div className="teamInfo">
              <h3>{fixture?.teams?.away?.name || fixture?.awayTeam?.name}</h3>
              <img
                src={
                  sport === "cricket" || sport === "american-football"
                    ? renderImage(fixture?.awayTeam?.name)
                    : fixture?.teams?.away?.logo
                }
                alt={fixture?.teams?.away?.name || fixture?.awayTeam?.name}
              />
            </div>
          </Link>
        </div>
      </div>
      <div className="fixturesTab-container__body__box__row">
        <div className="fixturesTab-container__body__box__row--left bottom--row">
          <p>
            {sport === "cricket" || sport === "american-football"
              ? "Tournament "
              : "League "}
            :
            <Link
              onClick={(e) => e.stopPropagation()}
              className="link"
              to={`/${sport}/league/${
                fixture?.league?.id || fixture?.tournament?.uniqueTournament?.id
              }`}
            >
              {fixture?.league?.name || fixture?.tournament?.name}
            </Link>
          </p>
          {window.innerWidth < 1024 ? (
            <div className="date-col">
              {sport === "cricket" || sport === "american-football"
                ? moment.unix(fixture?.startTimestamp).format("dddd,")
                : moment(fixture?.date || fixture?.fixture?.date).format(
                    "dddd,"
                  )}
              <span>
                {sport === "cricket" || sport === "american-football"
                  ? moment.unix(fixture?.startTimestamp).format("do Mo")
                  : moment(fixture?.date || fixture?.fixture?.date).format(
                      "MMM Do"
                    )}
              </span>
            </div>
          ) : (
            <p>
              Date :
              <span>
                {sport === "cricket" || sport === "american-football"
                  ? moment.unix(fixture?.startTimestamp).format("dddd, MMM Do")
                  : moment(fixture?.date || fixture?.fixture?.date).format(
                      "dddd, MMM Do"
                    )}
              </span>
            </p>
          )}
        </div>
        <div className="fixturesTab-container__body__box__row--right bottom--row">
          <p>
            <span>
              {fixture?.league?.season || fixture?.tournament?.category?.name}
            </span>
            :
            {sport === "cricket" || sport === "american-football"
              ? "Category"
              : "Season"}
          </p>
          <p>
            <span>
              {fixture?.league?.type ||
                fixture?.league?.round ||
                fixture?.tournament?.uniqueTournament?.name}
            </span>
            : Type
          </p>
        </div>
      </div>
    </div>
  );
});

export default Fixtures;
