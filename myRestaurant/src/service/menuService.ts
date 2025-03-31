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
        `/menu-items/by/categories`
      );
      console.log(JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.error("An error occurred while fetching menu items:", error);
      return Promise.reject(error);
    }
  }
  async getMenuItemsAndCategories(): Promise<IMenuItemAndCategory[]> {
    try {
      const response = await apiClients.get<IMenuItemAndCategory[]>(
        `/menu-items/categories`
      );
      console.log(JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.error("An error occurred while fetching menu items:", error);
      return Promise.reject(error);
    }
  }
  //get all categories
  async getCategories(): Promise<ICategoryItem[]> {
    try {
      const response = await apiClients.get<ICategoryItem[]>(`/categories`);
      console.log(JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.error("An error occurred while fetching menu items:", error);
      return Promise.reject(error);
    }
  }
  // create category
  async createCategory({
    name,
    description,
  }: {
    name: string;
    description: string;
  }): Promise<ICategoryItem> {
    try {
      const response = await apiClients.post<ICategoryItem>(`/categories/`, {
        name,
        description,
      });
      console.log(JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.error("An error occurred while creating category:", error);
      return Promise.reject(error);
    }
  }
}
export default new MenuService();
