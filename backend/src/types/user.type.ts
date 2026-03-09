export interface IUser {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: 'user' | 'admin';
  image?: string | null;
  resetToken?: string | null;
  resetTokenExpiry?: Date | null;
}
