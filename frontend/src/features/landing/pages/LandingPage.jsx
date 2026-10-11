import {Link} from "react-router";
import officerImg from "../../../assets/images/officer.svg";
import userImg from "../../../assets/images/user.svg";
import Header from "../../../components/layout/Header";

export default function LandingPage() {
  return (
    <div className="w-full h-full p-4 flex flex-col">
      <Header />
      <div className="flex gap-10 items-center justify-center w-full h-full">
        <Link
          to="/language-selection"
          className="flex w-52 h-52 flex-col items-center justify-center gap-4 px-8 py-6 bg-white border border-gray-300 rounded-2xl shadow-sm hover:shadow-md hover:border-gray-400 transition-all"
        >
          <img src={userImg} alt="Client" />
          <p>Client</p>
        </Link>
        <Link
          to="/officer"
          className="flex w-52 h-52 flex-col items-center justify-center gap-4 px-8 py-6 bg-white border border-gray-300 rounded-2xl shadow-sm hover:shadow-md hover:border-gray-400 transition-all"
        >
          <img src={officerImg} alt="Operator" />
          <p>Operator</p>
        </Link>
      </div>
    </div>
  );
}
