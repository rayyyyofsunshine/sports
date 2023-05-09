const currentDate = new Date();
const notstartedStatus = ["NS", "TWD", "notstarted"];
const finishedStatus = ["FT", "AOT", "AET", "AP", "PEN", "finished"];

export const getImportantFixture = (apiData, impLeagueIds) => {
  const importantFixture = apiData?.find((item) =>
    impLeagueIds.includes(
      item?.league?.id ?? item?.tournament?.uniqueTournament?.id
    )
  );

  if (importantFixture) {
    return importantFixture;
  } else {
    const latestFinishedFixture = apiData
      ?.filter(
        (item) =>
          item?.status?.short.includes(finishedStatus) ??
          item?.fixture?.status?.short.includes(finishedStatus) ??
          item?.status?.type.includes(finishedStatus)
      )
      .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

    if (latestFinishedFixture) {
      return latestFinishedFixture;
    } else {
      const latestNotStartedFixture = apiData
        ?.filter(
          (item) =>
            item?.status?.short.includes(notstartedStatus) ??
            item?.fixture?.status?.short.includes(finishedStatus) ??
            item?.status?.type.includes(finishedStatus)
        )
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

      if (latestNotStartedFixture) {
        return latestNotStartedFixture;
      }
    }
  }
};

export const isCurrentDateinRange = (tournament) => {
  const currentDate = new Date();
  const startDate = new Date(tournament.startDateTimestamp * 1000);
  const endDate = new Date(tournament.endDateTimestamp * 1000);

  if (currentDate < startDate) {
    return true;
  }

  if (currentDate > endDate) {
    return false;
  }

  return true;
};

export const filterMatchesByStatus = (matches, status) => {
  return matches.filter((item) =>
    status.includes(
      item?.status?.short ?? item?.fixture?.status?.short ?? item?.status?.type
    )
  );
};

export const getCurrentSeason = (seasons) => {
  const currSeason = seasons?.find((season) => {
    const startDate = new Date(season.start);
    const endDate = new Date(season.end);
    return currentDate >= startDate && currentDate <= endDate;
  });

  if (currSeason) {
    return currSeason?.season;
  } else {
    const sortedSeasons = [...seasons].sort(
      (a, b) => new Date(b.end) - new Date(a.end)
    );
    return sortedSeasons?.[0]?.season;
  }
};

export const getScoreValue = (data, sport, side) => {
  if (sport === "cricket" || sport === "american-football") {
    console.log(data, side);
    return data?.[side]?.display;
  }

  if (sport === "basketball" || sport === "baseball") {
    return data?.scores?.[side]?.total;
  }

  if (sport !== "football") {
    return data?.scores?.[side];
  }

  return data?.goals?.[side];
};

export const setPosition = (pos) => {
  if (pos === "G") {
    return "Goalkeeper";
  } else if (pos === "D") {
    return "Defender";
  } else if (pos === "M") {
    return "Midfielder";
  } else if (pos === "F") {
    return "Striker";
  }
};

export const setPoints = (pts) => {
  if (pts === "threePoints") {
    return "3 Points";
  } else if (pts === "twoPoints") {
    return "2 Points";
  } else if (pts === "onePoint") {
    return "1 Point";
  } else if (pts === "try") {
    return "Try";
  }
};

export const setIncidentType = (event) => {
  if (event?.incidentType === "card") {
    if (event?.incidentClass === "yellow") {
      return "Yellow Card";
    } else if (event?.incidentClass === "red") {
      return "Red Card";
    }
  } else if (event?.incidentType === "goal") {
    if (event?.incidentClass === "regular") {
      return "Goal";
    } else if (event?.incidentClass === "penalty") {
      return "Penalty";
    } else if (event?.incidentClass === "ownGoal") {
      return "Own Goal";
    }
  } else if (event?.incidentType === "substitution") {
    return "Substitution";
  } else if (event?.incidentType === "varDecision") {
    if (event?.incidentClass === "goalAwarded") {
      return "Goal Awarded";
    } else if (event?.incidentClass === "goalNotAwarded") {
      return "Goal Not Awarded";
    } else if (event?.incidentClass === "penaltyAwarded") {
      return "Penalty Awarded";
    } else if (event?.incidentClass === "penaltyNotAwarded") {
      return "Penalty Not Awarded";
    }
  }
};

