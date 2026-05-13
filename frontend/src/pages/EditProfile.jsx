import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../services/api";
import { updateUser } from "../redux/slices/authSlice";

export default function EditProfile() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: user?.name || "", phone: user?.phone || "", photo: user?.photo || "",
    designation: user?.designation || "", batchYear: user?.batchYear || "", program: user?.program || "",
    gender: user?.gender || "prefer_not_to_say",
    department: user?.department || "", about: user?.about || "",
    address: user?.address || "", location: user?.location || "",
    socialLinks: user?.socialLinks || [],
  });

  const upload = async (file) => {
    const fd = new FormData(); fd.append("file", file);
    const { data } = await api.post("/upload?type=profile", fd, { headers: { "Content-Type": "multipart/form-data" } });
    const saved = await api.put("/users/me/photo", { photo: data.url });
    setForm({ ...form, photo: saved.data.photo || data.url });
    dispatch(updateUser(saved.data));
  };

  const submit = async (e) => {
    e.preventDefault();
    const { data } = await api.put("/users/me", form);
    dispatch(updateUser(data));
    toast.success("Profile updated");
  };

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const isAdmin   = user?.role === "admin";
  const isFaculty = user?.role === "faculty";
  const isStudentOrAlumni = user?.role === "student" || user?.role === "alumni";

  return (
    <form onSubmit={submit} className="card p-6 space-y-4">
      <h1 className="text-xl font-bold">Edit Profile</h1>
      <div className="flex items-center gap-4">
        {form.photo ? <img src={form.photo} className="w-20 h-20 rounded-full" alt="" /> :
          <div className="w-20 h-20 rounded-full bg-brand-500 text-white flex items-center justify-center text-2xl font-bold">{form.name[0]}</div>}
        <label className="btn-ghost cursor-pointer">
          Upload photo
          <input type="file" hidden accept="image/*" onChange={(e) => e.target.files[0] && upload(e.target.files[0])} />
        </label>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <input className="input" placeholder="Name" value={form.name} onChange={set("name")} />
        <input className="input" placeholder="Phone" value={form.phone} onChange={set("phone")} />
        <input className="input" placeholder="Designation" value={form.designation} onChange={set("designation")} />

        {/* Department — hidden for admin */}
        {!isAdmin && (
          <input className="input" placeholder="Department" value={form.department} onChange={set("department")} />
        )}

        {/* Batch year & Program — only for students and alumni */}
        {isStudentOrAlumni && (
          <>
            <input
              className="input" type="date" placeholder="Batch year"
              value={form.batchYear ? `${form.batchYear}-01-01` : ""}
              onChange={(e) => setForm({ ...form, batchYear: e.target.value ? new Date(e.target.value).getFullYear().toString() : "" })}
            />
            <input className="input" placeholder="Program" value={form.program} onChange={set("program")} />
          </>
        )}

        <input className="input" placeholder="Location" value={form.location} onChange={set("location")} />
        <select className="input" value={form.gender} onChange={set("gender")}>
          <option value="prefer_not_to_say">Prefer not to say</option>
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="other">Other</option>
        </select>
      </div>
      <input className="input" placeholder="Address" value={form.address} onChange={set("address")} />
      <textarea className="input min-h-[100px]" placeholder="About you" value={form.about} onChange={set("about")} />
      <div>
        <div className="font-semibold mb-2">Social links</div>
        {form.socialLinks.map((l, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input className="input" placeholder="Platform (e.g. LinkedIn)" value={l.platform}
              onChange={(e) => { const a = [...form.socialLinks]; a[i].platform = e.target.value; setForm({ ...form, socialLinks: a }); }} />
            <input className="input" placeholder="URL" value={l.url}
              onChange={(e) => { const a = [...form.socialLinks]; a[i].url = e.target.value; setForm({ ...form, socialLinks: a }); }} />
            <button type="button" className="btn-ghost" onClick={() => setForm({ ...form, socialLinks: form.socialLinks.filter((_, j) => j !== i) })}>×</button>
          </div>
        ))}
        <button type="button" className="btn-ghost" onClick={() => setForm({ ...form, socialLinks: [...form.socialLinks, { platform: "", url: "" }] })}>+ Add link</button>
      </div>
      <button className="btn-primary">Save changes</button>
    </form>
  );
}
