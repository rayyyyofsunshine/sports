import React, { useContext } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import moment from "moment";
import { Link } from "react-router-dom";
import UpcomingFixtures from "../../Layouts/UpcomingFixtures";
import CountriesList from "../../Layouts/CountriesList";
import TableBox from "../../Layouts/TableBox";
import { DataContext } from "../../Helpers/DataContext";
import {
  getRgyCountries,
  getRgyFixturesByDate,
  getRgyLeagueInfo,
  getRgyLeagues,
  getUpcomingRgyFixturesByLeagues,
} from "../../Api/RgyRequest";
import {
  getImportantFixture,
  filterMatchesByStatus,
} from "../../Helpers/Utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFootball } from "@fortawesome/free-solid-svg-icons";

export default function RgyHomePage() {
  const {
    selectedDate,
    countriesList,
    setCountriesList,
    ongoingStatus,
    notstartedStatus,
    finishedStatus,
    cancelledStatus,
    setMatchCancelledData,
    setMatchFinishedData,
    setMatchNotStartedData,
    setMatchOngoingData,
    setImpMatch,
    impMatch,
  } = useContext(DataContext);
  const impLeagueIds = [13, 16, 27, 71, 76];

  const { isLoading: isCountriesLoading, isError: isError1 } = useQuery(
    "countriesListRgy",
    () => axios(getRgyCountries),
    {
      refetchOnWindowFocus: false,
      cacheTime: Infinity,
      staleTime: Infinity,
      onSuccess: (data) =>
        setCountriesList((prevState) => ({
          ...prevState,
          rugby: data?.data?.response,
        })),
    }
  );

  const { isLoading: isFixturesLoading, isError: isError2 } = useQuery(
    ["fixturesRgy", selectedDate],
    () =>
      axios({
        ...getRgyFixturesByDate,
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
          rugby: importantFixture,
        }));

        setMatchNotStartedData((prevState) => ({
          ...prevState,
          rugby: filterMatchesByStatus(data?.data?.response, notstartedStatus),
        }));

        setMatchOngoingData((prevState) => ({
          ...prevState,
          rugby: filterMatchesByStatus(data?.data?.response, ongoingStatus),
        }));

        setMatchFinishedData((prevState) => ({
          ...prevState,
          rugby: filterMatchesByStatus(data?.data?.response, finishedStatus),
        }));

        setMatchCancelledData((prevState) => ({
          ...prevState,
          rugby: filterMatchesByStatus(data?.data?.response, cancelledStatus),
        }));
      },
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
    <div className="homePage-container">
      {isCountriesLoading || isFixturesLoading ? (
        <div className="loading-container">
          <FontAwesomeIcon
            className="icon"
            bounce
            icon={faFootball}
            style={{ color: "#e5c72e" }}
          />
        </div>
      ) : (
        <>
          <div className="homePage-container__left">
            <CountriesList
              sport={"rugby"}
              countries={countriesList?.["rugby"]}
              fetchUrl={getRgyLeagues}
            />
          </div>
          <div className="homePage-container__middle">
            <div className="homePage-container__middle__live-match-container">
              <div className="homePage-container__middle__live-match-container--pseudo">
                <Link
                  className="link"
                  to={`/rugby/league/${impMatch?.["rugby"]?.league.id}`}
                >
                  <div className="live-match-container__header">
                    <img src={impMatch?.["rugby"]?.league.logo} alt="" />
                    <h4>{impMatch?.["rugby"]?.league.name}</h4>
                  </div>
                </Link>
                <div className="live-match-container__body">
                  <Link
                    className="link"
                    to={`/rugby/team/${impMatch?.["rugby"]?.teams?.home?.id}`}
                  >
                    <div className="box__body__team">
                      <div className="team-img-box">
                        <img
                          src={impMatch?.["rugby"]?.teams.home.logo}
                          alt=""
                        />
                      </div>
                      <h4>{impMatch?.["rugby"]?.teams.home.name}</h4>
                    </div>
                  </Link>
                  <h2>{impMatch?.["rugby"]?.scores?.home}</h2>
                  {impMatch?.["rugby"]?.scores?.home && <span>-</span>}
                  <h2>{impMatch?.["rugby"]?.scores?.away}</h2>
                  <Link
                    className="link"
                    to={`/rugby/team/${impMatch?.["rugby"]?.teams?.away?.id}`}
                  >
                    <div className="box__body__team">
                      <div className="team-img-box">
                        <img
                          src={impMatch?.["rugby"]?.teams.away.logo}
                          alt=""
                        />
                      </div>
                      <h4>{impMatch?.["rugby"]?.teams.away.name}</h4>
                    </div>
                  </Link>
                </div>
                <div className="live-match-container__footer">
                  {impMatch?.["rugby"]?.status.short === "NS" ? (
                    <div className="date-footer">
                      <p>
                        Date :{" "}
                        {moment(impMatch?.["rugby"]?.date).format(
                          "DD MMM, YYYY"
                        )}
                      </p>
                    </div>
                  ) : (
                    <table>
                      <thead>
                        <tr>
                          <td>Team</td>
                          <td>1</td>
                          <td>2</td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{impMatch?.["rugby"]?.teams.home.name}</td>
                          <td>{impMatch?.["rugby"]?.periods.first?.home}</td>
                          <td>{impMatch?.["rugby"]?.periods.second?.home}</td>
                        </tr>
                        <tr>
                          <td>{impMatch?.["rugby"]?.teams.away.name}</td>
                          <td>{impMatch?.["rugby"]?.periods.first?.away}</td>
                          <td>{impMatch?.["rugby"]?.periods.second?.away}</td>
                        </tr>
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
            <div
              style={{
                height:
                  impMatch?.["rugby"]?.status.short === "NS"
                    ? "calc(100% - 230px)"
                    : "calc(100% - 290px)",
              }}
              className="homePage-container__middle__table"
            >
              <TableBox sport={"rugby"} />
            </div>
          </div>
          <div className="homePage-container__right">
            <div className="homePage-container__right__header">
              <h4>
                Rugby <span> Recent Games</span>
              </h4>
            </div>
            <div className="homePage-container__right__carousel-container">
              <UpcomingFixtures
                fetchUrl={getRgyLeagueInfo}
                url={getUpcomingRgyFixturesByLeagues}
                leagueId={"13"}
                sport={"rugby"}
              />
              <UpcomingFixtures
                fetchUrl={getRgyLeagueInfo}
                url={getUpcomingRgyFixturesByLeagues}
                leagueId={"16"}
                sport={"rugby"}
              />
              <UpcomingFixtures
                fetchUrl={getRgyLeagueInfo}
                url={getUpcomingRgyFixturesByLeagues}
                leagueId={"27"}
                sport={"rugby"}
              />
              <UpcomingFixtures
                fetchUrl={getRgyLeagueInfo}
                url={getUpcomingRgyFixturesByLeagues}
                leagueId={"71"}
                sport={"rugby"}
              />
              <UpcomingFixtures
                fetchUrl={getRgyLeagueInfo}
                url={getUpcomingRgyFixturesByLeagues}
                leagueId={"76"}
                sport={"rugby"}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
