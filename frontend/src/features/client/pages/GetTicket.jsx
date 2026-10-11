import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {createTicket, getQueues, getServices} from "../../../lib/api.js";

export default function GetTicket() {
  const navigate = useNavigate();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);

  const [services, setServices] = useState([]);
  const [queueSizes, setQueueSizes] = useState({});
  const [loadingServices, setLoadingServices] = useState(true);  

  useEffect(() => {
    async function load() {
      try {
        const [list, queues] = await Promise.all([getServices(), getQueues()]);
        setServices(list);
        setQueueSizes(
          Object.fromEntries(
            Object.entries(queues).map(([name, q]) => [name, q.tickets.length]),
          ),
        );
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingServices(false);
      }
    }
    load();
  }, []);


  const handleServiceSelect = async (service) => {
    setLoading(true);
    setError(null);
    try {
      const created = await createTicket(service.id);
      setTicket({
        number: created.number,
        serviceName: created.serviceName,
        emittedAt: new Date(created.issuedAt).toLocaleTimeString("it-IT", 
        {
          hour: "2-digit",
          minute: "2-digit",
        }),
      });
    } catch (err) {
      console.error("Error fetching ticket:", err);
      setError(err.message);
    } finally {
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
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col p-8 font-sans text-[#1c2b39]">
      <header className="flex justify-between items-start border-b border-gray-300 pb-4 w-full mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-12 h-12 bg-linear-to-br from-green-500 to-orange-400 rounded-sm"
            style={{clipPath: "polygon(0 0, 100% 50%, 0 100%)"}}
          ></div>
          <div>
            <h1 className="text-xl font-bold leading-tight">Post Office</h1>
            <p className="text-sm text-slate-500 tracking-wider">
              PUBLIC SERVICE
            </p>
          </div>
        </div>
        <div className="text-right">
          <h2 className="text-2xl font-bold">17:24</h2>
          <p className="text-sm text-slate-500">8 October 2026</p>
        </div>
      </header>

      <button
        onClick={() => navigate("/")}
        className="text-lg font-medium self-start mb-4"
      >
        {"< Back"}
      </button>

      <main className="grow flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-[#1c2b39] mb-8">
          Select a service
        </h1>

        {error && <p className="mb-4 font-medium text-red-600">{error}</p>}
        {loadingServices && <p className="text-slate-500">Loading services...</p>}
        {!loadingServices && !error && services.length === 0 && (
          <p className="text-slate-500">No service available</p>
        )}

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
                  {queueSizes[service.name] ?? 0}
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
