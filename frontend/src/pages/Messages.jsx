import { useEffect, useRef, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import api from "../services/api";
import { connectSocket } from "../sockets/socket";
import { markDmRead, setActiveDmUserId } from "../redux/slices/notificationsSlice";

export default function Messages() {
  const { userId } = useParams();
  const { user } = useSelector((s) => s.auth);
  const dispatch = useDispatch();
  const [threads, setThreads] = useState([]);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [other, setOther] = useState(null);
  const socketRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    socketRef.current = connectSocket();
    api.get("/messages/inbox").then((r) => setThreads(r.data));
    if (!socketRef.current) return;
    socketRef.current.on("dm:receive", ({ from, message }) => {
      if (other && from === other._id) setMessages((m) => [...m, message]);
    });
    return () => socketRef.current?.off("dm:receive");
  }, [other]);

  useEffect(() => {
    if (!userId) return;
    api.get(`/users/${userId}`).then((r) => setOther(r.data));
    api.get(`/messages/direct/${userId}`).then((r) => setMessages(r.data));
  }, [userId]);

  useEffect(() => {
    if (!other?._id) return;
    dispatch(setActiveDmUserId(other._id));
    dispatch(markDmRead({ fromUserId: other._id }));
    return () => {
      dispatch(setActiveDmUserId(null));
    };
  }, [other?._id, dispatch]);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [messages]);

  const send = async (e) => {
    e.preventDefault();
    if (!text.trim() || !other) return;
    const { data } = await api.post("/messages/direct", { recipient: other._id, text });
    setMessages((m) => [...m, data]); setText("");
    socketRef.current?.emit("dm:send", { to: other._id, message: data });
  };

  return (
    <div className="card overflow-hidden grid grid-cols-12 h-[70vh]">
      <div className="col-span-4 border-r overflow-y-auto">
        <div className="p-3 font-semibold border-b">Conversations</div>
        {threads.length === 0 && <div className="p-4 text-sm text-slate-500">No conversations yet. Open someone's profile to message them.</div>}
        {threads.map((t) => (
          <Link key={t.user._id} to={`/messages/${t.user._id}`}
            className={`block p-3 border-b hover:bg-slate-50 ${userId === t.user._id ? "bg-brand-50" : ""}`}>
            <div className="font-medium">{t.user.name}</div>
            <div className="text-xs text-slate-500 truncate">{t.lastMessage.text}</div>
          </Link>
        ))}
      </div>
      <div className="col-span-8 flex flex-col">
        {!other ? (
          <div className="flex-1 flex items-center justify-center text-slate-500">Select a conversation</div>
        ) : (
          <>
            <div className="p-3 border-b font-semibold">{other.name}</div>
            <div className="flex-1 overflow-y-auto p-4 space-y-2 bg-slate-50">
              {messages.map((m) => {
                const mine = (m.sender?._id || m.sender) === user._id;
                return (
                  <div key={m._id} className={`flex ${mine ? "justify-end" : "justify-start"}`}>
                    <div className={`px-3 py-2 rounded-2xl max-w-[70%] ${mine ? "bg-brand-500 text-white" : "bg-white border"}`}>{m.text}</div>
                  </div>
                );
              })}
              <div ref={endRef} />
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
