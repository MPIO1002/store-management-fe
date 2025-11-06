# OrderRequest


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**customerId** | **number** |  | [optional] [default to undefined]
**userId** | **number** |  | [optional] [default to undefined]
**promotionId** | **number** |  | [optional] [default to undefined]
**date** | **string** |  | [optional] [default to undefined]
**paymentMethod** | [**PaymentMethod**](PaymentMethod.md) |  | [optional] [default to undefined]
**totalAmount** | **number** |  | [optional] [default to undefined]
**discountAmount** | **number** |  | [optional] [default to undefined]
**orderStatus** | [**OrderStatus**](OrderStatus.md) |  | [optional] [default to undefined]
**listItems** | [**Array&lt;OrderItemRequest&gt;**](OrderItemRequest.md) |  | [optional] [default to undefined]

## Example

```typescript
import { OrderRequest } from './api';

const instance: OrderRequest = {
    customerId,
    userId,
    promotionId,
    date,
    paymentMethod,
    totalAmount,
    discountAmount,
    orderStatus,
    listItems,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
