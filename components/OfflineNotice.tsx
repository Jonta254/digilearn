"use client";
import { useEffect, useState } from "react";

export function OfflineNotice() {
  const [offline, setOffline] = useState(false);
  useEffect(() => {
    const update = () => setOffline(!navigator.onLine);
    update();
    window.addEventListener("online", update);
    window.addEventListener("offline", update);
    return () => { window.removeEventListener("online", update); window.removeEventListener("offline", update); };
  }, []);
  return offline ? <div className="offline-notice" role="status">You are offline. Already rendered content may remain visible, but DigiLearn does not currently cache courses for offline use.</div> : null;
}
