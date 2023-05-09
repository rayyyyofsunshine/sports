import React from "react";

export default function StatsTab({ data, sport }) {
  console.log(data);

  return (
    <div className="statsTab-container__body__table">
      <div className="statsTab-container__body__table--content">
        <table>
          <thead>
            <tr>
              <td></td>
              <td>P</td>
              <td>W</td>
              <td>L</td>
              <td>W (in %)</td>
              <td>L (in %)</td>
              <td>{sport === "football" ? "GF" : "PF"}</td>
              <td>{sport === "football" ? "GA" : "PA"}</td>
              <td>{sport === "football" ? "GF (avg)" : "PF (avg)"} </td>
              <td>{sport === "football" ? "GA (avg)" : "PA (avg)"} </td>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>All</td>
              <td>
                {data?.games?.played?.all || data?.fixtures?.played?.total}
              </td>
              <td>
                {data?.games?.wins?.all?.total || data?.fixtures?.wins?.total}
              </td>
              <td>
                {data?.games?.loses?.all?.total || data?.fixtures?.loses?.total}
              </td>
              <td>
                {sport === "football"
                  ? (
                      (data?.fixtures?.wins?.total /
                        data?.fixtures?.played?.total) *
                      100
                    ).toFixed(2)
                  : data?.games?.wins?.all?.percentage}
              </td>
              <td>
                {sport === "football"
                  ? (
                      (data?.fixtures?.loses?.total /
                        data?.fixtures?.played?.total) *
                      100
                    ).toFixed(2)
                  : data?.games?.loses?.all?.percentage}
              </td>
              <td>
                {sport === "football"
                  ? data?.goals?.for?.total?.total
                  : data?.goals?.for?.total?.all ||
                    data?.points?.for?.total?.all}
              </td>
              <td>
                {sport === "football"
                  ? data?.goals?.against?.total?.total
                  : data?.goals?.against?.total?.all ||
                    data?.points?.against?.total?.all}
              </td>
              <td>
                {sport === "football"
                  ? data?.goals?.for?.average?.total
                  : data?.goals?.for?.total?.all ||
                    data?.points?.for?.average?.all}
              </td>
              <td>
                {sport === "football"
                  ? data?.goals?.against?.average?.total
                  : data?.goals?.against?.total?.all ||
                    data?.points?.against?.average?.all}
              </td>
            </tr>
            <tr>
              <td>Home</td>
              <td>
                {data?.games?.played?.home || data?.fixtures?.played?.home}
              </td>
              <td>
                {data?.games?.wins?.home?.total || data?.fixtures?.wins?.home}
              </td>
              <td>
                {data?.games?.loses?.home?.total || data?.fixtures?.loses?.home}
              </td>
              <td>
                {sport === "football"
                  ? (
                      (data?.fixtures?.wins?.home /
                        data?.fixtures?.played?.home) *
                      100
                    ).toFixed(2)
                  : data?.games?.wins?.home?.percentage}
              </td>
              <td>
                {sport === "football"
                  ? (
                      (data?.fixtures?.loses?.home /
                        data?.fixtures?.played?.home) *
                      100
                    ).toFixed(2)
                  : data?.games?.loses?.home?.percentage}
              </td>
              <td>
                {sport === "football"
                  ? data?.goals?.for?.total?.home
                  : data?.goals?.for?.total?.home ||
                    data?.points?.for?.total?.home}
              </td>
              <td>
                {sport === "football"
                  ? data?.goals?.against?.total?.home
                  : data?.goals?.against?.total?.home ||
                    data?.points?.against?.total?.home}
              </td>
              <td>
                {sport === "football"
                  ? data?.goals?.for?.average?.home
                  : data?.goals?.for?.total?.home ||
                    data?.points?.for?.average?.home}
              </td>
              <td>
                {sport === "football"
                  ? data?.goals?.against?.average?.home
                  : data?.goals?.against?.total?.home ||
                    data?.points?.against?.average?.home}
              </td>
            </tr>
            <tr>
              <td>Away</td>
              <td>
                {data?.games?.played?.away || data?.fixtures?.played?.away}
              </td>
              <td>
                {data?.games?.wins?.away?.total || data?.fixtures?.wins?.away}
              </td>
              <td>
                {data?.games?.loses?.away?.total || data?.fixtures?.loses?.away}
              </td>
              <td>
                {sport === "football"
                  ? (
                      (data?.fixtures?.wins?.away /
                        data?.fixtures?.played?.away) *
                      100
                    ).toFixed(2)
                  : data?.games?.wins?.away?.percentage}
              </td>
              <td>
                {sport === "football"
                  ? (
                      (data?.fixtures?.loses?.away /
                        data?.fixtures?.played?.away) *
                      100
                    ).toFixed(2)
                  : data?.games?.loses?.away?.percentage}
              </td>
              <td>
                {sport === "football"
                  ? data?.goals?.for?.total?.away
                  : data?.goals?.for?.total?.away ||
                    data?.points?.for?.total?.away}
              </td>
              <td>
                {sport === "football"
                  ? data?.goals?.against?.total?.away
                  : data?.goals?.against?.total?.away ||
                    data?.points?.against?.total?.away}
              </td>
              <td>
                {sport === "football"
                  ? data?.goals?.for?.average?.away
                  : data?.goals?.for?.total?.away ||
                    data?.points?.for?.average?.away}
              </td>
              <td>
                {sport === "football"
                  ? data?.goals?.against?.average?.away
                  : data?.goals?.against?.total?.away ||
                    data?.points?.against?.average?.away}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
