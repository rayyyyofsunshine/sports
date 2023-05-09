import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const UpcomingSkeletonLoading = () => {
  return (
    <div className="upcomingFixture-container">
      <SkeletonTheme highlightColor={"#d5d5d5"} baseColor={"#e2e2e2"}>
        <div className="upcomingFixture-container__header">
          <div className="upcomingFixture-container__header__league--details">
            <Skeleton width={"20px"} height={"20px"} borderRadius={"50%"} />
            <h5 style={{ marginLeft: "1em" }}>
              <Skeleton width={"80px"} />
            </h5>
          </div>
          <div className="upcomingFixture-container__header__arrows"></div>
        </div>
        <div
          style={{ width: "100%" }}
          className="upcomingFixture-container__content--carousel"
        >
          <div style={{ position: "sticky" }} className="carousel-card">
            <div className="carousel-card__fixture-details">
              <div className="team--flags">
                <Skeleton
                  width={"32.5px"}
                  height={"32.5px"}
                  borderRadius={"50%"}
                  style={{ marginRight: "0.65em" }}
                />
                <Skeleton
                  width={"32.5px"}
                  height={"32.5px"}
                  borderRadius={"50%"}
                />
              </div>
              <div className="fixture--details">
                <div className="details__time">
                  <Skeleton width={"30px"} />
                </div>
                <div className="details__date">
                  <Skeleton width={"30px"} />
                </div>
              </div>
            </div>
            <div className="carousel-card__teams">
              <div className="carousel-card__teams--home">
                <Skeleton width={"100px"} />
              </div>
              <div className="carousel-card__teams--away">
                <Skeleton width={"100px"} />
              </div>
            </div>
          </div>
        </div>
      </SkeletonTheme>
    </div>
  );
};

export default UpcomingSkeletonLoading;
