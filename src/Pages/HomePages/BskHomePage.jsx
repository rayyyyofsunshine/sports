import React, { useContext } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  getBskCountries,
  getBskFixturesByDate,
  getBskLeagueInfo,
  getBskLeagues,
  getUpcomingBskFixturesByLeagues,
} from "../../Api/BskRequest";
import UpcomingFixtures from "../../Layouts/UpcomingFixtures";
import CountriesList from "../../Layouts/CountriesList";
import TableBox from "../../Layouts/TableBox";
import { DataContext } from "../../Helpers/DataContext";
import {
  getImportantFixture,
  filterMatchesByStatus,
} from "../../Helpers/Utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBasketball } from "@fortawesome/free-solid-svg-icons";

export default function BskHomePage() {
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
  const impLeagueIds = [12, 82, 117, 104, 120];

  const { isLoading: isCountriesLoading, isError: isError1 } = useQuery(
    "countriesListBsk",
    () => axios(getBskCountries),
    {
      refetchOnWindowFocus: false,
      cacheTime: Infinity,
      staleTime: Infinity,
      onSuccess: (data) =>
        setCountriesList((prevState) => ({
          ...prevState,
          basketball: data?.data?.response,
        })),
    }
  );

  const { isLoading: isFixturesLoading, isError: isError2 } = useQuery(
    ["fixturesBsk", selectedDate],
    () =>
      axios({
        ...getBskFixturesByDate,
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
          basketball: importantFixture,
        }));

        setMatchNotStartedData((prevState) => ({
          ...prevState,
          basketball: filterMatchesByStatus(
            data?.data?.response,
            notstartedStatus
          ),
        }));

        setMatchOngoingData((prevState) => ({
          ...prevState,
          basketball: filterMatchesByStatus(
            data?.data?.response,
            ongoingStatus
          ),
        }));

        setMatchFinishedData((prevState) => ({
          ...prevState,
          basketball: filterMatchesByStatus(
            data?.data?.response,
            finishedStatus
          ),
        }));

        setMatchCancelledData((prevState) => ({
          ...prevState,
          basketball: filterMatchesByStatus(
            data?.data?.response,
            cancelledStatus
          ),
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
      {isFixturesLoading || isCountriesLoading ? (
        <div className="loading-container">
          <FontAwesomeIcon
            icon={faBasketball}
            bounce
            className="icon"
            style={{ color: "#e5c72e" }}
          />
        </div>
      ) : (
        <>
          <div className="homePage-container__left">
            <CountriesList
              sport={"basketball"}
              countries={countriesList?.["basketball"]}
              fetchUrl={getBskLeagues}
            />
          </div>
          <div className="homePage-container__middle">
            <div className="homePage-container__middle__live-match-container">
              <div className="homePage-container__middle__live-match-container--pseudo">
                <Link
                  className="link"
                  to={`/basketball/team/${impMatch?.["basketball"]?.league?.id}`}
                >
                  <div className="live-match-container__header">
                    <img src={impMatch?.["basketball"]?.league?.logo} alt="" />
                    <h4>{impMatch?.["basketball"]?.league?.name}</h4>
                  </div>
                </Link>
                <div className="live-match-container__body">
                  <Link
                    className="link"
                    to={`/basketball/team/${impMatch?.["basketball"]?.teams?.home?.id}`}
                  >
                    <div className="box__body__team">
                      <div className="team-img-box">
                        <img
                          src={impMatch?.["basketball"]?.teams?.home?.logo}
                          alt=""
                        />
                      </div>
                      <h4>{impMatch?.["basketball"]?.teams?.home?.name}</h4>
                    </div>
                  </Link>
                  <h2>{impMatch?.["basketball"]?.scores?.home?.total}</h2>
                  {impMatch?.["basketball"]?.scores?.home?.total && (
                    <span>-</span>
                  )}
                  <h2>{impMatch?.["basketball"]?.scores?.away?.total}</h2>
                  <Link
                    className="link"
                    to={`/basketball/team/${impMatch?.["basketball"]?.teams?.away?.id}`}
                  >
                    <div className="box__body__team">
                      <div className="team-img-box">
                        <img
                          src={impMatch?.["basketball"]?.teams?.away?.logo}
                          alt=""
                        />
                      </div>
                      <h4>{impMatch?.["basketball"]?.teams?.away?.name}</h4>
                    </div>
                  </Link>
                </div>
                <div className="live-match-container__footer">
                  {impMatch?.["basketball"]?.status?.short?.includes(
                    finishedStatus
                  ) ? (
                    <table>
                      <thead>
                        <tr>
                          <td>Team</td>
                          <td>1</td>
                          <td>2</td>
                          <td>3</td>
                          <td>4</td>
                          <td>T</td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{impMatch?.["basketball"]?.teams?.home?.name}</td>
                          <td>
                            {impMatch?.["basketball"]?.scores?.home?.quarter_1}
                          </td>
                          <td>
                            {impMatch?.["basketball"]?.scores?.home?.quarter_2}
                          </td>
                          <td>
                            {impMatch?.["basketball"]?.scores?.home?.quarter_3}
                          </td>
                          <td>
                            {impMatch?.["basketball"]?.scores?.home?.quarter_4}
                          </td>
                          <td>
                            {impMatch?.["basketball"]?.scores?.home?.total}
                          </td>
                        </tr>
                        <tr>
                          <td>{impMatch?.["basketball"]?.teams?.away?.name}</td>
                          <td>
                            {impMatch?.["basketball"]?.scores?.away?.quarter_1}
                          </td>
                          <td>
                            {impMatch?.["basketball"]?.scores?.away?.quarter_2}
                          </td>
                          <td>
                            {impMatch?.["basketball"]?.scores?.away?.quarter_3}
                          </td>
                          <td>
                            {impMatch?.["basketball"]?.scores?.away?.quarter_4}
                          </td>
                          <td>
                            {impMatch?.["basketball"]?.scores?.away?.total}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  ) : (
                    <div className="footer-box">
                      <p>
                        Week : <span>{impMatch?.["basketball"]?.week}</span>
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div
              style={{
                height:
                  impMatch?.["basketball"]?.status?.short === "NS"
                    ? "calc(100% - 245px)"
                    : "calc(100% - 270px)",
              }}
              className="homePage-container__middle__table"
            >
              <TableBox sport={"basketball"} />
            </div>
          </div>
          <div className="homePage-container__right">
            <div className="homePage-container__right__header">
              <h4>
                BasketBall <span> Recent Games</span>
              </h4>
            </div>
            <div className="homePage-container__right__carousel-container">
              <UpcomingFixtures
                fetchUrl={getBskLeagueInfo}
                url={getUpcomingBskFixturesByLeagues}
                leagueId={"12"}
                sport={"basketball"}
              />
              <UpcomingFixtures
                fetchUrl={getBskLeagueInfo}
                url={getUpcomingBskFixturesByLeagues}
                leagueId={"117"}
                sport={"basketball"}
              />
              <UpcomingFixtures
                fetchUrl={getBskLeagueInfo}
                url={getUpcomingBskFixturesByLeagues}
                leagueId={"104"}
                sport={"basketball"}
              />
              <UpcomingFixtures
                fetchUrl={getBskLeagueInfo}
                url={getUpcomingBskFixturesByLeagues}
                leagueId={"82"}
                sport={"basketball"}
              />
              <UpcomingFixtures
                fetchUrl={getBskLeagueInfo}
                url={getUpcomingBskFixturesByLeagues}
                leagueId={"120"}
                sport={"basketball"}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
