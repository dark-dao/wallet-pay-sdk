import { CreateOrderDto, GetOrderListDto } from '../src/dto';
import {
  IMoneyAmount,
  ECurrencyCode,
  ICreateOrderResponse,
  ECreateOrderRequestStatus,
  IGetOrderPreviewResponse,
  IGetOrderAmountResponse,
  IGetOrderListResponse,
  IOrderReconciliationList,
  IOrderPreview,
  EOrderStatus,
  EResponseStatus,
  IWebhook,
  EWebhookOrderType,
  IWebhookPayload,
} from '../src/types';

export const amountFixture: IMoneyAmount = {
  currencyCode: ECurrencyCode.USD,
  amount: '123.78',
};

export const createOrderFixture: CreateOrderDto = {
  amount: amountFixture,
  description: '',
  returnUrl: '',
  failReturnUrl: '',
  customData: '',
  externalId: '51679b31-49a5-40a9-bc1a-4e6a8d6674b3',
  timeoutSeconds: 60 * 60 * 3,
  customerTelegramUserId: 1123421,
};

export const orderPreviewFixture: IOrderPreview = {
  id: '2703383946',
  status: EOrderStatus.ACTIVE,
  number: '9aeb581c',
  amount: amountFixture,
  createdDateTime: new Date(),
  expirationDateTime: new Date(new Date().setHours(new Date().getHours() + 4)),
  completedDateTime: new Date(),
  payLink: 'https://t.me/wallet?startattach=wpay_order_2703383946854401',
  directPayLink:
    'https://t.me/wallet/start?startapp=wpay_order-orderId__2703383946854401',
};

export const createOrderResponseFixture: ICreateOrderResponse = {
  status: ECreateOrderRequestStatus.SUCCESS,
  message: '',
  data: orderPreviewFixture,
};

export const getOrderPreviewResponseFixture: IGetOrderPreviewResponse = {
  status: EResponseStatus.SUCCESS,
  message: '',
  data: orderPreviewFixture,
};

export const getOrderAmountResponseFixture: IGetOrderAmountResponse = {
  status: EResponseStatus.SUCCESS,
  message: '',
  data: {
    totalAmount: 5422,
  },
};

const items: IOrderReconciliationList = [
  {
    id: '1233242342342',
    status: EOrderStatus.ACTIVE,
    amount: amountFixture,
    externalId: '51679b31-49a5-40a9-bc1a-4e6a8d6674b3',
    customerTelegramUserId: 12332123,
    createdDateTime: new Date(),
    expirationDateTime: new Date(
      new Date().setHours(new Date().getHours() + 4)
    ),
    paymentDateTime: new Date(),
    selectedPaymentOption: {
      amount: amountFixture,
      amountFee: amountFixture,
      amountNet: amountFixture,
      exchangeRate: '',
    },
  },
];

export const getOrderListResponse: IGetOrderListResponse = {
  status: EResponseStatus.SUCCESS,
  message: '',
  data: {
    items,
  },
};

export const getOrderListFixture: GetOrderListDto = {
  offset: 0,
  count: 100,
};

export const webhookPayloadSuccess: IWebhookPayload = {
  id: 112342322,
  number: '123324',
  externalId: '51679b31-49a5-40a9-bc1a-4e6a8d6674b3',
  customData: '',
  orderAmount: amountFixture,
  selectedPaymentOption: '',
  orderCompletedDateTime: new Date('Sat Aug 19 2023 14:54:53 GMT+0300'),
};

export const webhookPayloadFailed: IWebhookPayload = {
  status: EOrderStatus.EXPIRED,
  id: 112342322,
  number: '123324',
  externalId: '51679b31-49a5-40a9-bc1a-4e6a8d6674b3',
  customData: '',
  orderAmount: amountFixture,
  orderCompletedDateTime: new Date('Sat Aug 19 2023 14:54:53 GMT+0300'),
};

export const webhookSuccessFixture: IWebhook = {
  eventDateTime: new Date('Sat Aug 19 2023 14:54:53 GMT+0300'),
  eventId: 1123123,
  type: EWebhookOrderType.ORDER_PAID,
  payload: webhookPayloadFailed,
};

export const webhookFailedFixture: IWebhook = {
  eventDateTime: new Date('Sat Aug 19 2023 14:54:53 GMT+0300'),
  eventId: 1123123,
  type: EWebhookOrderType.ORDER_FAILED,
  payload: webhookPayloadFailed,
};
