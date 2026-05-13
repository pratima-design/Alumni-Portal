import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../services/api";

export default function Directory() {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    search: "", role: "", batchYear: "", department: "", location: "", designation: "",
  });

  const load = async () => {
    const params = new URLSearchParams(Object.entries(filters).filter(([, v]) => v));
    const { data } = await api.get(`/users?${params}`);
    setUsers(data);
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, []);

  const set = (k) => (e) => setFilters({ ...filters, [k]: e.target.value });

  return (
    <div>
      <div className="card p-4 mb-4 grid grid-cols-2 md:grid-cols-4 gap-2">
        <input className="input" placeholder="Search name / email" value={filters.search} onChange={set("search")} />
        <select className="input" value={filters.role} onChange={set("role")}>
          <option value="">All roles</option>
          <option value="faculty">Faculty</option>
          <option value="alumni">Alumni</option>
          <option value="student">Student</option>
        </select>
        <input className="input" type="date" placeholder="Batch year" value={filters.batchYear ? `${filters.batchYear}-01-01` : ""} onChange={(e) => setFilters({ ...filters, batchYear: e.target.value ? new Date(e.target.value).getFullYear().toString() : "" })} />
        <input className="input" placeholder="Location" value={filters.location} onChange={set("location")} />
        <input className="input [ytinput" placeholder="Designation" value={filters.designation} onChange={set("designation")} />
        <input className="input" placeholder="Department" value={filters.department} onChange={set("department")} />

        <button className="btn-primary col-span-2 md:col-span-4 md:w-32" onClick={load}>Search</button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {users.map((u) => (
          <Link to={`/profile/${u._id}`} key={u._id} className="card p-4 flex items-center gap-3 hover:shadow-md">
            {u.photo ? <img src={u.photo} className="w-14 h-14 rounded-full" alt="" /> :
              <div className="w-14 h-14 rounded-full bg-brand-500 text-white flex items-center justify-center text-xl font-bold">{u.name[0]}</div>}
            <div>
              <div className="font-semibold">{u.name}</div>
              <div className="text-sm text-slate-500">{u.designation || u.role} {u.batchYear && `• ${u.batchYear}`}</div>
              <div className="text-xs text-slate-400">{u.department}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

 