# wallet-pay-sdk
> Package for using Wallet Pay API https://docs.wallet.tg/pay/

[![NPM Version][npm-image]][npm-url]
[![Downloads Stats][npm-downloads]][npm-url]
[![Last commit][last-update]][last-update]

<p align="center">
  <img src="https://storage.yandexcloud.net/test-file-storage/telegram-bots/wallet-pay/SDK-preview.gif" width="240">
</p>

## Supported endpoints

Create order [/wpay/store-api/v1/order][createOrderEndpoint]

Get order preview [/wpay/store-api/v1/order/preview][getPreview]

Get order list [/wpay/store-api/v1/reconciliation/order-list][getOrderList]

Get order amount [/wpay/store-api/v1/reconciliation/order-amount][getOrderAmount]

## Installation

```sh
npm i wallet-pay-sdk --save
```

## Usage examples

### init wallet pay sdk 
```js
import { WalletPaySDK } from 'wallet-pay-sdk';
const wp = new WalletPaySDK({
  apiKey: 'secret_api_key',
  timeoutSeconds: 60 * 60 * 3, // Default value = Order TTL, if the order is not paid within the timeout period
});
...
```

### create new order
[/wpay/store-api/v1/order][createOrderEndpoint]
```js
import { WalletPaySDK } from 'wallet-pay-sdk';
import { CreateOrderDto } from 'wallet-pay-sdk/lib/dto';
import { ECurrencyCode, ICreateOrderResponse, IResponseError } from 'wallet-pay-sdk/lib/type';

const wp = new WalletPaySDK({
  apiKey: 'secret_api_key',
  timeoutSeconds: 60 * 60 * 3, // Default value = Order TTL, if the order is not paid within the timeout period
});

const newOrder: CreateOrderDto = {
  amount: {
    currencyCode: ECurrencyCode.TON,
    amount: '10.67',
  },
  description: 'My first order', // Description of the order
  returnUrl: 'https://example.com', //  Url to redirect after paying order
  failReturnUrl: 'https://example.com', // Url to redirect after unsuccessful order completion (expiration/cancelation/etc)
  externalId: '5cfaf283-8242-4ddd-ae00-c9ecd6966245',
  // timeoutSeconds: 200000; // If you want, you can override the value of the "timeoutSeconds" variable here
  customerTelegramUserId: 12238398, // The customer's telegram id (User_id)
};

const response: ICreateOrderResponse | IResponseError =
  await wp.createOrder(newOrder);
```

### get order preview
[/wpay/store-api/v1/order/preview][getPreview]
```js
import { WalletPaySDK } from 'wallet-pay-sdk';
import { IGetOrderPreviewResponse, IResponseError } from 'wallet-pay-sdk/lib/type';

const wp = new WalletPaySDK({
  apiKey: 'secret_api_key',
  timeoutSeconds: 60 * 60 * 3, // Default value = Order TTL, if the order is not paid within the timeout period
});

const orderId = '10797500785491970';
const response: IGetOrderPreviewResponse | IResponseError = await wp.getPreviewOrder(orderId)
```

### get order list
[/wpay/store-api/v1/reconciliation/order-list][getOrderList]
```js
import { WalletPaySDK } from 'wallet-pay-sdk';
import { GetOrderListDto } from 'wallet-pay-sdk/lib/dto';
import { IGetOrderListResponse, IResponseError } from 'wallet-pay-sdk/lib/type';

const wp = new WalletPaySDK({
  apiKey: 'secret_api_key',
  timeoutSeconds: 60 * 60 * 3, // Default value = Order TTL, if the order is not paid within the timeout period
});

const params: GetOrderListDto = {
  offset: 0, // Specifying the amount of excluded from a response the first N orders
  count: 10, // Specifying the limit of orders for the request
};
const response: IGetOrderListResponse | IResponseError =
  await wp.getOrderList({ offset, count });
```

### get order amount
[/wpay/store-api/v1/reconciliation/order-amount][getOrderAmount]
```js
import { WalletPaySDK } from 'wallet-pay-sdk';
import { IGetOrderAmountResponse, IResponseError } from 'wallet-pay-sdk/lib/type';

const wp = new WalletPaySDK({
  apiKey: 'secret_api_key',
  timeoutSeconds: 60 * 60 * 3, // Default value = Order TTL, if the order is not paid within the timeout period
});

const response: IGetOrderAmountResponse | IResponseError =
  await wp.getOrderAmount();
```

### webhook hashes verification
```js
import { WalletPaySDK } from 'wallet-pay-sdk';
import { IWebhook, IWebhookRequest, IWebhookRequestSign, IResponseError } from 'wallet-pay-sdk/lib/type';

const wp = new WalletPaySDK({
  apiKey: 'secret_api_key',
  timeoutSeconds: 60 * 60 * 3, // Default value = Order TTL, if the order is not paid within the timeout period
});

/**
 * Most of the data described below comes
 * when Wallet Pay calls your endpoint.
 * Only two parameters depend on you:
 * - originalUrl
 * - method
 */
const update: IWebhookRequest = {
  body: IWebhook[], // request body you can see type 'IWebhook' in types file
  originalUrl: '/api/wallet-pay/webhook', // URI path exactly the same as set in the personal account
  method: 'POST',
}

const signParams: IWebhookRequestSign = {
  timestamp: '168824905680291', // HEADER: 'WalletPay-Timestamp'
  signature: 'B7gy92BjFxILVctGG32fWBDEy4WW5iGzWs1kziNFGys', // HEADER: 'WalletPay-Signature'
}
const result: boolean | IResponseError = wp.webhookVerifyHash(update, signParams)
// if return TRUE - webhook call is verificated
```

<!-- Markdown link & img dfn's -->
[npm-image]: https://img.shields.io/npm/v/wallet-pay-sdk.svg?style=flat-square
[npm-url]: https://www.npmjs.com/package/wallet-pay-sdk
[npm-downloads]: https://img.shields.io/npm/dm/wallet-pay-sdk.svg?style=flat-square
[last-update]: https://img.shields.io/github/last-commit/dark-dao/wallet-pay-sdk/main
[createOrderEndpoint]: https://docs.wallet.tg/pay/#tag/Order/operation/create
[getPreview]: https://docs.wallet.tg/pay/#tag/Order/operation/getPreview
[getOrderList]: https://docs.wallet.tg/pay/#tag/Order-Reconciliation/operation/getOrderList
[getOrderAmount]: https://docs.wallet.tg/pay/#tag/Order-Reconciliation/operation/getOrderAmount
