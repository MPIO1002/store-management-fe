# OrderResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **number** |  | [optional] [default to undefined]
**customerName** | **string** |  | [optional] [default to undefined]
**employeeName** | **string** |  | [optional] [default to undefined]
**totalAmount** | **number** |  | [optional] [default to undefined]
**discountAmount** | **number** |  | [optional] [default to undefined]
**status** | **string** |  | [optional] [default to undefined]
**orderDate** | **string** |  | [optional] [default to undefined]
**listItem** | [**Array&lt;OrderItemResponse&gt;**](OrderItemResponse.md) |  | [optional] [default to undefined]

## Example

```typescript
import { OrderResponse } from './api';

const instance: OrderResponse = {
    id,
    customerName,
    employeeName,
    totalAmount,
    discountAmount,
    status,
    orderDate,
    listItem,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
