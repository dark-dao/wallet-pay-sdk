# wallet-pay-sdk

SDK for using WalletPay API - https://docs.wallet.tg/pay/

Supported API methods list:
https://pay.wallet.tg/wpay/store-api/v1/order
https://pay.wallet.tg/wpay/store-api/v1/order/preview
https://pay.wallet.tg/wpay/store-api/v1/reconciliation/order-list
https://pay.wallet.tg/wpay/store-api/v1/reconciliation/order-amount

There is also a method to check the hash of a webhook

```js
import { WalletPaySDK } from 'wallet-pay-sdk';
import { CreateOrderDto, GetOrderListDto } from 'wallet-pay-sdk/lib/dto';

import { IWebhookRequest, IWebhookRequestSign } from 'wallet-pay-sdk/lib/type'

const sdk = new WalletPaySDK({
  apiKey: 'API_KEY_FOR_WALLET_PAY',
  timeoutSeconds: 10800, // [ 30 .. 864000 ] Order TTL, if the order is not paid within the timeout period
})

const createOrderDto: CreateOrderDto = {...};
await sdk.createOrder(createOrderDto);

await sdk.getPreviewOrder(orderId: string | number);

const getOrderListDto: GetOrderListDto = {...};
await sdk.getOrderList(getOrderListDto);

await sdk.getOrderAmount();

const update: IWebhookRequest = {...}
const signParams: IWebhookRequestSign = {...}
sdk.webhookVerifyHash(update: IWebhookRequest, signParams: IWebhookRequestSign)

```