import { IMoneyAmount } from './types';

export class CreateOrderDto {
  amount!: IMoneyAmount;
  description!: string | null;
  returnUrl?: string | null;
  failReturnUrl?: string | null;
  customData?: string | null;
  externalId!: string;
  timeoutSeconds?: number;
  customerTelegramUserId!: number;
}

export class GetOrderListDto {
  offset!: number;
  count!: number;
}
