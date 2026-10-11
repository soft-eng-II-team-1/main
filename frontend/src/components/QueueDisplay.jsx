export default function QueueDisplay() {
  const currentCall = { number: "A-204", counter: "04", service: "Shipping" };
  
  const recentCalls = [
    { number: "A-203", counter: "02", service: "Pickups" },
    { number: "P-087", counter: "01", service: "Payments" },
    { number: "T-112", counter: "05", service: "Top-ups" },
  ];

  return (
    <div className="min-h-screen bg-[#fafafa] flex flex-col p-8 font-sans text-[#1c2b39]">
      {/* Header */}
      <header className="flex justify-between items-end border-b border-gray-300 pb-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-orange-400 rounded-md" style={{ clipPath: 'polygon(0 0, 100% 50%, 0 100%)' }}></div>
          <div className="leading-tight">
            <h1 className="text-3xl font-bold">Post Office</h1>
            <p className="text-sm text-gray-500 uppercase tracking-widest">Public Service</p>
          </div>
        </div>
        <div className="text-right flex items-baseline gap-4">
          <span className="text-xl text-gray-600">9 October 2026</span>
          <span className="text-4xl font-bold">17:25</span>
        </div>
      </header>

      <main className="flex-grow flex gap-8">
        {/* Left Column: Current Call */}
        <section className="flex-[2] flex flex-col">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Current Call</h2>
          <div className="flex-grow bg-white border border-gray-200 rounded-3xl p-12 flex flex-col justify-between text-center shadow-sm">
            <div className="mt-12">
              <p className="text-2xl font-bold text-gray-500 uppercase tracking-widest mb-4">Last Called</p>
              <h1 className="text-[140px] leading-none font-black text-[#108a5e] tracking-tight">{currentCall.number}</h1>
              <div className="flex items-center justify-center gap-6 mt-8">
                <svg className="w-16 h-16 text-[#1c2b39]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                <h2 className="text-7xl font-black text-[#1c2b39]">Counter {currentCall.counter}</h2>
              </div>
            </div>
            <p className="text-3xl text-gray-400 font-medium mb-8">{currentCall.service}</p>
          </div>
        </section>

        {/* Right Column: Recent Calls */}
        <section className="flex-1 flex flex-col">
          <h2 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4 opacity-0 hidden md:block">Recent Calls</h2>
          <div className="flex-grow bg-[#eef0f2] rounded-3xl p-8">
            <h3 className="text-sm font-bold text-gray-700 uppercase tracking-widest mb-6">Recent Calls</h3>
            <ul className="space-y-6">
              {recentCalls.map((call, index) => (
                <li key={index} className="flex justify-between items-center border-b border-gray-300 pb-6 last:border-0">
                  <span className="text-5xl font-black">{call.number}</span>
                  <div className="text-right">
                    <p className="text-xl text-[#5b6b7c]">Counter {call.counter}</p>
                    <p className="text-sm text-gray-600">{call.service}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </div>
  );
}