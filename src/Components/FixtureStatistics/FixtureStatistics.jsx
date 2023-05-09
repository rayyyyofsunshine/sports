import React from "react";

export default function FixtureStatistics({ stats, sports }) {
  function mergeData(team1, team2) {
    let result = [];

    for (let i = 0; i < team1.length; i++) {
      result.push({
        type: team1[i].type,
        team1Value: team1[i].value,
        team2Value: team2[i].value,
      });
    }

    return result;
  }

  let mergedData =
    sports === "football" &&
    mergeData(stats?.[0]?.statistics, stats?.[1]?.statistics);

  return (
    <div className="fixtureStats-container__wrapper">
      <table>
        <tbody>
          {sports === "football"
            ? mergedData?.length > 0 &&
              mergedData?.map((data, i) => (
                <tr key={i}>
                  <td className="team--value">
                    {data?.team1Value !== null ? data?.team1Value : 0}
                  </td>
                  <td style={{ fontWeight: 300 }}>{data?.type}</td>
                  <td className="team--value">
                    {data?.team2Value !== null ? data?.team2Value : 0}
                  </td>
                </tr>
              ))
            : stats?.map((data, i) => (
                <tr key={i}>
                  <td className="team--value">{parseFloat(data?.home)}</td>
                  <td style={{ fontWeight: 300, width: "70%" }}>
                    {data?.name}
                  </td>
                  <td className="team--value">{parseFloat(data?.away)}</td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
}
