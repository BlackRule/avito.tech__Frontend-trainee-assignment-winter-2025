import axios from 'axios'
import type { Advertisement } from '~/types/advertisement'

const api = axios.create({
  baseURL: 'http://127.0.0.1:3000',
})

export const getAdvertisements = async () => {
  const { data } = await api.get<Advertisement[]>('/items')
  return data
}

export const getAdvertisement = async (id: string) => {
  const { data } = await api.get<Advertisement>(`/items/${id}`)
  return data
}

export const createAdvertisement = async (advertisement: Omit<Advertisement, 'id'>) => {
  const { data } = await api.post<Advertisement>('/items', advertisement)
  return data
}

export const updateAdvertisement = async (id: string, advertisement: Omit<Advertisement, 'id'>) => {
  const { data } = await api.put<Advertisement>(`/items/${id}`, advertisement)
  return data
}

export const deleteAdvertisement = async (id: string) => {
  await api.delete(`/items/${id}`)
}
