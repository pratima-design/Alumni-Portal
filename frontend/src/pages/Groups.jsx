import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import api from "../services/api";
import { connectSocket } from "../sockets/socket";
import { markGroupRead, setActiveGroupId } from "../redux/slices/notificationsSlice";

function AddMemberSearch({ groupId, onAdded }) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (query.trim().length < 2) { setResults([]); return; }
    const t = setTimeout(async () => {
      setLoading(true);
      try {
        const { data } = await api.get(`/users/search?q=${encodeURIComponent(query)}`);
        setResults(data);
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(t);
  }, [query]);

  const add = async (userId, name) => {
    try {
      await api.post(`/groups/${groupId}/members`, { userId });
      toast.success(`${name} added to group`);
      setQuery(""); setResults([]);
      onAdded();
    } catch (e) {
      toast.error(e.response?.data?.message || "Failed to add member");
    }
  };

  return (
    <div className="p-3 border-b relative">
      <p className="text-xs font-semibold text-slate-500 mb-1">Add member by name or roll no.</p>
      <input
        className="input text-sm"
        placeholder="Search name or roll no…"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      {(results.length > 0 || loading) && (
        <div className="absolute left-3 right-3 bg-white border rounded shadow-lg z-10 mt-1 max-h-48 overflow-y-auto">
          {loading && <div className="p-2 text-xs text-slate-400">Searching…</div>}
          {results.map((u) => (
            <button
              key={u._id}
              onClick={() => add(u._id, u.name)}
              className="w-full text-left px-3 py-2 hover:bg-slate-50 text-sm flex items-center gap-2"
            >
              <div className="w-7 h-7 rounded-full bg-brand-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                {u.name[0]}
              </div>
              <div>
                <p className="font-medium">{u.name}</p>
                <p className="text-xs text-slate-400">{u.role}{u.rollNo ? ` · ${u.rollNo}` : ""}</p>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Groups() {
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const [groups, setGroups] = useState([]);
  const [active, setActive] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [creating, setCreating] = useState(false);
  const [name, setName] = useState("");
  const socketRef = useRef(null);

  const canCreate    = user?.role === "admin" || user?.role === "alumni";
  const canAddMember = ["admin", "faculty", "alumni"].includes(user?.role);

  const loadGroups = () => api.get("/groups/me").then((r) => setGroups(r.data));
  useEffect(() => { loadGroups(); socketRef.current = connectSocket(); }, []);

  useEffect(() => {
    if (!active || !socketRef.current) return;
    api.get(`/messages/group/${active._id}`).then((r) => setMessages(r.data));
    socketRef.current.emit("group:join", active._id);
    const handler = ({ groupId, message }) => {
      if (groupId === active._id) setMessages((m) => [...m, message]);
    };
    socketRef.current.on("group:receive", handler);
    return () => {
      socketRef.current?.emit("group:leave", active._id);
      socketRef.current?.off("group:receive", handler);
    };
  }, [active]);

  useEffect(() => {
    if (!active?._id) return;
    dispatch(setActiveGroupId(active._id));
    dispatch(markGroupRead({ groupId: active._id }));
    return () => dispatch(setActiveGroupId(null));
  }, [active?._id, dispatch]);

  const refreshActive = () => {
    loadGroups();
    if (active) api.get(`/groups/${active._id}`).then((r) => setActive(r.data));
  };

  const create = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    await api.post("/groups", { name });
    toast.success("Group created"); setName(""); setCreating(false); loadGroups();
  };

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim() || !active) return;
    const { data } = await api.post("/messages/group", { groupId: active._id, text });
    setMessages((m) => [...m, data]); setText("");
    socketRef.current?.emit("group:send", { groupId: active._id, message: data });
  };

  return (
    <div className="card overflow-hidden grid grid-cols-12 h-[70vh]">
      <div className="col-span-4 border-r overflow-y-auto">
        <div className="p-3 border-b flex justify-between items-center">
          <span className="font-semibold">Groups</span>
          {canCreate && <button className="btn-ghost text-sm" onClick={() => setCreating(!creating)}>+ New</button>}
        </div>
        {creating && (
          <form onSubmit={create} className="p-3 border-b">
            <input className="input mb-2" placeholder="Group name" value={name} onChange={(e) => setName(e.target.value)} />
            <button className="btn-primary w-full">Create</button>
          </form>
        )}
        {groups.length === 0 && <div className="p-4 text-sm text-slate-500">No groups yet.</div>}
        {groups.map((g) => (
          <button key={g._id} onClick={() => setActive(g)} className={`block w-full text-left p-3 border-b hover:bg-slate-50 ${active?._id === g._id ? "bg-brand-50" : ""}`}>
            <div className="font-medium">{g.name}</div>
            <div className="text-xs text-slate-500">{g.members.length} members</div>
          </button>
        ))}
      </div>
      <div className="col-span-8 flex flex-col">
        {!active ? (
          <div className="flex-1 flex items-center justify-center text-slate-500">Select a group</div>
        ) : (
          <>
            <div className="p-3 border-b font-semibold">{active.name}</div>

            {/* Add member search — only for admin / faculty / alumni */}
            {canAddMember && (
              <AddMemberSearch groupId={active._id} onAdded={refreshActive} />
            )}

            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50">
              {messages.map((m) => {
                const mine = (m.sender?._id || m.sender) === user._id;
                return (
                  <div key={m._id} className={`flex ${mine ? "justify-end" : "justify-start"} flex-col ${mine ? "items-end" : "items-start"}`}>
                    {!mine && <div className="text-xs text-slate-500 mb-1">{m.sender?.name}</div>}
                    <div className={`px-3 py-2 rounded-2xl max-w-[70%] ${mine ? "bg-brand-500 text-white" : "bg-white border"}`}>{m.text}</div>
                  </div>
                );
              })}
            </div>
            <form onSubmit={send} className="p-3 border-t flex gap-2">
              <input className="input" value={text} onChange={(e) => setText(e.target.value)} placeholder="Type a message..." />
              <button className="btn-primary">Send</button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