export const comment = (data) => {
  if (data?.incidentClassLabel === "0") {
    return "no runs.";
  } else if (data?.incidentClassLabel === "1") {
    return "1 run.";
  } else if (data?.incidentClassLabel === "2") {
    return "2 runs.";
  } else if (data?.incidentClassLabel === "3") {
    return "3 runs.";
  } else if (data?.incidentClassLabel === "4") {
    return "FOUR, a boundary.";
  } else if (data?.incidentClassLabel === "6") {
    return "SIX, that's massive!";
  } else if (data?.incidentClassLabel === "W") {
    return `OUT, ${data?.bowlDetail.toLowerCase()} ${
      data?.fielder !== undefined ? `by ${data?.fielder?.name}` : "!!"
    }!`;
  } else if (data?.incidentClassLabel.slice(0, -1) === "B") {
    return `${data?.totalRuns} extra ${
      data?.totalRuns > 1 ? "runs" : "run"
    } there.`;
  } else if (data?.incidentClassLabel.slice(0, -1) === "Lb") {
    return `leg bye, ${data?.totalRuns} ${
      data?.totalRuns > 1 ? "runs" : "run"
    } there.`;
  } else if (data?.incidentClassLabel.slice(0, -1) === "Nb") {
    return `a no ball, some extra runs there.`;
  } else if (data?.incidentClassLabel.slice(0, -1) === "Wd") {
    return `a wide, some extra runs there.`;
  }
};

