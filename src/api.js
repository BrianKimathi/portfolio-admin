const API_URL = 'https://portfolio-backend-x6q9.onrender.com/api';

// Helper to get token from localStorage
function getToken() {
  return localStorage.getItem('token');
}

export async function login(username, password) {
  const res = await fetch(`${API_URL}/admin/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  return res.json();
}

export async function fetchProjects() {
  const res = await fetch(`${API_URL}/projects`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return res.json();
}

export async function createProject(data) {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'images') {
      value.forEach((file) => formData.append('images', file));
    } else {
      formData.append(key, value);
    }
  });
  const res = await fetch(`${API_URL}/projects`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${getToken()}` },
    body: formData
  });
  return res.json();
}

export async function updateProject(id, data) {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'images') {
      value.forEach((file) => formData.append('images', file));
    } else {
      formData.append(key, value);
    }
  });
  const res = await fetch(`${API_URL}/projects/${id}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${getToken()}` },
    body: formData
  });
  return res.json();
}

export async function deleteProject(id) {
  const res = await fetch(`${API_URL}/projects/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return res.json();
}

export async function fetchStats() {
  const res = await fetch(`${API_URL}/stats`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return res.json();
}

export async function fetchSkills() {
  const res = await fetch(`${API_URL}/skills`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return res.json();
}
export async function createSkill(data) {
  const res = await fetch(`${API_URL}/skills`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
    body: JSON.stringify(data)
  });
  return res.json();
}
export async function updateSkill(id, data) {
  const res = await fetch(`${API_URL}/skills/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
    body: JSON.stringify(data)
  });
  return res.json();
}
export async function deleteSkill(id) {
  const res = await fetch(`${API_URL}/skills/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return res.json();
}

export async function fetchExperience() {
  const res = await fetch(`${API_URL}/experience`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return res.json();
}
export async function createExperience(data) {
  const res = await fetch(`${API_URL}/experience`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
    body: JSON.stringify(data)
  });
  return res.json();
}
export async function updateExperience(id, data) {
  const res = await fetch(`${API_URL}/experience/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
    body: JSON.stringify(data)
  });
  return res.json();
}
export async function deleteExperience(id) {
  const res = await fetch(`${API_URL}/experience/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return res.json();
}

export async function fetchEducation() {
  const res = await fetch(`${API_URL}/education`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return res.json();
}
export async function createEducation(data) {
  const res = await fetch(`${API_URL}/education`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
    body: JSON.stringify(data)
  });
  return res.json();
}
export async function updateEducation(id, data) {
  const res = await fetch(`${API_URL}/education/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
    body: JSON.stringify(data)
  });
  return res.json();
}
export async function deleteEducation(id) {
  const res = await fetch(`${API_URL}/education/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return res.json();
}

export async function fetchContacts() {
  const res = await fetch(`${API_URL}/contacts`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return res.json();
}
export async function markContactRead(id) {
  const res = await fetch(`${API_URL}/contacts/${id}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return res.json();
}
export async function deleteContact(id) {
  const res = await fetch(`${API_URL}/contacts/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return res.json();
}

export async function fetchCertifications() {
  const res = await fetch(`${API_URL}/certifications`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return res.json();
}
export async function createCertification(data) {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'certificate' && value) {
      formData.append('certificate', value);
    } else {
      formData.append(key, value);
    }
  });
  const res = await fetch(`${API_URL}/certifications`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${getToken()}` },
    body: formData
  });
  return res.json();
}
export async function updateCertification(id, data) {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'certificate' && value) {
      formData.append('certificate', value);
    } else {
      formData.append(key, value);
    }
  });
  const res = await fetch(`${API_URL}/certifications/${id}`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${getToken()}` },
    body: formData
  });
  return res.json();
}
export async function deleteCertification(id) {
  const res = await fetch(`${API_URL}/certifications/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return res.json();
}

export async function fetchProfile() {
  const res = await fetch(`${API_URL}/profile`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return res.json();
}
export async function updateProfile(data) {
  const formData = new FormData();
  Object.entries(data).forEach(([key, value]) => {
    if (key === 'cv' && value) {
      formData.append('cv', value);
    } else {
      formData.append(key, value);
    }
  });
  const res = await fetch(`${API_URL}/profile`, {
    method: 'PUT',
    headers: { 'Authorization': `Bearer ${getToken()}` },
    body: formData
  });
  return res.json();
}

export async function fetchReferences(expId) {
  const res = await fetch(`${API_URL}/experience/${expId}/references`, {
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return res.json();
}
export async function createReference(expId, data) {
  const res = await fetch(`${API_URL}/experience/${expId}/references`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
    body: JSON.stringify(data)
  });
  return res.json();
}
export async function updateReference(refId, data) {
  const res = await fetch(`${API_URL}/references/${refId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${getToken()}` },
    body: JSON.stringify(data)
  });
  return res.json();
}
export async function deleteReference(refId) {
  const res = await fetch(`${API_URL}/references/${refId}`, {
    method: 'DELETE',
    headers: { 'Authorization': `Bearer ${getToken()}` }
  });
  return res.json();
}

export function getImageUrl(url) {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `http://localhost:5000${url}`;
} 