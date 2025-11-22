# OrderApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**callback**](#callback) | **GET** /api/vnpay/check-result/callback | |
|[**createOrder**](#createorder) | **POST** /api/Order | |
|[**createVnpayOrder**](#createvnpayorder) | **POST** /api/Order/vnpay | |
|[**filterOrders**](#filterorders) | **GET** /api/Order/filter | |
|[**getAllOrders**](#getallorders) | **GET** /api/Order | |

# **callback**
> callback()


### Example

```typescript
import {
    OrderApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderApi(configuration);

const { status, data } = await apiInstance.callback();
```

### Parameters
This endpoint does not have any parameters.


### Return type

void (empty response body)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **createOrder**
> ResponseObject createOrder()


### Example

```typescript
import {
    OrderApi,
    Configuration,
    OrderRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderApi(configuration);

let orderRequest: OrderRequest; // (optional)

const { status, data } = await apiInstance.createOrder(
    orderRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **orderRequest** | **OrderRequest**|  | |


### Return type

**ResponseObject**

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

# **createVnpayOrder**
> ResponseOrderRedirectResponse createVnpayOrder()


### Example

```typescript
import {
    OrderApi,
    Configuration,
    OrderRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderApi(configuration);

let orderRequest: OrderRequest; // (optional)

const { status, data } = await apiInstance.createVnpayOrder(
    orderRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **orderRequest** | **OrderRequest**|  | |


### Return type

**ResponseOrderRedirectResponse**

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

# **filterOrders**
> ResponsePagedResponseOrderResponse filterOrders()


### Example

```typescript
import {
    OrderApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderApi(configuration);

let customerName: string; // (optional) (default to undefined)
let employeeName: string; // (optional) (default to undefined)
let minTotalAmount: number; // (optional) (default to undefined)
let maxTotalAmount: number; // (optional) (default to undefined)
let status: string; // (optional) (default to undefined)
let startDate: string; // (optional) (default to undefined)
let endDate: string; // (optional) (default to undefined)
let pageNumber: number; // (optional) (default to undefined)
let pageSize: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.filterOrders(
    customerName,
    employeeName,
    minTotalAmount,
    maxTotalAmount,
    status,
    startDate,
    endDate,
    pageNumber,
    pageSize
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **customerName** | [**string**] |  | (optional) defaults to undefined|
| **employeeName** | [**string**] |  | (optional) defaults to undefined|
| **minTotalAmount** | [**number**] |  | (optional) defaults to undefined|
| **maxTotalAmount** | [**number**] |  | (optional) defaults to undefined|
| **status** | [**string**] |  | (optional) defaults to undefined|
| **startDate** | [**string**] |  | (optional) defaults to undefined|
| **endDate** | [**string**] |  | (optional) defaults to undefined|
| **pageNumber** | [**number**] |  | (optional) defaults to undefined|
| **pageSize** | [**number**] |  | (optional) defaults to undefined|


### Return type

**ResponsePagedResponseOrderResponse**

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

# **getAllOrders**
> ResponsePagedResponseOrderResponse getAllOrders()


### Example

```typescript
import {
    OrderApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new OrderApi(configuration);

let pageNumber: number; // (optional) (default to 1)
let pageSize: number; // (optional) (default to 10)

const { status, data } = await apiInstance.getAllOrders(
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

**ResponsePagedResponseOrderResponse**

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

