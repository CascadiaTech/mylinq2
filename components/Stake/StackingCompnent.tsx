import React, { useState } from "react";

const OverviewComponent = () => {
  const tableData = [
    {
      txnDate: "2023-08-25",
      txnHash: "0xabc123",
      lpAmount: "1000",
      remainingDays: "5",
      totalAccumulate: "5000",
      action: "Unstake",
    },
    {
      txnDate: "2023-08-26",
      txnHash: "0xabc5623",
      lpAmount: "500",
      remainingDays: "2",
      totalAccumulate: "600",
      action: "Claim",
    },
  ];

  return (
    <div className="overflow-x-auto">
      <table
        className="w-full border-collapse border-y border-black text-black font-sans italic"
        style={{ fontFamily: "Azonix" }}
      >
        <thead>
          <tr>
            <th className="border-b border-black p-2">TXN DATE</th>
            <th className="border-b border-black p-2">TXN HASH</th>
            <th className="border-b border-black p-2">LP AMOUNT</th>
            <th className="border-b border-black p-2">REMAINING DAYS</th>
            <th className="border-b border-black p-2">TOTAL ACCUMULATE</th>
            <th className="border-b border-black p-2">ACTIONS</th>
          </tr>
        </thead>

        <tbody>
          {tableData.map((item, index) => (
            <tr
              key={index}
              className={
                index % 2 === 0 ? "bg-gray-100 text-center" : "text-center"
              }
              style={{ width: "200px" }}
            >
              <td className="border-b text-sm border-black p-2 md:w-1/6 lg:w-1/6">
                {item.txnDate}
              </td>
              <td className="border-b text-sm border-black p-2 md:w-1/6 lg:w-1/6">
                {item.txnHash}
              </td>
              <td className="border-b text-sm border-black p-2 md:w-1/6 lg:w-1/6">
                {item.lpAmount}
              </td>
              <td className="border-b text-sm border-black p-2 md:w-1/6 lg:w-1/6">
                {item.remainingDays}
              </td>
              <td className="border-b text-sm border-black p-2 md:w-1/6 lg:w-1/6">
                {item.totalAccumulate}
              </td>
              <td className="border-b text-sm border-black p-2 md:w-1/6 lg:w-1/6 ">
                <button className="bg-gray-300 text-black text-sm px-4 py-1 rounded w-full items-center justify-center">
                  {item.action}
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const StackComponent = () => {
  return (
    <div className="py-6 px-4 m-auto sm:p-10   w-[350px] sm:w-[350px] md:w-[550px] lg:w-[450px]   bg-white">
      <div className="flex flex-col space-y-5">
        <div className="relative   rounded-lg p-2">
          <input
            type="text"
            className="w-full border-0 outline-none p-2 pr-10 text-black"
            defaultValue="0"
            max={10000}
            min={0}
            style={{ fontFamily: "Azonix" }}
          />
          <button className="absolute top-1/2 transform -translate-y-1/2 w-[80px] h-[50px] right-2 bg-transparent border-0 outline-none bg-black text-white">
            MAX
          </button>
        </div>
        <div className="flex justify-center items-center">
          <button
            style={{ fontFamily: "Azonix" }}
            className="font-sans italic cursor-pointer text-[20px] rounded-lg text-center border-black border-2 text-white bg-black py-2 px-5 sm:px-10 md:px-10 lg:px-10"
            type="button"
          >
            Stake
          </button>
        </div>
      </div>
    </div>
  );
};

const StackingCompnent = () => {
  const [activeStep, setActiveStep] = useState("overview");

  const handleStepChange = (step) => {
    setActiveStep(step);
  };

  return (
    <>
      <div className="py-5 px-4 sm:p-5 mt-5 sm:mt-10 md:mt-10 lg:mt-15  w-[350px] sm:w-[350px] md:w-[550px] min-h-[450px] lg:w-[700px] bg-white">
        <h1
          className="text-black font-sans italic flex justify-center text-center items-center text-[30px]"
          style={{ fontFamily: "Azonix" }}
        >
          14 Days Staking
        </h1>
        <div className="flex flex-col md:flex-row lg:flex-row md:justify-between lg:justify-between font-sans text-black border-b-[1px] pb-3 border-gray-500 mt-5 mb-5"></div>
        <div className="flex justify-center items-center">
          <button
            style={{ fontFamily: "Azonix" }}
            className={`font-sans mr-6 italic cursor-pointer md:text-[20px] lg:text-[20px] sm:text-[10px]  rounded-lg text-center border-black border-2 py-2 px-5 sm:px-10 md:px-10 lg:px-10 ${
              activeStep === "overview"
                ? "text-black bg-gray-300"
                : "text-gray-500"
            }`}
            type="button"
            onClick={() => handleStepChange("overview")}
          >
            Over view
          </button>
          <button
            style={{ fontFamily: "Azonix" }}
            className={`font-sans ml-6 italic cursor-pointer  md:text-[20px] lg:text-[20px] sm:text-[10px] rounded-lg text-center border-black border-2 py-2 px-5 sm:px-10 md:px-10 lg:px-10 ${
              activeStep === "stack"
                ? "text-black bg-gray-300"
                : "text-gray-500"
            }`}
            type="button"
            onClick={() => handleStepChange("stack")}
          >
            Stack
          </button>
        </div>
        <div className="mt-4">
          {activeStep === "overview" && <OverviewComponent />}
          {activeStep === "stack" && <StackComponent />}
        </div>
      </div>
    </>
  );
};

export default StackingCompnent;
