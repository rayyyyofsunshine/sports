import React, { useState, useContext, useEffect } from "react";
import { useLocation } from "react-router";
import { useQuery } from "react-query";
import { instance } from "../../Api/Request";
import FixtureDetail from "../../Layouts/FixtureDetail";
import BoxScore from "../../Components/BoxScore/BoxScore";
import FixtureStatistics from "../../Components/FixtureStatistics/FixtureStatistics";
import { DataContext } from "../../Helpers/DataContext";
import stringSimilarity from "string-similarity";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBaseball } from "@fortawesome/free-solid-svg-icons";
import FixtureDetailSkeletonLoading from "../../Components/SkeletonLoading/FixtureDetailSkeletonLoading";
import { useFetchBsbData } from "../../Helpers/ReusableQueryHooks";

export default function BsbFixturePage() {
  const location = useLocation();
  const { bsbData } = useContext(DataContext);
  const [tab, setTab] = useState("BoxScore");
  const [teamIndex, setTeamIndex] = useState(0);
  const date = new Date(location.state.date);
  const formattedDate = date.toLocaleDateString("en-GB");

  const { isLoading, isError, refetch } = useFetchBsbData(formattedDate);

  useEffect(() => {
    if (!bsbData?.[formattedDate]) {
      refetch();
    }
  }, [formattedDate, bsbData, refetch]);

  const bestMatch =
    bsbData?.[formattedDate] &&
    stringSimilarity.findBestMatch(
      location?.state?.teams.home.name,
      bsbData?.[formattedDate]?.events?.map((obj) => obj.homeTeam.name)
    );

  const fixture = bsbData?.[formattedDate]?.events.find(
    (obj) => obj.homeTeam.name === bestMatch.bestMatch.target
  );

  const {
    data: fixtureLineups,
    isLoading: isLineupsLoading,
    isError: isError1,
  } = useQuery(
    ["bsbFixtureLineups", fixture?.id],
    () =>
      instance
        .get(`/baseball/match/${fixture?.id}/lineups`)
        .then((res) => res.data),
    { refetchOnWindowFocus: false, enabled: !!fixture?.id }
  );

  const {
    data: fixtureStats,
    isLoading: isStatsLoading,
    isError: isError2,
  } = useQuery(
    ["bsbFixtureStats", fixture?.id],
    () =>
      instance
        .get(`/baseball/match/${fixture?.id}/statistics`)
        .then((res) => res.data),
    { refetchOnWindowFocus: false, enabled: !!fixture?.id }
  );

  if (isError || isError1 || isError2) {
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
          sport={"baseball"}
          tab={tab}
          setTab={setTab}
          fixture={location?.state}
          homeScore={location?.state?.scores?.home?.total}
          awayScore={location?.state?.scores?.away?.total}
        />
      )}
      <div className="fixturePage-container--tabs">
        {tab === "BoxScore" &&
          (isLineupsLoading ? (
            <div className="loading-container">
              <FontAwesomeIcon
                className="icon"
                icon={faBaseball}
                bouncen
                style={{ color: "#e5c72e" }}
              />
            </div>
          ) : fixtureLineups?.home?.players?.length ? (
            <div className="scorecard-container__wrapper">
              <div className="scorecard-container__wrapper--filter">
                <p
                  onClick={() => {
                    setTeamIndex(0);
                  }}
                  className={teamIndex === 0 && "active"}
                >
                  {fixture?.homeTeam?.name}
                </p>
                <p
                  onClick={() => {
                    setTeamIndex(1);
                  }}
                  className={teamIndex === 1 && "active"}
                >
                  {fixture?.awayTeam?.name}
                </p>
              </div>
              <div className="scorecard-container__wrapper--contents">
                {teamIndex === 0 ? (
                  <BoxScore sport={"baseball"} stats={fixtureLineups?.home} />
                ) : (
                  <BoxScore sport={"baseball"} stats={fixtureLineups?.away} />
                )}
              </div>
            </div>
          ) : (
            <div className="tabs-container--alt">
              <h4>No Stats found for this match.</h4>
            </div>
          ))}
        {tab === "Stats" &&
          (isStatsLoading ? (
            <div className="loading-container">
              <FontAwesomeIcon
                className="icon"
                style={{ color: "#e5c72e" }}
                bounce
                icon={faBaseball}
              />
            </div>
          ) : fixtureStats?.statistics?.[0]?.groups?.length ? (
            <div className="stats-container__wrapper">
              <div className="stats-container__wrapper--header">
                <Link
                  className="link"
                  to={`/baseball/team/${location?.state?.teams?.home?.id}`}
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
                  to={`/baseball/team/${location?.state?.teams?.away?.id}`}
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
                    sports={"baseball"}
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
      </div>
    </div>
  );
}
