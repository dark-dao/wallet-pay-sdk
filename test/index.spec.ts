import fetch from 'node-fetch';

import { WalletPaySDK } from '../src';
import {
  IResponse,
  ICreateOrderResponse,
  IGetOrderPreviewResponse,
  IGetOrderAmountResponse,
  IGetOrderListResponse,
  IResponseError,
  IWebhookRequestSign,
  IWebhookRequest,
} from '../src/types';

import {
  createOrderFixture,
  createOrderResponseFixture,
  getOrderPreviewResponseFixture,
  getOrderAmountResponseFixture,
  getOrderListFixture,
  getOrderListResponse,
  webhookSuccessFixture,
  webhookFailedFixture,
} from './fixtures';

const { Response } = jest.requireActual('node-fetch');
jest.mock('node-fetch', () => jest.fn());

describe('WalletPaySDK', () => {
  describe('createOrder', () => {
    const expectedResponse: ICreateOrderResponse = createOrderResponseFixture;
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      new Response(JSON.stringify(expectedResponse))
    );

    it('success', async () => {
      // @ts-ignore
      const response: IResponse<ICreateOrderResponse> = await new WalletPaySDK({
        apiKey: 'TEST_KEY',
      }).createOrder(createOrderFixture);
      expect(createOrderResponseFixture?.status).toEqual(
        response.response?.status
      );
    });

    it('without apiKey', async () => {
      const sdk = new WalletPaySDK({
        apiKey: '',
      });
      // @ts-ignore
      const result: IResponseError = await sdk.createOrder(createOrderFixture);
      expect(result?.error).toEqual(new Error('apiKey is not defined!'));
    });

    it('set timeoutSeconds', () => {
      const timeoutSeconds = 22345;
      const sdk = new WalletPaySDK({
        apiKey: 'TEST_KEY',
        timeoutSeconds,
      });
      expect(sdk.initOptions.timeoutSeconds).toEqual(timeoutSeconds);
    });
  });

  describe('getPreviewOrder', () => {
    const orderId = '123333889230';
    const fixture = { ...getOrderPreviewResponseFixture };
    fixture.data.id = orderId;
    const expectedResponse: IGetOrderPreviewResponse = {
      ...fixture,
    };
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      new Response(JSON.stringify(expectedResponse))
    );

    it('success', async () => {
      // @ts-ignore
      const response: IResponse<IGetOrderPreviewResponse> =
        await new WalletPaySDK({
          apiKey: 'TEST_KEY',
        }).getPreviewOrder(orderId);
      expect(fixture?.data.id).toEqual(response.response?.data?.id);
    });

    it('without apiKey', async () => {
      const sdk = new WalletPaySDK({
        apiKey: '',
      });
      // @ts-ignore
      const result: IResponseError = await sdk.getPreviewOrder(orderId);
      expect(result?.error).toEqual(new Error('apiKey is not defined!'));
    });
  });

  describe('getOrderAmount', () => {
    const expectedResponse: IGetOrderAmountResponse = {
      ...getOrderAmountResponseFixture,
    };
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      new Response(JSON.stringify(expectedResponse))
    );

    it('success', async () => {
      // @ts-ignore
      const response: IResponse<IGetOrderAmountResponse> =
        await new WalletPaySDK({
          apiKey: 'TEST_KEY',
        }).getOrderAmount();
      expect(getOrderAmountResponseFixture?.data.totalAmount).toEqual(
        response.response?.data.totalAmount
      );
    });

    it('without apiKey', async () => {
      const sdk = new WalletPaySDK({
        apiKey: '',
      });
      // @ts-ignore
      const result: IResponseError = await sdk.getOrderAmount();
      expect(result?.error).toEqual(new Error('apiKey is not defined!'));
    });
  });

  describe('getOrderList', () => {
    const expectedResponse: IGetOrderListResponse = {
      ...getOrderListResponse,
    };
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      new Response(JSON.stringify(expectedResponse))
    );

    it('success', async () => {
      // @ts-ignore
      const response: IResponse<IGetOrderListResponse> = await new WalletPaySDK(
        {
          apiKey: 'TEST_KEY',
        }
      ).getOrderList(getOrderListFixture);
      expect(getOrderListResponse?.data.items[0].externalId).toEqual(
        response.response?.data?.items[0].externalId
      );
    });

    it('without apiKey', async () => {
      const sdk = new WalletPaySDK({
        apiKey: '',
      });
      // @ts-ignore
      const result: IResponseError = await sdk.getOrderList(
        getOrderListFixture
      );
      expect(result?.error).toEqual(new Error('apiKey is not defined!'));
    });
  });
  describe('webhookVerifyHash', () => {
    it('is valid', () => {
      const localSign = 'oOgfOumUekI9EST5H7KaaKEMgTWXb08VqI5K3NCros8=';

      const sdk = new WalletPaySDK({
        apiKey: 'TEST_KEY',
      });
      const request: IWebhookRequest = {
        body: webhookSuccessFixture,
        originalUrl: 'https://example.com/api/wallet-pay/webhook',
        method: 'POST',
      };
      const sign: IWebhookRequestSign = {
        timestamp: '168824905680291',
        signature: localSign,
      };
      // @ts-ignore
      const result: boolean = sdk.webhookVerifyHash(request, sign);
      expect(result).toEqual(true);
    });
  });

  it('not valid', () => {
    const localSign = 'notValidSingHash';

    const sdk = new WalletPaySDK({
      apiKey: 'TEST_KEY',
    });
    const request: IWebhookRequest = {
      body: webhookFailedFixture,
      originalUrl: 'https://example.com/api/wallet-pay/webhook',
      method: 'POST',
    };
    const sign: IWebhookRequestSign = {
      timestamp: '168824905680291',
      signature: localSign,
    };
    // @ts-ignore
    const result: boolean = sdk.webhookVerifyHash(request, sign);
    expect(result).toEqual(false);
  });

  it('without apiKey', () => {
    const localSign = 'notValidSingHash';

    const sdk = new WalletPaySDK({
      apiKey: '',
    });
    const request: IWebhookRequest = {
      body: webhookSuccessFixture,
      originalUrl: 'https://example.com/api/wallet-pay/webhook',
      method: 'POST',
    };
    const sign: IWebhookRequestSign = {
      timestamp: '168824905680291',
      signature: localSign,
    };
    // @ts-ignore
    const result: IResponseError = sdk.webhookVerifyHash(request, sign);
    expect(result?.error).toEqual(new Error('apiKey is not defined!'));
  });
});
