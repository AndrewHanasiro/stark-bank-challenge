import { InvoiceInput, Starkbank } from "../lib/starkbank";

export class InvoiceUsecase {
  constructor() {}
  async sendInvoice(dataList: InvoiceInput[]) {
    const starkbank = await Starkbank.getInstance();
    await starkbank.createInvoice(dataList);
  }
}
