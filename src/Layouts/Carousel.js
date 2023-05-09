import moment from "moment";
import React from "react";
import { Link } from "react-router-dom";

export default function Carousel({
  toggle,
  teams,
  date,
  homeScores,
  awayScores,
  homeTeam,
  awayTeam,
  homeWickets,
  awayWickets,
  sport,
}) {
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
    <div className={`carousel-card ${toggle && "current-card"}`}>
      <div className="carousel-card__fixture-details">
        <div className="team--flags">
          <Link to={`/${sport}/team/${teams?.home?.id}`}>
            <img
              src={
                sport !== "cricket" && sport !== "american-football"
                  ? teams?.home?.logo
                  : renderImage(homeTeam)
              }
              alt="team-img"
            />
          </Link>
          <Link to={`/${sport}/team/${teams?.away?.id}`}>
            <img
              src={
                sport !== "cricket" && sport !== "american-football"
                  ? teams?.away?.logo
                  : renderImage(awayTeam)
              }
              alt="team-img"
            />
          </Link>
        </div>
        <div className="fixture--details">
          <div className="details__time">
            {sport === "cricket" || sport === "american-football"
              ? moment.unix(date)?.utc().local().format("HH:mm")
              : date?.split("T")[1].substring(0, 5)}
          </div>
          <div className="details__date">
            {sport === "cricket" || sport === "american-football"
              ? moment.unix(date)?.utc().local().format("MM/DD")
              : `${date?.split("T")[0].split("-")[2]} / ${
                  date?.split("T")[0].split("-")[1]
                }`}
          </div>
        </div>
      </div>
      <div className="carousel-card__teams">
        <div
          className={`${
            homeScores < awayScores ? "losing--score" : ""
          } carousel-card__teams--home`}
        >
          <Link className="link" to={`/${sport}/team/${teams?.home?.id}`}>
            {teams?.home?.name || homeTeam}
          </Link>
          <p className={homeScores < awayScores ? "losing--score" : ""}>
            {homeScores}{" "}
            {sport === "cricket" &&
              homeScores !== undefined &&
              "/" + homeWickets}
          </p>
        </div>
        <div
          className={`${
            awayScores < homeScores ? "losing--score" : ""
          } carousel-card__teams--away`}
        >
          <Link className="link" to={`/${sport}/team/${teams?.away?.id}`}>
            {teams?.away?.name || awayTeam}
          </Link>
          <p className={awayScores < homeScores ? "losing--score" : ""}>
            {awayScores}{" "}
            {sport === "cricket" &&
              awayScores !== undefined &&
              "/" + awayWickets}
          </p>
        </div>
      </div>
    </div>
  );
}
