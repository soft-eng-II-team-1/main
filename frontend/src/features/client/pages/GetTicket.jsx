import {useState, useEffect} from "react";
import {useNavigate} from "react-router-dom";
import {createTicket, getQueues, getServices} from "../../../lib/api.js";
import {getServiceIcon} from "../../../lib/serviceIcons.js";
import {
  getLanguageLocale,
  getSelectedLanguage,
  translate,
  translateServiceName,
} from "../../../lib/language.js";
import ticketSuccessIcon from "../../../assets/images/lets-icons_check-ring-round-duotone.svg";
import postOfficeLogo from "../../../assets/images/selfhst_proton-mail.svg";
import Header from "../../../components/layout/Header";

export default function GetTicket() {
  const navigate = useNavigate();
  const language = getSelectedLanguage();
  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(false);
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
        emittedAt: new Date(created.issuedAt).toLocaleTimeString(
          getLanguageLocale(language),
          {
            hour: "2-digit",
            minute: "2-digit",
          },
        ),
      });
    } catch (err) {
      console.error("Error creating ticket:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGetNewTicket = async () => {
    setLoading(true);
    setError(null);
    try {
      const queues = await getQueues();
      setQueueSizes(
        Object.fromEntries(
          Object.entries(queues).map(([name, queue]) => [
            name,
            queue.tickets.length,
          ]),
        ),
      );
    } catch (err) {
      setError(err.message);
    } finally {
      setTicket(null);
      setLoading(false);
    }
  };

  if (ticket) {
    // TICKET ISSUED SCREEN[cite: 6]
    return (
      <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans">
        {/* Success Banner */}
        <div className="bg-[#108a5e] text-black p-6 flex items-center justify-start gap-2">
          <img
            src={ticketSuccessIcon}
            alt=""
            aria-hidden="true"
            className="w-20 h-20 object-contain"
          />
          <div>
            <h1 className="text-2xl font-bold">
              {translate("ticketSuccess", language)}
            </h1>
            <p className="text-sm opacity-90">
              {translate("waitToBeCalled", language)}
            </p>
          </div>
        </div>

        {/* Ticket Display */}
        <main className="grow flex flex-col items-center pt-12 pb-8 px-4">
          <div className="bg-white rounded-bl-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col mb-8 relative">
            {/* Ticket Header */}
            <div className="bg-[#5b6b7c] text-white p-4 flex justify-between items-center">
              <div className="flex items-center gap-2">
                <img
                  src={postOfficeLogo}
                  alt=""
                  aria-hidden="true"
                  className="w-8 h-8 object-contain"
                />
                <div className="leading-tight">
                  <p className="font-bold text-sm">Post Office</p>
                  <p className="text-[10px] tracking-wider opacity-80">
                    {translate("publicService", language).toUpperCase()}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs opacity-80">
                  {translate("emittedAt", language)}
                </p>
                <p className="font-bold">{ticket.emittedAt}</p>
              </div>
            </div>

            {/* Ticket Body */}
            <div className="p-8 text-center flex flex-col items-center">
              <div className="w-full text-left mb-6">
                <p className="text-[10px] text-gray-500 uppercase font-bold">
                  {translate("service", language)}
                </p>
                <p className="text-sm font-bold text-[#1c2b39]">
                  {translateServiceName(ticket.serviceName, language)}
                </p>
              </div>

              <p className="text-gray-500 text-sm">
                {translate("yourTicket", language)}
              </p>
              <h2 className="text-8xl font-black text-[#e88b23] my-2">
                {ticket.number}
              </h2>

            </div>

            {/* Ticket Footer Note */}
            <div className="bg-white border-t border-dashed border-gray-300 py-3 text-center rounded-bl-2xl">
              <p className="text-[10px] text-gray-500">
                {translate("ticketsPrinted", language)}
              </p>
            </div>
          </div>

          <button
            onClick={handleGetNewTicket}
            disabled={loading}
            className="bg-[#108a5e] text-white text-xl font-bold py-4 px-12 rounded-xl w-full max-w-md shadow-md hover:bg-green-700 transition disabled:opacity-60"
          >
            {translate("getNewTicket", language)}
          </button>
        </main>

        <footer className="w-full text-center pb-8">
          <p className="text-sm font-medium text-[#5b6b7c]">
            {translate("assistance", language)}
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
        className="text-lg font-medium self-start mt-2 mb-4 ml-4"
      >
        {"< " + translate("back", language)}
      </button>

      <main className="grow flex flex-col items-center p-8">
        <h1 className="text-5xl font-bold text-[#1c2b39] mb-8">
          {translate("selectService", language)}
        </h1>

        {error && <p className="mb-4 font-medium text-red-600">{error}</p>}
        {loadingServices && (
          <p className="text-slate-500">
            {translate("loadingServices", language)}
          </p>
        )}
        {!loadingServices && !error && services.length === 0 && (
          <p className="text-slate-500">
            {translate("noServices", language)}
          </p>
        )}

        <div className="grid grid-cols-2 gap-6 w-full max-w-3xl">
          {services.map((service) => (
            <button
              key={service.id}
              onClick={() => handleServiceSelect(service)}
              disabled={loading}
              className="flex flex-col items-center justify-center p-8 bg-white border border-gray-300 rounded-2xl shadow-sm hover:shadow-md active:border-[#e88b23] active:shadow-[0_0_12px_rgba(232,139,35,0.6)] focus-visible:outline-none focus-visible:border-[#e88b23] focus-visible:shadow-[0_0_12px_rgba(232,139,35,0.6)] transition-all"
            >
              {/* Service icon */}
              <div className="h-16 w-16 mb-4 flex items-center justify-center">
                {getServiceIcon(service.name) ? (
                  <img
                    src={getServiceIcon(service.name)}
                    alt=""
                    aria-hidden="true"
                    className="h-full w-full object-contain"
                  />
                ) : (
                  <span className="text-2xl text-[#1c2b39]" aria-hidden="true">
                    {service.name.charAt(0)}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-bold text-[#1c2b39] mb-4">
                {translateServiceName(service.name, language)}
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
          {translate("assistance", language)}
        </p>
      </footer>
    </div>
  );
}
