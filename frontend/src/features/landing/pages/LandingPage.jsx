import {Link} from "react-router";
import officerImg from "../../../assets/images/officer.svg";
import userImg from "../../../assets/images/user.svg";

export default function LandingPage() {
  return (
    <div className="w-full h-full p-4 flex items-center justify-center">
      <div className="flex gap-10 items-center justify-center">
        <Link
          to="/client"
          className="rounded-full flex flex-col gap-2 w-40 h-40 p-4 bg-gray-200 overflow-hidden shadow-blue-200 hover:shadow-lg duration-300 shadow-none"
        >
          <img src={userImg} alt="Client" />
          <p>Client</p>
        </Link>
        <Link
          to="/login"
          className="rounded-full flex flex-col gap-2 w-40 h-40 p-4 bg-gray-200 overflow-hidden shadow-blue-200 hover:shadow-lg duration-300 shadow-none"
        >
          <img src={officerImg} alt="Operator" />
          <p>Operator</p>
        </Link>
      </div>
    </div>
  );
}
