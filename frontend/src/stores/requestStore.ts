import { create } from 'zustand'
import type { AxiosRequestConfig } from 'axios';
import { axiosInstance } from '@/lib/axios'

interface RequestState {
  isLoading: boolean
  getData: <T = any>(url: string, config?: AxiosRequestConfig) => Promise<T>
  postData: <T = any>(url: string, data: any, config?: AxiosRequestConfig) => Promise<T>
  patchData: <T = any>(url: string, data: any, config?: AxiosRequestConfig) => Promise<T>
  putData: <T = any>(url: string, data: any, config?: AxiosRequestConfig) => Promise<T>
  deleteData: <T = any>(url: string, config?: AxiosRequestConfig) => Promise<T>
}

export const useRequestStore = create<RequestState>((set) => ({
  isLoading: false,

  getData: async (url, config) => {
    set({ isLoading: true })
    try {
      const res = await axiosInstance.get(url, config)
      return res.data
    } finally {
      set({ isLoading: false })
    }
  },

  postData: async (url, data, config) => {
    set({ isLoading: true })
    try {
      const res = await axiosInstance.post(url, data, config)
      return res.data
    } finally {
      set({ isLoading: false })
    }
  },

  patchData: async (url, data, config) => {
    set({ isLoading: true })
    try {
      const res = await axiosInstance.patch(url, data, config)
      return res.data
    } finally {
      set({ isLoading: false })
    }
  },

  putData: async (url, data, config) => {
    set({ isLoading: true })
    try {
      const res = await axiosInstance.put(url, data, config)
      return res.data
    } finally {
      set({ isLoading: false })
    }
  },

  deleteData: async (url, config) => {
    set({ isLoading: true })
    try {
      const res = await axiosInstance.delete(url, config)
      return res.data
    } finally {
      set({ isLoading: false })
    }
  },
}))