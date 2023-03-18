export type AtmCurrency = {
  currency: Currencies.ILS | Currencies.USD | Currencies.EUR;
  bills: AtmCurrencyAmount[];
  coins: AtmCurrencyAmount[];
  total: number;
};

export type AtmCurrencyAmount = {
  value: string;
  amount: number;
};

export type AtmCurrencyResult = { [key: string]: number };

export type AtmResult = {
  result: {
    bills: AtmCurrencyResult[];
    coins: AtmCurrencyResult[];
  };
};

export enum Currencies {
  ILS = "ILS",
  USD = "USD",
  EUR = "EUR",
}

export enum MoneyOptions {
  BILLS = "Bills",
  COINS = "Coins",
}
