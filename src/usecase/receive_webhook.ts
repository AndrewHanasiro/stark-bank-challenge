import { Event } from "starkbank";
import { Starkbank } from "../lib/starkbank";

export abstract class WebhookUsecase {
  static getType(event: Event) {
    // See possible values here: https://starkbank.com/docs/api#webhook
    console.log(event)
    switch (event.subscription) {
      case "transfer":
        return new TransferWebhookUsecase();
      case "invoice":
        return new InvoiceWebhookUsecase();
      case "deposit":
        return new DepositWebhookUsecase();
      default:
        throw new Error("Invalid event type");
    }
  }
  abstract process(data: Event): Promise<void>;
}

class TransferWebhookUsecase extends WebhookUsecase {
  async process(): Promise<void> {
    console.log("Processing transfer webhook event");
  }
}

class InvoiceWebhookUsecase extends WebhookUsecase {
  async process(data: Event): Promise<void> {
    const starkbank = await Starkbank.getInstance();
    await starkbank.transfer(data);
  }
}

class DepositWebhookUsecase extends WebhookUsecase {
  async process(): Promise<void> {
    console.log("Processing invoice webhook event");
  }
}
