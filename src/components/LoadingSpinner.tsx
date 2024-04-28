"use-client";
import React from "react";
import { CirclesWithBar } from "react-loader-spinner";

type LoadingSpinnerProps = {
  loading: boolean;
};

const LoadingSpinner: React.FC<LoadingSpinnerProps> = ({ loading }) => {
  return (
    <CirclesWithBar
      height="150"
      width="150"
      color="#ffffff"
      outerCircleColor="#6511d4"
      innerCircleColor="#FFD700"
      barColor="#FFD700"
      ariaLabel="circles-with-bar-loading"
      wrapperStyle={{}}
      wrapperClass="component-absolute-center"
      visible={loading}
    />
  );
};

export default LoadingSpinner;
