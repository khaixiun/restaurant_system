export default function AboutPage() {
  return (
    <main className="bg-brand-dark min-h-screen">
      <div className="max-w-6xl mx-auto px-6 md:px-12">

        {/* Hero */}
        <div className="pt-32 pb-16 border-b border-white/10">
          <p className="font-sans text-brand-gold text-xs tracking-[0.2em] uppercase mb-4">
            Our Story
          </p>
          <h1 className="font-serif text-white text-5xl md:text-6xl">
            About Us
          </h1>
        </div>

        {/* Story */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 py-20 border-b border-white/10">
          <div>
            <p className="font-sans text-brand-gold text-xs tracking-[0.2em] uppercase mb-4">
              Who We Are
            </p>
            <h2 className="font-serif text-white text-3xl mb-6">
              A Passion for Honest Food
            </h2>
          </div>
          <div className="flex flex-col gap-4">
            <p className="font-sans text-white/50 text-sm leading-relaxed">
              Founded in 2018, Aurelius began as a small kitchen with a simple belief — that great food starts with great ingredients. We source directly from local farmers and trusted suppliers, ensuring every dish that leaves our kitchen is a reflection of the season.
            </p>
            <p className="font-sans text-white/50 text-sm leading-relaxed">
              Our team of chefs brings together decades of experience from kitchens across Europe and Asia, united by a shared commitment to craft, intention, and the pleasure of a well-made meal.
            </p>
          </div>
        </div>

        {/* Values */}
        <div className="py-20 border-b border-white/10">
          <p className="font-sans text-brand-gold text-xs tracking-[0.2em] uppercase mb-12">
            What We Stand For
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: "Sourced with Care", description: "Every ingredient is chosen with intention, working with suppliers who share our values of quality and sustainability." },
              { title: "Crafted with Skill", description: "Our chefs approach each dish as a creative act — balancing tradition with curiosity, technique with instinct." },
              { title: "Served with Warmth", description: "We believe dining is a deeply human experience. Our team is here to make every visit feel personal and unhurried." },
            ].map((value) => (
              <div key={value.title}>
                <div className="w-8 h-px bg-brand-gold mb-6" />
                <h3 className="font-serif text-white text-xl mb-3">{value.title}</h3>
                <p className="font-sans text-white/40 text-sm leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Location + Hours */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 py-20">
          <div>
            <p className="font-sans text-brand-gold text-xs tracking-[0.2em] uppercase mb-6">
              Find Us
            </p>
            <h3 className="font-serif text-white text-2xl mb-4">Location</h3>
            <p className="font-sans text-white/50 text-sm leading-relaxed">
              123 Jalan Aurelius<br />
              Seremban, Negeri Sembilan<br />
              Malaysia
            </p>
            <p className="font-sans text-white/50 text-sm mt-4">
              hello@aurelius.com
            </p>
          </div>

          <div>
            <p className="font-sans text-brand-gold text-xs tracking-[0.2em] uppercase mb-6">
              Hours
            </p>
            <div className="flex flex-col gap-3">
              {[
                { day: "Monday — Thursday", hours: "12:00 PM — 10:00 PM" },
                { day: "Friday — Saturday", hours: "12:00 PM — 11:00 PM" },
                { day: "Sunday", hours: "11:00 AM — 9:00 PM" },
              ].map((item) => (
                <div key={item.day} className="flex justify-between border-b border-white/5 pb-3">
                  <span className="font-sans text-white/50 text-sm">{item.day}</span>
                  <span className="font-sans text-white text-sm">{item.hours}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </main>
  );
}