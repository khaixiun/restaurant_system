export default function ProjectReadmePage() {
  return (
    <main className="bg-brand-dark min-h-screen">
      <div className="max-w-6xl mx-auto px-6 md:px-12">

        <div className="pt-32 pb-16 border-b border-white/10">
          <p className="font-sans text-brand-gold text-xs tracking-[0.2em] uppercase mb-4">
            Portfolio Showcase
          </p>
          <h1 className="font-serif text-white text-5xl md:text-6xl">
            Project Readme
          </h1>
        </div>

        <div className="my-12 bg-white/5 border border-brand-gold/30 rounded-lg p-6 md:p-8">
          <p className="font-sans text-brand-gold text-xs tracking-[0.2em] uppercase mb-4">
            Demo Access
          </p>
          <h2 className="font-serif text-white text-2xl mb-4">
            Test the Admin Dashboard & CRUD Operations
          </h2>
          <p className="font-sans text-white/70 text-sm mb-6 max-w-2xl leading-relaxed">
            To view the full operational flow, manage menu categories, and process incoming food orders, access the secure back-office dashboard using the credentials below:
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            <div className="bg-white/5 px-4 py-3 rounded border border-white/10">
              <span className="block text-xs text-white/40 font-sans uppercase">Admin Route</span>
              <a 
                href="/login" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-brand-gold text-sm underline hover:text-white transition-colors"
              >
                /login (Opens in new tab)
              </a>
            </div>
            <div className="bg-white/5 px-4 py-3 rounded border border-white/10">
              <span className="block text-xs text-white/40 font-sans uppercase">Email Address</span>
              <span className="text-white text-sm font-mono selection:bg-brand-gold/30">admin@gmail.com</span>
            </div>
            <div className="bg-white/5 px-4 py-3 rounded border border-white/10">
              <span className="block text-xs text-white/40 font-sans uppercase">Password</span>
              <span className="text-white text-sm font-mono selection:bg-brand-gold/30">12345678</span>
            </div>
          </div>
        </div>

        <div className="py-12 border-t border-white/10">
          <p className="font-sans text-brand-gold text-xs tracking-[0.2em] uppercase mb-4">
            Project Status & Development Roadmap
          </p>
          <h2 className="font-serif text-white text-2xl mb-4">
            What's Next
          </h2>
          <p className="font-sans text-white/70 text-sm max-w-2xl leading-relaxed">
            This project is under active development. I will continue to update, optimize, and build out features to polish the overall architecture. 
          </p>
          <p className="font-sans text-white/70 text-sm max-w-2xl leading-relaxed mt-4">
            The next major milestone is implementing the **Reservation Module**. Building a robust, conflict-free booking system takes some time to properly map out and execute, and it will be integrated into the architecture shortly.
          </p>
        </div>

      </div>
    </main>
  );
}