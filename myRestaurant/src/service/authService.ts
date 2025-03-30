import { apiClients } from "../config/axios";

class AuthService {
  // Method to authenticate a user
  async authenticate(
    username: string,
    password: string
  ): Promise<ILoginResponse> {
    // Placeholder logic for authentication
    try {
      const response = await apiClients.post<ILoginResponse>("/auth/login/", {
        username,
        password,
      });
      console.log(JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.error("An error occurred during authentication:", error);
      return Promise.reject(error);
    }
  }

  // Method to register a new user
  async register(user: IUserRegister): Promise<ILoginResponse> {
    try {
      console.log({ user });

      // Placeholder logic for user registration
      if (!user.first_name) {
        throw new Error("Invalid user data");
      }
      const response = await apiClients.post<ILoginResponse>(
        "/auth/register/",
        user
      );
      console.log(JSON.stringify(response.data, null, 2));

      return response.data;
    } catch (error) {
      return Promise.reject(`Registration failed: ${error.message}`);
    }
  }

  // Method to logout a user
  logout(): string {
    // Placeholder logic for logout
    return "User logged out successfully.";
  }

  //me
  async me(): Promise<IUser> {
    try {
      const response = await apiClients.get<IUser>("/auth/me/");
      console.log(JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.error("An error occurred during user fetch:", error);
      return Promise.reject(error);
    }
  }
}
const authService = new AuthService();
export default authService;
