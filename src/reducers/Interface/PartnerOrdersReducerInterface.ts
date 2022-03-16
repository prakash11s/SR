export interface IPartnerOrdersReducer {
  partnerOrders: {
    id: number | null;
    department: string;
    execution_date: string | null;
    services: IServices[];
    meta: {
      total_price: number;
    };
    additional_data: any;
    address: {
      city: string;
      zip_code: string;
      country: string;
    };
    created_at: string | null;
    updated_at: string | null;
    distance: number | null;
  };
}

interface IServices {
  id: any;
  order_id: number | null;
  service_id: number | null;
  amount: number | null;
  name: string;
  price_per_unit: number | null;
  total_price: number | null;
  accepted: string;
  created_at: string;
  updated_at: string;
}
