# CategoryApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**createCategory**](#createcategory) | **POST** /api/Category | |
|[**deleteCategory**](#deletecategory) | **DELETE** /api/Category/{id} | |
|[**filterCategories**](#filtercategories) | **GET** /api/Category/filter | |
|[**getCategoryById**](#getcategorybyid) | **GET** /api/Category/{id} | |
|[**searchCategories**](#searchcategories) | **GET** /api/Category/search | |
|[**updateCategory**](#updatecategory) | **PUT** /api/Category/{id} | |

# **createCategory**
> createCategory()


### Example

```typescript
import {
    CategoryApi,
    Configuration,
    CategoryRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new CategoryApi(configuration);

let categoryRequest: CategoryRequest; // (optional)

const { status, data } = await apiInstance.createCategory(
    categoryRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **categoryRequest** | **CategoryRequest**|  | |


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

# **deleteCategory**
> deleteCategory()


### Example

```typescript
import {
    CategoryApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CategoryApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.deleteCategory(
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

# **filterCategories**
> filterCategories()


### Example

```typescript
import {
    CategoryApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CategoryApi(configuration);

let categoryName: string; // (optional) (default to undefined)
let pageNumber: number; // (optional) (default to undefined)
let pageSize: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.filterCategories(
    categoryName,
    pageNumber,
    pageSize
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **categoryName** | [**string**] |  | (optional) defaults to undefined|
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

# **getCategoryById**
> getCategoryById()


### Example

```typescript
import {
    CategoryApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CategoryApi(configuration);

let id: number; // (default to undefined)

const { status, data } = await apiInstance.getCategoryById(
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

# **searchCategories**
> searchCategories()


### Example

```typescript
import {
    CategoryApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new CategoryApi(configuration);

let categoryName: string; // (optional) (default to undefined)

const { status, data } = await apiInstance.searchCategories(
    categoryName
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **categoryName** | [**string**] |  | (optional) defaults to undefined|


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

# **updateCategory**
> updateCategory()


### Example

```typescript
import {
    CategoryApi,
    Configuration,
    CategoryRequest
} from './api';

const configuration = new Configuration();
const apiInstance = new CategoryApi(configuration);

let id: number; // (default to undefined)
let categoryRequest: CategoryRequest; // (optional)

const { status, data } = await apiInstance.updateCategory(
    id,
    categoryRequest
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **categoryRequest** | **CategoryRequest**|  | |
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

