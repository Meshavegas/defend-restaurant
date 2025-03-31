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
  // create menu item form data
  async createMenuItemFormData({
    name,
    description,
    price,
    image_url,
    is_available,
    preparation_time,
    category_id,
  }: {
    name: string;
    description: string;
    price: string;
    image_url: string;
    is_available: boolean;
    preparation_time: string;
    category_id: string;
  }) {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("price", price);
    formData.append("is_available", is_available.toString());
    formData.append("preparation_time", preparation_time);
    formData.append("category_id", category_id);

    if (image_url) {
      const imageFile = {
        uri: image_url,
        type: "image/jpeg", // or "image/png" depending on the file
        name: image_url.split("/").pop() || "photo.jpg", // dynamically generate name
      };
      formData.append("image", imageFile as any);
    }

    try {
      const response = await apiClients.post<IMenuItem>(
        `menu-items/menu-items/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      console.log(JSON.stringify(response.data, null, 2));
      return response.data;
    } catch (error) {
      console.error(
        "An error occurred while creating menu item:",
        JSON.stringify(error, null, 2)
      );
      return Promise.reject(error);
    }
  }
}
export default new MenuService();
