import React from "react";
import background_login from "../../../public/background_login.jpg";
import Teams from "../components/Teams";

const Team = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{ backgroundImage: `url(${background_login.src})` }}
    >
      <Teams />
    </div>
  );
};

export default Team;
