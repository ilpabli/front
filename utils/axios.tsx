import axios from "axios";
import { getSession, signOut } from "next-auth/react";

const axiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

export const axiosLogin = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

axiosInstance.interceptors.request.use(async (config) => {
  const session = await getSession();
  if (session?.user?.token) {
    config.headers.Authorization = `Bearer ${session.user.token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (
      error.response &&
      error.response.status === 401
    ) {
      signOut({ callbackUrl: "/login", redirect: true })
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

export const getTicketspriority = async () => {
  try {
    const res = await axiosInstance.get(
      "/tickets?ticket_status=Abierto&ticket_status=En%20proceso&priority=True"
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

export const getTechnicians = async (time: any) => {
  try {
    if (time) {
      const res = await axiosInstance.get(
        `/users/technicians?last_location_update=${time}`
      );
      return res.data;
    }
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

export const createClient = async (data: any) => {
  try {
    const res = await axiosInstance.post("/clients", data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getClients = async (page: any) => {
  try {
    if (page) {
      const res = await axiosInstance.get(`/clients?page=${page}`);
      return res.data;
    }
    const res = await axiosInstance.get("/clients");
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getClient = async (clientId: any) => {
  try {
    const res = await axiosInstance.get(`/clients/${clientId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const updateClient = async (clientId: any, data: any) => {
  try {
    const res = await axiosInstance.put(`/clients/${clientId}`, data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteClient = async (jobNumber: any) => {
  try {
    const res = await axiosInstance.delete(`/clients/${jobNumber}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const createUser = async (data: any) => {
  try {
    const res = await axiosInstance.post("/users", data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getUsers = async (page: any) => {
  try {
    if (page) {
      const res = await axiosInstance.get(`/users?page=${page}`);
      return res.data;
    }
    const res = await axiosInstance.get("/users");
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getUser = async (userId: any) => {
  try {
    const res = await axiosInstance.get(`/users/${userId}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const deleteUser = async (user: any) => {
  try {
    const res = await axiosInstance.delete(`/users/${user}`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const getProfile = async () => {
  try {
    const res = await axiosInstance.get(`/users/current`);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export const changePassword = async (data: any) => {
  try {
    const res = await axiosInstance.post(`/users/changepassword`, data);
    return res.data;
  } catch (error) {
    throw error;
  }
};

export default axiosInstance;
