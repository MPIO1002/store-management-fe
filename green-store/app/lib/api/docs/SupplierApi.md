# SupplierApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createSupplier**](#createsupplier) | **POST** /api/Supplier | |
|[**deleteSupplier**](#deletesupplier) | **DELETE** /api/Supplier/{id} | |
|[**filterSuppliers**](#filtersuppliers) | **GET** /api/Supplier/filter | |
|[**getSupplierById**](#getsupplierbyid) | **GET** /api/Supplier/{id} | |
|[**getSuppliers**](#getsuppliers) | **GET** /api/Supplier | |
|[**updateSupplier**](#updatesupplier) | **PUT** /api/Supplier/{id} | |

# **createSupplier**
> createSupplier()


### Example

```typescript
import {
    SupplierApi,
    Configuration,
    SupplierDto
} from './api';

const configuration = new Configuration();
const apiInstance = new SupplierApi(configuration);

let supplierDto: SupplierDto; // (optional)

const { status, data } = await apiInstance.createSupplier(
    supplierDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **supplierDto** | **SupplierDto**|  | |


### Return type

void (empty response body)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: application/json, text/json, application/*+json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **deleteSupplier**
> deleteSupplier()


### Example

```typescript
import {
    SupplierApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SupplierApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.deleteSupplier(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


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

# **filterSuppliers**
> filterSuppliers()


### Example

```typescript
import {
    SupplierApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SupplierApi(configuration);

let name: string; // (optional) (default to undefined)
let phone: string; // (optional) (default to undefined)
let pageNumber: number; // (optional) (default to undefined)
let pageSize: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.filterSuppliers(
    name,
    phone,
    pageNumber,
    pageSize
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **name** | [**string**] |  | (optional) defaults to undefined|
| **phone** | [**string**] |  | (optional) defaults to undefined|
| **pageNumber** | [**number**] |  | (optional) defaults to undefined|
| **pageSize** | [**number**] |  | (optional) defaults to undefined|


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

# **getSupplierById**
> getSupplierById()


### Example

```typescript
import {
    SupplierApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SupplierApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getSupplierById(
    id
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **id** | [**number**] |  | defaults to undefined|


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

# **getSuppliers**
> getSuppliers()


### Example

```typescript
import {
    SupplierApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new SupplierApi(configuration);

let pageNumber: number; // (optional) (default to 1)
let pageSize: number; // (optional) (default to 10)

const { status, data } = await apiInstance.getSuppliers(
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

# **updateSupplier**
> updateSupplier()


### Example

```typescript
import {
    SupplierApi,
    Configuration,
    SupplierDto
} from './api';

const configuration = new Configuration();
const apiInstance = new SupplierApi(configuration);

let id: number; // (default to undefined)
let supplierDto: SupplierDto; // (optional)

const { status, data } = await apiInstance.updateSupplier(
    id,
    supplierDto
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **supplierDto** | **SupplierDto**|  | |
| **id** | [**number**] |  | defaults to undefined|


### Return type

void (empty response body)

### Authorization

[Bearer](../README.md#Bearer)

### HTTP request headers

 - **Content-Type**: application/json, text/json, application/*+json
 - **Accept**: Not defined


### HTTP response details
| Status code | Description | Response headers |
|-------------|-------------|------------------|
|**200** | OK |  -  |

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

