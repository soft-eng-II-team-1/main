import {useEffect, useState} from "react";
import postOfficeLogo from "../../assets/images/selfhst_proton-mail.svg";
import {getLanguageLocale, getSelectedLanguage, translate} from "../../lib/language.js";

export default function Header({type}) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const language = type === "client" ? getSelectedLanguage() : "EN";
  const locale = getLanguageLocale(language);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = currentDate.toLocaleTimeString(locale, {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const dateString = currentDate.toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="flex justify-between items-start border-b border-gray-300 p-4 w-full">
      <div className="flex items-center gap-3">
        <img
          src={postOfficeLogo}
          alt=""
          aria-hidden="true"
          className="w-12 h-12 object-contain"
        />
        <div>
          <h1 className="text-xl font-bold leading-tight">Post Office</h1>
          <p className="text-sm text-slate-500 tracking-wider">
            {type === "client"
              ? translate("publicService", language)
              : "Counter Queue Management"}
          </p>
        </div>
      </div>
      <div className="text-right">
        <h2 className="text-2xl font-bold">{timeString}</h2>
        <p className="text-sm text-slate-500">{dateString}</p>
      </div>
    </header>
  );
}
