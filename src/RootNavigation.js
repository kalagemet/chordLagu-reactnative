import { createRef } from "react";

export const navigationRef = createRef();

export function navigate(name, params) {
  navigationRef.current?.navigate(name, params);
}

export function goBack() {
  navigationRef.current?.goBack();
}

export function canGoBack() {
  return navigationRef.current?.canGoBack();
}
