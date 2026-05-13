import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import { selectTotalUnread } from "../redux/slices/notificationsSlice";

export default function Navbar() {
  const { user } = useSelector((s) => s.auth);
  const totalUnread = useSelector(selectTotalUnread);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  
  // State for mobile menu
  const [isOpen, setIsOpen] = useState(false);

  const navLinkStyles = "px-3 py-2 rounded-md text-sm font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50 transition-colors duration-200";
  const mobileNavLinkStyles = "block px-3 py-2 rounded-md text-base font-medium text-slate-600 hover:text-blue-600 hover:bg-slate-50";

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-slate-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="flex items-center gap-1">
              <span className="text-2xl font-extrabold tracking-tight text-blue-600">
                Alumni<span className="text-slate-900">Connect</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-1">
            <Link to="/messages" className={`${navLinkStyles} relative`}>
              Messages
              {totalUnread > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full shadow">
                  {totalUnread > 99 ? "99+" : totalUnread}
                </span>
              )}
            </Link>
            <Link to="/directory" className={navLinkStyles}>Directory</Link>
            <Link to="/" className={navLinkStyles}>Feed</Link>
          </nav>

          {/* User Profile & Actions (Desktop & Tablet) */}
          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-3">
              <Link 
                to={`/profile/${user?._id}`} 
                className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
              >
                {user?.photo ? (
                  <img src={user.photo} alt={user.name} className="w-8 h-8 rounded-full object-cover ring-2 ring-white" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
                <span className="hidden lg:block text-sm font-semibold text-slate-700">
                  {user?.name?.split(' ')[0]}
                </span>
              </Link>

              <button 
                onClick={handleLogout} 
                className="px-4 py-2 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-sm transition-all active:scale-95"
              >
                Logout
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-slate-600 hover:text-blue-600 hover:bg-slate-50 focus:outline-none"
              >
                <svg className="h-6 w-6" stroke="currentColor" fill="none" viewBox="0 0 24 24">
                  {isOpen ? (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  ) : (
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  )}
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Content */}
      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-100 animate-in slide-in-from-top duration-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link to="/messages" className={mobileNavLinkStyles} onClick={() => setIsOpen(false)}>
              Messages {totalUnread > 0 && `(${totalUnread})`}
            </Link>
            <Link to="/directory" className={mobileNavLinkStyles} onClick={() => setIsOpen(false)}>
              Directory
            </Link>
            <Link to="/" className={mobileNavLinkStyles} onClick={() => setIsOpen(false)}>
              Feed
            </Link>
            <hr className="my-2 border-slate-100" />
            <Link to={`/profile/${user?._id}`} className={mobileNavLinkStyles} onClick={() => setIsOpen(false)}>
              My Profile
            </Link>
            <button 
              onClick={() => { setIsOpen(false); handleLogout(); }}
              className="w-full text-left block px-3 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-md"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </header>
  );
}