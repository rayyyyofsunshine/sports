import React, { useContext } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import moment from "moment";
import { Link } from "react-router-dom";
import UpcomingFixtures from "../../Layouts/UpcomingFixtures";
import CountriesList from "../../Layouts/CountriesList";
import { DataContext } from "../../Helpers/DataContext";
import TableBox from "../../Layouts/TableBox";
import {
  getHkyCountries,
  getHkyFixturesByDate,
  getHkyLeagueInfo,
  getHkyLeagues,
  getUpcomingHkyFixturesByLeagues,
} from "../../Api/HkyRequest";
import {
  getImportantFixture,
  filterMatchesByStatus,
} from "../../Helpers/Utilities";
import { faHockeyPuck } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function HkyHomePage() {
  const {
    selectedDate,
    countriesList,
    setCountriesList,
    ongoingStatus,
    notstartedStatus,
    finishedStatus,
    cancelledStatus,
    setMatchNotStartedData,
    setMatchFinishedData,
    setMatchCancelledData,
    setMatchOngoingData,
    setImpMatch,
    impMatch,
  } = useContext(DataContext);
  const impLeagueIds = [16, 35, 47, 57, 58];

  const { isLoading: isCountriesLoading, isError: isError1 } = useQuery(
    "countriesListHky",
    () => axios(getHkyCountries),
    {
      refetchOnWindowFocus: false,
      cacheTime: Infinity,
      staleTime: Infinity,
      onSuccess: (data) =>
        setCountriesList((prevState) => ({
          ...prevState,
          hockey: data?.data?.response,
        })),
    }
  );

  const { isLoading: isFixturesLoading, isError: isError2 } = useQuery(
    ["fixturesHky", selectedDate],
    () =>
      axios({
        ...getHkyFixturesByDate,
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
          hockey: importantFixture,
        }));

        setMatchNotStartedData((prevState) => ({
          ...prevState,
          hockey: filterMatchesByStatus(data?.data?.response, notstartedStatus),
        }));

        setMatchOngoingData((prevState) => ({
          ...prevState,
          hockey: filterMatchesByStatus(data?.data?.response, ongoingStatus),
        }));

        setMatchFinishedData((prevState) => ({
          ...prevState,
          hockey: filterMatchesByStatus(data?.data?.response, finishedStatus),
        }));

        setMatchCancelledData((prevState) => ({
          ...prevState,
          hockey: filterMatchesByStatus(data?.data?.response, cancelledStatus),
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
            icon={faHockeyPuck}
            shake
            className="icon"
            style={{ color: "#e5c72e" }}
          />
        </div>
      ) : (
        <>
          <div className="homePage-container__left">
            <CountriesList
              sport={"hockey"}
              countries={countriesList?.["hockey"]}
              fetchUrl={getHkyLeagues}
            />
          </div>
          <div className="homePage-container__middle">
            <div className="homePage-container__middle__live-match-container">
              <div className="homePage-container__middle__live-match-container--pseudo">
                <Link
                  className="link"
                  to={`/hockey/team/${impMatch?.["hockey"]?.league?.id}`}
                >
                  <div className="live-match-container__header">
                    <img src={impMatch?.["hockey"]?.league.logo} alt="" />
                    <h4>{impMatch?.["hockey"]?.league.name}</h4>
                  </div>
                </Link>
                <div className="live-match-container__body">
                  <Link
                    className="link"
                    to={`/hockey/team/${impMatch?.["hockey"]?.teams?.home?.id}`}
                  >
                    <div className="box__body__team">
                      <div className="team-img-box">
                        <img
                          src={impMatch?.["hockey"]?.teams.home.logo}
                          alt=""
                        />
                      </div>
                      <h4>{impMatch?.["hockey"]?.teams.home.name}</h4>
                    </div>
                  </Link>
                  <h2>{impMatch?.["hockey"]?.scores?.home}</h2>
                  {impMatch?.["hockey"]?.scores?.home && <span>-</span>}
                  <h2>{impMatch?.["hockey"]?.scores?.away}</h2>
                  <Link
                    className="link"
                    to={`/hockey/team/${impMatch?.["hockey"]?.teams?.away?.id}`}
                  >
                    <div className="box__body__team">
                      <div className="team-img-box">
                        <img
                          src={impMatch?.["hockey"]?.teams.away.logo}
                          alt=""
                        />
                      </div>
                      <h4>{impMatch?.["hockey"]?.teams.away.name}</h4>
                    </div>
                  </Link>
                </div>
                <div className="live-match-container__footer">
                  {impMatch?.["hockey"]?.status.short === "NS" ? (
                    <div className="date-footer">
                      <p>
                        Date :{" "}
                        {moment(impMatch?.["hockey"]?.date).format(
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
                          <td>3</td>
                          <td>T</td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{impMatch?.["hockey"]?.teams.home.name}</td>
                          <td>
                            {impMatch?.["hockey"]?.periods.first.split("-")[0]}
                          </td>
                          <td>
                            {impMatch?.["hockey"]?.periods.second.split("-")[0]}
                          </td>
                          <td>
                            {impMatch?.["hockey"]?.periods.third.split("-")[0]}
                          </td>
                        </tr>
                        <tr>
                          <td>{impMatch?.["hockey"]?.teams.away.name}</td>
                          <td>
                            {impMatch?.["hockey"]?.periods.first.split("-")[1]}
                          </td>
                          <td>
                            {impMatch?.["hockey"]?.periods.second.split("-")[1]}
                          </td>
                          <td>
                            {impMatch?.["hockey"]?.periods.third.split("-")[1]}
                          </td>
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
                  impMatch?.["hockey"]?.status.short === "NS"
                    ? "calc(100% - 230px)"
                    : "calc(100% - 290px)",
              }}
              className="homePage-container__middle__table"
            >
              <TableBox sport={"hockey"} />
            </div>
          </div>
          <div className="homePage-container__right">
            <div className="homePage-container__right__header">
              <h4>
                Hockey <span> Recent Games</span>
              </h4>
            </div>
            <div className="homePage-container__right__carousel-container">
              <UpcomingFixtures
                fetchUrl={getHkyLeagueInfo}
                url={getUpcomingHkyFixturesByLeagues}
                leagueId={"57"}
                sport={"hockey"}
              />
              <UpcomingFixtures
                fetchUrl={getHkyLeagueInfo}
                url={getUpcomingHkyFixturesByLeagues}
                leagueId={"35"}
                sport={"hockey"}
              />
              <UpcomingFixtures
                fetchUrl={getHkyLeagueInfo}
                url={getUpcomingHkyFixturesByLeagues}
                leagueId={"47"}
                sport={"hockey"}
              />
              <UpcomingFixtures
                fetchUrl={getHkyLeagueInfo}
                url={getUpcomingHkyFixturesByLeagues}
                leagueId={"58"}
                sport={"hockey"}
              />
              <UpcomingFixtures
                fetchUrl={getHkyLeagueInfo}
                url={getUpcomingHkyFixturesByLeagues}
                leagueId={"16"}
                sport={"hockey"}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
