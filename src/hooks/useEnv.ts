export function useEnv() {
  const { MODE, VITE_BASE_API, VITE_PUBLIC_PATH, VITE_ENCRYP_KEY, VITE_ENCRYP_IV, VITE_TIME_ZONE } =
    import.meta.env

  return {
    MODE,
    VITE_BASE_API,
    VITE_PUBLIC_PATH,
    VITE_ENCRYP_KEY,
    VITE_ENCRYP_IV,
    VITE_TIME_ZONE
  }
}
