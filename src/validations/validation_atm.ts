import { AtmCurrency, Currencies, MoneyOptions } from "../types/type_atm";

export const MAX_AMOUNT_OF_WITHDRAWAL: number = 2000;
export const MAX_OF_COINS: number = 50;

export const isCurrencyExist = (
  currency: string,
  atm: AtmCurrency[]
): boolean => {
  const atmByCurrency = atm.find((item) => item.currency === currency);
  return !!atmByCurrency;
};

export const isValidCurrency = (currency: string): boolean => {
  if (!currency || currency === null || currency === undefined) return false;
  return (
    currency === Currencies.ILS ||
    currency === Currencies.USD ||
    currency === Currencies.EUR
  );
};

export const isValidType = (type: string): boolean => {
  return type === MoneyOptions.BILLS || type === MoneyOptions.COINS;
};

export const isEnoghtMoney = (
  amount: number,
  atmCurrency: AtmCurrency
): boolean => {
  return amount <= atmCurrency.total;
};

export const isMaxAmount = (amount: number): boolean => {
  return amount <= MAX_AMOUNT_OF_WITHDRAWAL;
};
