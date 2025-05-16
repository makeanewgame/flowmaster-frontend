import React from "react";
import { Suspense } from "react";

import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "./App.tsx";
import { HeroProvider } from "./provider.tsx";
import "@/styles/globals.css";
import { store } from "./redux/store.ts";

import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import { Provider } from "react-redux";
import { I18nextProvider } from "react-i18next";
import i18n from "./i18.ts";
const persistor = persistStore(store);
import "leaflet/dist/leaflet.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <Suspense fallback={<div>Loading...</div>}>
          <I18nextProvider i18n={i18n}>
            <BrowserRouter>
              <HeroProvider>
                <App />
              </HeroProvider>
            </BrowserRouter>
          </I18nextProvider>
        </Suspense>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
