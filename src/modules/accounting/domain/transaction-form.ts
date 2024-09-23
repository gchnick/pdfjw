import { Draw } from "@/src/modules/form/domain/draw";
import { Form } from "@/src/modules/form/domain/form";
import { FolderStore } from "@/src/modules/jwform/folder-store";
import { Pdf } from "@/src/modules/jwform/pdf";
import { toLocaleDateString } from "@/src/modules/shared/domain/date";
import { FileName } from "@/src/modules/shared/domain/file-name";

import { mapper } from "./mapper";
import { TransactionRecord } from "./schema";

export class TransactionForm extends Draw implements Form {
  static formName: FileName = FileName.fromValue("S-24.pdf");
  static md5 = "f8fc2a3345e648a07d80e3184ae79aea";
  readonly #locale: Intl.LocalesArgument;
  readonly #data: TransactionRecord;

  constructor({
    folder,
    bufferEncode,
    data,
    locale,
  }: {
    folder: FolderStore;
    bufferEncode: BufferEncoding;
    data: TransactionRecord;
    locale: Intl.LocalesArgument;
  }) {
    super(
      new Pdf({ folder, fileName: TransactionForm.formName, bufferEncode }),
    );
    this.#locale = locale;
    this.#data = data;
  }

  async fill(): Promise<Uint8Array> {
    await this.createDocument();
    for (const [key, value] of Object.entries(this.#data)) {
      let setting = mapper[key];
      if (typeof value === "string" && key === "type") {
        setting = mapper[this.#data.type];
        const SVG_PATH_DONE =
          "m9.55 18-5.7-5.7 1.425-1.425L9.55 15.15l9.175-9.175L20.15 7.4Z";
        this.drawSvgPath(setting.point, SVG_PATH_DONE);
      }

      if (value instanceof Date && key === "date") {
        await this.drawText(
          toLocaleDateString(value, this.#locale),
          setting.point,
        );
      }

      if (typeof value === "string" && key !== "type" && key !== "date") {
        await this.drawTextWithSetting(value, setting);
      }

      if (
        !(value instanceof Date) &&
        typeof value !== "number" &&
        typeof value !== "string" &&
        key === "otherTransactions"
      ) {
        const descriptonSetting = mapper["otherTransactionsDescription"];
        const amountSetting = mapper["otherTransactionsAmount"];
        for (const [index, { amount, description }] of value.entries()) {
          const amountText = amount.toString();

          await this.drawTextWithSetting(description, descriptonSetting, index);
          await this.drawTextWithSetting(amountText, amountSetting, index);
        }
      }
    }

    const setting = mapper["total"];
    const total = this.#data.total.toString();
    await this.drawTextWithSetting(total, setting);

    return await this.document.save();
  }
}
