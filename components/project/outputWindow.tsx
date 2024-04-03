import React from "react";


const OutputWindow = ({ outputDetails }: { outputDetails: any }) => {
  console.log(outputDetails)
  const getOutput = () => {
    if (outputDetails?.error) {
      // Compilation error
      return (
        <span className="px-2 py-1 font-normal text-lg text-red-500">
          {outputDetails?.error}
        </span>
      );
    } else if (outputDetails?.output) {
      // Output with line breaks
      return (
        <span
          className="px-2 py-1 font-normal text-lg text-green-500"
          style={{ whiteSpace: "pre-wrap" }} // Set white-space property
        >
          {outputDetails?.output}
        </span>
      );
    } else {
      // Default case
      return (
        <span className="px-2 py-1 font-normal text-lg text-red-500">
          {outputDetails?.error}
        </span>
      );
    }
  };

  return (
    <>
      {/* <h1 className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 mb-2">
        Output
      </h1> */}
      <div className="w-full h-full bg-gray-800/40 hover:border hover:border-green-600 px-4 text-white font-normal text-md overflow-y-auto">
        <span className="text-slate-600 hover:underline text-md cursor-default">Output window</span>{outputDetails ? getOutput() : null}
      </div>
    </>
  )
};

export default OutputWindow;
