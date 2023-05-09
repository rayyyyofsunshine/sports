import React, { useState, useEffect, useRef, useContext } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { useParams } from "react-router";
import {
  getRgyFixturesByTeam,
  getRgyTeamInfo,
  getRgyTeamStats,
  getRgySeasons,
} from "../../Api/RgyRequest";
import InfoNav from "../../Layouts/InfoNav";
import Fixtures from "../../Components/Fixtures/Fixtures";
import StatsTab from "../../Components/StatsTab/StatsTab";
import InfoSkeletonLoading from "../../Components/SkeletonLoading/InfoSkeletonLoading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFootball } from "@fortawesome/free-solid-svg-icons";
import { DataContext } from "../../Helpers/DataContext";

export default function RgyTeamPage() {
  const params = useParams();
  let merged = useRef(null);
  let firstIncompleteRef = useRef(null);
  const [tab, setTab] = useState("Fixtures");
  const [leagueId, setLeagueId] = useState(0);
  const { cancelledStatus, notstartedStatus } = useContext(DataContext);

  const {
    data: rgyTeamsInfo,
    isLoading: isInfoLoading,
    isError: isError1,
  } = useQuery(
    ["rgyTeamsInfo", params?.id],
    () =>
      axios({
        ...getRgyTeamInfo,
        params: { ...getRgyTeamInfo.params, id: params?.id },
      }).then((res) => res.data.response),
    {
      refetchOnWindowFocus: false,
      enabled: !!params?.id,
      staleTime: 30 * 60 * 1000, // 10 minutes
      cacheTime: 60 * 60 * 1000, // 1 hour
    }
  );

  const { data: rgyTeamsSeasons, isError: isError2 } = useQuery(
    ["rgyTeamsSeasons", params?.id],
    () => axios(getRgySeasons).then((res) => res.data.response),
    {
      refetchOnWindowFocus: false,
      enabled: !!params?.id,
      staleTime: 30 * 60 * 1000, // 10 minutes
      cacheTime: 60 * 60 * 1000, // 1 hour
    }
  );

  const {
    data: rgyTeamFixtures,
    isLoading: isFixturesLoading,
    isError: isError3,
  } = useQuery(
    ["rgyTeamFixtures", rgyTeamsSeasons?.[rgyTeamsSeasons?.length - 1]],
    () =>
      axios({
        ...getRgyFixturesByTeam,
        params: {
          ...getRgyFixturesByTeam.params,
          team: params?.id,
          season: rgyTeamsSeasons?.[rgyTeamsSeasons?.length - 1],
        },
      }).then((res) => res.data.response),
    {
      refetchOnWindowFocus: false,
      enabled: !!rgyTeamsSeasons?.[rgyTeamsSeasons?.length - 1],
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
    if (rgyTeamFixtures !== undefined) {
      const leagueIds = [
        ...new Set(rgyTeamFixtures.map((item) => item.league.id)),
      ];
      const leagueNames = [
        ...new Set(rgyTeamFixtures.map((item) => item.league.name)),
      ];
      merged.current = leagueIds.map((item, index) => [
        leagueNames[index],
        item,
      ]);
      setLeagueId(merged?.current?.[0]?.[1]);
    }
  }, [rgyTeamFixtures]);

  const {
    data: rgyTeamStats,
    isLoading: isStatsLoading,
    isError: isError4,
  } = useQuery(
    ["rgyTeamStats", leagueId],
    () =>
      axios({
        ...getRgyTeamStats,
        params: {
          ...getRgyTeamStats.params,
          team: params?.id,
          league: leagueId,
          season: rgyTeamsSeasons?.[rgyTeamsSeasons?.length - 1],
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
    if (rgyTeamFixtures !== undefined && firstIncompleteRef.current) {
      const { top } = firstIncompleteRef.current.getBoundingClientRect();
      window.scrollTo({ top: window.innerWidth < 1024 ? top - 270 : top - 70 });
    }
  }, [rgyTeamFixtures]);

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
          data={rgyTeamsInfo?.[0]}
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
                icon={faFootball}
                bounce
                style={{ color: "#e5c72e" }}
              />
            </div>
          ) : (
            <div className="teamPage-container__body__content--body">
              {tab === "Fixtures" && (
                <div className="fixturesTab-container">
                  {isFixturesLoading ? (
                    <div className="loading-container">
                      <FontAwesomeIcon
                        className="icon"
                        style={{ color: "#e5c72e" }}
                        bounce
                        icon={faFootball}
                      />
                    </div>
                  ) : rgyTeamFixtures?.length > 0 ? (
                    rgyTeamFixtures
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
                          sport={"rugby"}
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
                <div className="loading-container">
                  <FontAwesomeIcon
                    className="icon"
                    style={{ color: "#e5c72e" }}
                    bounce
                    icon={faFootball}
                  />
                </div>
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
                    {rgyTeamStats !== undefined ? (
                      <StatsTab data={rgyTeamStats} />
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
