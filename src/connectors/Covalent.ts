import { env } from '@/env.mjs';
export class Covalent {
  private readonly endPointUrl: string;
  private readonly apiToken: string;

  constructor(apiToken: string) {
    this.apiToken = apiToken;
    this.endPointUrl = env.COVALENT_URL;
  }

  private async fetchFromCovalent(url: string) {
    let headers = new Headers();
    headers.set('Authorization', 'Basic ' + btoa(this.apiToken));
    try {
      return await fetch(url, { method: 'GET', headers });
    } catch (e) {
      console.log('error from covalent');
    }
  }

  public async getWalletTxsByPage(
    chainName: string,
    walletAddr: string,
    page: number
  ) {
    const url = `${this.endPointUrl}${chainName}/address/${walletAddr}/transactions_v3/page/${page}/`;
    const res = await this.fetchFromCovalent(url);
    try {
      const data = await res?.json();
      return { data, page };
    } catch (e) {
      console.log('error from getWalletTxsByPage');
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
    }
  }
}
