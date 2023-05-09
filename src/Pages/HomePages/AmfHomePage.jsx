import React, { useContext } from "react";
import { useQuery } from "react-query";
import moment from "moment";
import UpcomingFixtures from "../../Layouts/UpcomingFixtures";
import CountriesList from "../../Layouts/CountriesList";
import TableBox from "../../Layouts/TableBox";
import { instance } from "../../Api/Request";
import { DataContext } from "../../Helpers/DataContext";
import {
  getImportantFixture,
  filterMatchesByStatus,
} from "../../Helpers/Utilities";
import { faFootball } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

export default function AmfHomePage() {
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
  const impLeagueIds = [9464, 11208, 11167, 11168, 11170];

  const { isLoading: isCountriesLoading } = useQuery(
    "countriesAmf",
    () => instance.get(`/american-football/tournament/categories`),
    {
      refetchOnWindowFocus: false,
      cacheTime: Infinity,
      staleTime: Infinity,
      enabled: false,
      onSuccess: (data) => {
        setCountriesList((prevState) => ({
          ...prevState,
          americanFootball: data?.data?.categories,
        }));
      },
    }
  );

  const { isLoading: isFixturesLoading } = useQuery(
    ["fixturesAmf", selectedDate],
    () =>
      instance.get(
        `/american-football/matches/${moment(selectedDate).format(
          "DD/MM/YYYY"
        )}`
      ),
    {
      refetchOnWindowFocus: false,
      enabled: !!selectedDate,
      onSuccess: (data) => {
        const importantFixture = getImportantFixture(
          data?.data?.events,
          impLeagueIds
        );
        console.log(data?.data?.events);
        setImpMatch((prevState) => ({
          ...prevState,
          americanFootball: importantFixture,
        }));

        setMatchNotStartedData((prevState) => ({
          ...prevState,
          americanFootball: filterMatchesByStatus(
            data?.data?.events,
            notstartedStatus
          ),
        }));

        setMatchOngoingData((prevState) => ({
          ...prevState,
          americanFootball: filterMatchesByStatus(
            data?.data?.events,
            ongoingStatus
          ),
        }));

        setMatchFinishedData((prevState) => ({
          ...prevState,
          americanFootball: filterMatchesByStatus(
            data?.data?.events,
            finishedStatus
          ),
        }));

        setMatchCancelledData((prevState) => ({
          ...prevState,
          americanFootball: filterMatchesByStatus(
            data?.data?.events,
            cancelledStatus
          ),
        }));
      },
    }
  );

  function renderImage(path) {
    try {
      return require(`../../Assets/A-Football Teams/${path}.gif`);
    } catch (err) {
      return "https://www.seekpng.com/png/small/28-289657_espn-soccer-team-logo-default.png";
    }
  }

  return (
    <div className="homePage-container">
      {isCountriesLoading || isFixturesLoading ? (
        <div className="loading-container">
          <FontAwesomeIcon
            icon={faFootball}
            bounce
            className="icon"
            style={{ color: "#e5c72e" }}
          />
        </div>
      ) : (
        <>
          <div className="homePage-container__left">
            <CountriesList
              sport={"american-football"}
              countries={countriesList?.["americanFootball"]}
            />
          </div>
          <div className="homePage-container__middle">
            <div className="homePage-container__middle__live-match-container">
              <div className="homePage-container__middle__live-match-container--pseudo">
                <Link
                  to={`/american-football/league/${impMatch?.["americanFootball"]?.tournament?.id}`}
                  className="link"
                >
                  <div className="live-match-container__header">
                    <img
                      src={impMatch?.["americanFootball"]?.league?.logo}
                      alt=""
                    />
                    <h4>{impMatch?.["americanFootball"]?.tournament?.name}</h4>
                  </div>
                </Link>
                <div className="live-match-container__body">
                  <Link
                    to={`/american-football/team/${impMatch?.["americanFootball"]?.homeTeam?.id}`}
                    className="link"
                  >
                    <div className="box__body__team">
                      <div
                        style={{ width: "60px", height: "60px" }}
                        className="team-img-box"
                      >
                        <img
                          src={renderImage(
                            impMatch?.["americanFootball"]?.homeTeam?.name
                          )}
                          alt=""
                        />
                      </div>
                      <h4>{impMatch?.["americanFootball"]?.homeTeam?.name}</h4>
                    </div>
                  </Link>
                  <h2>{impMatch?.["americanFootball"]?.homeScore?.display}</h2>
                  {impMatch?.["americanFootball"]?.status?.type ===
                    "finished" && <span>-</span>}
                  <h2>{impMatch?.["americanFootball"]?.awayScore?.display}</h2>
                  <Link
                    to={`/american-football/team/${impMatch?.["americanFootball"]?.awayTeam?.id}`}
                    className="link"
                  >
                    <div className="box__body__team">
                      <div
                        style={{ width: "60px", height: "60px" }}
                        className="team-img-box"
                      >
                        <img
                          src={renderImage(
                            impMatch?.["americanFootball"]?.awayTeam?.name
                          )}
                          alt=""
                        />
                      </div>
                      <h4>{impMatch?.["americanFootball"]?.awayTeam?.name}</h4>
                    </div>
                  </Link>
                </div>
                <div className="live-match-container__footer">
                  {impMatch?.["americanFootball"]?.status?.type !==
                  "finished" ? (
                    <div className="date-footer">
                      <p>
                        Date :{" "}
                        {moment
                          .unix(impMatch?.["americanFootball"]?.startTimestamp)
                          .format("DD MMM, YYYY")}
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
                          <td>T</td>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td>
                            {impMatch?.["americanFootball"]?.homeTeam.name}
                          </td>
                          <td>
                            {impMatch?.["americanFootball"]?.homeScore?.period1}
                          </td>
                          <td>
                            {impMatch?.["americanFootball"]?.homeScore?.period2}
                          </td>
                          <td>
                            {impMatch?.["americanFootball"]?.homeScore?.period3}
                          </td>
                          <td>
                            {impMatch?.["americanFootball"]?.homeScore?.period4}
                          </td>
                          <td>
                            {impMatch?.["americanFootball"]?.homeScore?.display}
                          </td>
                        </tr>
                        <tr>
                          <td>
                            {impMatch?.["americanFootball"]?.awayTeam.name}
                          </td>
                          <td>
                            {impMatch?.["americanFootball"]?.awayScore?.period1}
                          </td>
                          <td>
                            {impMatch?.["americanFootball"]?.awayScore?.period2}
                          </td>
                          <td>
                            {impMatch?.["americanFootball"]?.awayScore?.period3}
                          </td>
                          <td>
                            {impMatch?.["americanFootball"]?.awayScore?.period4}
                          </td>
                          <td>
                            {impMatch?.["americanFootball"]?.awayScore?.display}
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
                  impMatch?.["americanFootball"]?.status?.type !== "finished"
                    ? "calc(100% - 230px)"
                    : "calc(100% - 290px)",
              }}
              className="homePage-container__middle__table"
            >
              <TableBox sport={"americanFootball"} />
            </div>
          </div>
          <div className="homePage-container__right">
            <div className="homePage-container__right__header">
              <h4>
                American Football <span> Recent Games</span>
              </h4>
            </div>
            <div className="homePage-container__right__carousel-container">
              <UpcomingFixtures
                url={"/american-football/tournament/9464"}
                leagueId={"9464"}
                sport={"american-football"}
              />
              <UpcomingFixtures
                url={"/american-football/tournament/11208"}
                leagueId={"11208"}
                sport={"american-football"}
              />
              {/* <UpcomingFixtures
                url={"/american-football/tournament/11168"}
                leagueId={"11168"}
                sport={"american-football"}
              />
              <UpcomingFixtures
                url={"/american-football/tournament/11170"}
                leagueId={"11170"}
                sport={"american-football"}
              />
              <UpcomingFixtures
                url={"/american-football/tournament/11167"}
                leagueId={"11167"}
                sport={"american-football"}
              /> */}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
