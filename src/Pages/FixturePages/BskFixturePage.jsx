import React, { useContext, useState } from "react";
import { useLocation } from "react-router";
import { useQuery } from "react-query";
import FixtureDetail from "../../Layouts/FixtureDetail";
import BoxScore from "../../Components/BoxScore/BoxScore";
import PlayByPlay from "../../Components/PlayByPlay/PlayByPlay";
import { instance } from "../../Api/Request";
import { DataContext } from "../../Helpers/DataContext";
import stringSimilarity from "string-similarity";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBasketball } from "@fortawesome/free-solid-svg-icons";
import FixtureDetailSkeletonLoading from "../../Components/SkeletonLoading/FixtureDetailSkeletonLoading";
import { useFetchBskData } from "../../Helpers/ReusableQueryHooks";

export default function BskFixturePage() {
  const location = useLocation();
  const { bskData } = useContext(DataContext);
  const [tab, setTab] = useState("BoxScore");
  const [teamIndex, setTeamIndex] = useState(0);

  const date = new Date(location.state.date);
  const formattedDate = date.toLocaleDateString("en-GB");

  const { isLoading, isError, refetch } = useFetchBskData(formattedDate);

  if (!bskData?.[formattedDate]) {
    refetch();
  }

  const bestMatch =
    bskData?.[formattedDate] &&
    stringSimilarity.findBestMatch(
      location?.state?.teams.home.name,
      bskData?.[formattedDate]?.events?.map((obj) => obj.homeTeam.name)
    );

  const fixture = bskData?.[formattedDate]?.events.find(
    (obj) => obj.homeTeam.name === bestMatch.bestMatch.target
  );

  const {
    data: fixtureLineups,
    isLoading: isLineupsLoading,
    isError: isError1,
  } = useQuery(
    ["bskFixtureLineups", fixture?.id],
    () =>
      instance
        .get(`/basketball/match/${fixture?.id}/lineups`)
        .then((res) => res.data),
    { refetchOnWindowFocus: false, enabled: !!fixture?.id }
  );

  const {
    data: fixturePlayByPlay,
    isLoading: isTimelineLoading,
    isError: isError2,
  } = useQuery(
    ["bskFixturePlays", fixture?.id],
    () =>
      instance
        .get(`/basketball/match/${fixture?.id}/incidents`)
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
          sport={"basketball"}
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
                icon={faBasketball}
                className="icon"
                bounce
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
                  <BoxScore sport={"basketball"} stats={fixtureLineups?.home} />
                ) : (
                  <BoxScore sport={"basketball"} stats={fixtureLineups?.away} />
                )}
              </div>
            </div>
          ) : (
            <div className="tabs-container--alt">
              <h4>No Stats found for this match.</h4>
            </div>
          ))}
        {tab === "Plays" &&
          (isTimelineLoading ? (
            <div className="loading-container">
              <FontAwesomeIcon
                className="icon"
                icon={faBasketball}
                bounce
                style={{ color: "#e5c72e" }}
              />
            </div>
          ) : fixturePlayByPlay?.incidents?.length ? (
            <PlayByPlay
              sport={"basketball"}
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
