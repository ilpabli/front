import axios from "axios";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      typeof window !== "undefined" &&
      error.response &&
      error.response.status === 401
    ) {
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const createTicket = async (data: any) => {
  try {
    const res = await axiosInstance.post("/tickets", data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getTickets = async () => {
  try {
    const res = await axiosInstance.get("/tickets");
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getTicket = async (id: any) => {
  try {
    const res = await axiosInstance.get(`/tickets/${id}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getTicketsfiltered = async () => {
  try {
    const res = await axiosInstance.get(
      "/tickets?ticket_status=Abierto&ticket_status=En%20proceso"
    );
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateTicket = async (ticketId: any, data: any) => {
  try {
    const res = await axiosInstance.put(`/tickets/${ticketId}`, data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteTicket = async (ticketId: any) => {
  try {
    const res = await axiosInstance.delete(`/tickets/${ticketId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getTechnicians = async () => {
  try {
    const res = await axiosInstance.get("/users/technicians");
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const setTechnician = async (ticketId: number, assignedTo: string) => {
  try {
    const res = await axiosInstance.put(`/tickets/assign/${ticketId}`, {
      user: assignedTo,
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const refreshAssign = async (ticketId: number) => {
  try {
    const res = await axiosInstance.put(`/tickets/assign/${ticketId}`, {
      user: "refresh",
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getClients = async () => {
  try {
    const res = await axiosInstance.get("/clients");
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default axiosInstance;
