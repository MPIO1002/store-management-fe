# PagedResponseInventoryResponse


## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**items** | [**Array&lt;InventoryResponse&gt;**](InventoryResponse.md) |  | [optional] [default to undefined]
**pageNumber** | **number** |  | [optional] [default to undefined]
**pageSize** | **number** |  | [optional] [default to undefined]
**totalItems** | **number** |  | [optional] [default to undefined]
**totalPages** | **number** |  | [optional] [readonly] [default to undefined]
**hasPreviousPage** | **boolean** |  | [optional] [readonly] [default to undefined]
**hasNextPage** | **boolean** |  | [optional] [readonly] [default to undefined]

## Example

```typescript
import { PagedResponseInventoryResponse } from './api';

const instance: PagedResponseInventoryResponse = {
    items,
    pageNumber,
    pageSize,
    totalItems,
    totalPages,
    hasPreviousPage,
    hasNextPage,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
