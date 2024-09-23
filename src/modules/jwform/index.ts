import type { ZodType } from "zod";
import type { FormData } from "./types";

import { transactionRecordSchema } from "@/src/modules/accounting/domain/schema";
import { TransactionForm } from "@/src/modules/accounting/domain/transaction-form";
import { InvalidArgumentError } from "@/src/modules/shared/domain/errors";
import { TerritoryRegistryForm } from "@/src/modules/territory/form";
import { territoryRegistrySchema } from "@/src/modules/territory/schema";

import { FolderStore } from "./folder-store";

export class JwForm {
  readonly #folder: FolderStore;
  readonly #bufferEncode: BufferEncoding;
  readonly #locale: Intl.LocalesArgument;

  constructor({
    path,
    bufferEncode = "base64",
    locale = "es-VE",
  }: {
    path: string;
    bufferEncode?: BufferEncoding;
    locale?: Intl.LocalesArgument;
  }) {
    this.#locale = locale;
    this.#folder = new FolderStore(path);
    this.#bufferEncode = bufferEncode;
  }

  async fillTerritoryRegistry({ data }: { data: FormData }) {
    const validated = await this.#ensureThatDataIsValid(
      territoryRegistrySchema,
      data,
    );

    const form = new TerritoryRegistryForm({
      folder: this.#folder,
      bufferEncode: this.#bufferEncode,
      data: validated,
      locale: this.#locale,
    });

    return await form.fill();
  }

  async fillTransactionRecord({ data }: { data: FormData }) {
    const validated = await this.#ensureThatDataIsValid(
      transactionRecordSchema,
      data,
    );

    const form = new TransactionForm({
      folder: this.#folder,
      bufferEncode: this.#bufferEncode,
      data: validated,
      locale: this.#locale,
    });

    return await form.fill();
  }

  async #ensureThatDataIsValid<T>(
    schema: ZodType<T>,
    data: string,
  ): Promise<T> {
    const dataParsed = JSON.parse(data) as T;

    const result = await schema.safeParseAsync(dataParsed);
    if (!result.success) {
      throw new InvalidArgumentError(
        "Data of territories registry in invalid",
        { cause: result.error },
      );
    }

    return result.data;
  }
}
