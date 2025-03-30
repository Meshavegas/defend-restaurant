import { useEffect } from "react";
import useAuthStore from "./auth";

const HydAuth = () => {
  const setAuthHydrated = useAuthStore((state) => state.setHasHydrated);

  useEffect(() => {
    const rehydrate = async () => {
      //auth hydration
      await useAuthStore.persist.rehydrate();
      setAuthHydrated(true);
    };

    rehydrate();
  }, []);

  return null;
};

export default HydAuth;
