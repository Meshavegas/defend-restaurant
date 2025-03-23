import React from "react";

import RootNavigation from "./src/navigation/rootNavigation";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { AppProvider } from "./src/context/themeContext";

const App = () => {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <RootNavigation />
      </AppProvider>
    </SafeAreaProvider>
  );
};

export default App;
