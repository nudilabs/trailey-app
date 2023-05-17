import { config as serverConfig } from '../configs/server';

export class Covalent {
  private readonly endPointUrl: string;
  private readonly apiToken: string;

  constructor(apiToken: string) {
    this.apiToken = apiToken;
    this.endPointUrl = serverConfig.covalent.url;
  }

  private async fetchFromCovalent(url: string) {
    let headers = new Headers();
    headers.set('Authorization', 'Basic ' + btoa(this.apiToken));
    try {
      return await fetch(url, { method: 'GET', headers });
    } catch (e) {
      console.log('error from covalent');
      console.log(e);
    }
  }

  public async getWalletTxsByPage(
    chainName: string,
    walletAddr: string,
    page: number
  ) {
    console.log('fetch getWalletTxsByPage', page);
    const url = `${this.endPointUrl}${chainName}/address/${walletAddr}/transactions_v3/page/${page}/`;
    const res = await this.fetchFromCovalent(url);
    try {
      // console.log('res status', res?.status);
      const data = await res?.json();
      return { data, page };
    } catch (e) {
      console.log('error from getWalletTxsByPage');
      console.log(e);
    }
  }

  public async getWalletRecentTxs(chainName: string, walletAddr: string) {
    const url = `${this.endPointUrl}${chainName}/address/${walletAddr}/transactions_v3/`;
    const res = await this.fetchFromCovalent(url);
    try {
      const data = await res?.json();
      return data;
    } catch (e) {
      console.log('error from getRecentTxs');
      console.log(e);
    }
  }
}
