import React, { useContext, useState } from "react";
import { useLocation } from "react-router";
import { useQuery } from "react-query";
import { instance } from "../../Api/Request";
import FixtureDetail from "../../Layouts/FixtureDetail";
import FixtureStatistics from "../../Components/FixtureStatistics/FixtureStatistics";
import PlayByPlay from "../../Components/PlayByPlay/PlayByPlay";
import { DataContext } from "../../Helpers/DataContext";
import stringSimilarity from "string-similarity";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHockeyPuck } from "@fortawesome/free-solid-svg-icons";
import FixtureDetailSkeletonLoading from "../../Components/SkeletonLoading/FixtureDetailSkeletonLoading";
import BoxScore from "../../Components/BoxScore/BoxScore";
import { useFetchHkyData } from "../../Helpers/ReusableQueryHooks";

export default function HkyFixturePage() {
  const location = useLocation();
  const { hkyData } = useContext(DataContext);
  const [tab, setTab] = useState("Stats");
  const [teamIndex, setTeamIndex] = useState(0);

  const date = new Date(location.state.date);
  const formattedDate = date.toLocaleDateString("en-GB");

  const { isLoading, isError, refetch } = useFetchHkyData(formattedDate);

  if (!hkyData?.[formattedDate]) {
    refetch();
  }

  const bestMatch =
    hkyData?.[formattedDate] &&
    stringSimilarity.findBestMatch(
      location?.state?.teams.home.name,
      hkyData?.[formattedDate]?.events.map((obj) => obj.homeTeam.name)
    );

  const fixture = hkyData?.[formattedDate]?.events.find(
    (obj) => obj.homeTeam.name === bestMatch.bestMatch.target
  );

  const {
    data: fixtureLineups,
    isLoading: isLineupsLoading,
    isError: isError1,
  } = useQuery(
    ["hkyFixtureLineups", fixture?.id],
    () =>
      instance
        .get(`/ice-hockey/match/${fixture?.id}/lineups`)
        .then((res) => res.data),
    { refetchOnWindowFocus: false, enabled: !!fixture?.id }
  );

  const {
    data: fixturePlayByPlay,
    isLoading: isTimelineLoading,
    isError: isError2,
  } = useQuery(
    ["hkyFixtureIncidents", fixture?.id],
    () =>
      instance
        .get(`/ice-hockey/match/${fixture?.id}/incidents`)
        .then((res) => res.data),
    { refetchOnWindowFocus: false, enabled: !!fixture?.id }
  );

  const {
    data: fixtureStats,
    isLoading: isStatsLoading,
    isError: isError3,
  } = useQuery(
    ["hkyFixtureStats", fixture?.id],
    () =>
      instance
        .get(`/ice-hockey/match/${fixture?.id}/statistics`)
        .then((res) => res.data),
    { refetchOnWindowFocus: false, enabled: !!fixture?.id }
  );

  if (isError || isError1 || isError2 || isError3) {
    return (
      <div className="error-container">
        Too many requests, come back after some time or another day. :(
      </div>
    );
  }

  return (
    <div className="fixturePage-container">
      {isLoading ? (
        <FixtureDetailSkeletonLoading />
      ) : (
        <FixtureDetail
          sport={"hockey"}
          tab={tab}
          setTab={setTab}
          fixture={location?.state}
          homeScore={location?.state?.scores?.home}
          awayScore={location?.state?.scores?.away}
        />
      )}
      <div className="fixturePage-container--tabs">
        {tab === "Stats" &&
          (isStatsLoading ? (
            <div className="loading-container">
              <FontAwesomeIcon
                className="icon"
                icon={faHockeyPuck}
                style={{ color: "#e5c72e" }}
                bounce
              />
            </div>
          ) : fixtureStats?.statistics?.[0]?.groups?.length ? (
            <div className="stats-container__wrapper">
              <div className="stats-container__wrapper--header">
                <Link
                  className="link"
                  to={`/hockey/team/${location?.state?.teams?.home?.id}`}
                >
                  <div className="home--team">
                    <img
                      src={location?.state?.teams?.home?.logo}
                      alt="team-logo"
                    />
                    <h4>{location?.state?.teams?.home?.name}</h4>
                  </div>
                </Link>
                <Link
                  className="link"
                  to={`/hockey/team/${location?.state?.teams?.away?.id}`}
                >
                  <div className="away--team">
                    <h4>{location?.state?.teams?.away?.name}</h4>
                    <img
                      src={location?.state?.teams?.away?.logo}
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
                    sports={"hockey"}
                    stats={group?.statisticsItems}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="tabs-container--alt">
              <h4>No Stats available for this match.</h4>
            </div>
          ))}
        {tab === "Lineups" &&
          (isLineupsLoading ? (
            <div className="loading-container">
              <FontAwesomeIcon
                className="icon"
                icon={faHockeyPuck}
                style={{ color: "#e5c72e" }}
                bounce
              />
            </div>
          ) : fixtureLineups?.confirmed ? (
            <div className="scorecard-container__wrapper">
              <div className="scorecard-container__wrapper--filter">
                <p
                  onClick={() => {
                    setTeamIndex(0);
                  }}
                  className={teamIndex === 0 ? "active" : ""}
                >
                  {location?.state?.teams?.home?.name}
                </p>
                <p
                  onClick={() => {
                    setTeamIndex(1);
                  }}
                  className={teamIndex === 1 ? "active" : ""}
                >
                  {location?.state?.teams?.away?.name}
                </p>
              </div>
              <div className="scorecard-container__wrapper--contents">
                {teamIndex === 0 ? (
                  <BoxScore sport={"hockey"} stats={fixtureLineups?.home} />
                ) : (
                  <BoxScore sport={"hockey"} stats={fixtureLineups?.away} />
                )}
              </div>
            </div>
          ) : (
            <div className="tabs-container--alt">
              <h4>No lineups for this match.</h4>
            </div>
          ))}
        {tab === "Plays" &&
          (isTimelineLoading || isLineupsLoading ? (
            <div className="loading-container">
              <FontAwesomeIcon
                className="icon"
                icon={faHockeyPuck}
                style={{ color: "#e5c72e" }}
                bounce
              />
            </div>
          ) : fixturePlayByPlay?.incidents?.length ? (
            <PlayByPlay
              sport={"hockey"}
              lineups={fixtureLineups}
              fixtureData={location?.state}
              data={fixturePlayByPlay}
            />
          ) : (
            <div className="tabs-container--alt">
              <h4>No Play By Play data for this match.</h4>
            </div>
          ))}
      </div>
    </div>
  );
}
