import {useCallback, useEffect, useState} from "react";
import {callNext, getQueues} from "../../../lib/api.js";
import Header from "../../../components/layout/Header";

//set counter in .env based on database
const COUNTER_ID = import.meta.env.VITE_COUNTER_ID;
const COUNTER_NUMBER = String(import.meta.env.VITE_COUNTER_NUMBER ?? "").padStart(2, "0");

const toQueueList = (data) =>
  Object.entries(data).map(([name, q]) => ({name, count: q.tickets.length}));

export default function OfficerDesktop() {
  const [currentTicket, setCurrentTicket] = useState(null);
  const [queues, setQueues] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(
    COUNTER_ID ? null : "VITE_COUNTER_ID is not set in frontend/.env",
  );
  const [message, setMessage] = useState(null);

const loadQueues = async () => {
  try {
    setQueues(toQueueList(await getQueues()));
  } catch (err) {
    setError(err.message);
  }
};

useEffect(() => {
  let ignore = false;
  getQueues()
    .then((data) => {
      if (!ignore) setQueues(toQueueList(data));
    })
    .catch((err) => {
      if (!ignore) setError(err.message);
    });
  return () => {
    ignore = true;
  };
}, []);

  const handleCallNext = async () => {
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      const ticket = await callNext(COUNTER_ID);
      if (!ticket.id) {
        // response {} : no client in the queue for that service
        setCurrentTicket(null);
        setMessage("No customers waiting");
      } else {
        setCurrentTicket({
          number: ticket.number,
          counter: COUNTER_NUMBER,
          service: ticket.serviceName,
        });
      }
      await loadQueues();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col font-sans text-[#1c2b39]">
      <Header type="officer" />
      <div className="flex justify-end px-8 pt-4">
        <div className="flex items-center gap-2 border border-gray-300 rounded-full px-4 py-1">
          <div className="w-2 h-2 rounded-full bg-[#108a5e]"></div>
            <span className="text-sm font-medium text-gray-700">
              Counter {COUNTER_NUMBER} - Ready
            </span>
          </div>
        </div>
      <main className="grow flex p-8 gap-8 max-w-6xl mx-auto w-full">
        {/* Left Column: Active Queues */}
        <aside className="w-72 bg-white border border-gray-200 rounded-2xl p-6 shadow-sm h-fit">
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-bold text-lg">Active Queues</h2>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded-full">
              {queues.length} services
            </span>
          </div>
          <ul className="space-y-4">
            {queues.map((q) => (
              <li key={q.name} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="flex items-center justify-center w-6 h-6 border border-gray-300 rounded text-xs font-medium text-gray-500">
                    {q.name.charAt(0)}
                  </span>
                  <span className="text-sm text-gray-700">{q.name}</span>
                </div>
                <span className="text-sm font-bold">{q.count}</span>
              </li>
            ))}
          </ul>
        </aside>

        {/* Right Column: Interaction Area */}
        <section className="grow flex flex-col items-center pt-8">
          <div className="bg-white border border-gray-200 rounded-3xl w-full max-w-lg p-10 text-center shadow-sm mb-8">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4">
              Currently Serving
            </p>
            <h2 className="text-7xl font-black text-[#1c2b39] mb-8 tracking-tight">
              {currentTicket?.number ?? "-"}
            </h2>

            <div className="flex justify-center items-center gap-12">
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-gray-400 uppercase font-bold">
                  Counter
                </span>
                <span className="text-xl font-bold">
                  {currentTicket?.counter ?? "-"}
                </span>
              </div>
              <div className="w-px h-8 bg-gray-200"></div>
              <div className="flex flex-col items-center">
                <span className="text-[10px] text-gray-400 uppercase font-bold">
                  Service
                </span>
                <span className="text-xl font-bold">
                  {currentTicket?.service ?? "-"}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 w-full max-w-sm">
            <button className="w-full bg-[#108a5e] text-white py-4 rounded-full font-bold shadow-md hover:bg-green-700 transition flex justify-center items-center gap-2" onClick={handleCallNext} disabled={loading || !COUNTER_ID}>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              Call Next Customer
            </button>
              {message && <p className="text-center text-gray-500">{message}</p>}
              {error && <p className="text-center font-medium text-red-600">{error}</p>}
            <div className="flex gap-3">
              <button className="flex-1 bg-[#8fa99b] text-white py-3 rounded-full font-medium hover:bg-opacity-90 transition">
                Close Ticket
              </button>
              <button className="flex-1 bg-[#8fa99b] text-white py-3 rounded-full font-medium hover:bg-opacity-90 transition">
                No Show
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
