export interface IUser {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: "contributor" |"maintainor";
  created_at: Date;
  updated_at: Date;
}
export interface ILoginResponse{
  token : string,
  user : Omit<IUser,'password'>
}
