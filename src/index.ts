/* eslint-disable no-useless-catch */
import fetch from 'node-fetch';
import { createHmac } from 'crypto';

import { CreateOrderDto, GetOrderListDto } from './dto';
import {
  IResponseError,
  ICreateOrderResponse,
  IGetOrderPreviewResponse,
  IGetOrderListResponse,
  IGetOrderAmountResponse,
  IWebhookRequestSign,
  IWebhookRequest,
} from './types';

type TInitOptions = {
  apiKey: string;
  timeoutSeconds?: number | 10800; // 10800 = 60 * 60 * 3 = 3 hours
};

export class WalletPaySDK {
  private apiUrl = 'https://pay.wallet.tg/';
  initOptions: TInitOptions;

  constructor(opt: TInitOptions) {
    this.initOptions = opt;
  }

  private getHeaders(): { [key: string]: string } {
    const apiHeaders = {
      'Wpay-Store-Api-Key': this.initOptions.apiKey,
      'Content-Type': 'application/json',
    };
    return apiHeaders;
  }

  /**
   * @param dto Create an order
   * POST https://pay.wallet.tg/wpay/store-api/v1/order
   *
   * @param {IMoneyAmount} dto.amount       *required                            Amount of order
   * @type {IMoneyAmount}
   * {
   *   currencyCode: ECurrencyCode;
   *   amount: string;
   * }
   * @type {ECurrencyCode} {
   *   TON = 'TON',
   *   BTC = 'BTC',
   *   USDT = 'USDT',
   *   EUR = 'EUR',
   *   USD = 'USD',
   *   RUB = 'RUB',
   * }
   * @param {string | null} dto.description *required  [ 5 .. 100 ] characters   Description of the order
   * @param {string | null} returnUrl                  <= 255 characters         Url to redirect after paying order
   * @param {string | null} failReturnUrl              <= 255 characters         Url to redirect after unsuccessful order completion (expiration/cancelation/etc)
   * @param {string | null} customData                 <= 255 characters         Any custom string, will be provided through webhook and order status polling
   * @param {string} externalId             *required  <= 255 characters         Order ID in Merchant system. Use to prevent orders duplication due to request retries
   * @param {number} timeoutSeconds                    [ 30 .. 864000 ]          Default value = Order TTL, if the order is not paid within the timeout period
   * @param {number} customerTelegramUserId *required                            The customer's telegram id (User_id). For more details please follow the link https://core.telegram.org/bots/api#available-types
   */
  async createOrder(
    dto: CreateOrderDto
  ): Promise<ICreateOrderResponse | IResponseError> {
    try {
      if (!this.initOptions.apiKey)
        return { error: new Error('apiKey is not defined!') };

      const url = `${this.apiUrl}wpay/store-api/v1/order`;
      const method = 'POST';
      const headers: { [key: string]: string } = this.getHeaders();
      const body: CreateOrderDto = {
        ...dto,
        timeoutSeconds: dto.timeoutSeconds || this.initOptions?.timeoutSeconds,
      };
      const response = await fetch(url, {
        method,
        headers,
        body: JSON.stringify(body),
      });
      const data = await response.json();
      return data as ICreateOrderResponse;
    } catch (error) {
      return { error };
    }
  }

  /**
   * Create an order
   * POST https://pay.wallet.tg/wpay/store-api/v1/order/preview?id=${orderId}
   *
   * @param {string | number} orderId *required - Order id
   */
  async getPreviewOrder(
    orderId: string | number
  ): Promise<IGetOrderPreviewResponse | IResponseError> {
    try {
      if (!this.initOptions.apiKey)
        return { error: new Error('apiKey is not defined!') };

      const url = `${this.apiUrl}wpay/store-api/v1/order/preview?id=${orderId}`;
      const method = 'GET';
      const headers: { [key: string]: string } = this.getHeaders();
      const response = await fetch(url, {
        method,
        headers,
      });
      const data = await response.json();
      return data as IGetOrderPreviewResponse;
    } catch (error) {
      return { error };
    }
  }

  /**
   * @param dto Return list of store orders sorted by creation time in ascending order
   * GET wpay/store-api/v1/reconciliation/order-list
   *
   * @param {number} dto.offset *required >= 0 Specifying the amount of excluded from a response the first N orders
   * @param {number} dto.count  *required [ 0 .. 10000 ] Specifying the limit of orders for the request
   *
   * @returns
   * @type {IGetOrderListResponse}
   * @property IGetOrderListResponse.status: 'SUCCESS' | 'INVALID_REQUEST' | 'INTERNAL_ERROR'  Operation result status, always present
   * @property IGetOrderListResponse.message: string;                                          Verbose reason of non-success result
   * @property IGetOrderListResponse.data: {                                                   Response payload, present if status is SUCCESS
   *   @property items: IOrderReconciliationList[];
   * }
   */
  async getOrderList(
    dto: GetOrderListDto
  ): Promise<IGetOrderListResponse | IResponseError> {
    try {
      if (!this.initOptions.apiKey)
        return { error: new Error('apiKey is not defined!') };

      const url = `${this.apiUrl}wpay/store-api/v1/reconciliation/order-list?offset=${dto.offset}&count=${dto.count}`;
      const method = 'GET';
      const headers: { [key: string]: string } = this.getHeaders();
      const response = await fetch(url, {
        method,
        headers,
      });
      const data = await response.json();
      return data as IGetOrderListResponse;
    } catch (error) {
      return { error };
    }
  }

  /**
   * Return Store orders amount
   * GET wpay/store-api/v1/reconciliation/order-amount
   *
   * @returns
   * @type {IGetOrderAmountResponse}
   * @property IGetOrderAmountResponse.status: 'SUCCESS' | 'INVALID_REQUEST' | 'INTERNAL_ERROR'  Operation result status, always present
   * @property IGetOrderAmountResponse.message: string                                           Verbose reason of non-success result
   * @property IGetOrderAmountResponse.data: {
   *  @property totalAmount: number;                                                             Store orders total amount
   * }
   */
  async getOrderAmount(): Promise<IGetOrderAmountResponse | IResponseError> {
    try {
      if (!this.initOptions.apiKey)
        return { error: new Error('apiKey is not defined!') };

      const url = `${this.apiUrl}wpay/store-api/v1/reconciliation/order-amount`;
      const method = 'GET';
      const headers: { [key: string]: string } = this.getHeaders();
      const response = await fetch(url, {
        method,
        headers,
      });
      const data = await response.json();
      return data as IGetOrderAmountResponse;
    } catch (error) {
      return { error };
    }
  }

  /**
   * Verifying webhook request. Return 'true' if the hash of the call and the locally generated hash are the same
   * @param update {IWebhookRequest}
   * @param signParams {IWebhookRequestSign}
   * @returns boolean
   */
  webhookVerifyHash(
    update: IWebhookRequest,
    signParams: IWebhookRequestSign
  ): boolean | IResponseError {
    try {
      if (!this.initOptions.apiKey)
        return { error: new Error('apiKey is not defined!') };

      const requestBody = JSON.stringify(update.body);

      const timestampHeaderValue = signParams.timestamp;

      const uriPath = `${update.originalUrl}`;

      const message = `${
        update.method
      }.${uriPath}.${timestampHeaderValue}.${Buffer.from(requestBody).toString(
        'base64'
      )}`;

      const hmac = createHmac('sha256', this.initOptions.apiKey);

      hmac.update(message);
      const calculatedSignature = hmac.digest('base64');
      return calculatedSignature === signParams.signature;
    } catch (error) {
      throw error;
    }
  }
}
