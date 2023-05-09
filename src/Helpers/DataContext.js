import React, { createContext, useState } from "react";

export const DataContext = createContext();

const DataProvider = (props) => {
  const notstartedStatus = ["NS", "TBD", "notstarted"];
  const finishedStatus = ["FT", "AOT", "AET", "AP", "PEN", "finished"];
  const ongoingStatus = [
    "1H",
    "2H",
    "HT",
    "ET",
    "PT",
    "BT",
    "P1",
    "P2",
    "P3",
    "OT",
    "PT",
    "BT",
    "Q1",
    "Q2",
    "Q3",
    "Q4",
    "IN1",
    "IN2",
    "IN3",
    "IN4",
    "IN5",
    "IN6",
    "IN7",
    "IN8",
    "IN9",
    "LIVE",
    "P",
    "inprogress",
    "willcontinue",
  ];
  const cancelledStatus = [
    "POST",
    "CANC",
    "INTR",
    "ABD",
    "SUSP",
    "INT",
    "PST",
    "AWD",
    "WO",
    "canceled",
    "postponed",
  ];
  const [bskData, setBskData] = useState(null);
  const [bsbData, setBsbData] = useState(null);
  const [hkyData, setHkyData] = useState(null);
  const [rgyData, setRgyData] = useState(null);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [impFixture, setImpFixture] = useState([]);
  const [impMatch, setImpMatch] = useState({});
  const [matchNotStartedData, setMatchNotStartedData] = useState({});
  const [matchOnGoingData, setMatchOngoingData] = useState({});
  const [matchFinishedData, setMatchFinishedData] = useState({});
  const [matchCancelledData, setMatchCancelledData] = useState({});
  const [upcomingFixture, setUpcomingFixture] = useState({});
  const [countriesList, setCountriesList] = useState({});

  return (
    <DataContext.Provider
      value={{
        bskData,
        setBskData,
        bsbData,
        setBsbData,
        hkyData,
        setHkyData,
        rgyData,
        setRgyData,
        upcomingFixture,
        setUpcomingFixture,
        countriesList,
        setCountriesList,
        notstartedStatus,
        finishedStatus,
        ongoingStatus,
        cancelledStatus,
        matchCancelledData,
        matchFinishedData,
        matchNotStartedData,
        matchOnGoingData,
        setMatchCancelledData,
        setMatchFinishedData,
        setMatchNotStartedData,
        setMatchOngoingData,
        impMatch,
        setImpMatch,
        impFixture,
        setImpFixture,
        selectedDate,
        setSelectedDate,
      }}
    >
      {props.children}
    </DataContext.Provider>
  );
};

export default DataProvider;
