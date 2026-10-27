
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "http://localhost:5000/api";

export const getMonitoredAPIs = async () => {
  const response = await fetch(
    `${API_BASE_URL}/monitored-apis`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch monitored APIs"
    );
  }

  return data;
};

export const getMonitoringHistory = async (id) => {
  const response = await fetch(
    `${API_BASE_URL}/monitored-apis/${id}/history`
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to fetch monitoring history"
    );
  }

  return data;
};

export const runHealthCheck = async (id) => {
  const response = await fetch(
    `${API_BASE_URL}/monitored-apis/${id}/health-check`,
    {
      method: "POST",
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(
      data.message || "Failed to run health check"
    );
  }

  return data;
};

export const createMonitoredAPI = async (apiData) => {
  const response = await fetch(
    `${import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api"}/monitored-apis`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(apiData),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to add API");
  }

  return data;
};