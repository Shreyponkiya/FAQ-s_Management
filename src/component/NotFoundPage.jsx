import React from "react";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col h-[80vh] justify-center">
      <div className="text-9xl text-ellipsis font-bold flex justify-center items-center ">
        <h1>404</h1>
      </div>
      <div className="text-5xl text-ellipsis flex font-semibold font-serif justify-center items-center ">
        <h1>Page Not Found</h1>
      </div>
    </div>
  );
};

export default NotFoundPage;
