import React from "react";
import { Buffer } from "buffer";
const OutputWindow = ( outputDetails:any ) => {
  const getOutput = () => {
    let statusId = outputDetails?.status?.id;

    if (statusId === 6) {
      // compilation error
      return (
        <span className="px-2 py-1 font-normal text-xs text-red-500">
          {atob(outputDetails?.stderr)}
        </span>
      );
    } else if (statusId === 3) {
      console.log("Should display")
      return (
        <span className="px-2 py-1 font-normal text-xs text-green-500">
          {atob(outputDetails.compile_output) !== null
            ? `${atob(outputDetails.compile_output)}`
            : null}
        </span>
      );
    } else if (statusId === 5) {
      return (
        <span className="px-2 py-1 font-normal text-xs text-red-500">
          {`Time Limit Exceeded`}
        </span>
      );
    } else {
      return (
        <span className="px-2 py-1 font-normal text-xs text-red-500">
          {outputDetails?.stderr}
        </span>
      );
    }
  };
  return (
    <>
      <h1 className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 mb-2">
        Output
      </h1>
      <div className="w-full h-56 bg-[#1e293b] rounded-md text-white font-normal text-sm overflow-y-auto">
        {outputDetails ? <>{getOutput()}</> : null}
      </div>
    </>
  );
};

export default OutputWindow;