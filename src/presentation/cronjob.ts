import { CronJob } from "cron";
import { InvoiceUsecase } from "../usecase/send_invoice";
import { randEmail, randFloat, randFullName, randNumber } from "@ngneat/falso";

const NUMBER_OF_INVOICES = 1;

const CRONTAB =
  process.env.NODE === "development" ? "* * * * *" : "0 */3 * * *";

const job = new CronJob(
  CRONTAB,
  async function () {
    const usecase = new InvoiceUsecase();
    let dataList = [];
    for (let i = 0; i < NUMBER_OF_INVOICES; i++) {
      const data = createData();
      dataList.push(data);
    }
    await usecase.sendInvoice(dataList);
  },
  null,
  true,
  "America/Sao_Paulo",
);

job.start();

function createData() {
  return {
    name: randFullName(),
    email: randEmail(),
    amount: randNumber({ min: 0 }),
  };
}
