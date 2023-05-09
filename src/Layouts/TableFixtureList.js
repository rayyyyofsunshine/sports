import moment from "moment";
import React from "react";
import { useNavigate } from "react-router";
import { Link } from "react-router-dom";

export default function TableFixtureList({
  toggle,
  fixture,
  sport,
  homeScore,
  awayScore,
  homeWickets,
  awayWickets,
}) {
  const navigate = useNavigate();

  function renderImage(path) {
    try {
      return sport === "cricket"
        ? require(`../Assets/Cricket Teams/${path}.png`)
        : require(`../Assets/A-Football Teams/${path}.gif`);
    } catch (err) {
      return "https://www.seekpng.com/png/small/28-289657_espn-soccer-team-logo-default.png";
    }
  }

  return (
    <div
      onClick={() => {
        navigate(`/${sport}/fixture/${fixture?.fixture?.id || fixture?.id}`, {
          state: fixture,
        });
      }}
      className="tableFixture-container"
    >
      <div className="tableFixture-container__info">
        <div className="tableFixture-container__info--time">
          <div className="tableFixture-container__info--time__details">
            <p className="details__time">
              {sport !== "cricket" && sport !== "american-football"
                ? moment(fixture?.fixture?.date || fixture?.date)
                    .utc()
                    .local()
                    .format("HH:mm")
                : moment
                    .unix(fixture?.startTimestamp)
                    .utc()
                    .local()
                    .format("HH:mm")}
            </p>
            <p className="details__date">
              {sport !== "cricket" && sport !== "american-football"
                ? moment(fixture?.fixture?.date || fixture?.date)
                    .utc()
                    .local()
                    .format("DD / MM")
                : moment
                    .unix(fixture?.startTimestamp)
                    .utc()
                    .local()
                    .format("DD / MM")}
            </p>
          </div>
          {toggle && (
            <div className="tableFixture-container__info--time__is-live">
              <button>L</button>
            </div>
          )}
        </div>
        <div className="tableFixture-container__info--team">
          <div className="team--img">
            <Link
              className="link"
              to={`/${sport}/team/${
                fixture?.teams?.home?.id ??
                fixture?.homeTeam?.id ??
                fixture?.home_team?.id
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`home-team-flag ${
                  homeScore > awayScore ? "winning-team" : ""
                }`}
              >
                <img
                  src={
                    sport !== "cricket" && sport !== "american-football"
                      ? fixture?.teams?.home?.logo
                      : renderImage(fixture?.homeTeam?.name)
                  }
                  alt="team-logo"
                />
                {homeScore > awayScore && (
                  <span className="more-goals goals-home">
                    <i className="fas fa-futbol"></i>
                  </span>
                )}
              </div>
            </Link>
            <Link
              className="link"
              to={`/${sport}/team/${
                fixture?.teams?.away?.id ??
                fixture?.awayTeam?.id ??
                fixture?.away_team?.id
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              <div
                className={`away-team-flag ${
                  homeScore < awayScore ? "winning-team" : ""
                }`}
              >
                <img
                  src={
                    sport !== "cricket" && sport !== "american-football"
                      ? fixture?.teams?.away?.logo
                      : renderImage(fixture?.awayTeam?.name)
                  }
                  alt="team-logo"
                />
                {homeScore < awayScore && (
                  <span className="more-goals goals-away">
                    <i className="fas fa-futbol"></i>
                  </span>
                )}
              </div>
            </Link>
          </div>
          <div className="team--name">
            <Link
              className="link"
              to={`/${sport}/team/${
                fixture?.teams?.home?.id ??
                fixture?.homeTeam?.id ??
                fixture?.home_team?.id
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {fixture?.teams?.home?.name ||
                fixture?.homeTeam?.name ||
                fixture?.home_team?.name}
            </Link>
            <Link
              className="link"
              to={`/${sport}/team/${
                fixture?.teams?.away?.id ??
                fixture?.awayTeam?.id ??
                fixture?.away_team?.id
              }`}
              onClick={(e) => e.stopPropagation()}
            >
              {fixture?.teams?.away?.name ||
                fixture?.awayTeam?.name ||
                fixture?.away_team?.name}
            </Link>
          </div>
        </div>
      </div>
      <div className="tableFixture-container__score">
        <p className={homeScore > awayScore ? "winning-score" : ""}>
          {homeScore}
          {homeWickets !== undefined && "/" + homeWickets}
        </p>
        <p className={homeScore < awayScore ? "winning-score" : ""}>
          {awayScore}
          {awayWickets !== undefined && "/" + awayWickets}
        </p>
      </div>
    </div>
  );
}
