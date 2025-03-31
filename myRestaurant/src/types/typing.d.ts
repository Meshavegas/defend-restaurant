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

interface ICategory {
  id: string;
  name: string;
  description: string;
  menu_items: IMenuItem[];
}
interface IMenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  image_url: string;
  is_available: boolean;
  preparation_time: string;
}

interface IMenuItemAndCategory {
  id: string;
  name: string;
  description: string;
  price: string;
  is_available: boolean;
  image_url: string;
  preparation_time: string;
  category: {
    id: string;
    name: string;
    description: string;
  };
}

interface ICategoryItem {
  id: string;
  name: string;
  description: string;
}
