export const LANGUAGE_STORAGE_KEY = "postOfficeLanguage";

export const supportedLanguages = ["EN", "IT", "FR", "DE", "ES", "PT"];

const translations = {
  EN: {
    publicService: "Public Service",
    emittedAt: "Emitted at",
    ticketSuccess: "Ticket issued successfully",
    waitToBeCalled: "Please wait to be called to the counter",
    service: "Service",
    yourTicket: "Your ticket",
    ticketsPrinted: "Tickets are printed automatically",
    getNewTicket: "Get a new ticket",
    assistance: "For assistance, please speak to our staff",
    back: "Back",
    selectService: "Select a service",
    loadingServices: "Loading services...",
    noServices: "No service available",
    services: {
      Shipping: "Shipping",
      Pickups: "Pickups",
      Payments: "Payments",
      "Account Management": "Account Management",
      Deposits: "Deposits",
      "Financial Services": "Financial Services",
      "Top-ups": "Top-ups",
      "Identity Services": "Identity Services",
    },
  },
  IT: {
    publicService: "Servizio al pubblico",
    emittedAt: "Emesso alle",
    ticketSuccess: "Biglietto emesso con successo",
    waitToBeCalled: "Attendi di essere chiamato allo sportello",
    service: "Servizio",
    yourTicket: "Il tuo biglietto",
    ticketsPrinted: "I biglietti vengono stampati automaticamente",
    getNewTicket: "Prendi un nuovo biglietto",
    assistance: "Per assistenza, rivolgiti al nostro personale",
    back: "Indietro",
    selectService: "Seleziona un servizio",
    loadingServices: "Caricamento dei servizi...",
    noServices: "Nessun servizio disponibile",
    services: {
      Shipping: "Spedizioni",
      Pickups: "Ritiri",
      Payments: "Pagamenti",
      "Account Management": "Gestione conti",
      Deposits: "Depositi",
      "Financial Services": "Servizi finanziari",
      "Top-ups": "Ricariche",
      "Identity Services": "Servizi di identità",
    },
  },
  FR: {
    publicService: "Service public",
    emittedAt: "Émis à",
    ticketSuccess: "Ticket émis avec succès",
    waitToBeCalled: "Veuillez attendre que l’on vous appelle au guichet",
    service: "Service",
    yourTicket: "Votre ticket",
    ticketsPrinted: "Les tickets sont imprimés automatiquement",
    getNewTicket: "Prendre un nouveau ticket",
    assistance: "Pour obtenir de l’aide, adressez-vous à notre personnel",
    back: "Retour",
    selectService: "Sélectionnez un service",
    loadingServices: "Chargement des services...",
    noServices: "Aucun service disponible",
    services: {
      Shipping: "Expéditions",
      Pickups: "Retraits",
      Payments: "Paiements",
      "Account Management": "Gestion des comptes",
      Deposits: "Dépôts",
      "Financial Services": "Services financiers",
      "Top-ups": "Recharges",
      "Identity Services": "Services d’identité",
    },
  },
  DE: {
    publicService: "Bürgerservice",
    emittedAt: "Ausgestellt um",
    ticketSuccess: "Ticket erfolgreich ausgestellt",
    waitToBeCalled: "Bitte warten Sie, bis Sie zum Schalter aufgerufen werden",
    service: "Service",
    yourTicket: "Ihr Ticket",
    ticketsPrinted: "Tickets werden automatisch gedruckt",
    getNewTicket: "Neues Ticket ziehen",
    assistance: "Bei Fragen wenden Sie sich bitte an unser Personal",
    back: "Zurück",
    selectService: "Service auswählen",
    loadingServices: "Services werden geladen...",
    noServices: "Kein Service verfügbar",
    services: {
      Shipping: "Versand",
      Pickups: "Abholungen",
      Payments: "Zahlungen",
      "Account Management": "Kontoverwaltung",
      Deposits: "Einzahlungen",
      "Financial Services": "Finanzdienstleistungen",
      "Top-ups": "Aufladungen",
      "Identity Services": "Identitätsdienste",
    },
  },
  ES: {
    publicService: "Servicio público",
    emittedAt: "Emitido a las",
    ticketSuccess: "Turno emitido correctamente",
    waitToBeCalled: "Espere a que le llamen al mostrador",
    service: "Servicio",
    yourTicket: "Su turno",
    ticketsPrinted: "Los turnos se imprimen automáticamente",
    getNewTicket: "Obtener otro turno",
    assistance: "Si necesita ayuda, consulte con nuestro personal",
    back: "Volver",
    selectService: "Seleccione un servicio",
    loadingServices: "Cargando servicios...",
    noServices: "No hay servicios disponibles",
    services: {
      Shipping: "Envíos",
      Pickups: "Recogidas",
      Payments: "Pagos",
      "Account Management": "Gestión de cuentas",
      Deposits: "Depósitos",
      "Financial Services": "Servicios financieros",
      "Top-ups": "Recargas",
      "Identity Services": "Servicios de identidad",
    },
  },
  PT: {
    publicService: "Serviço público",
    emittedAt: "Emitida às",
    ticketSuccess: "Senha emitida com sucesso",
    waitToBeCalled: "Aguarde até ser chamado ao balcão",
    service: "Serviço",
    yourTicket: "A sua senha",
    ticketsPrinted: "As senhas são impressas automaticamente",
    getNewTicket: "Tirar uma nova senha",
    assistance: "Para obter ajuda, fale com um membro da equipa",
    back: "Voltar",
    selectService: "Selecione um serviço",
    loadingServices: "A carregar serviços...",
    noServices: "Nenhum serviço disponível",
    services: {
      Shipping: "Envios",
      Pickups: "Levantamentos",
      Payments: "Pagamentos",
      "Account Management": "Gestão de contas",
      Deposits: "Depósitos",
      "Financial Services": "Serviços financeiros",
      "Top-ups": "Carregamentos",
      "Identity Services": "Serviços de identidade",
    },
  },
};

const locales = {
  EN: "en-GB",
  IT: "it-IT",
  FR: "fr-FR",
  DE: "de-DE",
  ES: "es-ES",
  PT: "pt-PT",
};

export function getSelectedLanguage() {
  const language = localStorage.getItem(LANGUAGE_STORAGE_KEY);
  return supportedLanguages.includes(language) ? language : "EN";
}

export function translate(key, language = getSelectedLanguage()) {
  return translations[language]?.[key] ?? translations.EN[key] ?? key;
}

export function translateServiceName(name, language = getSelectedLanguage()) {
  return translations[language]?.services?.[name] ?? name;
}

export function getLanguageLocale(language = getSelectedLanguage()) {
  return locales[language] ?? locales.EN;
}
