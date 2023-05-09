import React from "react";
import { Link } from "react-router-dom";
import moment from "moment";
import PlayerGoalsFooter from "../Helpers/PlayerGoalsFooter";

export default function FixtureDetail({
  fixture,
  sport,
  tab,
  setTab,
  homeScore,
  awayScore,
  homeWickets,
  awayWickets,
  homeOvers,
  awayOvers,
  detailedFixture,
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
    <div className="fixturePage-container--detail">
      <div className="fixturePage-container--detail__header">
        <div className="fixturePage-container--detail__header__completed">
          <div className="fixturePage-container--detail__header__completed__row">
            <Link
              to={`/${sport}/league/${
                fixture?.league?.id ?? fixture?.tournament?.id
              }`}
              className="link"
            >
              {fixture?.league?.name || fixture?.tournament?.name}
            </Link>
            <p>
              {sport === "cricket" || sport === "american-football"
                ? moment.unix(fixture?.startTimestamp).format("DD, MMM")
                : moment(fixture?.date || fixture?.start_at).format("DD, MMM")}
            </p>
          </div>
          <div className="fixturePage-container--detail__header__completed__row">
            {fixture?.status?.short !== "NS" ||
            fixture?.status?.type !== "notstarted" ? (
              <p>Full Time</p>
            ) : (
              <p>Not Started</p>
            )}
          </div>
        </div>
      </div>
      <div className="fixturePage-container--detail__body">
        <div className="fixturePage-container--detail__body__column--first">
          <Link
            to={`/${sport}/team/${
              fixture?.teams?.home?.id ??
              fixture?.homeTeam?.id ??
              fixture?.home_team?.id
            }`}
          >
            <img
              src={
                sport === "cricket" || sport === "american-football"
                  ? renderImage(fixture?.homeTeam?.name)
                  : fixture?.teams?.home?.logo || fixture?.home_team?.logo
              }
              alt="team-img"
            />
          </Link>
          <Link
            className="link"
            to={`/${sport}/team/${
              fixture?.teams?.home?.id ??
              fixture?.homeTeam?.id ??
              fixture?.home_team?.id
            }`}
          >
            {fixture?.teams?.home?.name ||
              fixture?.homeTeam?.name ||
              fixture?.home_team?.name}
          </Link>
        </div>
        <div className="fixturePage-container--detail__body__column--second">
          <div className="column--second__goals">
            <div className="home--score">
              <h2
                style={{
                  fontSize: sport === "cricket" && "1.2rem",
                  whiteSpace: "nowrap",
                }}
              >
                {homeScore} {sport === "cricket" && `/${homeWickets}`}
              </h2>
              {sport === "cricket" &&
                fixture?.homeScore?.innings?.inning2 === undefined && (
                  <span
                    style={{
                      fontSize: "0.875rem",
                      fontWeight: "500",
                      whiteSpace: "nowrap",
                    }}
                  >
                    ({homeOvers})
                  </span>
                )}
              {sport === "cricket" &&
                fixture?.homeScore?.innings?.inning2 !== undefined && (
                  <h3 style={{ fontSize: "1.2rem", textAlign: "center" }}>
                    {fixture?.homeScore?.innings?.inning2?.score} /
                    {fixture?.homeScore?.innings?.inning2?.wickets}
                  </h3>
                )}
            </div>
            <span>-</span>
            <div className="away--score">
              <h2
                style={{
                  fontSize: sport === "cricket" && "1.2rem",
                  whiteSpace: "nowrap",
                }}
              >
                {awayScore}
                {sport === "cricket" && `/${awayWickets}`}
                {sport === "cricket" &&
                  fixture?.awayScore?.innings?.inning2 === undefined && (
                    <span style={{ fontSize: "0.875rem", fontWeight: "500" }}>
                      ({awayOvers})
                    </span>
                  )}
                {sport === "cricket" &&
                  fixture?.awayScore?.innings?.inning2 !== undefined && (
                    <h3
                      style={{
                        fontSize: "1.2rem",
                        textAlign: "center",
                        whiteSpace: "nowrap",
                      }}
                    >
                      {fixture?.awayScore?.innings?.inning2?.score} /
                      {fixture?.awayScore?.innings?.inning2?.wickets}
                    </h3>
                  )}
              </h2>
            </div>
          </div>
        </div>
        <div className="fixturePage-container--detail__body__column--third">
          <Link
            to={`/${sport}/team/${
              fixture?.teams?.away?.id ??
              fixture?.awayTeam?.id ??
              fixture?.away_team?.id
            }`}
          >
            <img
              src={
                sport === "cricket" || sport === "american-football"
                  ? renderImage(fixture?.awayTeam?.name)
                  : fixture?.teams?.away?.logo || fixture?.away_team?.logo
              }
              alt="team-img"
            />
          </Link>
          <Link
            className="link"
            to={`/${sport}/team/${
              fixture?.teams?.away?.id ??
              fixture?.awayTeam?.id ??
              fixture?.away_team?.id
            }`}
          >
            {fixture?.teams?.away?.name ||
              fixture?.awayTeam?.name ||
              fixture?.away_team?.name}
          </Link>
        </div>
      </div>
      {sport === "football" && (
        <div className="fixturePage-container--detail__footer">
          <PlayerGoalsFooter fixture={detailedFixture} />
        </div>
      )}
      <div className="fixturePage-container--detail__filter">
        <p
          onClick={() => setTab(sport !== "baseball" ? "Plays" : "Stats")}
          className={
            sport !== "baseball"
              ? tab === "Plays"
                ? "active"
                : ""
              : tab === "Stats"
              ? "active"
              : ""
          }
        >
          {sport !== "baseball" ? "PLAY BY PLAY" : "STATS"}
        </p>
        {(sport === "football" ||
          sport === "american-football" ||
          sport === "hockey") && (
          <p
            onClick={() => setTab("Lineups")}
            className={tab === "Lineups" ? "active" : ""}
          >
            LINEUPS
          </p>
        )}
        <p
          onClick={() =>
            setTab(
              sport === "rugby" ||
                sport === "football" ||
                sport === "hockey" ||
                sport === "american-football"
                ? "Stats"
                : sport === "cricket"
                ? "Scorecard"
                : "BoxScore"
            )
          }
          className={
            sport === "rugby" ||
            sport === "football" ||
            sport === "hockey" ||
            sport === "american-football"
              ? tab === "Stats"
                ? "active"
                : ""
              : sport === "cricket"
              ? tab === "Scorecard"
                ? "active"
                : ""
              : tab === "BoxScore"
              ? "active"
              : ""
          }
        >
          {sport === "rugby" ||
          sport === "football" ||
          sport === "hockey" ||
          sport === "american-football"
            ? "STATS"
            : sport === "cricket"
            ? "SCORECARD"
            : "BOXSCORE"}
        </p>
      </div>
    </div>
  );
}
