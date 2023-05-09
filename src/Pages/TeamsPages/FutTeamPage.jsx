import React, { useEffect, useState, useRef, useContext } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { useParams } from "react-router";
import {
  getFutFixturesByTeam,
  getFutStatsInfo,
  getFutTeamInfo,
  getFutTeamPlayers,
  getFutTeamSeasons,
} from "../../Api/FutRequest";
import InfoNav from "../../Layouts/InfoNav";
import Fixtures from "../../Components/Fixtures/Fixtures";
import StatsTab from "../../Components/StatsTab/StatsTab";
import InfoSkeletonLoading from "../../Components/SkeletonLoading/InfoSkeletonLoading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFutbol } from "@fortawesome/free-regular-svg-icons";
import { DataContext } from "../../Helpers/DataContext";
import PlayersTab from "../../Components/PlayersTab/PlayersTab";

export default function FutTeamPage() {
  const params = useParams();
  let merged = useRef(null);
  let firstIncompleteRef = useRef(null);
  const [tab, setTab] = useState("Fixtures");
  const [leagueId, setLeagueId] = useState(0);
  const { cancelledStatus, notstartedStatus } = useContext(DataContext);

  const {
    data: futTeamsInfo,
    isLoading: isInfoLoading,
    isError: isError1,
  } = useQuery(
    ["futTeamsInfo", params?.id],
    () =>
      axios({
        ...getFutTeamInfo,
        params: { ...getFutTeamInfo.params, id: params?.id },
      }).then((res) => res.data.response),
    {
      refetchOnWindowFocus: false,
      enabled: !!params?.id,
      staleTime: 30 * 60 * 1000, // 10 minutes
      cacheTime: 60 * 60 * 1000, // 1 hour
    }
  );

  const { data: futTeamsSeasons, isError: isError2 } = useQuery(
    ["futTeamsSeasons", params?.id],
    () =>
      axios({
        ...getFutTeamSeasons,
        params: { ...getFutTeamSeasons.params, team: params?.id },
      }).then((res) => res.data.response),
    {
      refetchOnWindowFocus: false,
      enabled: !!params?.id,
      staleTime: 30 * 60 * 1000, // 10 minutes
      cacheTime: 60 * 60 * 1000, // 1 hour
    }
  );

  const {
    data: futTeamFixtures,
    isLoading: isFixturesLoading,
    isError: isError3,
  } = useQuery(
    ["futTeamFixtures", futTeamsSeasons?.[futTeamsSeasons?.length - 1]],
    () =>
      axios({
        ...getFutFixturesByTeam,
        params: {
          ...getFutFixturesByTeam.params,
          team: params?.id,
          season: futTeamsSeasons?.[futTeamsSeasons?.length - 1],
        },
      }).then((res) => res.data.response),
    {
      refetchOnWindowFocus: false,
      enabled: !!futTeamsSeasons?.[futTeamsSeasons?.length - 1],
      staleTime: 10 * 60 * 1000, // 10 minutes
      cacheTime: 60 * 60 * 1000, // 1 hour
      onSuccess: (data) => {
        if (data) {
          const firstNotStartedFixtureIndex = data
            .filter(
              (fixture) =>
                !cancelledStatus.includes(fixture?.fixture?.status?.short)
            )
            .findIndex((fixture) =>
              notstartedStatus.includes(fixture?.fixture?.status?.short)
            );
          firstIncompleteRef.current = firstNotStartedFixtureIndex;
        }
      },
    }
  );

  useEffect(() => {
    if (futTeamFixtures !== undefined) {
      const leagueIds = [
        ...new Set(futTeamFixtures.map((item) => item.league.id)),
      ];
      const leagueNames = [
        ...new Set(futTeamFixtures.map((item) => item.league.name)),
      ];
      merged.current = leagueIds.map((item, index) => [
        leagueNames[index],
        item,
      ]);
      setLeagueId(merged?.current?.[0]?.[1]);
    }
  }, [futTeamFixtures]);

  const {
    data: futTeamStats,
    isLoading: isStatsLoading,
    isError: isError4,
  } = useQuery(
    ["futTeamStats", leagueId],
    () =>
      axios({
        ...getFutStatsInfo,
        params: {
          ...getFutStatsInfo.params,
          team: params?.id,
          league: leagueId,
          season: futTeamsSeasons?.[futTeamsSeasons?.length - 1],
        },
      }).then((res) => res.data.response),
    {
      refetchOnWindowFocus: false,
      enabled: tab === "Stats" && !!leagueId,
      staleTime: 10 * 60 * 1000, // 10 minutes
      cacheTime: 60 * 60 * 1000, // 1 hour
    }
  );

  const {
    data: futTeamPlayers,
    isLoading: isPlayersLoading,
    isError: isError5,
  } = useQuery(
    ["futTeamPlayers", leagueId],
    () =>
      axios({
        ...getFutTeamPlayers,
        params: {
          ...getFutTeamPlayers.params,
          team: params?.id,
        },
      }).then((res) => res.data.response),
    {
      refetchOnWindowFocus: false,
      enabled: tab === "Players" && !!leagueId,
      staleTime: 10 * 60 * 1000, // 10 minutes
      cacheTime: 60 * 60 * 1000, // 1 hour
    }
  );

  useEffect(() => {
    if (futTeamFixtures !== undefined && firstIncompleteRef.current) {
      const { top } = firstIncompleteRef.current.getBoundingClientRect();
      window.scrollTo({ top: window.innerWidth < 1024 ? top - 270 : top - 70 });
    }
  }, [futTeamFixtures]);

  if (isError1 || isError2 || isError3 || isError4 || isError5) {
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
          sport={"football"}
          setTab={setTab}
          type={"team"}
          tab={tab}
          data={futTeamsInfo?.[0]?.team}
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
                icon={faFutbol}
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
                        icon={faFutbol}
                      />
                    </div>
                  ) : futTeamFixtures?.length > 0 ? (
                    futTeamFixtures
                      ?.filter(
                        (fixture) =>
                          !cancelledStatus.includes(
                            fixture?.fixture?.status?.short
                          )
                      )
                      .map((fixture, index) => (
                        <Fixtures
                          ref={
                            firstIncompleteRef.current === index
                              ? firstIncompleteRef
                              : null
                          }
                          key={fixture?.fixture?.id}
                          sport={"football"}
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
              {tab === "Stats" &&
                (isStatsLoading ? (
                  <div className="loading-container">
                    <FontAwesomeIcon
                      className="icon"
                      style={{ color: "#e5c72e" }}
                      bounce
                      icon={faFutbol}
                    />
                  </div>
                ) : (
                  <div className="statsTab-container">
                    <div className="statsTab-container--filter">
                      {merged?.current?.map((item, index) => (
                        <h4
                          className={
                            merged?.current?.length > 1 &&
                            item?.[1] === leagueId
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
                      {futTeamStats !== undefined ? (
                        <StatsTab sport={"football"} data={futTeamStats} />
                      ) : (
                        <div className="alt-container">
                          <p>No data found.</p>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              {tab === "Players" &&
                (isPlayersLoading ? (
                  <div className="loading-container">
                    <FontAwesomeIcon
                      className="icon"
                      style={{ color: "#e5c72e" }}
                      bounce
                      icon={faFutbol}
                    />
                  </div>
                ) : (
                  <PlayersTab
                    sport={"football"}
                    players={futTeamPlayers?.[0]?.players}
                  />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
