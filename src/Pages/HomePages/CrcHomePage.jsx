import React, { useContext } from "react";
import { useQuery } from "react-query";
import moment from "moment";
import { Link } from "react-router-dom";
import UpcomingFixtures from "../../Layouts/UpcomingFixtures";
import CountriesList from "../../Layouts/CountriesList";
import TableBox from "../../Layouts/TableBox";
import { instance } from "../../Api/Request";
import {
  getImportantFixture,
  filterMatchesByStatus,
} from "../../Helpers/Utilities";
import { DataContext } from "../../Helpers/DataContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBaseballBatBall } from "@fortawesome/free-solid-svg-icons";

export default function CrcHomePage() {
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
  const impLeagueIds = [11162, 11165, 11167, 11168, 11170];

  const { isLoading: isCountriesLoading } = useQuery(
    "countriesCrc",
    () => instance.get(`/cricket/tournament/categories`),
    {
      refetchOnWindowFocus: false,
      cacheTime: Infinity,
      staleTime: Infinity,
      onSuccess: (data) => {
        setCountriesList((prevState) => ({
          ...prevState,
          cricket: data?.data?.categories,
        }));
      },
    }
  );

  const { isLoading: isFixturesLoading } = useQuery(
    ["fixturesCrc", selectedDate],
    () =>
      instance.get(
        `/cricket/matches/${moment(selectedDate).format("DD/MM/YYYY")}`
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
          cricket: importantFixture,
        }));

        setMatchNotStartedData((prevState) => ({
          ...prevState,
          cricket: filterMatchesByStatus(data?.data?.events, notstartedStatus),
        }));

        setMatchOngoingData((prevState) => ({
          ...prevState,
          cricket: filterMatchesByStatus(data?.data?.events, ongoingStatus),
        }));

        setMatchFinishedData((prevState) => ({
          ...prevState,
          cricket: filterMatchesByStatus(data?.data?.events, finishedStatus),
        }));

        setMatchCancelledData((prevState) => ({
          ...prevState,
          cricket: filterMatchesByStatus(data?.data?.events, cancelledStatus),
        }));
      },
    }
  );

  function renderImage(path) {
    try {
      return require(`../../Assets/Cricket Teams/${path}.png`);
    } catch (err) {
      return "https://www.seekpng.com/png/small/28-289657_espn-soccer-team-logo-default.png";
    }
  }

  return (
    <div className="homePage-container">
      {isCountriesLoading || isFixturesLoading ? (
        <div className="loading-container">
          <FontAwesomeIcon
            icon={faBaseballBatBall}
            flip
            className="icon"
            style={{ color: "#e5c72e" }}
          />
        </div>
      ) : (
        <>
          <div className="homePage-container__left">
            <CountriesList
              sport={"cricket"}
              countries={countriesList?.["cricket"]}
            />
          </div>
          <div className="homePage-container__middle">
            <div className="homePage-container__middle__live-match-container">
              <div className="homePage-container__middle__live-match-container--pseudo">
                <Link
                  to={`/cricket/league/${impMatch?.["cricket"]?.tournament?.id}`}
                  className="link"
                >
                  <div className="live-match-container__header">
                    <img src={impMatch?.["cricket"]?.league?.logo} alt="" />
                    <h4>{impMatch?.["cricket"]?.tournament?.name}</h4>
                  </div>
                </Link>
                <div className="live-match-container__body">
                  <Link
                    to={`/cricket/team/${impMatch?.["cricket"]?.homeTeam?.id}`}
                    className="link"
                  >
                    <div className="box__body__team">
                      <div
                        style={{ width: "60px", height: "60px" }}
                        className="team-img-box"
                      >
                        <img
                          src={renderImage(
                            impMatch?.["cricket"]?.homeTeam?.name
                          )}
                          alt=""
                        />
                      </div>
                      <h4>{impMatch?.["cricket"]?.homeTeam?.name}</h4>
                    </div>
                  </Link>
                  <h2 style={{ fontSize: "1.35rem" }}>
                    {impMatch?.["cricket"]?.homeScore?.innings !== undefined &&
                      `${impMatch?.["cricket"]?.homeScore?.innings?.inning1?.score} / ${impMatch?.["cricket"]?.homeScore?.innings?.inning1?.wickets}`}
                    {impMatch?.["cricket"]?.homeScore?.display -
                      impMatch?.["cricket"]?.homeScore?.innings?.inning1
                        ?.score >
                      0 && (
                      <h2
                        style={{
                          fontSize: "1.35rem",
                          marginTop: "-1em",
                          textAlign: "center",
                        }}
                      >
                        {impMatch?.["cricket"]?.homeScore?.display -
                          impMatch?.["cricket"]?.homeScore?.innings?.inning1
                            ?.score}
                      </h2>
                    )}
                  </h2>
                  {impMatch?.["cricket"]?.status?.type !== "notstarted" && (
                    <span>-</span>
                  )}
                  <h2 style={{ fontSize: "1.35rem" }}>
                    {impMatch?.["cricket"]?.awayScore?.innings !== undefined &&
                      `${impMatch?.["cricket"]?.awayScore?.innings?.inning1?.score} / ${impMatch?.["cricket"]?.awayScore?.innings?.inning1?.wickets}`}
                    {impMatch?.["cricket"]?.awayScore?.display -
                      impMatch?.["cricket"]?.awayScore?.innings?.inning1
                        ?.score >
                      0 && (
                      <h2
                        style={{
                          fontSize: "1.35rem",
                          marginTop: "-1em",
                          textAlign: "center",
                        }}
                      >
                        {impMatch?.["cricket"]?.awayScore?.display -
                          impMatch?.["cricket"]?.awayScore?.innings?.inning1
                            ?.score}
                      </h2>
                    )}
                  </h2>
                  <Link
                    to={`/cricket/team/${impMatch?.["cricket"]?.awayTeam?.id}`}
                    className="link"
                  >
                    <div className="box__body__team">
                      <div
                        style={{ width: "60px", height: "60px" }}
                        className="team-img-box"
                      >
                        <img
                          src={renderImage(
                            impMatch?.["cricket"]?.awayTeam?.name
                          )}
                          alt=""
                        />
                      </div>
                      <h4>{impMatch?.["cricket"]?.awayTeam?.name}</h4>
                    </div>
                  </Link>
                </div>
                <div className="live-match-container__footer">
                  {impMatch?.["cricket"]?.note !== null ? (
                    <p
                      style={{
                        fontSize: "0.925rem",
                        opacity: "0.8",
                        wordSpacing: "0.15px",
                      }}
                    >
                      {impMatch?.["cricket"]?.note}
                    </p>
                  ) : (
                    <div
                      style={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                      }}
                      className="footer-box"
                    >
                      <p>
                        Date :
                        <span>
                          {moment
                            .unix(impMatch?.["cricket"]?.startTimestamp)
                            .format("dddd, MMM Do")}
                        </span>
                      </p>
                      <p
                        style={{
                          textTransform: "capitalize",
                          textAlign: "right",
                        }}
                      >
                        <span>
                          {moment
                            .unix(impMatch?.["cricket"]?.startTimestamp)
                            .format("HH : mm a")}
                        </span>
                        - Time
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div
              style={{
                height:
                  impMatch?.["cricket"]?.status?.type !== "finished"
                    ? "calc(100% - 230px)"
                    : "calc(100% - 290px)",
              }}
              className="homePage-container__middle__table"
            >
              <TableBox sport={"cricket"} />
            </div>
          </div>
          <div className="homePage-container__right">
            <div className="homePage-container__right__header">
              <h4>
                Cricket <span> Recent Games</span>
              </h4>
            </div>
            <div className="homePage-container__right__carousel-container">
              <UpcomingFixtures
                url={"/cricket/tournament/11162"}
                leagueId={"11162"}
                sport={"cricket"}
              />
              <UpcomingFixtures
                url={"/cricket/tournament/11165"}
                leagueId={"11165"}
                sport={"cricket"}
              />
              <UpcomingFixtures
                url={"/cricket/tournament/11168"}
                leagueId={"11168"}
                sport={"cricket"}
              />
              <UpcomingFixtures
                url={"/cricket/tournament/11170"}
                leagueId={"11170"}
                sport={"cricket"}
              />
              <UpcomingFixtures
                url={"/cricket/tournament/11167"}
                leagueId={"11167"}
                sport={"cricket"}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
