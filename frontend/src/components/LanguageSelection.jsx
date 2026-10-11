import {useNavigate} from "react-router-dom";

export default function LanguageSelection() {
  const navigate = useNavigate();

  const languages = [
    {code: "EN", name: "English"},
    {code: "IT", name: "Italiano"},
    {code: "FR", name: "Français"},
    {code: "DE", name: "Deutsch"},
    {code: "ES", name: "Español"},
    {code: "PT", name: "Português"},
  ];

  // eslint-disable-next-line no-unused-vars
  const handleLanguageSelect = (code) => {
    // Pass the selected language to the next screen if needed
    navigate("/services");
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col p-8 font-sans text-[#1c2b39]">
      {/* Header */}
      <header className="flex justify-between items-start border-b border-gray-300 pb-4 w-full">
        <div className="flex items-center gap-3">
          {/* Placeholder for the Post Office Logo */}
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

      {/* Main Content */}
      <main className="grow flex flex-col items-center justify-center">
        <div className="text-center mb-12">
          <h1 className="text-6xl font-extrabold text-[#1c2b39] mb-4">
            Welcome
          </h1>
          <p className="text-lg text-[#5b6b7c]">
            Benvenuto · Bienvenue · Willkommen · Bienvenido · Bem-vindo
          </p>
        </div>

        <div className="text-center mb-8">
          <p className="text-lg font-semibold text-[#5b6b7c]">
            Tap your language to start
          </p>
          <p className="text-sm text-[#5b6b7c]">
            Tocca la tua lingua per iniziare
          </p>
        </div>

        {/* Language Grid */}
        <div className="grid grid-cols-2 gap-6 w-full max-w-2xl">
          {languages.map((lang) => (
            <button
              key={lang.code}
              onClick={() => handleLanguageSelect(lang.code)}
              className="flex items-center justify-start gap-4 px-8 py-6 bg-white border border-gray-300 rounded-2xl shadow-sm hover:shadow-md hover:border-gray-400 transition-all"
            >
              <span className="text-2xl font-bold text-[#e88b23]">
                {lang.code}
              </span>
              <span className="text-2xl font-bold text-[#1c2b39]">
                {lang.name}
              </span>
            </button>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full text-center pb-4">
        <p className="text-sm font-medium text-[#5b6b7c]">
          For assistance, please speak to our staff
        </p>
      </footer>
    </div>
  );
}
