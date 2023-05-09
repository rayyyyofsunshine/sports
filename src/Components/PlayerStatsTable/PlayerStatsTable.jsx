import React from "react";

const PlayerStatsTable = ({ property, value }) => {
  return (
    <div className="stats--table__value">
      <p>{property}</p>
      <p>{value}</p>
    </div>
  );
};

export default PlayerStatsTable;
