import {useEffect, useState} from "react";

export default function Header({type}) {
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDate(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const timeString = currentDate.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const dateString = currentDate.toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <header className="flex justify-between items-start border-b border-gray-300 p-4 w-full">
      <div className="flex items-center gap-3">
        {/* Placeholder for the Post Office Logo */}
        <div
          className="w-12 h-12 bg-linear-to-br from-green-500 to-orange-400 rounded-sm"
          style={{clipPath: "polygon(0 0, 100% 50%, 0 100%)"}}
        ></div>
        <div>
          <h1 className="text-xl font-bold leading-tight">Post Office</h1>
          <p className="text-sm text-slate-500 tracking-wider">
            {type === "client" ? "Public Service" : "Counter Queue Management"}
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
