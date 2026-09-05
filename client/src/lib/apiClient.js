import axios from 'axios';
import { supabase } from './supabaseClient';

const API_URL = import.meta.env.VITE_API_URL;

// Every call to OUR backend goes through here, so the Supabase JWT is
// always attached automatically. Components never build axios calls by hand.
const client = axios.create({ baseURL: API_URL });

client.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  const token = session?.access_token;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

client.interceptors.response.use(
  (res) => res.data,
  (err) => {
    const message = err.response?.data?.error || err.message;
    throw new Error(message);
  }
);

export const api = {
  getMe: () => client.get('/api/me'),
  createProfile: (data) => client.post('/api/users', data),
};
