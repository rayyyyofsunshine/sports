import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const FixtureDetailSkeletonLoading = () => {
  return (
    <div className="fixturePage-container--detail">
      <SkeletonTheme highlightColor={"#d5d5d5"} baseColor={"#e2e2e2"}>
        <div className="fixturePage-container--detail__header">
          <div className="fixturePage-container--detail__header__completed">
            <div className="fixturePage-container--detail__header__completed__row">
              <Skeleton width={"70px"} />
              <Skeleton width={"50px"} />
            </div>
            <div className="fixturePage-container--detail__header__completed__row">
              <Skeleton width={"50px"} />
            </div>
          </div>
        </div>
        <div
          style={{ paddingBottom: "2em" }}
          className="fixturePage-container--detail__body"
        >
          <div className="fixturePage-container--detail__body__column--first">
            <Skeleton
              width={window.innerWidth < 1024 ? "45px" : "65px"}
              height={window.innerWidth < 1024 ? "45px" : "65px"}
              borderRadius={"50%"}
            />
            <Skeleton
              style={{ marginTop: "1.25em" }}
              width={window.innerWidth < 1024 ? "70px" : "80px"}
            />
          </div>
          <div className="fixturePage-container--detail__body__column--second"></div>
          <div className="fixturePage-container--detail__body__column--third">
            <Skeleton
              width={window.innerWidth < 1024 ? "45px" : "65px"}
              height={window.innerWidth < 1024 ? "45px" : "65px"}
              borderRadius={"50%"}
            />
            <Skeleton
              style={{ marginTop: "1.25em" }}
              width={window.innerWidth < 1024 ? "70px" : "80px"}
            />
          </div>
        </div>
      </SkeletonTheme>
    </div>
  );
};

export default FixtureDetailSkeletonLoading;
