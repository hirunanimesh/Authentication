"use client";

import { Provider } from "react-redux";
import { store } from "../redux/store"; // adjust path if needed

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  return <Provider store={store}>{children}</Provider>;
}
