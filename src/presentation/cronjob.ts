import { CronJob } from "cron";
import { InvoiceUsecase } from "../usecase/send_invoice";
import { randEmail, randFloat, randFullName, randNumber } from "@ngneat/falso";

const NUMBER_OF_INVOICES = 1;


const job = new CronJob(
//   "0 */3 * * *", // Schedule task to run at minute 0 past every 3rd hour (e.g., 00:00, 03:00, 06:00...)
  "* * * * *", // For testing for every minute
  async function () {
    const usecase = new InvoiceUsecase();
    let dataList = []
    for (let i = 0; i < NUMBER_OF_INVOICES; i++) {
      const data = createData();
      dataList.push(data)
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
