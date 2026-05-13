import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../services/api";

export default function AdminPanel() {
  const { user } = useSelector((s) => s.auth);
  const [users, setUsers] = useState([]);
  const [facultyForm, setFacultyForm] = useState({
    name: "", email: "", phone: "", password: "", role: "student", program: "", batchYear: "",
  });
  const load = () => api.get("/users").then((r) => setUsers(r.data));
  useEffect(() => { load(); }, []);

  const setRole = async (id, role) => {
    await api.put(`/users/${id}/role`, { role });
    toast.success("Role updated"); load();
  };
  const approve = async (id) => {
    await api.put(`/users/${id}/approve`);
    toast.success("User approved");
    load();
  };
  const del = async (id) => {
    if (!confirm("Delete user?")) return;
    if (user?.role === "faculty") await api.delete(`/users/faculty/users/${id}`);
    else await api.delete(`/users/${id}`);
    toast.success("User deleted"); load();
  };
  const createByFaculty = async (e) => {
    e.preventDefault();
    await api.post("/users/faculty/users", facultyForm);
    toast.success("User added successfully");
    setFacultyForm({ name: "", email: "", phone: "", password: "", role: "student", program: "", batchYear: "" });
    load();
  };

  return (
    <div className="card overflow-hidden">
      <h1 className="p-4 font-bold border-b">{user?.role === "faculty" ? "Faculty Management" : "Admin Panel"} - Users</h1>
      {user?.role === "faculty" && (
        <form onSubmit={createByFaculty} className="p-4 border-b grid grid-cols-2 gap-2">
          <input className="input" placeholder="Name" required value={facultyForm.name} onChange={(e) => setFacultyForm({ ...facultyForm, name: e.target.value })} />
          <input className="input" placeholder="Email" required value={facultyForm.email} onChange={(e) => setFacultyForm({ ...facultyForm, email: e.target.value })} />
          <input className="input" placeholder="Phone" required value={facultyForm.phone} onChange={(e) => setFacultyForm({ ...facultyForm, phone: e.target.value })} />
          <input className="input" type="password" placeholder="Password" required value={facultyForm.password} onChange={(e) => setFacultyForm({ ...facultyForm, password: e.target.value })} />
          <input className="input" placeholder="Program" required value={facultyForm.program} onChange={(e) => setFacultyForm({ ...facultyForm, program: e.target.value })} />
          <input className="input" type="date" required value={facultyForm.batchYear ? `${facultyForm.batchYear}-01-01` : ""} onChange={(e) => setFacultyForm({ ...facultyForm, batchYear: e.target.value ? new Date(e.target.value).getFullYear().toString() : "" })} />
          <select className="input" value={facultyForm.role} onChange={(e) => setFacultyForm({ ...facultyForm, role: e.target.value })}>
            <option value="student">Student</option>
            <option value="alumni">Alumni</option>
          </select>
          <button className="btn-primary">Add Department User</button>
        </form>
      )}
      <table className="w-full text-sm">
        <thead className="bg-slate-50">
          <tr>
            <th className="text-left p-3">Name</th><th className="text-left p-3">Email</th>
            <th className="text-left p-3">Role</th><th className="text-left p-3">Status</th><th className="p-3"></th>
          </tr>
        </thead>
        <tbody>
          {users.filter((u) => u.role !== "admin").map((u) => (
            <tr key={u._id} className="border-t">
              <td className="p-3">{u.name}</td>
              <td className="p-3">{u.email}</td>
              <td className="p-3">
                {user?.role === "admin" ? (
                  <select className="input" value={u.role} onChange={(e) => setRole(u._id, e.target.value)}>
                    <option value="student">Student</option>
                    <option value="alumni">Alumni</option>
                    <option value="faculty">Faculty</option>
                    <option value="admin">Admin</option>
                  </select>
                ) : (
                  <span className="capitalize">{u.role}</span>
                )}
              </td>
              <td className="p-3">{u.isApproved ? "Approved" : "Pending"}</td>
              <td className="p-3 text-right">
                {!u.isApproved && <button onClick={() => approve(u._id)} className="text-green-600 hover:underline mr-3">Approve</button>}
                {!(user?.role === "faculty" && u._id === user?._id) && (
                  <button onClick={() => del(u._id)} className="text-red-500 hover:underline">Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
