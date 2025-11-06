# CustomerApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createCustomer**](#createcustomer) | **POST** /api/Customer | |
|[**deleteCustomer**](#deletecustomer) | **DELETE** /api/Customer/{id} | |
|[**filterCustomers**](#filtercustomers) | **GET** /api/Customer/filter | |
|[**getCustomerByEmail**](#getcustomerbyemail) | **GET** /api/Customer/email/{email} | |
|[**getCustomerById**](#getcustomerbyid) | **GET** /api/Customer/{id} | |
|[**getCustomerByPhone**](#getcustomerbyphone) | **GET** /api/Customer/phone/{phone} | |
|[**getCustomers**](#getcustomers) | **GET** /api/Customer | |
|[**searchCustomers**](#searchcustomers) | **GET** /api/Customer/search | |
|[**updateCustomer**](#updatecustomer) | **PUT** /api/Customer/{id} | |

# **createCustomer**
> createCustomer()


### Example

```typescript
import {
    CustomerApi,
    Configuration,
    CustomerCreateRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new CustomerApi(configuration);

let customerCreateRequest: CustomerCreateRequest; // (optional)

const { status, data } = await apiInstance.createCustomer(
    customerCreateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **customerCreateRequest** | **CustomerCreateRequest**|  | |


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

# **deleteCustomer**
> deleteCustomer()


### Example

```typescript
import {
    CustomerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CustomerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.deleteCustomer(
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

# **filterCustomers**
> filterCustomers()


### Example

```typescript
import {
    CustomerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CustomerApi(configuration);

let fullName: string; // (optional) (default to undefined)
let email: string; // (optional) (default to undefined)
let phoneNumber: string; // (optional) (default to undefined)
let pageNumber: number; // (optional) (default to undefined)
let pageSize: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.filterCustomers(
    fullName,
    email,
    phoneNumber,
    pageNumber,
    pageSize
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **fullName** | [**string**] |  | (optional) defaults to undefined|
| **email** | [**string**] |  | (optional) defaults to undefined|
| **phoneNumber** | [**string**] |  | (optional) defaults to undefined|
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

# **getCustomerByEmail**
> getCustomerByEmail()


### Example

```typescript
import {
    CustomerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CustomerApi(configuration);

let email: string; // (default to undefined)

const { status, data } = await apiInstance.getCustomerByEmail(
    email
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **email** | [**string**] |  | defaults to undefined|


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

# **getCustomerById**
> getCustomerById()


### Example

```typescript
import {
    CustomerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CustomerApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getCustomerById(
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

# **getCustomerByPhone**
> getCustomerByPhone()


### Example

```typescript
import {
    CustomerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CustomerApi(configuration);

let phone: string; // (default to undefined)

const { status, data } = await apiInstance.getCustomerByPhone(
    phone
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **phone** | [**string**] |  | defaults to undefined|


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

# **getCustomers**
> getCustomers()


### Example

```typescript
import {
    CustomerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CustomerApi(configuration);

let pageNumber: number; // (optional) (default to 1)
let pageSize: number; // (optional) (default to 10)

const { status, data } = await apiInstance.getCustomers(
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

# **searchCustomers**
> searchCustomers()


### Example

```typescript
import {
    CustomerApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CustomerApi(configuration);

let name: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.searchCustomers(
    name
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **name** | [**string**] |  | (optional) defaults to undefined|


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

# **updateCustomer**
> updateCustomer()


### Example

```typescript
import {
    CustomerApi,
    Configuration,
    CustomerCreateRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new CustomerApi(configuration);

let id: number; // (default to undefined)
let customerCreateRequest: CustomerCreateRequest; // (optional)

const { status, data } = await apiInstance.updateCustomer(
    id,
    customerCreateRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **customerCreateRequest** | **CustomerCreateRequest**|  | |
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

