export interface IServicesReducer {
  services: IService[],
  loading: boolean,
  error: string,
  categories: [],
  price_driver: [],
}

export interface IService {
  id: number,
  name: string,
  category: ICategory,
  department: string,
  attachments: [],
  description: string,
  order: number,
  options: [],
  created_at: string,
  updated_at: string
}

export interface ICategory {
  id: number,
  department: string,
  name: string,
  order: number
  image: string
}

export interface IPriceDriver {
  name: string,
  description: string,
  driver: string,
  fields: Object
}
