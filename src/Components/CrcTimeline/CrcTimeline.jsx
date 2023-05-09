import React, { useState } from "react";
import _ from "lodash";
import moment from "moment";
import { comment } from "../../Helpers/Utilities";

export default function CrcTimeline({ data, inningData }) {
  const [inningsIndex, setInningsIndex] = useState(1);
  // eslint-disable-next-line
  const [overTotalRuns, setOverTotalRuns] = useState(0);

  const inningWisePlay = _.groupBy(data, "inningNumber");
  console.log(inningData);
  console.log(inningWisePlay);

  return (
    <div className="timeline-container">
      <div className="timeline-container--filter">
        {Object.keys(inningWisePlay).map((inning) => (
          <p
            className={inning === inningsIndex.toString() && "active"}
            onClick={() => setInningsIndex(inning)}
            key={inning}
          >
            <span>{moment.localeData().ordinal(inning) + " Inn"}</span>
          </p>
        ))}
      </div>
      <div className="timeline-container--contents">
        {Object.keys(_.groupBy(inningWisePlay[inningsIndex], "over"))
          .reverse()
          .map((over, index) => (
            <div key={index} className="timeline-container__over-wrapper">
              <div className="timeline-container__header">
                <div className="timeline-container__header--overview">
                  <div className="overview--col">
                    <h4>END OF OVER {over}</h4>
                    <span>{overTotalRuns}</span>
                  </div>
                  <div className="overview--col">
                    <h4>
                      {inningData?.[inningsIndex - 1]?.battingTeam?.shortName}:{" "}
                      {
                        _.groupBy(inningWisePlay[inningsIndex], "over")[
                          over
                        ]?.[0]?.score
                      }
                    </h4>
                    <span>
                      CRR:{" "}
                      {(
                        parseInt(
                          _.groupBy(inningWisePlay[inningsIndex], "over")[
                            over
                          ]?.[0]?.score?.split("/")[0]
                        ) /
                        parseInt(
                          _.groupBy(inningWisePlay[inningsIndex], "over")[
                            over
                          ]?.[0]?.over
                        )
                      ).toFixed(2)}
                    </span>
                  </div>
                </div>
                <div className="timeline-container__header--details">
                  <div className="details--col">
                    <div className="player">
                      <p>
                        Batsman:{" "}
                        {
                          _.groupBy(inningWisePlay[inningsIndex], "over")[
                            over
                          ]?.[0]?.batsman?.name
                        }
                      </p>
                    </div>
                  </div>
                  <div className="details--col">
                    <div className="player">
                      <p>
                        Bowler:{" "}
                        {
                          _.groupBy(inningWisePlay[inningsIndex], "over")[
                            over
                          ]?.[0]?.bowler?.name
                        }
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="timeline-container__body">
                {_.groupBy(inningWisePlay[inningsIndex], "over")[over]?.map(
                  (ball) => (
                    <div
                      key={ball?.id}
                      className="timeline-container__body__row"
                    >
                      <span>{`${ball?.over}.${ball?.ball}`}</span>
                      <div
                        className={`ball--detail ${ball?.incidentClassColor}`}
                      >
                        <p>
                          {ball?.incidentClassColor === "errors"
                            ? ball?.incidentClassLabel.slice(0, -1)
                            : ball?.incidentClassLabel !== "0"
                            ? ball?.incidentClassLabel
                            : ""}
                        </p>
                      </div>
                      <div className="commentary">
                        <p>
                          {`${ball?.bowler?.name} to ${ball?.batsman?.name}, `}{" "}
                          {comment(ball)}
                        </p>
                      </div>
                    </div>
                  )
                )}
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
