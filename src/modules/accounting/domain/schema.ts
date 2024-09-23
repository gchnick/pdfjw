import { z } from "zod";

import { TransactionType } from "./types";

const amount = z.number().min(1).max(9_999_999);

export const transactionRecordSchema = z.object({
  date: z.coerce.date().transform(s => new Date(s)),
  type: z.nativeEnum(TransactionType),
  worldwideWorkDonations: z.number().optional(),
  congregationExpenses: z.number().optional(),
  otherTransactions: z
    .array(
      z.object({
        description: z.string().min(1).max(200),
        amount,
      }),
    )
    .max(3)
    .optional(),
  total: amount,
});

export type TransactionRecord = z.infer<typeof transactionRecordSchema>;
