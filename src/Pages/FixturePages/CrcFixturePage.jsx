import React, { useState } from "react";
import { useParams, useLocation } from "react-router";
import { useQuery } from "react-query";
import moment from "moment/moment";
import ScoreCard from "../../Components/ScoreCard/ScoreCard";
import CrcTimeline from "../../Components/CrcTimeline/CrcTimeline";
import FixtureDetail from "../../Layouts/FixtureDetail";
import { instance } from "../../Api/Request";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBaseballBatBall } from "@fortawesome/free-solid-svg-icons";

export default function CrcFixturePage() {
  const { id } = useParams();
  let location = useLocation();
  const [tab, setTab] = useState("Scorecard");
  const [inningsIndex, setInningsIndex] = useState(1);

  const {
    data: inningsWiseData,
    isLoading: isInningsLoading,
    isError: isError1,
  } = useQuery(
    ["crcInningsWiseData", id],
    () => instance.get(`/cricket/match/${id}/innings`),
    {
      refetchOnWindowFocus: false,
      enabled: !!id,
    }
  );

  const {
    data: playByPlayData,
    isLoading: isTimelineLoading,
    isError: isError2,
  } = useQuery(
    ["crcFixturePlays", id],
    () => instance.get(`/cricket/match/${id}/incidents`),
    {
      refetchOnWindowFocus: false,
      enabled: !!id,
    }
  );

  if (isError1 || isError2) {
    return (
      <div className="error-container">
        Too many requests, come back after some time or another day. :(
      </div>
    );
  }

  return (
    <div className="fixturePage-container">
      <FixtureDetail
        sport={"cricket"}
        tab={tab}
        setTab={setTab}
        fixture={location?.state}
        homeScore={location?.state?.homeScore?.innings?.inning1?.score}
        awayScore={location?.state?.awayScore?.innings?.inning1?.score}
        homeWickets={location?.state?.homeScore?.innings?.inning1?.wickets}
        awayWickets={location?.state?.awayScore?.innings?.inning1?.wickets}
        homeOvers={location?.state?.homeScore?.innings?.inning1?.overs}
        awayOvers={location?.state?.awayScore?.innings?.inning1?.overs}
      />
      <div className="fixturePage-container--tabs">
        {tab === "Scorecard" &&
          (isInningsLoading ? (
            <div className="loading-container">
              <FontAwesomeIcon
                className="icon"
                icon={faBaseballBatBall}
                flip
                style={{ color: "#e5c72e" }}
              />
            </div>
          ) : inningsWiseData?.data?.innings?.length ? (
            <div className="scorecard-container__wrapper">
              <div className="scorecard-container__wrapper--filter">
                {inningsWiseData?.data?.innings?.map((data, index) => (
                  <p
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.25em",
                    }}
                    key={index}
                    onClick={() => {
                      setInningsIndex(data?.number);
                    }}
                    className={inningsIndex === index + 1 ? "active" : ""}
                  >
                    {data?.battingTeam?.name}
                    {Object.keys(location?.state?.periods).length > 3 && (
                      <span>
                        {moment.localeData().ordinal(data?.number) + " Inn"}
                      </span>
                    )}
                  </p>
                ))}
              </div>
              <div className="scorecard-container__wrapper--contents">
                <ScoreCard
                  data={inningsWiseData?.data?.innings?.[inningsIndex - 1]}
                />
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
                flip
                icon={faBaseballBatBall}
                style={{ color: "#e5c72e" }}
              />
            </div>
          ) : playByPlayData?.data?.incidents?.length ? (
            <CrcTimeline
              inningData={inningsWiseData?.data?.innings}
              data={playByPlayData?.data?.incidents}
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
