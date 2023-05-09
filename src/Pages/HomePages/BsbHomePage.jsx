import React, { useContext } from "react";
import { useQuery } from "react-query";
import axios from "axios";
import moment from "moment";
import {
  getBsbCountries,
  getBsbFixturesByDate,
  getBsbLeagueInfo,
  getBsbLeagues,
  getUpcomingBsbFixturesByLeagues,
} from "../../Api/BsbRequest";
import { Link } from "react-router-dom";
import UpcomingFixtures from "../../Layouts/UpcomingFixtures";
import TableBox from "../../Layouts/TableBox";
import CountriesList from "../../Layouts/CountriesList";
import { DataContext } from "../../Helpers/DataContext";
import {
  getImportantFixture,
  filterMatchesByStatus,
} from "../../Helpers/Utilities";
import { faBaseball } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function BsbHomePage() {
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
    setMatchOngoingData,
    setMatchNotStartedData,
    impMatch,
    setImpMatch,
  } = useContext(DataContext);
  const impLeagueIds = [1, 2, 3, 5, 21];

  const { isLoading: isCountriesLoading, isError: isError1 } = useQuery(
    "countriesListBsb",
    () => axios(getBsbCountries),
    {
      refetchOnWindowFocus: false,
      cacheTime: Infinity,
      staleTime: Infinity,
      onSuccess: (data) =>
        setCountriesList((prevState) => ({
          ...prevState,
          baseball: data?.data?.response,
        })),
    }
  );

  const { isLoading: isFixturesLoading, isError: isError2 } = useQuery(
    ["fixturesBsb", selectedDate],
    () =>
      axios({
        ...getBsbFixturesByDate,
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
          baseball: importantFixture,
        }));

        setMatchNotStartedData((prevState) => ({
          ...prevState,
          baseball: filterMatchesByStatus(
            data?.data?.response,
            notstartedStatus
          ),
        }));

        setMatchOngoingData((prevState) => ({
          ...prevState,
          baseball: filterMatchesByStatus(data?.data?.response, ongoingStatus),
        }));

        setMatchFinishedData((prevState) => ({
          ...prevState,
          baseball: filterMatchesByStatus(data?.data?.response, finishedStatus),
        }));

        setMatchCancelledData((prevState) => ({
          ...prevState,
          baseball: filterMatchesByStatus(
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
      {isCountriesLoading || isFixturesLoading ? (
        <div className="loading-container">
          <FontAwesomeIcon
            icon={faBaseball}
            bounce
            className="icon"
            style={{ color: "#e5c72e" }}
          />
        </div>
      ) : (
        <>
          <div className="homePage-container__left">
            <CountriesList
              sport={"baseball"}
              countries={countriesList?.["baseball"]}
              fetchUrl={getBsbLeagues}
            />
          </div>
          <div className="homePage-container__middle">
            <div className="homePage-container__middle__live-match-container">
              <div className="homePage-container__middle__live-match-container--pseudo">
                <Link
                  className="link"
                  to={`/baseball/team/${impMatch?.["baseball"].league?.id}`}
                >
                  <div className="live-match-container__header">
                    <img src={impMatch?.["baseball"].league.logo} alt="" />
                    <h4>{impMatch?.["baseball"].league.name}</h4>
                  </div>
                </Link>
                <div className="live-match-container__body">
                  <Link
                    className="link"
                    to={`/baseball/team/${impMatch?.["baseball"].teams?.home?.id}`}
                  >
                    <div className="box__body__team">
                      <div className="team-img-box">
                        <img
                          src={impMatch?.["baseball"].teams?.home?.logo}
                          alt=""
                        />
                      </div>
                      <h4>{impMatch?.["baseball"].teams?.home?.name}</h4>
                    </div>
                  </Link>
                  <h2>{impMatch?.["baseball"].scores?.home?.total}</h2>
                  {impMatch?.["baseball"].scores?.home?.total && <span>-</span>}
                  <h2>{impMatch?.["baseball"].scores?.away?.total}</h2>
                  <Link
                    className="link"
                    to={`/baseball/team/${impMatch?.["baseball"].teams?.away?.id}`}
                  >
                    <div className="box__body__team">
                      <div className="team-img-box">
                        <img
                          src={impMatch?.["baseball"].teams?.away?.logo}
                          alt=""
                        />
                      </div>
                      <h4>{impMatch?.["baseball"].teams?.away?.name}</h4>
                    </div>
                  </Link>
                </div>
                <div className="live-match-container__footer">
                  {impMatch?.["baseball"].status?.short === "NS" ? (
                    <div className="date-footer">
                      <p>
                        Date :{" "}
                        {moment(impMatch?.["baseball"].date).format(
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
                          <td>4</td>
                          <td>5</td>
                          <td>6</td>
                          <td>7</td>
                          <td>8</td>
                          <td>9</td>
                          <td>R</td>
                          <td>H</td>
                          <td>E</td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>{impMatch?.["baseball"].teams?.home?.name}</td>
                          <td>
                            {impMatch?.["baseball"].scores?.home?.innings[1]}
                          </td>
                          <td>
                            {impMatch?.["baseball"].scores?.home?.innings[2]}
                          </td>
                          <td>
                            {impMatch?.["baseball"].scores?.home?.innings[3]}
                          </td>
                          <td>
                            {impMatch?.["baseball"].scores?.home?.innings[4]}
                          </td>
                          <td>
                            {impMatch?.["baseball"].scores?.home?.innings[5]}
                          </td>
                          <td>
                            {impMatch?.["baseball"].scores?.home?.innings[6]}
                          </td>
                          <td>
                            {impMatch?.["baseball"].scores?.home?.innings[7]}
                          </td>
                          <td>
                            {impMatch?.["baseball"].scores?.home?.innings[8]}
                          </td>
                          <td>
                            {impMatch?.["baseball"].scores?.home?.innings[9]}
                          </td>
                          <td>{impMatch?.["baseball"].scores?.home?.total}</td>
                          <td>{impMatch?.["baseball"].scores?.home?.hits}</td>
                          <td>{impMatch?.["baseball"].scores?.home?.errors}</td>
                        </tr>
                        <tr>
                          <td>{impMatch?.["baseball"].teams?.away?.name}</td>
                          <td>
                            {impMatch?.["baseball"].scores?.away?.innings[1]}
                          </td>
                          <td>
                            {impMatch?.["baseball"].scores?.away?.innings[2]}
                          </td>
                          <td>
                            {impMatch?.["baseball"].scores?.away?.innings[3]}
                          </td>
                          <td>
                            {impMatch?.["baseball"].scores?.away?.innings[4]}
                          </td>
                          <td>
                            {impMatch?.["baseball"].scores?.away?.innings[5]}
                          </td>
                          <td>
                            {impMatch?.["baseball"].scores?.away?.innings[6]}
                          </td>
                          <td>
                            {impMatch?.["baseball"].scores?.away?.innings[7]}
                          </td>
                          <td>
                            {impMatch?.["baseball"].scores?.away?.innings[8]}
                          </td>
                          <td>
                            {impMatch?.["baseball"].scores?.away?.innings[9]}
                          </td>
                          <td>{impMatch?.["baseball"].scores?.away?.total}</td>
                          <td>{impMatch?.["baseball"].scores?.away?.hits}</td>
                          <td>{impMatch?.["baseball"].scores?.away?.errors}</td>
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
                  impMatch?.["baseball"].status?.short === "NS"
                    ? "calc(100% - 230px)"
                    : "calc(100% - 290px)",
              }}
              className="homePage-container__middle__table"
            >
              <TableBox sport={"baseball"} />
            </div>
          </div>
          <div className="homePage-container__right">
            <div className="homePage-container__right__header">
              <h4>
                Baseball <span> Recent Games</span>
              </h4>
            </div>
            <div className="homePage-container__right__carousel-container">
              <UpcomingFixtures
                fetchUrl={getBsbLeagueInfo}
                url={getUpcomingBsbFixturesByLeagues}
                leagueId={"1"}
                sport={"baseball"}
              />
              <UpcomingFixtures
                fetchUrl={getBsbLeagueInfo}
                url={getUpcomingBsbFixturesByLeagues}
                leagueId={"2"}
                sport={"baseball"}
              />
              <UpcomingFixtures
                fetchUrl={getBsbLeagueInfo}
                url={getUpcomingBsbFixturesByLeagues}
                leagueId={"5"}
                sport={"baseball"}
              />
              <UpcomingFixtures
                fetchUrl={getBsbLeagueInfo}
                url={getUpcomingBsbFixturesByLeagues}
                leagueId={"21"}
                sport={"baseball"}
              />
              <UpcomingFixtures
                fetchUrl={getBsbLeagueInfo}
                url={getUpcomingBsbFixturesByLeagues}
                leagueId={"3"}
                sport={"baseball"}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
