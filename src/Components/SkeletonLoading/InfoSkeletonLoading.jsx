import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const InfoSkeletonLoading = () => {
  return (
    <div className="info-container">
      <SkeletonTheme highlightColor={"#d5d5d5"} baseColor={"#e2e2e2"}>
        <div className="info-container__header"></div>
        <div className="info-container__body">
          <Skeleton width={"75px"} height={"75px"} borderRadius={"50%"} />
          <p>
            <Skeleton width={"80px"} />
          </p>
          <h2 style={{ paddingTop: "0.5em" }}>
            <Skeleton width={"120px"} />
          </h2>
        </div>
        <div
          style={{ paddingTop: window.innerWidth < 1024 ? "3em" : "0" }}
          className="info-container__footer"
        ></div>
      </SkeletonTheme>
    </div>
  );
};

export default InfoSkeletonLoading;
