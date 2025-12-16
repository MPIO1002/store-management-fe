# PromotionApi

All URIs are relative to *http://localhost*

|Method | HTTP request | Description|
|------------- | ------------- | -------------|
|[**getAllPromotions**](#getallpromotions) | **GET** /api/Promotion | |

# **getAllPromotions**
> ResponseIEnumerablePromotionResponse getAllPromotions()


### Example

```typescript
import {
    PromotionApi,
    Configuration
} from './api';

const configuration = new Configuration();
const apiInstance = new PromotionApi(configuration);

let minOrderAmount: number; // (optional) (default to 0)

const { status, data } = await apiInstance.getAllPromotions(
    minOrderAmount
);
```

### Parameters

|Name | Type | Description  | Notes|
|------------- | ------------- | ------------- | -------------|
| **minOrderAmount** | [**number**] |  | (optional) defaults to 0|


### Return type

**ResponseIEnumerablePromotionResponse**

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

