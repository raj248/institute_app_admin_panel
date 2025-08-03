export const isAuthenticated = (): boolean => {
  return localStorage.getItem("admin_token") === "true";
};
