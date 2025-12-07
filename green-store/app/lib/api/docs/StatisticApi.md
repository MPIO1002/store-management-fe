# StatisticApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getDailyRevenue**](#getdailyrevenue) | **GET** /api/Statistic/revenue | |
|[**getTopSellerProduct**](#gettopsellerproduct) | **GET** /api/Statistic/top-seller/{top} | |

# **getDailyRevenue**
> ResponseIEnumerableRevenueResponse getDailyRevenue()


### Example

```typescript
import {
    StatisticApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StatisticApi(configuration);

let year: number; // (optional) (default to undefined)
let month: number; // (optional) (default to undefined)
let day: number; // (optional) (default to undefined)

const { status, data } = await apiInstance.getDailyRevenue(
    year,
    month,
    day
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **year** | [**number**] |  | (optional) defaults to undefined|
| **month** | [**number**] |  | (optional) defaults to undefined|
| **day** | [**number**] |  | (optional) defaults to undefined|


### Return type

**ResponseIEnumerableRevenueResponse**

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

# **getTopSellerProduct**
> ResponseIEnumerableTopSellerProductResponse getTopSellerProduct()


### Example

```typescript
import {
    StatisticApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new StatisticApi(configuration);

let top: number; // (default to 5)

const { status, data } = await apiInstance.getTopSellerProduct(
    top
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **top** | [**number**] |  | defaults to 5|


### Return type

**ResponseIEnumerableTopSellerProductResponse**

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

