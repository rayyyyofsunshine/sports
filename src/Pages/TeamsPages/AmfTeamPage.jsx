import React, { useState, useEffect } from "react";
import { useQuery, useInfiniteQuery } from "react-query";
import { useParams } from "react-router";
import InfoNav from "../../Layouts/InfoNav";
import PlayersTab from "../../Components/PlayersTab/PlayersTab";
import { instance } from "../../Api/Request";
import InfiniteScroll from "react-infinite-scroll-component";
import Fixtures from "../../Components/Fixtures/Fixtures";
import InfoSkeletonLoading from "../../Components/SkeletonLoading/InfoSkeletonLoading";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFootball } from "@fortawesome/free-solid-svg-icons";

export default function AmfTeamPage() {
  const params = useParams();
  const [tab, setTab] = useState("Fixtures");
  const [previousFixturesPage, setPreviousFixturesPage] = useState(0);
  const [upcomingFixturesPage, setUpcomingFixturesPage] = useState(0);
  const [fixtureType, setFixtureType] = useState("Upcoming");
  const [fixtures, setFixtures] = useState([]);

  const {
    data: amfTeamInfo,
    isLoading: isInfoLoading,
    isError: isError1,
  } = useQuery(
    ["amfTeamsInfo", params?.id],
    () => instance.get(`/american-football/team/${params?.id}`),
    {
      refetchOnWindowFocus: false,
      enabled: !!params?.id,
      staleTime: 30 * 60 * 1000, // 10 minutes
      cacheTime: 60 * 60 * 1000, // 1 hour
    }
  );

  const {
    data: amfPreviousTeamFixtures,
    hasNextPage: hasPreviousFixtures,
    fetchNextPage: fetchPreviousFixtures,
    refetch: refetchPreviousFixtures,
    isLoading: isPreviousFixturesLoading,
    isError: isError2,
  } = useInfiniteQuery(
    ["amfPreviousTeamFixtures", params?.id],
    async () =>
      instance.get(
        `/american-football/team/${params?.id}/matches/previous/${previousFixturesPage}`
      ),
    {
      refetchOnWindowFocus: false,
      enabled: false,
      staleTime: 10 * 60 * 1000, // 10 minutes
      cacheTime: 60 * 60 * 1000, // 1 hour
      getNextPageParam: (lastPage) => lastPage?.data?.hasNextPage,
      onSuccess: (data) => {
        setFixtures((prevState) => [
          ...prevState,
          data?.pages?.[0]?.data?.events,
        ]);
      },
    }
  );

  console.log(amfPreviousTeamFixtures);

  const {
    data: amfUpcomingTeamFixtures,
    hasNextPage: hasUpcomingFixtures,
    fetchNextPage: fetchUpcomingFixtures,
    refetch: refetchUpcomingFixtures,
    isLoading: isUpcomingFixturesLoading,
    isError: isError3,
  } = useInfiniteQuery(
    ["amfNextTeamFixtures", params?.id],
    async () =>
      instance.get(
        `/american-football/team/${params?.id}/matches/next/${upcomingFixturesPage}`
      ),
    {
      refetchOnWindowFocus: false,
      enabled: false,
      staleTime: 10 * 60 * 1000, // 10 minutes
      cacheTime: 60 * 60 * 1000, // 1 hour
      getNextPageParam: (lastPage) => lastPage?.data?.hasNextPage,
      onSuccess: (data) => {
        setFixtures((prevState) => [
          ...prevState,
          data?.pages?.[0]?.data?.events,
        ]);
      },
    }
  );

  const {
    data: amfTeamPlayers,
    isLoading: isPlayerLoading,
    isError: isError4,
  } = useQuery(
    ["amfTeamPlayers", params?.id],
    () => instance.get(`/american-football/team/${params?.id}/players`),
    {
      refetchOnWindowFocus: false,
      staleTime: 30 * 60 * 1000, // 30 minutes
      cacheTime: 60 * 60 * 1000, // 1 hour
      enabled: tab === "Players" && !!params?.id,
    }
  );

  useEffect(() => {
    if (fixtureType === "Upcoming") {
      refetchUpcomingFixtures();
    } else {
      refetchPreviousFixtures();
    }
  }, [fixtureType, refetchPreviousFixtures, refetchUpcomingFixtures]);

  useEffect(() => {
    if (
      amfUpcomingTeamFixtures?.pages?.[
        amfUpcomingTeamFixtures?.pages?.length - 1
      ]?.data?.hasNextPage
    ) {
      setUpcomingFixturesPage((prev) => prev + 1);
    }
  }, [amfUpcomingTeamFixtures]);

  useEffect(() => {
    if (
      amfPreviousTeamFixtures?.pages?.[
        amfPreviousTeamFixtures?.pages?.length - 1
      ]?.data?.hasNextPage
    ) {
      setPreviousFixturesPage((prev) => prev + 1);
    }
  }, [amfPreviousTeamFixtures]);

  const getFilteredFixtures = (fixtures, fixtureType) =>
    fixtures
      .flat()
      .filter((fixture) =>
        fixtureType === "Previous"
          ? fixture?.status?.type === "finished"
          : fixture?.status?.type === "notstarted"
      )
      .filter((fixture) => fixture?.status?.type !== "canceled")
      .map((fixture) => (
        <Fixtures
          key={fixture?.id}
          sport={"american-football"}
          fixture={fixture}
        />
      ));

  if (isError1 || isError2 || isError3 || isError3 || isError4) {
    return (
      <div className="error-container">
        Too many request, come back after some time or another day. :(
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
          sport={"american-football"}
          type={"team"}
          data={amfTeamInfo?.data?.team}
        />
      )}
      <div className="teamPage-container__body">
        <div className="teamPage-container__body--pseudo-margin"></div>
        <div className="teamPage-container__body__content">
          <div className="teamPage-container__body__content--header">
            <h4>{tab}</h4>
          </div>
          {tab === "Fixtures" && (
            <div
              style={{ top: window.innerWidth < 1024 ? "18.175em" : "4.1em" }}
              className="teamPage-container__body__content--filter"
            >
              <p
                className={fixtureType === "Previous" ? "active" : ""}
                onClick={() => setFixtureType("Previous")}
              >
                Previous
              </p>
              <p
                className={fixtureType === "Upcoming" ? "active" : ""}
                onClick={() => setFixtureType("Upcoming")}
              >
                Upcoming
              </p>
            </div>
          )}
          {isPreviousFixturesLoading || isUpcomingFixturesLoading ? (
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
              {tab === "Fixtures" && fixtures?.length > 0 && (
                <div className="fixturesTab-container">
                  {fixtures?.filter(Boolean)?.length ? (
                    fixtureType === "Upcoming" ? (
                      fixtures
                        ?.filter(Boolean)
                        ?.flat()
                        .filter(
                          (fixture) => fixture.status.type === "notstarted"
                        ).length ? (
                        <InfiniteScroll
                          dataLength={fixtures.filter(Boolean).length}
                          next={fetchUpcomingFixtures}
                          hasMore={hasUpcomingFixtures}
                        >
                          {getFilteredFixtures(fixtures, fixtureType)}
                        </InfiniteScroll>
                      ) : (
                        <div className="alt-container">No fixtures found.</div>
                      )
                    ) : fixtures
                        ?.filter(Boolean)
                        ?.flat()
                        .filter((fixture) => fixture.status.type === "finished")
                        .length ? (
                      <InfiniteScroll
                        dataLength={fixtures.filter(Boolean).length}
                        next={fetchPreviousFixtures}
                        hasMore={hasPreviousFixtures}
                      >
                        {getFilteredFixtures(fixtures, fixtureType)}
                      </InfiniteScroll>
                    ) : (
                      <div className="alt-container">No fixtures found.</div>
                    )
                  ) : (
                    <div className="alt-container">No fixtures found.</div>
                  )}
                </div>
              )}
              {tab === "Players" &&
                (isPlayerLoading ? (
                  <div className="loading-container">
                    <FontAwesomeIcon
                      className="icon"
                      icon={faFootball}
                      bounce
                      style={{ color: "#e5c72e" }}
                    />
                  </div>
                ) : (
                  <PlayersTab
                    sport={"american-football"}
                    players={amfTeamPlayers?.data?.players}
                  />
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
