const API_BASE_URL = 'http://localhost:4000/api/users';

export async function getUser(uid) {
    try {
        const res = await fetch(`${API_BASE_URL}/${uid}`);
        if (!res.ok) {
            if (res.status === 404) return null;
            throw new Error('Failed to fetch user');
        }
        return await res.json();
    } catch (error) {
        console.error("API Error:", error);
        return null;
    }
}

export async function saveUser(uid, data) {
    const res = await fetch(`${API_BASE_URL}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ uid, ...data }),
    });
    if (!res.ok) throw new Error('Failed to save user');
    return res.json();
}

export async function saveUserDiseases(uid, diseases) {
    const res = await fetch(`${API_BASE_URL}/${uid}/diseases`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ diseases }),
    });
    if (!res.ok) throw new Error('Failed to save diseases');
    return res.json();
}

export async function saveDiseaseProfile(uid, disease, profileData) {
    const res = await fetch(`${API_BASE_URL}/${uid}/disease-profile/${disease}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profileData),
    });
    if (!res.ok) throw new Error('Failed to save disease profile');
    return res.json();
}

export async function savePlan(uid, disease, planData, isLastPlan = false) {
    const res = await fetch(`${API_BASE_URL}/${uid}/plans`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ disease, planData, isLastPlan }),
    });
    if (!res.ok) throw new Error('Failed to save plan');
    return res.json();
}
