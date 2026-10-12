import {useState} from "react";
import {useNavigate} from "react-router-dom";
import Header from "../../../components/layout/Header";
import {LANGUAGE_STORAGE_KEY} from "../../../lib/language.js";

export default function LanguageSelection() {
  const navigate = useNavigate();
  const [selectedLanguage, setSelectedLanguage] = useState(null);

  const languages = [
    {code: "EN", name: "English"},
    {code: "IT", name: "Italiano"},
    {code: "FR", name: "Français"},
    {code: "DE", name: "Deutsch"},
    {code: "ES", name: "Español"},
    {code: "PT", name: "Português"},
  ];

  const handleLanguageSelect = (code) => {
    setSelectedLanguage(code);
    localStorage.setItem(LANGUAGE_STORAGE_KEY, code);
    navigate("/services");
  };

  return (
    <div className="min-h-screen bg-[#f8f9fa] flex flex-col font-sans text-[#1c2b39]">
      {/* Header */}
      <Header type="client" />
      {/* Main Content */}
      <main className="grow flex flex-col p-8 items-center justify-center">
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
              className={`flex cursor-pointer items-center justify-start gap-4 px-8 py-6 bg-white border-2 rounded-2xl shadow-sm hover:shadow-md active:border-[#e88b23] active:shadow-[0_0_12px_rgba(232,139,35,0.6)] focus-visible:outline-none focus-visible:border-[#e88b23] focus-visible:shadow-[0_0_12px_rgba(232,139,35,0.6)] transition-all ${
                selectedLanguage === lang.code
                  ? "border-[#e88b23] shadow-[0_0_12px_rgba(232,139,35,0.6)]"
                  : "border-gray-300 hover:border-gray-400"
              }`}
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
        <p className="relative -top-2 text-sm font-medium text-[#5b6b7c]">
          For assistance, please speak to our staff
        </p>
      </footer>
    </div>
  );
}
