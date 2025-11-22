# InventoryApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createInventory**](#createinventory) | **POST** /api/Inventory | |
|[**deleteInventory**](#deleteinventory) | **DELETE** /api/Inventory/{id} | |
|[**filterInventories**](#filterinventories) | **GET** /api/Inventory/filter | |
|[**getAllInventories**](#getallinventories) | **GET** /api/Inventory | |
|[**getInventoryById**](#getinventorybyid) | **GET** /api/Inventory/{id} | |
|[**searchInventoryByProductName**](#searchinventorybyproductname) | **GET** /api/Inventory/search | |
|[**updateInventory**](#updateinventory) | **PUT** /api/Inventory/{id} | |

# **createInventory**
> ResponseInventoryResponse createInventory()


### Example

```typescript
import {
    InventoryApi,
    Configuration,
    InventoryRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new InventoryApi(configuration);

let inventoryRequest: InventoryRequest; // (optional)

const { status, data } = await apiInstance.createInventory(
    inventoryRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **inventoryRequest** | **InventoryRequest**|  | |


### Return type

**ResponseInventoryResponse**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: application/json, text/json, application/*+json
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**0** | Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteInventory**
> ResponseObject deleteInventory()


### Example

```typescript
import {
    InventoryApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InventoryApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.deleteInventory(
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

# **filterInventories**
> ResponsePagedResponseInventoryResponse filterInventories()


### Example

```typescript
import {
    InventoryApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InventoryApi(configuration);

let productName: string; // (optional) (default to undefined)
let pageNumber: number; // (optional) (default to undefined)
let pageSize: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.filterInventories(
    productName,
    pageNumber,
    pageSize
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **productName** | [**string**] |  | (optional) defaults to undefined|
| **pageNumber** | [**number**] |  | (optional) defaults to undefined|
| **pageSize** | [**number**] |  | (optional) defaults to undefined|


### Return type

**ResponsePagedResponseInventoryResponse**

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

# **getAllInventories**
> ResponsePagedResponseInventoryResponse getAllInventories()


### Example

```typescript
import {
    InventoryApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InventoryApi(configuration);

let pageNumber: number; // (optional) (default to 1)
let pageSize: number; // (optional) (default to 10)

const { status, data } = await apiInstance.getAllInventories(
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

**ResponsePagedResponseInventoryResponse**

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

# **getInventoryById**
> ResponseInventoryResponse getInventoryById()


### Example

```typescript
import {
    InventoryApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InventoryApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getInventoryById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ResponseInventoryResponse**

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

# **searchInventoryByProductName**
> ResponseIEnumerableInventoryResponse searchInventoryByProductName()


### Example

```typescript
import {
    InventoryApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new InventoryApi(configuration);

let productName: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.searchInventoryByProductName(
    productName
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **productName** | [**string**] |  | (optional) defaults to undefined|


### Return type

**ResponseIEnumerableInventoryResponse**

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

# **updateInventory**
> ResponseInventoryResponse updateInventory()


### Example

```typescript
import {
    InventoryApi,
    Configuration,
    InventoryRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new InventoryApi(configuration);

let id: number; // (default to undefined)
let inventoryRequest: InventoryRequest; // (optional)

const { status, data } = await apiInstance.updateInventory(
    id,
    inventoryRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **inventoryRequest** | **InventoryRequest**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

**ResponseInventoryResponse**

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: application/json, text/json, application/*+json
 - **Accept**: text/plain, application/json, text/json


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**0** | Error |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

