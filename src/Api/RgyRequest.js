import moment from "moment";

const api_key = process.env.REACT_APP_API_KEY;

const todaysDate = moment().format("YYYY-MM-DD").toString();

export const getRgyCountries = {
  method: "get",
  url: `https://v1.rugby.api-sports.io/countries`,
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v1.rugby.api-sports.io",
  },
};

export const getRgyLeagues = {
  method: "get",
  url: `https://v1.rugby.api-sports.io/leagues`,
  params: {
    country: "",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v1.rugby.api-sports.io",
  },
};

export const getRgySeasons = {
  method: "get",
  url: `https://v1.rugby.api-sports.io/seasons`,
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v1.rugby.api-sports.io",
  },
};

export const getRgyTeamInfo = {
  method: "get",
  url: `https://v1.rugby.api-sports.io/teams`,
  params: {
    id: "",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v1.rugby.api-sports.io",
  },
};

export const getRgyTeamStats = {
  method: "get",
  url: `https://v1.rugby.api-sports.io/teams/statistics`,
  params: {
    team: "",
    season: "",
    league: "",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v1.rugby.api-sports.io",
  },
};

export const getRgyLeagueInfo = {
  method: "get",
  url: `https://v1.rugby.api-sports.io/leagues`,
  params: {
    id: "",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v1.rugby.api-sports.io",
  },
};

export const getRgyFixturesByDate = {
  method: "get",
  url: `https://v1.rugby.api-sports.io/games`,
  params: {
    date: todaysDate,
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v1.rugby.api-sports.io",
  },
};

export const getRgyFixturesByLeague = {
  method: "get",
  url: `https://v1.rugby.api-sports.io/games`,
  params: {
    season: "",
    league: "",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v1.rugby.api-sports.io",
  },
};

export const getRgyFixturesByTeam = {
  method: "get",
  url: `https://v1.rugby.api-sports.io/games`,
  params: {
    season: "",
    team: "",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v1.rugby.api-sports.io",
  },
};

export const getUpcomingRgyFixturesByLeagues = {
  method: "get",
  url: `https://v1.rugby.api-sports.io/games`,
  params: {
    season: "",
    league: "",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v1.rugby.api-sports.io",
  },
};

export const getRgyStandingsByLeague = {
  method: "get",
  url: `https://v1.rugby.api-sports.io/standings`,
  params: {
    season: "",
    league: "",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v1.rugby.api-sports.io",
  },
};
