export default function ServicesSection() {
  const services = [
    {
      title: "Networking Hub",
      description: "Connect with fellow alumni, students, and professionals in your industry",
      icon: "🤝",
      features: ["Direct Messaging", "Community Groups", "Alumni Directory"]
    },
    {
      title: "Job Board",
      description: "Discover internship and job opportunities from top companies",
      icon: "💼",
      features: ["Curated Listings", "Company Profiles", "Career Guidance"]
    },
    {
      title: "Events & Webinars",
      description: "Participate in workshops, seminars, and networking events",
      icon: "📚",
      features: ["Live Sessions", "Recorded Access", "Certificates"]
    },
    {
      title: "Mentorship",
      description: "Get guidance from experienced professionals in your field",
      icon: "🎯",
      features: ["1-on-1 Sessions", "Career Path Planning", "Skill Development"]
    }
  ];

  return (
    <section id="services" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-slate-900 mb-4">
            What We Offer
          </h2>
          <p className="text-xl text-slate-600">
            Comprehensive tools to support your professional journey
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, idx) => (
            <div
              key={idx}
              className="bg-white p-8 rounded-xl border border-slate-200 hover:shadow-xl hover:border-brand-300 transition-all duration-300"
            >
              <div className="text-5xl mb-4">{service.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">
                {service.title}
              </h3>
              <p className="text-slate-600 mb-6">
                {service.description}
              </p>
              <ul className="space-y-2">
                {service.features.map((feature, i) => (
                  <li key={i} className="text-sm text-slate-600 flex items-center gap-2">
                    <span className="text-brand-500">✓</span>
                    {feature}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
