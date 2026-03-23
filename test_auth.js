import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api/v1/auth',
  headers: { 'Content-Type': 'application/json' }
});

async function run() {
  const testUser = {
    name: "Testing Admin",
    email: "admin@kleardocs.com",
    password: "securepassword123",
    role: "admin"
  };

  try {
    console.log("Attempting to register test user...");
    const regRes = await api.post('/register', testUser);
    console.log("Registration successful:", regRes.data.message);
  } catch (err) {
    if (err.response?.status === 400 && err.response.data.message.includes("exists")) {
      console.log("User already exists.");
    } else {
      console.error("Registration failed:", err.response?.data || err.message);
    }
  }

  try {
    console.log("Attempting to login...");
    const loginRes = await api.post('/login', {
      email: testUser.email,
      password: testUser.password
    });
    console.log("Login successful!");
    console.log("User:", loginRes.data.data.user.name);
    console.log("Token received:", !!loginRes.data.data.accessToken);
  } catch (err) {
    console.error("Login failed:", err.response?.data || err.message);
  }
}

run();
