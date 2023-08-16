type TInitOptions = {
  apiKey: string;
};

export class WalletPaySDK {
  private readonly apiKey: string = '';

  constructor(opt: TInitOptions) {
    this.apiKey = opt.apiKey;
    console.log('INIT');
  }
}
