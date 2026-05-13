export default function StatisticsSection() {
  const stats = [
    {
      number: "5K+",
      label: "Active Members",
      icon: "👥"
    },
    {
      number: "200+",
      label: "Companies Hiring",
      icon: "💼"
    },
    {
      number: "50+",
      label: "Events Organized",
      icon: "📅"
    },
    {
      number: "99%",
      label: "Success Rate",
      icon: "⭐"
    }
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            Empowering Your Success
          </h2>
          <p className="text-xl text-slate-600">
            Join a thriving community dedicated to professional growth and networking
          </p>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {stats.map((stat, idx) => (
            <div key={idx} className="text-center p-8 rounded-xl border border-slate-200 hover:border-brand-300 hover:shadow-lg transition-all duration-300">
              <div className="text-5xl mb-4">{stat.icon}</div>
              <div className="text-4xl font-bold text-brand-600 mb-2">
                {stat.number}
              </div>
              <p className="text-slate-600">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
