// lib/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://recommender.barchinet.com:8080/',
});

export default api;
