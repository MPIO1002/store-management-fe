# ProductApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createProduct**](#createproduct) | **POST** /api/Product | |
|[**deleteProduct**](#deleteproduct) | **DELETE** /api/Product/{id} | |
|[**filterProducts**](#filterproducts) | **GET** /api/Product/filter | |
|[**getAllProducts**](#getallproducts) | **GET** /api/Product | |
|[**getProductByBarcode**](#getproductbybarcode) | **GET** /api/Product/barcode/{barcode} | |
|[**getProductById**](#getproductbyid) | **GET** /api/Product/{id} | |
|[**updateProduct**](#updateproduct) | **PUT** /api/Product/{id} | |

# **createProduct**
> ResponseProductResponse createProduct()


### Example

```typescript
import {
    ProductApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductApi(configuration);

let productName: string; // (default to undefined)
let price: number; // (default to undefined)
let categoryId: number; // (optional) (default to undefined)
let supplierId: number; // (optional) (default to undefined)
let barcode: string; // (optional) (default to undefined)
let unit: string; // (optional) (default to undefined)
let imageUrl: string; // (optional) (default to undefined)
let imageFile: File; // (optional) (default to undefined)

const { status, data } = await apiInstance.createProduct(
    productName,
    price,
    categoryId,
    supplierId,
    barcode,
    unit,
    imageUrl,
    imageFile
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **productName** | [**string**] |  | defaults to undefined|
| **price** | [**number**] |  | defaults to undefined|
| **categoryId** | [**number**] |  | (optional) defaults to undefined|
| **supplierId** | [**number**] |  | (optional) defaults to undefined|
| **barcode** | [**string**] |  | (optional) defaults to undefined|
| **unit** | [**string**] |  | (optional) defaults to undefined|
| **imageUrl** | [**string**] |  | (optional) defaults to undefined|
| **imageFile** | [**File**] |  | (optional) defaults to undefined|


### Return type

**ResponseProductResponse**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**0** | Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteProduct**
> ResponseObject deleteProduct()


### Example

```typescript
import {
    ProductApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.deleteProduct(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ResponseObject**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**0** | Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **filterProducts**
> ResponsePagedResponseProductResponse filterProducts()


### Example

```typescript
import {
    ProductApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductApi(configuration);

let productName: string; // (optional) (default to undefined)
let barcode: string; // (optional) (default to undefined)
let categoryIds: Array<number>; // (optional) (default to undefined)
let supplierIds: Array<number>; // (optional) (default to undefined)
let minPrice: number; // (optional) (default to undefined)
let maxPrice: number; // (optional) (default to undefined)
let inStock: boolean; // (optional) (default to undefined)
let pageNumber: number; // (optional) (default to undefined)
let pageSize: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.filterProducts(
    productName,
    barcode,
    categoryIds,
    supplierIds,
    minPrice,
    maxPrice,
    inStock,
    pageNumber,
    pageSize
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **productName** | [**string**] |  | (optional) defaults to undefined|
| **barcode** | [**string**] |  | (optional) defaults to undefined|
| **categoryIds** | **Array&lt;number&gt;** |  | (optional) defaults to undefined|
| **supplierIds** | **Array&lt;number&gt;** |  | (optional) defaults to undefined|
| **minPrice** | [**number**] |  | (optional) defaults to undefined|
| **maxPrice** | [**number**] |  | (optional) defaults to undefined|
| **inStock** | [**boolean**] |  | (optional) defaults to undefined|
| **pageNumber** | [**number**] |  | (optional) defaults to undefined|
| **pageSize** | [**number**] |  | (optional) defaults to undefined|


### Return type

**ResponsePagedResponseProductResponse**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**0** | Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getAllProducts**
> ResponsePagedResponseProductResponse getAllProducts()


### Example

```typescript
import {
    ProductApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductApi(configuration);

let pageNumber: number; // (optional) (default to 1)
let pageSize: number; // (optional) (default to 10)

const { status, data } = await apiInstance.getAllProducts(
    pageNumber,
    pageSize
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **pageNumber** | [**number**] |  | (optional) defaults to 1|
| **pageSize** | [**number**] |  | (optional) defaults to 10|


### Return type

**ResponsePagedResponseProductResponse**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**0** | Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getProductByBarcode**
> ResponseProductResponse getProductByBarcode()


### Example

```typescript
import {
    ProductApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductApi(configuration);

let barcode: string; // (default to undefined)

const { status, data } = await apiInstance.getProductByBarcode(
    barcode
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **barcode** | [**string**] |  | defaults to undefined|


### Return type

**ResponseProductResponse**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**0** | Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getProductById**
> ResponseProductResponse getProductById()


### Example

```typescript
import {
    ProductApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getProductById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ResponseProductResponse**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**0** | Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateProduct**
> ResponseProductResponse updateProduct()


### Example

```typescript
import {
    ProductApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new ProductApi(configuration);

let id: number; // (default to undefined)
let productName: string; // (default to undefined)
let price: number; // (default to undefined)
let categoryId: number; // (optional) (default to undefined)
let supplierId: number; // (optional) (default to undefined)
let barcode: string; // (optional) (default to undefined)
let unit: string; // (optional) (default to undefined)
let imageUrl: string; // (optional) (default to undefined)
let imageFile: File; // (optional) (default to undefined)

const { status, data } = await apiInstance.updateProduct(
    id,
    productName,
    price,
    categoryId,
    supplierId,
    barcode,
    unit,
    imageUrl,
    imageFile
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|
| **productName** | [**string**] |  | defaults to undefined|
| **price** | [**number**] |  | defaults to undefined|
| **categoryId** | [**number**] |  | (optional) defaults to undefined|
| **supplierId** | [**number**] |  | (optional) defaults to undefined|
| **barcode** | [**string**] |  | (optional) defaults to undefined|
| **unit** | [**string**] |  | (optional) defaults to undefined|
| **imageUrl** | [**string**] |  | (optional) defaults to undefined|
| **imageFile** | [**File**] |  | (optional) defaults to undefined|


### Return type

**ResponseProductResponse**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: multipart/form-data
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**0** | Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

