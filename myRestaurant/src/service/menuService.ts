import { apiClients } from "../config/axios";

class MenuService {
  async getMenuItems(): Promise<IMenuItem[]> {
    try {
      const response = await apiClients.get<IMenuItem[]>("/menu-items/");
      console.log(JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.error("An error occurred while fetching menu items:", error);
      return Promise.reject(error);
    }
  }

  async getMenuItemsByCategory(): Promise<ICategory[]> {
    try {
      const response = await apiClients.get<ICategory[]>(
        `/menu-items/menu-items/categories`
      );
      console.log(JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.error("An error occurred while fetching menu items:", error);
      return Promise.reject(error);
    }
  }
}
export default new MenuService();
