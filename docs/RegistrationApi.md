# swagger_client.RegistrationApi

All URIs are relative to *https://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**register_post**](RegistrationApi.md#register_post) | **POST** /register | Create new registration


# **register_post**
> register_post(registration=registration)

Create new registration

### Example
```python
from __future__ import print_function
import time
import swagger_client
from swagger_client.rest import ApiException
from pprint import pprint

# create an instance of the API class
api_instance = swagger_client.RegistrationApi()
registration = swagger_client.RegistrationRequest() # RegistrationRequest | The registration to create. (optional)

try:
    # Create new registration
    api_instance.register_post(registration=registration)
except ApiException as e:
    print("Exception when calling RegistrationApi->register_post: %s\n" % e)
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **registration** | [**RegistrationRequest**](RegistrationRequest.md)| The registration to create. | [optional] 

### Return type

void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

