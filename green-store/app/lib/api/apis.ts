import { AuthApi, 
         CategoryApi, 
         InventoryApi, 
         OrderApi, 
         PaymentApi,
         ProductApi,
         SupplierApi,
         UsersApi } from "./api";
import { createApiConfiguration } from "./configuration-builder";

let apiInstance: {
    auth?: AuthApi;
    categories?: CategoryApi;
    inventory?: InventoryApi;
    orders?: OrderApi;
    payments?: PaymentApi;
    products?: ProductApi;
    suppliers?: SupplierApi;
    users?: UsersApi;
} = {}

function getOrCreateAPI<T>(
    key: keyof typeof apiInstance, 
    ApiClass: new (config: any) => T): T {
        if (!apiInstance[key]) {
            const config = createApiConfiguration();
            apiInstance[key] = new ApiClass(config) as any;
        }

        return apiInstance[key] as T;
}

export const apis = {
    get auth() {
      return getOrCreateAPI('auth', AuthApi);
    },
    get categories() {
      return getOrCreateAPI('categories', CategoryApi);
    },
    get inventory() {
      return getOrCreateAPI('inventory', InventoryApi);
    },
    get orders() {
      return getOrCreateAPI('orders', OrderApi);
    },
    get payments() {
      return getOrCreateAPI('payments', PaymentApi);
    },
    get products() {
      return getOrCreateAPI('products', ProductApi);
    },
    get suppliers() {
      return getOrCreateAPI('suppliers', SupplierApi);
    },
    get users() {
      return getOrCreateAPI('users', UsersApi);
    },
} as const;