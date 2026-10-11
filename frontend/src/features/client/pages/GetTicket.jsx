import {useState} from "react";
import {useNavigate} from "react-router-dom";
import Header from "../../../components/layout/Header";

export default function GetTicket() {
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);

  // Mock data to match the UI until the backend is fully wired
  const services = [
    {id: "shipping", name: "Shipping", queue: 8, wait: "90'"},
    {id: "pickups", name: "Pickups", queue: 8, wait: "90'"},
    {id: "payments", name: "Payments", queue: 8, wait: "90'"},
    {id: "financial", name: "Financial Services", queue: 8, wait: "90'"},
    {id: "topups", name: "Top-ups", queue: 8, wait: "90'"},
    {id: "identity", name: "Identity Services", queue: 8, wait: "90'"},
  ];

  const handleServiceSelect = async (service) => {
    setLoading(true);
    setError(null);
    try {
      // Replace with your actual backend call: await fetch('http://localhost:3000/api/v1/tickets', ...)
      // Simulating network delay and backend response
      setTimeout(() => {
        setTicket({
          number: "A040",
          serviceName: service.name,
          emittedAt: "10:38",
          queuePosition: 8,
          estimatedWait: 62,
        });
        setLoading(false);
      }, 500);
    } catch (err) {
      console.error("Error fetching ticket:", err);
      setError("Failed to fetch ticket");
      setLoading(false);
    }
  };

  if (ticket) {
    // TICKET ISSUED SCREEN[cite: 6]
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
        {/* Success Banner */}
        <div className="bg-[#108a5e] text-white p-6 flex items-center justify-center gap-4">
          <div className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <div>
            <h1 className="text-2xl font-bold">Ticket issued successfully</h1>
            <p className="text-sm opacity-90">
              Please wait to be called to the counter
            </p>
          </div>
        </div>

        {/* Ticket Display */}
        <main className="grow flex flex-col items-center pt-12 pb-8 px-4">
          <div className="bg-white rounded-b-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col mb-8 relative">
            {/* Ticket Header */}
            <div className="bg-[#5b6b7c] text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <div
                  className="w-8 h-8 bg-linear-to-br from-green-500 to-orange-400 rounded-sm"
                  style={{clipPath: "polygon(0 0, 100% 50%, 0 100%)"}}
                ></div>
                <div className="leading-tight">
                  <p className="font-bold text-sm">Post Office</p>
                  <p className="text-[10px] tracking-wider opacity-80">
                    PUBLIC SERVICE
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-80">Emitted at</p>
                <p className="font-bold">{ticket.emittedAt}</p>
              </div>
            </div>

            {/* Ticket Body */}
            <div className="p-8 text-center flex flex-col items-center">
              <div className="w-full text-left mb-6">
                <p className="text-[10px] text-gray-500 uppercase font-bold">
                  Service
                </p>
                <p className="text-sm font-bold text-[#1c2b39]">
                  {ticket.serviceName}
                </p>
              </div>

              <p className="text-gray-500 text-sm">Your ticket</p>
              <h2 className="text-8xl font-black text-[#e88b23] my-2">
                {ticket.number}
              </h2>

              <div className="flex justify-center gap-12 mt-6 w-full text-[#1c2b39]">
                <div className="flex flex-col items-center text-xs">
                  <span className="flex items-center gap-1 text-gray-500">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                      />
                    </svg>{" "}
                    You are number
                  </span>
                  <span className="text-xl font-bold">
                    {ticket.queuePosition}
                  </span>
                  <span className="text-gray-500">in queue</span>
                </div>
                <div className="flex flex-col items-center text-xs">
                  <span className="flex items-center gap-1 text-gray-500">
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>{" "}
                    Estimated waiting time
                  </span>
                  <span className="text-xl font-bold">
                    {ticket.estimatedWait}
                  </span>
                  <span className="text-gray-500">min</span>
                </div>
              </div>
            </div>

            {/* Ticket Footer Note */}
            <div className="bg-white border-t border-dashed border-gray-300 py-3 text-center rounded-b-2xl">
              <p className="text-[10px] text-gray-500">
                Tickets are printed automatically
              </p>
            </div>
          </div>

          <button
            onClick={() => navigate("/")}
            className="bg-[#108a5e] text-white text-xl font-bold py-4 px-12 rounded-xl w-full max-w-md shadow-md hover:bg-green-700 transition"
          >
            Get a new ticket
          </button>
        </main>

        <footer className="w-full text-center pb-8">
          <p className="text-sm font-medium text-[#5b6b7c]">
            For assistance, please speak to our staff
          </p>
        </footer>
      </div>
    );
  }

  // SERVICE SELECTION SCREEN[cite: 5]
  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans text-[#1c2b39]">
      <Header type="client" />

      <button
        onClick={() => navigate("/")}
        className="text-lg font-medium self-start mb-4"
      >
        {"< Back"}
      </button>

      <main className="grow flex flex-col items-center p-8">
        <h1 className="text-4xl font-extrabold text-[#1c2b39] mb-8">
          Select a service
        </h1>

        <div className="grid grid-cols-2 gap-6 w-full max-w-3xl">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => handleServiceSelect(service)}
              disabled={loading}
              className="flex flex-col items-center justify-center p-8 bg-white border border-gray-300 rounded-2xl shadow-sm hover:shadow-md transition-all"
            >
              {/* Placeholder for specific icons[cite: 5] */}
              <div className="h-16 w-16 bg-[#fae8d4] border-2 border-[#1c2b39] rounded-lg mb-4 flex items-center justify-center">
                <span className="text-2xl text-[#1c2b39]">Icon</span>
              </div>
              <h2 className="text-xl font-bold text-[#1c2b39] mb-4">
                {service.name}
              </h2>
              <div className="flex gap-4 text-sm text-[#1c2b39] font-medium">
                <span className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                  </svg>{" "}
                  {service.queue}
                </span>
                <span className="flex items-center gap-1">
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>{" "}
                  {service.wait}
                </span>
              </div>
            </button>
          ))}
        </div>
      </main>

      <footer className="w-full text-center pb-4 mt-8">
        <p className="text-sm font-medium text-[#5b6b7c]">
          For assistance, please speak to our staff
        </p>
      </footer>
    </div>
  );
}
