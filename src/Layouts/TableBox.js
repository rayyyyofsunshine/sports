import React, { useState, useEffect, useContext } from "react";
import _ from "lodash";
import TableFixtureList from "./TableFixtureList";
import { Link } from "react-router-dom";
import { DataContext } from "../Helpers/DataContext";
import Calendar from "../Components/Calendar/Calendar";

export default function TableBox({ sport, height }) {
  const [gameStatus, setGameStatus] = useState("NS");
  const [isHeaderActive, setIsHeaderActive] = useState(false);
  const {
    matchFinishedData,
    matchNotStartedData,
    matchCancelledData,
    matchOnGoingData,
  } = useContext(DataContext);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setIsHeaderActive(true);
      } else {
        setIsHeaderActive(false);
      }
    };
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div className="tableBox-container">
      <div className="tableBox-container--mask"></div>
      <div
        className={`tableBox-container__header--wrappper ${
          isHeaderActive ? "header--wrapper-active" : ""
        }`}
      >
        <div className="tableBox-container__header">
          <h4>
            {sport} <span>Games</span>
          </h4>
          <Calendar />
        </div>
        <div className="tableBox-container__filter">
          <p
            onClick={() => setGameStatus("NS")}
            className={gameStatus === "NS" ? "tab active-tab" : "tab"}
          >
            Not Started
          </p>
          <p
            onClick={() => setGameStatus("LIVE")}
            className={gameStatus === "LIVE" ? "tab active-tab" : "tab"}
          >
            Live Games
          </p>
          <p
            onClick={() => setGameStatus("FT")}
            className={gameStatus === "FT" ? "tab active-tab" : "tab"}
          >
            Completed Games
          </p>
          <p
            onClick={() => setGameStatus("CANC")}
            className={gameStatus === "CANC" ? "tab active-tab" : "tab"}
          >
            Cancelled Games
          </p>
        </div>
      </div>
      <div
        style={{
          height:
            sport === "football"
              ? window.matchMedia("(min-width: 1024px)").matches
                ? `calc(830px - ${height}px)`
                : "calc(100% - 125px)"
              : "calc(100% - 125px)",
        }}
        className="tableBox-container__body"
      >
        {Object.entries(
          _.groupBy(
            matchNotStartedData?.[sport],
            sport !== "cricket" && sport !== "american-football"
              ? "league.id"
              : "tournament.id"
          )
        ).length > 0
          ? Object.entries(
              _.groupBy(
                matchNotStartedData?.[sport],
                sport !== "cricket" && sport !== "american-football"
                  ? "league.id"
                  : "tournament.id"
              )
            ).map((item, index) => (
              <div
                key={index + "-NS"}
                className={
                  gameStatus === "NS"
                    ? "tableBox-container__body__content active--content"
                    : "tableBox-container__body__content"
                }
              >
                <div className="tableBox-container__body__content--sub-header">
                  <Link
                    className="link"
                    to={`/${sport}/league/${
                      item[1][0]?.league?.id || item[1][0]?.tournament?.id
                    }`}
                  >
                    {item[1][0]?.league?.name || item[1][0]?.tournament?.name}
                  </Link>
                  <p>
                    {item[1][0].league?.country ||
                      item[1][0]?.country?.name ||
                      item[1][0]?.tournament?.category?.name ||
                      item[1][0]?.section?.name}
                  </p>
                </div>
                <div className="tableBox-container__body__content--sub-body">
                  {item[1].map((fixture) => (
                    <TableFixtureList
                      sport={sport}
                      key={fixture?.fixture?.id || fixture?.id}
                      toggle={false}
                      fixture={fixture}
                      homeScore={
                        fixture?.goals?.home ||
                        (sport === "basketball" || sport === "baseball"
                          ? fixture?.scores?.home?.total
                          : fixture?.scores?.home) ||
                        fixture?.homeScore?.innings?.inning1?.score ||
                        fixture?.home_score?.display
                      }
                      awayScore={
                        fixture?.goals?.away ||
                        (sport === "basketball" || sport === "baseball"
                          ? fixture?.scores?.away?.total
                          : fixture?.scores?.away) ||
                        fixture?.awayScore?.innings?.inning1?.score ||
                        fixture?.away_score?.display
                      }
                      homeWickets={
                        fixture?.homeScore?.innings?.inning1?.wickets
                      }
                      awayWickets={
                        fixture?.awayScore?.innings?.inning1?.wickets
                      }
                    />
                  ))}
                </div>
              </div>
            ))
          : gameStatus === "NS" && (
              <div className="tableBox-container--alt">
                <p>No Upcoming fixtures.</p>
              </div>
            )}
        {Object.entries(
          _.groupBy(
            matchOnGoingData?.[sport],
            sport !== "cricket" && sport !== "american-football"
              ? "league.id"
              : "tournament.id"
          )
        ).length > 0
          ? Object.entries(
              _.groupBy(
                matchOnGoingData?.[sport],
                sport !== "cricket" && sport !== "american-football"
                  ? "league.id"
                  : "tournament.id"
              )
            ).map((item, index) => (
              <div
                key={index + "-LIVE"}
                className={
                  gameStatus === "LIVE"
                    ? "tableBox-container__body__content active--content"
                    : "tableBox-container__body__content"
                }
              >
                <div className="tableBox-container__body__content--sub-header">
                  <Link
                    className="link"
                    to={`/${sport}/league/${
                      item[1][0]?.league?.id || item[1][0]?.tournament?.id
                    }`}
                  >
                    {item[1][0]?.league?.name || item[1][0]?.tournament?.name}
                  </Link>
                  <p>
                    {item[1][0].league?.country ||
                      item[1][0]?.country?.name ||
                      item[1][0]?.tournament?.category?.name ||
                      item[1][0]?.section?.name}
                  </p>
                </div>
                <div className="tableBox-container__body__content--sub-body">
                  {item[1].map((fixture) => (
                    <TableFixtureList
                      sport={sport}
                      key={fixture?.fixture?.id || fixture?.id}
                      toggle={true}
                      fixture={fixture}
                      homeScore={
                        fixture?.goals?.home ||
                        (sport === "basketball" || sport === "baseball"
                          ? fixture?.scores?.home?.total
                          : fixture?.scores?.home) ||
                        fixture?.homeScore?.innings?.inning1?.score ||
                        fixture?.home_score?.display
                      }
                      awayScore={
                        fixture?.goals?.away ||
                        (sport === "basketball" || sport === "baseball"
                          ? fixture?.scores?.away?.total
                          : fixture?.scores?.away) ||
                        fixture?.awayScore?.innings?.inning1?.score ||
                        fixture?.away_score?.display
                      }
                      homeWickets={
                        fixture?.homeScore?.innings?.inning1?.wickets
                      }
                      awayWickets={
                        fixture?.awayScore?.innings?.inning1?.wickets
                      }
                    />
                  ))}
                </div>
              </div>
            ))
          : gameStatus === "LIVE" && (
              <div className="tableBox-container--alt">
                <p>No Live fixtures.</p>
              </div>
            )}
        {Object.entries(
          _.groupBy(
            matchFinishedData?.[sport],
            sport !== "cricket" && sport !== "american-football"
              ? "league.id"
              : "tournament.id"
          )
        ).length > 0
          ? Object.entries(
              _.groupBy(
                matchFinishedData?.[sport],
                sport !== "cricket" && sport !== "american-football"
                  ? "league.id"
                  : "tournament.id"
              )
            ).map((item, index) => (
              <div
                key={index + "-FT"}
                className={
                  gameStatus === "FT"
                    ? "tableBox-container__body__content active--content"
                    : "tableBox-container__body__content"
                }
              >
                <div className="tableBox-container__body__content--sub-header">
                  <Link
                    className="link"
                    to={`/${sport}/league/${
                      item[1][0]?.league?.id || item[1][0]?.tournament?.id
                    }`}
                  >
                    {item[1][0]?.league?.name || item[1][0]?.tournament?.name}
                  </Link>
                  <p>
                    {item[1][0].league?.country ||
                      item[1][0]?.country?.name ||
                      item[1][0]?.tournament?.category?.name ||
                      item[1][0]?.section?.name}
                  </p>
                </div>
                <div className="tableBox-container__body__content--sub-body">
                  {item[1].map((fixture) => (
                    <TableFixtureList
                      sport={sport}
                      key={fixture?.fixture?.id || fixture?.id}
                      toggle={false}
                      fixture={fixture}
                      homeScore={
                        fixture?.goals?.home ||
                        (sport === "basketball" || sport === "baseball"
                          ? fixture?.scores?.home?.total
                          : fixture?.scores?.home) ||
                        fixture?.homeScore?.innings?.inning1?.score ||
                        fixture?.home_score?.display
                      }
                      awayScore={
                        fixture?.goals?.away ||
                        (sport === "basketball" || sport === "baseball"
                          ? fixture?.scores?.away?.total
                          : fixture?.scores?.away) ||
                        fixture?.awayScore?.innings?.inning1?.score ||
                        fixture?.away_score?.display
                      }
                      homeWickets={
                        fixture?.homeScore?.innings?.inning1?.wickets
                      }
                      awayWickets={
                        fixture?.awayScore?.innings?.inning1?.wickets
                      }
                    />
                  ))}
                </div>
              </div>
            ))
          : gameStatus === "FT" && (
              <div className="tableBox-container--alt">
                <p>None of the fixtures have been completed yet.</p>
              </div>
            )}
        {Object.entries(
          _.groupBy(
            matchCancelledData?.[sport],
            sport !== "cricket" && sport !== "american-football"
              ? "league.id"
              : "tournament.id"
          )
        ).length > 0
          ? Object.entries(
              _.groupBy(
                matchCancelledData?.[sport],
                sport !== "cricket" && sport !== "american-football"
                  ? "league.id"
                  : "tournament.id"
              )
            ).map((item, index) => (
              <div
                key={index + "-CANC"}
                className={
                  gameStatus === "CANC"
                    ? "tableBox-container__body__content active--content"
                    : "tableBox-container__body__content"
                }
              >
                <div className="tableBox-container__body__content--sub-header">
                  <Link
                    className="link"
                    to={`/${sport}/league/${
                      item[1][0]?.league?.id || item[1][0]?.tournament?.id
                    }`}
                  >
                    {item[1][0]?.league?.name || item[1][0]?.tournament?.name}
                  </Link>
                  <p>
                    {item[1][0].league?.country ||
                      item[1][0]?.country?.name ||
                      item[1][0]?.tournament?.category?.name ||
                      item[1][0]?.section?.name}
                  </p>
                </div>
                <div className="tableBox-container__body__content--sub-body">
                  {item[1].map((fixture) => (
                    <TableFixtureList
                      sport={sport}
                      key={fixture?.fixture?.id || fixture?.id}
                      toggle={false}
                      fixture={fixture}
                      homeScore={
                        fixture?.goals?.home ||
                        (sport === "basketball" || sport === "baseball"
                          ? fixture?.scores?.home?.total
                          : fixture?.scores?.home) ||
                        fixture?.homeScore?.innings?.inning1?.score ||
                        fixture?.home_score?.display
                      }
                      awayScore={
                        fixture?.goals?.away ||
                        (sport === "basketball" || sport === "baseball"
                          ? fixture?.scores?.away?.total
                          : fixture?.scores?.away) ||
                        fixture?.awayScore?.innings?.inning1?.score ||
                        fixture?.away_score?.display
                      }
                      homeWickets={
                        fixture?.homeScore?.innings?.inning1?.wickets
                      }
                      awayWickets={
                        fixture?.awayScore?.innings?.inning1?.wickets
                      }
                    />
                  ))}
                </div>
              </div>
            ))
          : gameStatus === "CANC" && (
              <div className="tableBox-container--alt">
                <p>No Cancelled fixtures.</p>
              </div>
            )}
      </div>
      <div className="tableBox-container--mask"></div>
    </div>
  );
}
