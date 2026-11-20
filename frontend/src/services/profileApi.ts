import { api } from "./api";

export async function changeName(newName: string) {
  const response = await api.post('/profile/changeName', { newName })
  
  return response.data
}

export async function changePassword(password: string, oldPassword: string) {
  const response = await api.post('/profile/changePassword', { password, oldPassword })
  
  return response.data
}

export async function changeEmail(password: string, newEmail: string) {
  const response = await api.post('/profile/changeEmail', { password, newEmail })
  
  return response.data
}