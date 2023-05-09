import moment from "moment";

const api_key = process.env.REACT_APP_API_KEY;

const todaysDate = moment().format("YYYY-MM-DD").toString();

export const getBsbCountries = {
  method: "get",
  url: `https://v1.baseball.api-sports.io/countries`,
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v1.baseball.api-sports.io",
  },
};

export const getBsbLeagues = {
  method: "get",
  url: `https://v1.baseball.api-sports.io/leagues`,
  params: {
    country: "",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v1.baseball.api-sports.io",
  },
};

export const getBsbLeagueInfo = {
  method: "get",
  url: `https://v1.baseball.api-sports.io/leagues`,
  params: {
    id: "",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v1.baseball.api-sports.io",
  },
};

export const getBsbTeamInfo = {
  method: "get",
  url: `https://v1.baseball.api-sports.io/teams`,
  params: {
    id: "",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v1.baseball.api-sports.io",
  },
};

export const getBsbSeasons = {
  method: "get",
  url: `https://v1.baseball.api-sports.io/seasons`,
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v1.baseball.api-sports.io",
  },
};

export const getBsbTeamStats = {
  method: "get",
  url: `https://v1.baseball.api-sports.io/teams/statistics`,
  params: {
    team: "",
    league: "",
    season: "",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v1.baseball.api-sports.io",
  },
};

export const getBsbFixturesByDate = {
  method: "get",
  url: `https://v1.baseball.api-sports.io/games`,
  params: {
    date: todaysDate,
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v1.baseball.api-sports.io",
  },
};

export const getBsbFixturesByLeague = {
  method: "get",
  url: `https://v1.baseball.api-sports.io/games`,
  params: {
    league: "",
    season: "",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v1.baseball.api-sports.io",
  },
};

export const getBsbFixturesByTeam = {
  method: "get",
  url: `https://v1.baseball.api-sports.io/games`,
  params: {
    team: "",
    season: "",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v1.baseball.api-sports.io",
  },
};

export const getUpcomingBsbFixturesByLeagues = {
  method: "get",
  url: `https://v1.baseball.api-sports.io/games`,
  params: {
    season: "",
    league: "",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v1.baseball.api-sports.io",
  },
};

export const getBsbStandingsByLeague = {
  method: "get",
  url: `https://v1.baseball.api-sports.io/standings`,
  params: {
    league: "",
    season: "",
  },
  headers: {
    "x-rapidapi-key": api_key,
    "x-rapidapi-host": "v1.baseball.api-sports.io",
  },
};
