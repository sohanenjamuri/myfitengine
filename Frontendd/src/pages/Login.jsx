
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "../firebase-config";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getUser, saveUserDiseases } from "../utils/api";

const defaultRedirect = "/dashboard";
function getTargetPathFromDiseases(diseases) {
  if (!Array.isArray(diseases) || diseases.length === 0) return null;

  const first = diseases.find((d) => d && d.toLowerCase() !== "none");
  return first ? `/${first.toLowerCase()}` : null;
}



// ... (imports remain the same, except removed unused ones if any)

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) return;


      try {
        // Try fetching from MongoDB first
        let diseases = null;
        const mongoUser = await getUser(u.uid);
        if (mongoUser && Array.isArray(mongoUser.diseases) && mongoUser.diseases.length > 0) {
          diseases = mongoUser.diseases;
        } else {
          // Fallback to Firestore if not in MongoDB
          const snap = await getDoc(doc(db, "users", u.uid));
          if (snap.exists()) {
            const data = snap.data();
            if (Array.isArray(data?.diseases)) {
              diseases = data.diseases;
              // Sync to MongoDB
              await saveUserDiseases(u.uid, diseases);
            }
          }
        }

        // Fallback to localStorage (only for reading legacy data, do not write back)
        if (!Array.isArray(diseases)) {
          const fallback = JSON.parse(localStorage.getItem("user_diseases") || "null");
          diseases = Array.isArray(fallback) ? fallback : [];
          if (diseases.length > 0) {
            // Sync legacy localStorage to MongoDB
            await saveUserDiseases(u.uid, diseases);
          }
        }

        const target = getTargetPathFromDiseases(diseases) || defaultRedirect;
        navigate(target, { replace: true });
      } catch (e) {
        console.error("onAuthState error:", e);

        navigate(defaultRedirect, { replace: true });
      }
    });

    return () => unsub();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const normalizedEmail = (email || "").trim().toLowerCase();
    const pass = password || "";

    if (!normalizedEmail) {
      alert("Please enter your email.");
      setLoading(false);
      return;
    }
    if (!pass) {
      alert("Please enter your password.");
      setLoading(false);
      return;
    }

    try {
      const cred = await signInWithEmailAndPassword(auth, normalizedEmail, pass);
      const u = cred.user;
      if (!u) throw new Error("No user returned from signIn");


      let diseases = null;

      // Try MongoDB
      const mongoUser = await getUser(u.uid);
      if (mongoUser && Array.isArray(mongoUser.diseases)) {
        diseases = mongoUser.diseases;
      }

      // Try Firestore
      if (!Array.isArray(diseases)) {
        try {
          const snap = await getDoc(doc(db, "users", u.uid));
          if (snap.exists()) {
            const data = snap.data();
            if (Array.isArray(data?.diseases)) diseases = data.diseases;
          }
        } catch (fireFetchErr) {
          console.error("Failed to fetch user doc:", fireFetchErr);
        }
      }

      // Try localStorage (Legacy)
      if (!Array.isArray(diseases)) {
        const cached = JSON.parse(localStorage.getItem("user_diseases") || "null");
        diseases = Array.isArray(cached) ? cached : ["none"];
      }

      // Sync to MongoDB if we found diseases somewhere else
      if (Array.isArray(diseases)) {
        await saveUserDiseases(u.uid, diseases);
      }


      try {

        await setDoc(doc(db, "users", u.uid), { diseases }, { merge: true });
      } catch (fireWriteErr) {
        console.warn("Could not merge diseases back to Firestore:", fireWriteErr);
      }


      const target = getTargetPathFromDiseases(diseases) || defaultRedirect;
      navigate(target, { replace: true });
    } catch (err) {
      console.error("login error:", err);
      alert(err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-bold mb-4">Login</h1>

        <form id="loginForm" className="space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm">Email</label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border rounded p-2"
            />
          </div>

          <div>
            <label className="block text-sm">Password</label>
            <div className="flex gap-2">
              <input
                id="password"
                type={showPass ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border rounded p-2"
              />
              <button
                id="togglePass"
                type="button"
                onClick={() => setShowPass((s) => !s)}
                className="px-3 rounded bg-gray-100"
              >
                {showPass ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              id="loginBtn"
              type="submit"
              disabled={loading}
              className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            <Link to="/register" className="text-sm text-indigo-600">
              Register
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
