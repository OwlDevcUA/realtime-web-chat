import { api } from "./api";

export async function changeName(newName: string) {
  const response = await api.post('/profile/changeName', { newName })
  
  return response.data
}

export async function changePassword(password: string) {
  const response = await api.post('/profile/changePassword', { password })
  
  return response.data
}

export async function changeEmail(password: string, newEmail: string) {
  const response = await api.post('/profile/changePassword', { password, newEmail })
  
  return response.data
}