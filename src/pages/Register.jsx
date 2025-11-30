import React, { useState } from "react";
import { auth, db } from "../firebase-config";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
} from "firebase/auth";
import { setDoc, doc } from "firebase/firestore";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [show, setShow] = useState(false);
  const [diseases, setDiseases] = useState([]);
  const [loading, setLoading] = useState(false);

  const diseaseList = [
    "diabetes",
    "hypertension",
    "pcos",
    "cardiac",
    "kidney",
    "none",
  ];

  const toggleDisease = (val) => {
    setDiseases((prev) =>
      prev.includes(val)
        ? prev.filter((d) => d !== val)
        : [...prev, val]
    );
  };

  async function handleRegister(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const cred = await createUserWithEmailAndPassword(auth, email, pass);
      const user = cred.user;

      if (name.trim()) {
        await updateProfile(user, { displayName: name });
      }

      const profile = {
        name,
        email: user.email,
        createdAt: Date.now(),
        diseases: diseases.length ? diseases : ["none"],
      };

      await setDoc(doc(db, "users", user.uid), profile);

      
      await signOut(auth);

      window.location.replace("/login");
    } catch (err) {
      alert(err.message);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="w-full max-w-md bg-white p-6 rounded-2xl shadow">
        <h1 className="text-2xl font-bold mb-4">Create account</h1>

        <form className="space-y-4" onSubmit={handleRegister}>
          <div>
            <label className="block text-sm">Name</label>
            <input
              className="w-full border rounded p-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              type="text"
            />
          </div>

          <div>
            <label className="block text-sm">Email</label>
            <input
              required
              className="w-full border rounded p-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              type="email"
            />
          </div>

          <div>
            <label className="block text-sm">Password</label>
            <div className="flex gap-2">
              <input
                required
                className="w-full border rounded p-2"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
                type={show ? "text" : "password"}
              />
              <button
                type="button"
                onClick={() => setShow(!show)}
                className="px-3 rounded bg-gray-100"
              >
                {show ? "Hide" : "Show"}
              </button>
            </div>
          </div>

          <div>
            <div className="text-sm font-medium mb-2">
              Select any disease (optional)
            </div>

            <div className="grid grid-cols-2 gap-2">
              {diseaseList.map((d, i) => (
                <label key={i} className="inline-flex gap-2 items-center">
                  <input
                    type="checkbox"
                    checked={diseases.includes(d)}
                    onChange={() => toggleDisease(d)}
                  />
                  {d}
                </label>
              ))}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              disabled={loading}
              className="bg-emerald-600 text-white px-4 py-2 rounded disabled:opacity-60"
            >
              {loading ? "Creating..." : "Create account"}
            </button>

            <a href="/login" className="text-sm text-indigo-600">
              Sign in
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}
