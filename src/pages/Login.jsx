// // src/pages/Login.jsx
// import React, { useEffect, useState } from "react";
// import { useNavigate, Link } from "react-router-dom";
// import { auth, db } from "../firebase-config";
// import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
// import { setDoc, doc } from "firebase/firestore";

// const diseaseList = [
//   "diabetes",
//   "hypertension",
//   "pcos",
//   "cardiac",
//   "kidney",
//   "none",
// ];

// export default function Login() {
//   const navigate = useNavigate();
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPass, setShowPass] = useState(false);
//   const [selectedDiseases, setSelectedDiseases] = useState([]);
//   const [loading, setLoading] = useState(false);

//   useEffect(() => {
//     // If already signed in, redirect to home
//     const unsub = onAuthStateChanged(auth, (u) => {
//       if (u) navigate("/");
//     });
//     return () => unsub();
//   }, [navigate]);

//   const toggleDisease = (d) => {
//     setSelectedDiseases((prev) =>
//       prev.includes(d) ? prev.filter((x) => x !== d) : [...prev, d]
//     );
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     const normalizedEmail = (email || "").trim().toLowerCase();
//     const pass = password || "";

//     if (!normalizedEmail) {
//       alert("Please enter your email.");
//       setLoading(false);
//       return;
//     }
//     if (!pass) {
//       alert("Please enter your password.");
//       setLoading(false);
//       return;
//     }

//     try {
//       const cred = await signInWithEmailAndPassword(auth, normalizedEmail, pass);
//       const u = cred.user;
//       if (u) {
//         const diseases = selectedDiseases.length ? selectedDiseases : ["none"];
//         // write diseases to users/{uid} (merge so we don't overwrite other fields)
//         try {
//           await setDoc(doc(db, "users", u.uid), { diseases }, { merge: true });
//         } catch (fireErr) {
//           console.error("Firestore write error:", fireErr);
//         }
//         try {
//           localStorage.setItem("user_diseases", JSON.stringify(diseases));
//         } catch (_) {}
//         navigate("/"); // redirect to home (or '/index' if you prefer)
//       } else {
//         alert("Login failed");
//       }
//     } catch (err) {
//       console.error("login error:", err);
//       alert(err?.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-50">
//       <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow">
//         <h1 className="text-2xl font-bold mb-4">Login</h1>

//         <form id="loginForm" className="space-y-4" onSubmit={handleSubmit}>
//           <div>
//             <label className="block text-sm">Email</label>
//             <input
//               id="email"
//               type="email"
//               required
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               className="w-full border rounded p-2"
//             />
//           </div>

//           <div>
//             <label className="block text-sm">Password</label>
//             <div className="flex gap-2">
//               <input
//                 id="password"
//                 type={showPass ? "text" : "password"}
//                 required
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 className="w-full border rounded p-2"
//               />
//               <button
//                 id="togglePass"
//                 type="button"
//                 onClick={() => setShowPass((s) => !s)}
//                 className="px-3 rounded bg-gray-100"
//               >
//                 {showPass ? "Hide" : "Show"}
//               </button>
//             </div>
//           </div>

//           {/* <div>
//             <div className="text-sm font-medium mb-2">
//               Select any disease/condition (helps tailor home page)
//             </div>
//             <div className="grid grid-cols-2 gap-2">
//               {diseaseList.map((d) => (
//                 <label key={d} className="inline-flex items-center gap-2">
//                   <input
//                     type="checkbox"
//                     name="disease"
//                     value={d}
//                     checked={selectedDiseases.includes(d)}
//                     onChange={() => toggleDisease(d)}
//                   />
//                   {d}
//                 </label>
//               ))}
//             </div>
//           </div> */}

//           <div className="flex items-center justify-between">
//             <button
//               id="loginBtn"
//               type="submit"
//               disabled={loading}
//               className="bg-indigo-600 text-white px-4 py-2 rounded disabled:opacity-60"
//             >
//               {loading ? "Signing in..." : "Sign in"}
//             </button>

//             <Link to="/register" className="text-sm text-indigo-600">
//               Register
//             </Link>
//           </div>
//         </form>
//       </div>
//     </div>
//   );
// }


// src/pages/Login.jsx
import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { auth, db } from "../firebase-config";
import { signInWithEmailAndPassword, onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

const defaultRedirect = "/dashboard"; // fallback when no disease selected

function getTargetPathFromDiseases(diseases) {
  if (!Array.isArray(diseases) || diseases.length === 0) return null;
  // pick first non-'none' disease
  const first = diseases.find((d) => d && d.toLowerCase() !== "none");
  return first ? `/${first.toLowerCase()}` : null;
}

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  // If user is already signed in, redirect them to their disease / dashboard
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (u) => {
      if (!u) return; // not signed in, show the login form

      // user is signed in -> fetch their diseases and redirect accordingly
      try {
        const snap = await getDoc(doc(db, "users", u.uid));
        let diseases = null;
        if (snap.exists()) {
          const data = snap.data();
          if (Array.isArray(data?.diseases)) diseases = data.diseases;
        }
        if (!Array.isArray(diseases)) {
          // fallback to localStorage if server has none
          const fallback = JSON.parse(localStorage.getItem("user_diseases") || "null");
          diseases = Array.isArray(fallback) ? fallback : [];
        } else {
          // also persist to localStorage for fast access next time
          try { localStorage.setItem("user_diseases", JSON.stringify(diseases)); } catch (_) {}
        }

        const target = getTargetPathFromDiseases(diseases) || defaultRedirect;
        navigate(target, { replace: true });
      } catch (e) {
        console.error("onAuthState error:", e);
        // fallback to dashboard if anything goes wrong
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

      // fetch the user's diseases from Firestore (do not rely on client checkboxes)
      let diseases = null;
      try {
        const snap = await getDoc(doc(db, "users", u.uid));
        if (snap.exists()) {
          const data = snap.data();
          if (Array.isArray(data?.diseases)) diseases = data.diseases;
        }
      } catch (fireFetchErr) {
        console.error("Failed to fetch user doc:", fireFetchErr);
      }

      // fallback to localStorage or ['none']
      if (!Array.isArray(diseases)) {
        const cached = JSON.parse(localStorage.getItem("user_diseases") || "null");
        diseases = Array.isArray(cached) ? cached : ["none"];
      } else {
        try { localStorage.setItem("user_diseases", JSON.stringify(diseases)); } catch (_) {}
      }

      // ensure we also persist the selection server-side (optional)
      try {
        // If Firestore has no diseases or you want to ensure it is stored, write it back (merge)
        await setDoc(doc(db, "users", u.uid), { diseases }, { merge: true });
      } catch (fireWriteErr) {
        console.warn("Could not merge diseases back to Firestore:", fireWriteErr);
      }

      // redirect to first disease page or dashboard
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
