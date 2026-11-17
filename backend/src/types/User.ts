export interface UserType {
  username: string,
  id: string,
  password?: string,
  activationToken?: string
  resetPasswordToken?: string
}