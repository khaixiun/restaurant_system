export default function ProjectReadmePage() {
  const completed = [
    { title: "Authentication", desc: "JWT-based login with role-based authorization (admin / guest)" },
    { title: "Menu Management", desc: "Category and food CRUD with Cloudinary image upload" },
    { title: "Reservation System", desc: "Public table selection, availability checking, and double-booking prevention via composite unique index" },
    { title: "AI Chatbot", desc: "Floating chat widget powered by Gemini API — answers menu, table, and availability questions in natural language" },
    { title: "CI/CD Pipeline", desc: "GitHub Actions with automatic deploy to Render (backend) and Vercel (frontend)" },
  ];

  const roadmap = [
    { title: "Ordering System", desc: "Allow customers to place food orders directly from the menu" },
    { title: "Payment Gateway", desc: "Integrate a local payment provider (ToyyibPay or Billplz) for order checkout" },
    { title: "Admin Dashboard", desc: "Sales analytics, most ordered items, revenue charts filterable by date range" },
  ];

  return (
    <main className="bg-brand-dark min-h-screen">
      <div className="max-w-3xl mx-auto px-6 md:px-12 py-32">

        <p className="font-sans text-brand-gold text-xs tracking-[0.2em] uppercase mb-4">
          Portfolio Project
        </p>
        <h1 className="font-serif text-white text-5xl md:text-6xl mb-6">
          FoodPro
        </h1>
        <p className="font-sans text-white/60 text-sm leading-relaxed max-w-xl">
          A full-stack restaurant management system built with .NET 10, Next.js 15, and PostgreSQL. Deployed via Docker on Render and Vercel.
        </p>

        <div className="mt-12 bg-white/5 border border-brand-gold/30 rounded-lg p-6">
          <p className="font-sans text-brand-gold text-xs tracking-[0.2em] uppercase mb-4">
            Demo Access
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="block text-xs text-white/40 font-sans uppercase mb-1">Route</span>
              <a href="/login" target="_blank" rel="noopener noreferrer" className="text-brand-gold text-sm underline hover:text-white transition-colors">
                /login
              </a>
            </div>
            <div>
              <span className="block text-xs text-white/40 font-sans uppercase mb-1">Email</span>
              <span className="text-white text-sm font-mono">admin@gmail.com</span>
            </div>
            <div>
              <span className="block text-xs text-white/40 font-sans uppercase mb-1">Password</span>
              <span className="text-white text-sm font-mono">12345678</span>
            </div>
          </div>
        </div>

        {/* Completed */}
        <div className="mt-12">
          <p className="font-sans text-brand-gold text-xs tracking-[0.2em] uppercase mb-6">
            Completed
          </p>
          <div className="flex flex-col gap-4">
            {completed.map((item) => (
              <div key={item.title} className="border-l-2 border-brand-gold/40 pl-4">
                <p className="font-sans text-white text-sm font-medium mb-1">{item.title}</p>
                <p className="font-sans text-white/50 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Roadmap */}
        <div className="mt-12">
          <p className="font-sans text-brand-gold text-xs tracking-[0.2em] uppercase mb-6">
            Roadmap
          </p>
          <div className="flex flex-col gap-4">
            {roadmap.map((item) => (
              <div key={item.title} className="border-l-2 border-white/15 pl-4">
                <p className="font-sans text-white/60 text-sm font-medium mb-1">{item.title}</p>
                <p className="font-sans text-white/35 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </main>
  );
}