export const flagTournaments = {
  international:
    "https://upload.wikimedia.org/wikipedia/en/thumb/d/d9/International_Cricket_Council_%28logo%29.svg/1200px-International_Cricket_Council_%28logo%29.svg.png",
  "Ranji Trophy":
    "https://w7.pngwing.com/pngs/690/565/png-transparent-india-national-cricket-team-ranji-trophy-holkar-stadium-madhya-pradesh-cricket-team-cricket-stadium-symmetry-india-sports-thumbnail.png",
  "Indian Premier League":
    "https://i.pinimg.com/736x/0f/a7/fe/0fa7fe5b80843d53decad4408ff70da1.jpg",
  "Saurashtra Premier League": "https://www.saucricket.com/Images/sca-logo.png",

  "Tamil Nadu Premier League":
    "https://a2.espncdn.com/combiner/i?img=%2Fi%2Fleaguelogos%2Fcricket%2F500%2F10784.png",

  "Duleep Trophy":
    "https://media.news9live.com/h-upload/2022/01/10/149039-bcci-logo.jpg",

  "KCA Presidents Cup T20":
    "https://img.onmanorama.com/content/dam/mm/en/sports/cricket/images/2021/3/3/presidents-cup.jpg",

  "Vijay Hazare Trophy":
    "https://a.espncdn.com/i/teamlogos/cricket/500/1541.png",
  "Bangladesh Premier League":
    "https://w7.pngwing.com/pngs/1007/628/png-transparent-2017-18-bangladesh-premier-league-2016-17-bangladesh-premier-league-2015-16-bangladesh-premier-league-pakistan-national-cricket-team-m-a-aziz-stadium-bowling-cricket-text-logo-twenty20.png",

  "Pakistan Super League":
    "https://cdn.imgbin.com/7/10/10/imgbin-2017-pakistan-super-league-2018-pakistan-super-league-pakistan-national-cricket-team-2016-pakistan-super-league-india-national-cricket-team-others-LVcvbW2sbsaTJ72bMeV9zKi6b.jpg",
  "Pakistan Cup":
    "https://upload.wikimedia.org/wikipedia/en/8/8e/Pakistan-cup-logo.png",
  "CSA T20 Challenge":
    "https://turntable.kagiso.io/images/t20_challenge_resized.width-800.jpg",
  "CSA T20 Challenge Division 2":
    "https://turntable.kagiso.io/images/t20_challenge_resized.width-800.jpg",
  "CSA Provincial One Day Challenge":
    "https://turntable.kagiso.io/images/t20_challenge_resized.width-800.jpg",
  "Spice Isle":
    "https://i0.wp.com/sportzwiki.com/wp-content/uploads/2022/04/Spice-Isle-T10-Dream11-Prediction-Fantasy-Cricket-Tips-Dream11-Team.jpeg?resize=1200%2C720&ssl=1",
  "Country Championship":
    "https://aniportalimages.s3.amazonaws.com/media/details/CountyC_dec17_IhrXuzk.jpg",
  "T20 Charlotte Edwards Cup, Women":
    "https://upload.wikimedia.org/wikipedia/en/f/fe/Charlotte_Edwards_Cup_Logo.png",
  "T20 Vitality Blast":
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSZBqU8tPSaJo0DI8u3ABI5G5V1EqT97IIJAfIhfux741L5Byt_KjC_29gAYzN_pnw2mZ0&usqp=CAU",
  "Rachael Heyhoe Flint Trophy":
    "https://resources.ecb.co.uk/photo-resources/2020/08/17/53113fd2-e1d1-4122-9f1a-57d1cad4d04b/Rache-Heyhoe-Flint-Logo.png?width=290&height=290",
  "Royal London One Day Cup":
    "https://w7.pngwing.com/pngs/309/392/png-transparent-2017-royal-london-one-day-cup-2018-royal-london-one-day-cup-lord-s-2017-county-championship-bangladesh-cricket-team-thumbnail.png",
  "Inter-Provincial Twenty20":
    "https://fancode.com/skillup-uploads/prod-images/2022/04/Image-from-iOS.png",
  "Inter-Provincial Trophy":
    "https://fancode.com/skillup-uploads/prod-images/2022/04/Image-from-iOS.png",
  "Inter-Provincial Limited Over Cup":
    "https://fancode.com/skillup-uploads/prod-images/2022/04/Image-from-iOS.png",
  "ECS Sweden, Landskrona T10":
    "https://fancode.com/skillup-uploads/prod-images/2022/05/ECS_Logo.png",
  "ECS Sweden, Stockholm T10":
    "https://fancode.com/skillup-uploads/prod-images/2022/05/ECS_Logo.png",
  "ECS Hungary T10 League":
    "https://fancode.com/skillup-uploads/prod-images/2022/05/ECS_Logo.png",
  "ECS Italy, Milan":
    "https://fancode.com/skillup-uploads/prod-images/2022/05/ECS_Logo.png",
  "ECS Italy, Brescia":
    "https://fancode.com/skillup-uploads/prod-images/2022/05/ECS_Logo.png",
  "ECS Italy, Rome":
    "https://fancode.com/skillup-uploads/prod-images/2022/05/ECS_Logo.png",
  "ECS Germany T10":
    "https://fancode.com/skillup-uploads/prod-images/2022/05/ECS_Logo.png",
  "ECS Spain T10":
    "https://fancode.com/skillup-uploads/prod-images/2022/05/ECS_Logo.png",
  "ECS Croatia T10":
    "https://fancode.com/skillup-uploads/prod-images/2022/05/ECS_Logo.png",
  "ECS Malta T10":
    "https://fancode.com/skillup-uploads/prod-images/2022/05/ECS_Logo.png",
  "ECS Germany, Krefeld T10":
    "https://fancode.com/skillup-uploads/prod-images/2022/05/ECS_Logo.png",
  "ECS Italy Super Series":
    "https://fancode.com/skillup-uploads/prod-images/2022/05/ECS_Logo.png",
  "European Cricket Series T10, Austria":
    "https://fancode.com/skillup-uploads/prod-images/2022/05/ECS_Logo.png",
  "European Cricket Series T10 Belgium Edition":
    "https://fancode.com/skillup-uploads/prod-images/2022/05/ECS_Logo.png",
  "Big Bash League, Women":
    "https://upload.wikimedia.org/wikipedia/en/c/c0/Big_Bash_League_%28logo%29.png",
  "Big Bash League":
    "https://upload.wikimedia.org/wikipedia/en/c/c0/Big_Bash_League_%28logo%29.png",
  "Shpageeza League": "https://www.cricketworld.com/media/img/a/d/112342.jpg",
  "Minor League":
    "https://prowly-uploads.s3.eu-west-1.amazonaws.com/uploads/press_rooms/company_logos/24848/3318972588452ed2e861db43c74f4ec6.png",
  "Caribbean Premier League":
    "https://www.insidesport.in/wp-content/uploads/2021/08/CPL.jpg?w=690",
  "Caribbean Premier League, Women":
    "https://www.insidesport.in/wp-content/uploads/2021/08/CPL.jpg?w=690",
  "Regional Super 50":
    "https://e7.pngegg.com/pngimages/873/891/png-clipart-regional-super50-west-indies-cricket-team-windward-islands-cricket-team-west-indies-under-19-cricket-team-cricket-text-logo.png",
  "Oman D10 League T10":
    "https://www.thesportsnews.in/wp-content/uploads/2022/03/Oman-D10-2022-Points-Table-and-Team-Standings.jpg",
  "Sharjah CBFS T10 League":
    "https://cricketnlive.com/wp-content/uploads/2022/01/Sharjah-CBFS.jpg",
  "Sharjah Ramadan T20 League":
    "https://cricketnlive.com/wp-content/uploads/2022/01/Sharjah-CBFS.jpg",
  "Sharjah Ramadan T10 League":
    "https://cricketnlive.com/wp-content/uploads/2022/01/Sharjah-CBFS.jpg",
  "Ajman T20 Cup":
    "https://www.thesportsnews.in/wp-content/uploads/2022/03/Ajman-T20-Cup-2022-Points-Table-and-Team-Standings.jpg",
};
