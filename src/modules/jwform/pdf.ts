import { existsSync, readFileSync } from "node:fs";
import path from "node:path";

import * as CryptoJS from "crypto-js";

import {
  FileNotFound,
  NoIntegrityForm,
} from "@/src/modules/form/domain/errors";
import { InvalidArgumentError } from "@/src/modules/shared/domain/errors";
import { FileName } from "@/src/modules/shared/domain/file-name";
import { StringValueObject } from "@/src/modules/shared/domain/value-object/string-value-object";

import { FolderStore } from "./folder-store";

export const isBase64Valid =
  /^(?:[\d+/A-Za-z]{4})*(?:[\d+/A-Za-z]{4}|[\d+/A-Za-z]{3}=|[\d+/A-Za-z]{2}={2})$/;

export class Pdf extends StringValueObject {
  constructor({
    folder,
    fileName,
    bufferEncode,
  }: {
    folder: FolderStore;
    fileName: FileName;
    bufferEncode: BufferEncoding;
  }) {
    if (!bufferEncode && !path) {
      Pdf.#throwInvalidArgumentError();
    }

    const pathFile = path.join(folder.value, fileName.value);

    Pdf.#ensurePdfFileExists(pathFile);
    const value = readFileSync(pathFile, { encoding: bufferEncode });

    super(value);
  }

  static #ensurePdfFileExists(value: string) {
    if (!existsSync(value)) {
      throw FileNotFound(`The file form -> <${value}> is not fount`);
    }
  }

  static #throwInvalidArgumentError() {
    throw new InvalidArgumentError("Constructor with arguments invalid");
  }

  ensureMD5IsCorrect(md5: string, formName: FileName) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    const MD5 = CryptoJS.MD5(this.value).toString();
    if (MD5 !== md5) {
      throw NoIntegrityForm(`The form <${formName.value}> is invalid`);
    }
  }
}
