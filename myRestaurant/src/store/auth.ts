// import {clearTransactions} from '@src/redux/actions/appActions';
import { create, StateCreator } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";
import { storage } from "../const/storage";
import authService from "../service/authService";
import menuService from "../service/menuService";

// import {apiClient} from '@src/apiHelper/axiosHelper';
// import {changeLang} from '@src/constants/lang/i18n';
// import storage from '@src/utils/storage';
// import {apiClient} from '@src/apiHelper/axiosHelper';
// import appService from '@src/apiHelper/appService';

// Types plus précis

interface AuthState {
  users?: IUser;
  token?: string | null;
  basket: any[];
  menuItems: ICategory[];
  // Actions
  login: (username: string, password: string) => Promise<void>;
  register: (user: IUserRegister) => Promise<void>;
  _hasHydrated: boolean;
  setHasHydrated: (state: boolean) => void;
  getMe: () => Promise<void>;
  logout: () => void;
  addToBasket: (item: any) => void;
  removeFromBasket: (item: any) => void;
  totalItems: () => number;
  getMenuItems: () => Promise<void>;
  clearBasket: () => void;
  reduceQuantity: (item: any) => void;
}

type AuthPersist = (
  config: StateCreator<AuthState>,
  options: PersistOptions<AuthState>
) => StateCreator<AuthState>;

type StoreWithPersist<T> = typeof useAuthStore & {
  persist: {
    setOptions: (options: Partial<PersistOptions<T>>) => void;
    clearStorage: () => void;
    rehydrate: () => Promise<void>;
    hasHydrated: () => boolean;
  };
};

const useAuthStore = create<AuthState>(
  (persist as unknown as AuthPersist)(
    (set, get) => ({
      token: null,
      users: null,
      _hasHydrated: false,
      basket: [],
      menuItems: [],
      login: async (username: string, password: string) => {
        try {
          const response = await authService.authenticate(username, password);
          set({ token: response.access_token });
        } catch (error) {
          console.error("An error occurred during login:", error);
        }
      },
      register: async (user: IUserRegister) => {
        try {
          const response = await authService.register(user);
          set({ token: response.access_token });
        } catch (error) {
          console.error("An error occurred during registration:", error);
        }
      },
      totalItems: () =>
        get().basket.reduce((sum, item) => sum + item.quantity, 0),
      getMe: async () => {
        try {
          const response = await authService.me();
          set({ users: response });
        } catch (error) {
          console.error("An error occurred during user fetch:", error);
        }
      },
      logout: () => {
        set({ token: null, users: null });
      },
      reduceQuantity: (item: any) => {
        const prevBasket = get().basket;

        const itemExists = prevBasket.find(
          (basketItem) => basketItem.id === item.id
        );

        if (itemExists) {
          if (itemExists.quantity > 1) {
            const updatedBasket = prevBasket.map((basketItem) =>
              basketItem.id === item.id
                ? { ...basketItem, quantity: basketItem.quantity - 1 }
                : basketItem
            );
            set({ basket: updatedBasket });
          } else {
            set((state) => ({
              basket: state.basket.filter(
                (basketItem) => basketItem.id !== item.id
              ),
            }));
          }
        }
      },
      addToBasket: (item: any) => {
        const prevBasket = get().basket;

        const itemExists = prevBasket.find(
          (basketItem) => basketItem.id === item.id
        );
        if (itemExists) {
          const it = prevBasket.map((basketItem) =>
            basketItem.id === item.id
              ? { ...basketItem, quantity: basketItem.quantity + 1 }
              : basketItem
          );

          set({ basket: it });
        } else {
          const it = [...prevBasket, { ...item, quantity: 1 }];
          return set({ basket: it });
        }
      },
      removeFromBasket: (item: any) => {
        set((state) => ({
          basket: state.basket.filter(
            (basketItem) => basketItem.id !== item.id
          ),
        }));
      },
      clearBasket: () => {
        set({ basket: [] });
      },
      getMenuItems: async () => {
        try {
          const response = await menuService.getMenuItemsByCategory();
          set({ menuItems: response });
        } catch (error) {
          console.error("An error occurred during menu fetch:", error);
        }
      },
      setHasHydrated: (state: boolean) => set({ _hasHydrated: state }),
    }),
    {
      name: "constants",
      storage: {
        getItem: async (key: string) => {
          const val = storage.getString(key);
          return val ? JSON.parse(val) : null;
        },
        setItem: (name, value) => {
          storage.set(name, JSON.stringify(value));
        },
        removeItem: (name) => {
          storage.delete(name);
        },
      },
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.setHasHydrated(true);
        }
      },
      partialize: (state) => {
        return {
          ...state,
          users: state.users,
          token: state.token,
        };
      },
    }
  )
);

export default useAuthStore as StoreWithPersist<AuthState>;
