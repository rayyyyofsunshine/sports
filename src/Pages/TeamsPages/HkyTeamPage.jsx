import React, { useRef, useState, useEffect, useContext } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { useParams } from "react-router";
import {
  getHkyFixturesByTeam,
  getHkySeasons,
  getHkyTeamInfo,
  getHkyTeamStats,
} from "../../Api/HkyRequest";
import InfoNav from "../../Layouts/InfoNav";
import Fixtures from "../../Components/Fixtures/Fixtures";
import StatsTab from "../../Components/StatsTab/StatsTab";
import { faHockeyPuck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import InfoSkeletonLoading from "../../Components/SkeletonLoading/InfoSkeletonLoading";
import { DataContext } from "../../Helpers/DataContext";

export default function HkyTeamPage() {
  const params = useParams();
  let merged = useRef(null);
  let firstIncompleteRef = useRef(null);
  const [tab, setTab] = useState("Fixtures");
  const [leagueId, setLeagueId] = useState(0);
  const { cancelledStatus, notstartedStatus } = useContext(DataContext);

  const {
    data: hkyTeamsInfo,
    isLoading: isInfoLoading,
    isError: isError1,
  } = useQuery(
    ["hkyTeamsInfo", params?.id],
    () =>
      axios({
        ...getHkyTeamInfo,
        params: { ...getHkyTeamInfo.params, id: params?.id },
      }).then((res) => res.data.response),
    {
      refetchOnWindowFocus: false,
      enabled: !!params?.id,
      staleTime: 30 * 60 * 1000, // 10 minutes
      cacheTime: 60 * 60 * 1000, // 1 hour
    }
  );

  const { data: hkyTeamsSeasons, isError: isError2 } = useQuery(
    ["hkyTeamsSeasons", params?.id],
    () => axios(getHkySeasons).then((res) => res.data.response),
    {
      refetchOnWindowFocus: false,
      enabled: !!params?.id,
      staleTime: 30 * 60 * 1000, // 10 minutes
      cacheTime: 60 * 60 * 1000, // 1 hour
    }
  );

  const {
    data: hkyTeamFixtures,
    isLoading: isFixturesLoading,
    isError: isError3,
  } = useQuery(
    ["hkyTeamFixtures", hkyTeamsSeasons?.[hkyTeamsSeasons?.length - 1]],
    () =>
      axios({
        ...getHkyFixturesByTeam,
        params: {
          ...getHkyFixturesByTeam.params,
          team: params?.id,
          season: hkyTeamsSeasons?.[hkyTeamsSeasons?.length - 2],
        },
      }).then((res) => res.data.response),
    {
      refetchOnWindowFocus: false,
      enabled: !!hkyTeamsSeasons?.[hkyTeamsSeasons?.length - 1],
      staleTime: 10 * 60 * 1000, // 10 minutes
      cacheTime: 60 * 60 * 1000, // 1 hour
      onSuccess: (data) => {
        if (data) {
          const firstNotStartedFixtureIndex = data
            .filter(
              (fixture) => !cancelledStatus.includes(fixture?.status?.short)
            )
            .findIndex((fixture) =>
              notstartedStatus.includes(fixture?.status?.short)
            );
          firstIncompleteRef.current = firstNotStartedFixtureIndex;
        }
      },
    }
  );

  useEffect(() => {
    if (hkyTeamFixtures !== undefined) {
      const leagueIds = [
        ...new Set(hkyTeamFixtures.map((item) => item.league.id)),
      ];
      const leagueNames = [
        ...new Set(hkyTeamFixtures.map((item) => item.league.name)),
      ];
      merged.current = leagueIds.map((item, index) => [
        leagueNames[index],
        item,
      ]);
      setLeagueId(merged?.current?.[0]?.[1]);
    }
  }, [hkyTeamFixtures]);

  const {
    data: hkyTeamStats,
    isLoading: isStatsLoading,
    isError: isError4,
  } = useQuery(
    ["hkyTeamStats", leagueId],
    () =>
      axios({
        ...getHkyTeamStats,
        params: {
          ...getHkyTeamStats.params,
          team: params?.id,
          league: leagueId,
          season: hkyTeamsSeasons?.[hkyTeamsSeasons?.length - 2],
        },
      }).then((res) => res.data.response),
    {
      refetchOnWindowFocus: false,
      enabled: tab === "Stats" && !!leagueId,
      staleTime: 10 * 60 * 1000, // 10 minutes
      cacheTime: 60 * 60 * 1000, // 1 hour
    }
  );

  useEffect(() => {
    if (hkyTeamFixtures !== undefined && firstIncompleteRef.current) {
      const { top } = firstIncompleteRef.current.getBoundingClientRect();
      window.scrollTo({ top: window.innerWidth < 1024 ? top - 270 : top - 70 });
    }
  }, [hkyTeamFixtures]);

  if (isError1 || isError2 || isError3 || isError4) {
    return (
      <div className="error-container">
        Too many requests, come back after some time or another day. :(
      </div>
    );
  }

  return (
    <div className="teamPage-container">
      {isInfoLoading ? (
        <InfoSkeletonLoading />
      ) : (
        <InfoNav
          setTab={setTab}
          tab={tab}
          type={"team"}
          data={hkyTeamsInfo?.[0]}
        />
      )}
      <div className="teamPage-container__body">
        <div className="teamPage-container__body--pseudo-margin"></div>
        <div className="teamPage-container__body__content">
          <div className="teamPage-container__body__content--header">
            <h4>{tab}</h4>
          </div>
          {isInfoLoading ? (
            <div className="loading-container">
              <FontAwesomeIcon
                className="icon"
                icon={faHockeyPuck}
                shake
                style={{ color: "#e5c72e" }}
              />
            </div>
          ) : (
            <div className="teamPage-container__body__content--body">
              {tab === "Fixtures" && (
                <div className="fixturesTab-container">
                  {isFixturesLoading ? (
                    <FontAwesomeIcon
                      className="icon"
                      icon={faHockeyPuck}
                      shake
                      style={{ color: "#e5c72e" }}
                    />
                  ) : hkyTeamFixtures?.length > 0 ? (
                    hkyTeamFixtures
                      ?.filter(
                        (fixture) =>
                          !cancelledStatus.includes(fixture?.status?.short)
                      )
                      .map((fixture, index) => (
                        <Fixtures
                          ref={
                            firstIncompleteRef.current === index
                              ? firstIncompleteRef
                              : null
                          }
                          key={fixture?.id}
                          sport={"hockey"}
                          fixture={fixture}
                        />
                      ))
                  ) : (
                    <div className="alt-container">
                      <p>No data found.</p>
                    </div>
                  )}
                </div>
              )}
              {tab === "Stats" && isStatsLoading ? (
                <FontAwesomeIcon
                  className="icon"
                  icon={faHockeyPuck}
                  shake
                  style={{ color: "#e5c72e" }}
                />
              ) : (
                <div className="statsTab-container">
                  <div className="statsTab-container--filter">
                    {merged?.current?.map((item, index) => (
                      <h4
                        className={
                          merged?.current?.length > 1 && item?.[1] === leagueId
                            ? "active"
                            : ""
                        }
                        onClick={() => setLeagueId(item?.[1])}
                        key={index}
                      >
                        {item?.[0]}
                      </h4>
                    ))}
                  </div>
                  <div className="statsTab-container--content">
                    {hkyTeamStats !== undefined ? (
                      <StatsTab data={hkyTeamStats} />
                    ) : (
                      <div className="alt-container">
                        <p>No data found.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
