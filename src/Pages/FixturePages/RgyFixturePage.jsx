import React, { useState, useContext, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";
import { useQuery } from "react-query";
import { instance } from "../../Api/Request";
import FixtureDetail from "../../Layouts/FixtureDetail";
import FixtureStatistics from "../../Components/FixtureStatistics/FixtureStatistics";
import PlayByPlay from "../../Components/PlayByPlay/PlayByPlay";
import { DataContext } from "../../Helpers/DataContext";
import stringSimilarity from "string-similarity";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFootball } from "@fortawesome/free-solid-svg-icons";
import FixtureDetailSkeletonLoading from "../../Components/SkeletonLoading/FixtureDetailSkeletonLoading";
import { useFetchRgyData } from "../../Helpers/ReusableQueryHooks";

export default function RgyFixturePage() {
  const location = useLocation();
  const { rgyData } = useContext(DataContext);
  const [tab, setTab] = useState("Stats");
  const date = new Date(location.state.date);
  const formattedDate = date.toLocaleDateString("en-GB");

  const { isLoading, isError, refetch } = useFetchRgyData(formattedDate);

  useEffect(() => {
    if (!rgyData?.[formattedDate]) {
      refetch();
    }
  }, [formattedDate, rgyData, refetch]);

  const bestMatch =
    rgyData?.[formattedDate] &&
    stringSimilarity.findBestMatch(
      location?.state?.teams.home.name,
      rgyData?.[formattedDate]?.events?.map((obj) => obj.homeTeam.name)
    );

  const fixture = rgyData?.[formattedDate]?.events.find(
    (obj) => obj.homeTeam.name === bestMatch.bestMatch.target
  );

  const {
    data: fixtureLineups,
    isLoading: isLineupsLoading,
    isError: isError1,
  } = useQuery(
    ["rgyFixtureLineups", fixture?.id],
    () =>
      instance
        .get(`/rugby/match/${fixture?.id}/lineups`)
        .then((res) => res.data),
    { refetchOnWindowFocus: false, enabled: !!fixture?.id }
  );

  const {
    data: fixturePlayByPlay,
    isLoading: isTimelineLoading,
    isError: isError2,
  } = useQuery(
    ["rgyFixtureTimeline", fixture?.id],
    () =>
      instance
        .get(`/rugby/match/${fixture?.id}/incidents`)
        .then((res) => res.data),
    { refetchOnWindowFocus: false, enabled: !!fixture?.id }
  );

  const {
    data: fixtureStats,
    isLoading: isStatsLoading,
    isError: isError3,
  } = useQuery(
    ["rgyFixtureStats", fixture?.id],
    () =>
      instance
        .get(`/rugby/match/${fixture?.id}/statistics`)
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
          sport={"rugby"}
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
                icon={faFootball}
                style={{ color: " #e5c72e" }}
                bounce
              />
            </div>
          ) : fixtureStats?.statistics?.[0]?.groups?.length ? (
            <div className="stats-container__wrapper">
              <div className="stats-container__wrapper--header">
                <Link
                  className="link"
                  to={`/rugby/team/${location?.state?.teams?.home?.id}`}
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
                  to={`/rugby/team/${location?.state?.teams?.away?.id}`}
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
                    sports={"rugby"}
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
        {tab === "Plays" &&
          (isTimelineLoading || isLineupsLoading ? (
            <div className="loading-container">
              <FontAwesomeIcon
                className="icon"
                bounce
                style={{ color: "#e5c72e" }}
                icon={faFootball}
              />
            </div>
          ) : fixturePlayByPlay?.incidents?.length ? (
            <PlayByPlay
              sport={"rugby"}
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
