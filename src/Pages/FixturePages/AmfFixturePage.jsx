import React, { useState } from "react";
import { useParams, useLocation, Link } from "react-router-dom";
import { useQuery } from "react-query";
import FixtureStatistics from "../../Components/FixtureStatistics/FixtureStatistics";
import FixtureDetail from "../../Layouts/FixtureDetail";
import PlayByPlay from "../../Components/PlayByPlay/PlayByPlay";
import BoxScore from "../../Components/BoxScore/BoxScore";
import { instance } from "../../Api/Request";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFootball } from "@fortawesome/free-solid-svg-icons";

export default function AmfFixturePage() {
  const { id } = useParams();
  let location = useLocation();
  const [tab, setTab] = useState("Stats");
  const [teamIndex, setTeamIndex] = useState(0);

  const {
    data: fixtureStats,
    isLoading: isStatsLoading,
    isError: isError1,
  } = useQuery(
    ["amfFixtureStats", id],
    () =>
      instance
        .get(`/american-football/match/${id}/statistics`)
        .then((res) => res.data),
    {
      refetchOnWindowFocus: false,
      enabled: !!id,
    }
  );

  const {
    data: lineUps,
    isLoading: isLineupsLoading,
    isError: isError2,
  } = useQuery(
    ["amfFixtureLineups", id],
    () =>
      instance
        .get(`/american-football/match/${id}/lineups`)
        .then((res) => res.data),
    {
      refetchOnWindowFocus: false,
      enabled: !!id,
    }
  );

  const {
    data: playByPlayData,
    isLoading: isTimelineLoading,
    isError: isError3,
  } = useQuery(
    ["amfFixturePlays", id],
    () =>
      instance
        .get(`/american-football/match/${id}/incidents`)
        .then((res) => res.data),
    {
      refetchOnWindowFocus: false,
      enabled: !!id,
    }
  );

  function renderImage(path) {
    try {
      return require(`../../Assets/A-Football Teams/${path}.gif`);
    } catch (err) {
      return "https://www.seekpng.com/png/small/28-289657_espn-soccer-team-logo-default.png";
    }
  }

  if (isError1 || isError2 || isError3) {
    return (
      <div className="error-container">
        Too many requests, come back after some time or another day. :(
      </div>
    );
  }

  return (
    <div className="fixturePage-container">
      <FixtureDetail
        sport={"american-football"}
        tab={tab}
        setTab={setTab}
        fixture={location?.state}
        homeScore={location?.state?.homeScore?.display}
        awayScore={location?.state?.awayScore?.display}
      />
      <div className="fixturePage-container--tabs">
        {tab === "Stats" &&
          (isStatsLoading ? (
            <div className="loading-container">
              <FontAwesomeIcon
                className="icon"
                icon={faFootball}
                bounce
                style={{ color: " #e5c72e" }}
              />
            </div>
          ) : fixtureStats?.statistics?.[0]?.groups?.length ? (
            <div className="stats-container__wrapper">
              <div className="stats-container__wrapper--header">
                <Link
                  className="link"
                  to={`/american-football/team/${location?.state?.homeTeam?.id}`}
                >
                  <div className="home--team">
                    <img
                      src={renderImage(location?.state?.homeTeam?.name)}
                      alt="team-logo"
                    />
                    <h4>{location?.state?.homeTeam?.name}</h4>
                  </div>
                </Link>
                <Link
                  className="link"
                  to={`/american-football/team/${location?.state?.awayTeam?.id}`}
                >
                  <div className="away--team">
                    <h4>{location?.state?.awayTeam?.name}</h4>
                    <img
                      src={renderImage(location?.state?.awayTeam?.name)}
                      alt="team-logo"
                    />
                  </div>
                </Link>
              </div>
              {fixtureStats?.statistics?.[0]?.groups?.map((group, index) => (
                <div key={index} className="stats-container__wrapper--content">
                  <div className="stats-container__wrapper--content--sub-header">
                    <p>{group?.groupName}</p>
                  </div>
                  <FixtureStatistics
                    sports={"american-footbal"}
                    stats={group?.statisticsItems}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="tabs-container--alt">
              <h4>No Stats found for this match.</h4>
            </div>
          ))}
        {tab === "Lineups" &&
          (isLineupsLoading ? (
            <div className="loading-container">
              <FontAwesomeIcon
                className="icon"
                icon={faFootball}
                bounce
                style={{ color: " #e5c72e" }}
              />
            </div>
          ) : lineUps?.confirmed ? (
            <div className="scorecard-container__wrapper">
              <div className="scorecard-container__wrapper--filter">
                <p
                  onClick={() => {
                    setTeamIndex(0);
                  }}
                  className={teamIndex === 0 ? "active" : ""}
                >
                  {location?.state?.homeTeam?.name}
                </p>
                <p
                  onClick={() => {
                    setTeamIndex(1);
                  }}
                  className={teamIndex === 1 ? "active" : ""}
                >
                  {location?.state?.awayTeam?.name}
                </p>
              </div>
              <div className="scorecard-container__wrapper--contents">
                {teamIndex === 0 ? (
                  <BoxScore sport={"american-football"} stats={lineUps?.home} />
                ) : (
                  <BoxScore sport={"american-football"} stats={lineUps?.away} />
                )}
              </div>
            </div>
          ) : (
            <div className="tabs-container--alt">
              <h4>No Lineups for this match.</h4>
            </div>
          ))}
        {tab === "Plays" &&
          (isTimelineLoading ? (
            <div className="loading-container">
              <FontAwesomeIcon
                className="icon"
                icon={faFootball}
                bounce
                style={{ color: " #e5c72e" }}
              />
            </div>
          ) : playByPlayData?.incidents?.length ? (
            <PlayByPlay
              sport={"american-football"}
              lineups={lineUps}
              fixtureData={location?.state}
              data={playByPlayData}
            />
          ) : (
            <div className="tabs-container--alt">
              <h4>No Timeline for this match.</h4>
            </div>
          ))}
      </div>
    </div>
  );
}
