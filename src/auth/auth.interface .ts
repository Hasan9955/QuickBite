 
export interface IRegisterUser {
  fullName: string;
  email: string;
  password: string;
  fcmToken?: string;
}
export interface IUserLogin {
  email: string;
  password: string;
  fcmToken?: string;
}
export interface IOtp {
  userId: string;
  otpCode: Number;
}
export interface IChangePassword {
  newPassword: string;
  oldPassword: string;
}

