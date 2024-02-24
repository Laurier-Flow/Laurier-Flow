"use-client";
import React from "react";
import { CirclesWithBar } from "react-loader-spinner";

export default function LoadingSpinner(): React.ReactElement {
  return (
    <CirclesWithBar
      height="150"
      width="150"
      color="#ffffff"
      outerCircleColor="#6511d4"
      innerCircleColor="#0ce0f7"
      barColor="#0ce0f7"
      ariaLabel="circles-with-bar-loading"
      wrapperStyle={{}}
      wrapperClass="component-absolute-center"
      visible={true}
    />
  );
}
