import { api, setAccessToken } from "./api";

export async function register(username: string, email: string, password: string) {
  const response = await api.post('/registration', { username, email, password });
  return response.data;
}

export async function activation(activationToken: string) {
  const response = await api.get(`/activation/${activationToken}`,);

  setAccessToken(response.data.accessToken)
  return response.data
}

export async function login(email: string, password: string) {
  const response = await api.post('/login', { email, password });
  
  setAccessToken(response.data.accessToken)
  return response.data.user
}

export async function logout() {
  const response = await api.post('/logout');

  setAccessToken(null)
  return response.data
}

export async function refresh() {
  const response = await api.get('/refresh');

  setAccessToken(response.data.accessToken)
  return response.data.user
}

export async function forgotPassword(email: string) {
  const response = await api.post('/sentEmail', { email });
  
  return response.data
}
