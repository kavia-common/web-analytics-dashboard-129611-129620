/**
 * PUBLIC_INTERFACE
 * getConfig reads configuration from environment variables to configure the dashboard.
 * CRA exposes variables prefixed with REACT_APP_.
 */
export function getConfig() {
  return {
    siteName: process.env.REACT_APP_SITE_NAME || "My Website",
    apiBaseUrl: process.env.REACT_APP_API_BASE_URL || "",
    websocketUrl: process.env.REACT_APP_WEBSOCKET_URL || "",
    refreshMs: Number(process.env.REACT_APP_REFRESH_MS || 2000),
  };
}
