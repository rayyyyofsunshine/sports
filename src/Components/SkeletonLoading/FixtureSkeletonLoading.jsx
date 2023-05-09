import React from "react";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function CarouselSkeleton() {
  return (
    <div className="fixtuePage-container--detail">
      <div className="fixturePage-cotnainer--detail__body">
        <div className="fixturePage-container--detail__body__column--first">
          <h4></h4>
        </div>
        <div className="fixturePage-container--detail__body__column--second"></div>
        <div className="fixturePage-container--detail__body__column--third">
          <h4></h4>
        </div>
      </div>
    </div>
  );
}
