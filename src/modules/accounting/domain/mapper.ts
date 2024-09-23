import type { Mapper } from "@/src/modules/form/domain/types";

import { Aligned, Padding } from "@/src/modules/form/domain/types";

export const mapper: Mapper = {
  date: { point: { x: 85, y: 43 } },
  donation: { point: { x: 362, y: 43 } },
  pay: { point: { x: 178, y: 43 } },
  cashAvance: { point: { x: 178, y: 56 } },
  cashBoxDeposit: { point: { x: 362, y: 56 } },
  worldwideWorkDonations: {
    point: { x: 45, y: 90 },
    aligned: Aligned.RIGHT,
  },
  congregationExpenses: {
    point: { x: 45, y: 104 },
    aligned: Aligned.RIGHT,
  },
  otherTransactionsDescription: {
    point: { x: 358, y: 119 },
    padding: [{ type: Padding.TOP, value: 14 }],
  },
  otherTransactionsAmount: {
    point: { x: 45, y: 119 },
    padding: [{ type: Padding.TOP, value: 14 }],
    aligned: Aligned.RIGHT,
  },
  total: {
    point: { x: 45, y: 161 },
    aligned: Aligned.RIGHT,
  },
};
