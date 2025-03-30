interface IUser {
  email: string;
  is_active: boolean;
  is_superuser: boolean;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
  role: "client" | "admin" | "staff";
  id?: number;
}

interface ILoginResponse {
  access_token: string;
  token_type: string;
}

interface IUserLogin {
  email: string;
  password: string;
}

interface IUserRegister {
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  address: string;
}
