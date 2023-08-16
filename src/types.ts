export enum ECurrencyCode {
  TON = 'TON',
  BTC = 'BTC',
  USDT = 'USDT',
  EUR = 'EUR',
  USD = 'USD',
  RUB = 'RUB',
}

export enum ECreateOrderRequestStatus {
  SUCCESS = 'SUCCESS',
  ALREADY = 'ALREADY',
  CONFLICT = 'CONFLICT',
  ACCESS_DENIED = 'ACCESS_DENIED',
}

export enum EOrderStatus {
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  PAID = 'PAID',
  CANCELLED = 'CANCELLED',
}

export interface IMoneyAmount {
  currencyCode: ECurrencyCode;
  amount: string;
}

export interface IOrderPreview {
  id: string;
  status: EOrderStatus;
  number: string;
  amount: IMoneyAmount;
  createdDateTime: Date | string;
  expirationDateTime: Date | string;
  completedDateTime: Date | string;
  payLink: string;
}

export interface OrderReconciliationItem {
  id: string;
  status: EOrderStatus;
  amount: IMoneyAmount;
  externalId: string;
  customerTelegramUserId: number;
  createdDateTime: Date | string;
  expirationDateTime: Date | string;
  paymentDateTime: Date | string;
  selectedPaymentOption: {
    amount: IMoneyAmount;
    amountFee: IMoneyAmount;
    amountNet: IMoneyAmount;
    exchangeRate: string;
  };
}

export type IOrderReconciliationList = OrderReconciliationItem[];

export interface IResponseError {
  error: any;
}

export interface ICreateOrderResponse {
  status: ECreateOrderRequestStatus;
  message: string;
  data: IOrderPreview;
}

export interface IGetOrderPreviewResponse {
  status: 'SUCCESS';
  message: string;
  data: IOrderPreview;
}

export interface IGetOrderListResponse {
  status: 'SUCCESS' | 'INVALID_REQUEST' | 'INTERNAL_ERROR';
  message: string;
  data: {
    items: IOrderReconciliationList;
  };
}
export interface IGetOrderAmountResponse {
  status: 'SUCCESS' | 'INVALID_REQUEST' | 'INTERNAL_ERROR';
  message: string;
  data: {
    totalAmount: number;
  };
}

export interface IWebhookPayload {
  // Sent if type=ORDER_FAILED
  status?: EOrderStatus;

  id: number; // order id
  number: string;
  externalId: string;
  customData: string;
  orderAmount: IMoneyAmount;

  // json {"amount": {"currencyCode": "TON","amount": "10.0"},"exchangeRate": "1.0"}
  // Sent if type=ORDER_PAID
  selectedPaymentOption?: string | undefined;

  orderCompletedDateTime: Date | string;
}

export enum EWebhookOrderType {
  ORDER_PAID = 'ORDER_PAID',
  ORDER_FAILED = 'ORDER_FAILED',
}
export interface IWebhook {
  eventDateTime: Date | string;
  eventId: number;
  type: EWebhookOrderType;
  payload: IWebhookPayload;
}

/**
 * Headers from webhook call from wallet pay
 * @prop timestamp: string - Nano time used for HMAC from header WalletPay-Timestamp
 * @prop signature: string - Base64(HmacSHA256("HTTP-method.URI-path.timestamp.Base-64-encoded-body")) from header WalletPay-Signature
 */
export interface IWebhookRequestSign {
  timestamp: string;
  signature: string;
}

export interface IWebhookRequest {
  body: IWebhook;
  originalUrl: string;
  method: string;
}
