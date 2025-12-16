import {
  AuthApi,
  CategoryApi,
  CustomerApi,
  InventoryApi,
  OrderApi,
  PaymentApi,
  ProductApi,
  PromotionApi,
  SupplierApi,
  UsersApi,
} from "./api";
import { Configuration } from "./configuration";

const getConfiguration = () => {
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  return new Configuration({
    basePath: process.env.NEXT_PUBLIC_API_URL,
    apiKey: token ? `Bearer ${token}` : undefined,
  });
};

export const apis = {
  get auth() {
    return new AuthApi(getConfiguration());
  },
  get categories() {
    return new CategoryApi(getConfiguration());
  },
  get customers() {
    return new CustomerApi(getConfiguration());
  },
  get inventory() {
    return new InventoryApi(getConfiguration());
  },
  get orders() {
    return new OrderApi(getConfiguration());
  },
  get payments() {
    return new PaymentApi(getConfiguration());
  },
  get products() {
    return new ProductApi(getConfiguration());
  },
  get promotions() {
    return new PromotionApi(getConfiguration());
  },
  get suppliers() {
    return new SupplierApi(getConfiguration());
  },
  get users() {
    return new UsersApi(getConfiguration());
  },
};
