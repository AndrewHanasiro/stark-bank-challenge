import { readFile } from "fs/promises";

import * as starkbank from "starkbank";

export type InvoiceInput = {
  amount: number;
  name: string;
};

const FEE_SERVICE = 0.9;
export class Starkbank {
  private static instance: Starkbank;
  private constructor() {}

  static async getInstance() {
    if (!Starkbank.instance) {
      Starkbank.instance = new Starkbank();
      await Starkbank.instance.setup();
    }
    return Starkbank.instance;
  }

  private async setup() {
    let privateKey;
    try {
      privateKey = await readFile("certs/privateKey.pem", "utf8");
    } catch (err) {
      throw new Error(`Error reading the key: ${err}`);
    }

    let user = new starkbank.Project({
      environment: "sandbox",
      id: "6322127129018368",
      privateKey,
    });
    starkbank.setUser(user);
  }

  async createInvoice(dataList: InvoiceInput[]) {
    const invoiceFormatted = dataList.map((data) => this.prepareInvoice(data));
    let invoices = await starkbank.invoice.create(
      invoiceFormatted as starkbank.Invoice[],
    );
    for (let invoice of invoices) {
      console.log(invoice);
    }
  }

  private prepareInvoice({
    amount,
    name,
  }: InvoiceInput): Partial<starkbank.Invoice> {
    const today = new Date();
    today.setDate(today.getDate() + 21);
    const isoString = today.toISOString();
    const dueDate = isoString.replace("Z", "000+00:00");
    return {
      amount,
      due: dueDate,
      taxId: "012.345.678-90",
      name,
      expiration: 123456789,
      fine: 2.5,
      interest: 1.0,
      discounts: [
        {
          percentage: 10,
          due: dueDate,
        },
      ],
      tags: [],
      descriptions: [],
      rules: [],
      // fee: 10,
      splits: [],
      // pdf: "",
      // link: "",
      // nominalAmount: 0,
      // fineAmount: 0,
      // interestAmount: 0,
      // discountAmount: 0,
      // id: "",
      // brcode: "",
      // status: "",
      // transactionIds: [],
      // created: formatter.format(today),
      // updated: formatter.format(today),
    };
  }

  async transfer(data: starkbank.Event) {
    const amount =
      (data.log as starkbank.invoice.Log).invoice.amount * FEE_SERVICE;
    let transfers = await starkbank.transfer.create([
      {
        amount: Math.round(amount),
        bankCode: "20018183",
        branchCode: "0001",
        accountNumber: "6341320293482496",
        taxId: "20.018.183/0001-80",
        name: "Stark Bank S.A.",
      } as starkbank.Transfer,
    ]);
    for (let tranf of transfers) {
      console.log(tranf);
    }
  }
}
