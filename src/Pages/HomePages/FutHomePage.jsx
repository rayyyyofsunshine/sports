import React, { useContext, useEffect, useRef, useState } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import CountriesList from "../../Layouts/CountriesList";
import TableBox from "../../Layouts/TableBox";
import UpcomingFixtures from "../../Layouts/UpcomingFixtures";
import PlayerGoalsFooter from "../../Helpers/PlayerGoalsFooter";
import {
  getFutCountries,
  getFutDetailFixtures,
  getFutLeagues,
  getUpcomingFutFixturesByLeague,
  getFutFixturesByDate,
  getFutLeagueInfo,
} from "../../Api/FutRequest";
import { Link } from "react-router-dom";
import { DataContext } from "../../Helpers/DataContext";
import {
  getImportantFixture,
  filterMatchesByStatus,
} from "../../Helpers/Utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFutbol } from "@fortawesome/free-solid-svg-icons";

export default function FutHomePage() {
  let heightRef = useRef();
  const [height, setHeight] = useState();
  const impLeagueIds = [1, 2, 3, 4, 5, 15, 39, 61, 78, 135, 140, 531];
  const {
    countriesList,
    setCountriesList,
    ongoingStatus,
    notstartedStatus,
    finishedStatus,
    cancelledStatus,
    setMatchCancelledData,
    setMatchNotStartedData,
    setMatchFinishedData,
    setMatchOngoingData,
    setImpMatch,
    impMatch,
    setImpFixture,
    impFixture,
    selectedDate,
  } = useContext(DataContext);

  const { isLoading: isCountriesLoading, isError: isError1 } = useQuery(
    "countriesFut",
    () => axios(getFutCountries),
    {
      refetchOnWindowFocus: false,
      cacheTime: Infinity,
      staleTime: Infinity,
      onSuccess: (data) =>
        setCountriesList((prevState) => ({
          ...prevState,
          football: data?.data?.response,
        })),
    }
  );

  const { isLoading: isFixturesLoading, isError: isError2 } = useQuery(
    ["fixturesFut", selectedDate],
    () =>
      axios({
        ...getFutFixturesByDate,
        params: {
          date: selectedDate.toISOString().slice(0, 10),
        },
      }),
    {
      refetchOnWindowFocus: false,
      staleTime: 180000,
      enabled: !!selectedDate,
      onSuccess: (data) => {
        const importantFixture = getImportantFixture(
          data?.data?.response,
          impLeagueIds
        );
        setImpMatch((prevState) => ({
          ...prevState,
          football: importantFixture,
        }));

        setMatchNotStartedData((prevState) => ({
          ...prevState,
          football: filterMatchesByStatus(
            data?.data?.response,
            notstartedStatus
          ),
        }));

        setMatchOngoingData((prevState) => ({
          ...prevState,
          football: filterMatchesByStatus(data?.data?.response, ongoingStatus),
        }));

        setMatchFinishedData((prevState) => ({
          ...prevState,
          football: filterMatchesByStatus(data?.data?.response, finishedStatus),
        }));

        setMatchCancelledData((prevState) => ({
          ...prevState,
          football: filterMatchesByStatus(
            data?.data?.response,
            cancelledStatus
          ),
        }));
      },
    }
  );

  const {
    refetch: refetchFixture,
    isLoading: isDetailFixtureLoading,
    isError: isError3,
  } = useQuery(
    ["fixtureById", impMatch?.["football"]?.fixture.id],
    () => axios(getFutDetailFixtures),
    {
      refetchOnWindowFocus: false,
      enabled: false,
      staleTime: 180000,
      onSuccess: (data) => {
        setImpFixture((prevState) => [...prevState, data?.data?.response?.[0]]);
      },
    }
  );

  useEffect(() => {
    if (impMatch) {
      getFutDetailFixtures.params.id = impMatch?.fixture?.id;
      setHeight(heightRef?.current?.getBoundingClientRect().height);
    }
    if (impMatch?.fixture?.status?.short?.includes(finishedStatus)) {
      refetchFixture();
    }
  }, [impMatch, finishedStatus, refetchFixture]);

  if (isError1 || isError2 || isError3) {
    return (
      <div className="error-container">
        Too many requests, come back after some time or another day. :(
      </div>
    );
  }

  return (
    <div className="homePage-container">
      {isCountriesLoading || isFixturesLoading || isDetailFixtureLoading ? (
        <div className="loading-container">
          <FontAwesomeIcon
            className="icon"
            bounce
            icon={faFutbol}
            style={{ color: "#e5c72e" }}
          />
        </div>
      ) : (
        <>
          <div className="homePage-container__left">
            <CountriesList
              sport={"football"}
              countries={countriesList?.["football"]}
              fetchUrl={getFutLeagues}
            />
          </div>
          <div className="homePage-container__middle">
            <div
              ref={heightRef}
              className="homePage-container__middle__live-match-container"
            >
              <div className="homePage-container__middle__live-match-container--pseudo">
                <Link
                  className="link"
                  to={`/football/league/${impMatch?.["football"]?.league?.id}`}
                >
                  <div className="live-match-container__header">
                    <img
                      src={impMatch?.["football"]?.league?.logo}
                      alt="league-img"
                    />
                    <h4>{impMatch?.["football"]?.league?.name}</h4>
                  </div>
                </Link>
                <div className="live-match-container__body">
                  <Link
                    className="link"
                    to={`/football/team/${impMatch?.["football"]?.teams?.home?.id}`}
                  >
                    <div className="box__body__team">
                      <div className="team-img-box">
                        <img
                          src={impMatch?.["football"]?.teams?.home?.logo}
                          alt=""
                        />
                      </div>
                      <h4>{impMatch?.["football"]?.teams?.home?.name}</h4>
                    </div>
                  </Link>
                  <h2>{impMatch?.["football"]?.goals?.home}</h2>
                  {impMatch?.["football"]?.goals?.home !== null && (
                    <span>-</span>
                  )}
                  <h2>{impMatch?.["football"]?.goals?.away}</h2>
                  <Link
                    className="link"
                    to={`/football/team/${impMatch?.["football"]?.teams?.away?.id}`}
                  >
                    <div className="box__body__team">
                      <div className="team-img-box">
                        <img
                          src={impMatch?.["football"]?.teams?.away.logo}
                          alt=""
                        />
                      </div>
                      <h4>{impMatch?.["football"]?.teams?.away?.name}</h4>
                    </div>
                  </Link>
                </div>
                <div className="live-match-container__footer">
                  {impMatch?.["football"]?.fixture.status.short === "NS" ? (
                    <div className="player-footer--box">
                      <p>
                        Round :{" "}
                        <span>{impMatch?.["football"]?.league?.round}</span>
                      </p>
                      <p>
                        Venue :{" "}
                        <span>
                          {impMatch?.["football"]?.fixture?.venue?.name}
                        </span>
                      </p>
                    </div>
                  ) : (
                    <PlayerGoalsFooter
                      fixture={impFixture !== undefined && impFixture}
                    />
                  )}
                </div>
              </div>
            </div>
            <div className="homePage-container__middle__table">
              {heightRef?.current?.getBoundingClientRect() && (
                <TableBox height={height} sport={"football"} />
              )}
            </div>
          </div>
          <div className="homePage-container__right">
            <div className="homePage-container__right__header">
              <h4>
                Football <span> Recent Games</span>
              </h4>
            </div>
            <div className="homePage-container__right__carousel-container">
              <UpcomingFixtures
                sport={"football"}
                leagueId={"39"}
                url={getUpcomingFutFixturesByLeague}
                fetchUrl={getFutLeagueInfo}
              />
              <UpcomingFixtures
                sport={"football"}
                leagueId={"140"}
                url={getUpcomingFutFixturesByLeague}
                fetchUrl={getFutLeagueInfo}
              />
              <UpcomingFixtures
                sport={"football"}
                leagueId={"61"}
                url={getUpcomingFutFixturesByLeague}
                fetchUrl={getFutLeagueInfo}
              />
              <UpcomingFixtures
                sport={"football"}
                leagueId={"135"}
                url={getUpcomingFutFixturesByLeague}
                fetchUrl={getFutLeagueInfo}
              />
              <UpcomingFixtures
                sport={"football"}
                leagueId={"78"}
                url={getUpcomingFutFixturesByLeague}
                fetchUrl={getFutLeagueInfo}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
