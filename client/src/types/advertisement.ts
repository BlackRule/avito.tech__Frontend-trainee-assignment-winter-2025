export type AdvertisementType = 'Недвижимость' | 'Авто' | 'Услуги';

interface BaseAdvertisement {
  description: string;
  id?: string;
  image?: string;
  location: string;
  name: string;
  type: AdvertisementType;
}

export interface RealEstateAdvertisement extends BaseAdvertisement {
  area: number;
  price: number;
  propertyType: string;
  rooms: number;
  type: 'Недвижимость';
}

export interface AutomotiveAdvertisement extends BaseAdvertisement {
  brand: string;
  mileage?: number;
  model: string;
  type: 'Авто';
  year: number;
}

export interface ServicesAdvertisement extends BaseAdvertisement {
  cost: number;
  experience: number;
  serviceType: string;
  type: 'Услуги';
  workSchedule?: string;
}

export type Advertisement = RealEstateAdvertisement | AutomotiveAdvertisement | ServicesAdvertisement;
