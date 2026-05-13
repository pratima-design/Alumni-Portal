import { Link } from "react-router-dom";

export default function HeroSection() {
  return (
    <section className="relative min-h-[600px] bg-gradient-to-br from-slate-50 to-blue-50 flex items-center overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-brand-100/30 rounded-full blur-3xl -z-10"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-100/30 rounded-full blur-3xl -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <div className="inline-block bg-brand-100 text-brand-700 px-4 py-2 rounded-full text-sm font-semibold">
              ✨ Build Your Network
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-slate-900 leading-tight">
              Connect with Your Alumni Community
            </h1>
            <p className="text-xl text-slate-600 leading-relaxed">
              Join thousands of students, alumni, and faculty members. Share experiences, find mentors, and create lasting professional relationships.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link to="/register/user" className="btn-primary text-center">
                Join Now
              </Link>
              <button className="btn-secondary text-center">
                Learn More
              </button>
            </div>
          </div>

          {/* Right Visual */}
          <div className="relative hidden md:block">
            <div className="w-full h-80 bg-gradient-to-br from-brand-200 to-blue-200 rounded-2xl shadow-2xl flex items-center justify-center overflow-hidden">
              <div className="text-center space-y-2">
                <div className="text-6xl">👥</div>
                <p className="text-slate-700 font-semibold">Growing Community</p>
                <p className="text-slate-500 text-sm">5000+ Active Members</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
