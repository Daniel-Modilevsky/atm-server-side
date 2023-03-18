import { AtmCurrency, Currencies } from "../../types/type_atm";

export let ATM_MOCK: AtmCurrency[] = [
  {
    currency: Currencies.ILS,
    bills: [
      { value: "200", amount: 7 },
      { value: "100", amount: 4 },
      { value: "50", amount: 0 },
      { value: "20", amount: 1 },
    ],
    coins: [
      { value: "10", amount: 0 },
      { value: "5", amount: 2 },
      { value: "1", amount: 0 },
      { value: "0.1", amount: 12 },
      { value: "0.01", amount: 21 },
    ],
    total: 1400 + 400 + 20 + 10 + 1.2 + 0.21, // 1831.41
  },
];
