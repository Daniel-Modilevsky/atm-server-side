import {
  AtmCurrency,
  AtmCurrencyAmount,
  AtmCurrencyResult,
  AtmResult,
  Currencies,
  MoneyOptions,
} from "../types/type_atm";
import {
  ConflictException,
  TooMuchCoinsException,
  UnSupportedTypeException,
} from "../validations/erros";
import {
  isCurrencyExist,
  isEnoghtMoney,
  isMaxAmount,
  isValidCurrency,
  isValidType,
  MAX_AMOUNT_OF_WITHDRAWAL,
  MAX_OF_COINS,
} from "../validations/validation_atm";

export const updateAtmCurrencyTotal = (atmCurrency: AtmCurrency) => {
  // Atm is passed By reference so it updates the currency total
  let total = 0;
  total += atmCurrency.bills.reduce(
    (acc, item) => acc + item.amount * parseFloat(item.value),
    0
  );
  total += atmCurrency.coins.reduce(
    (acc, item) => acc + item.amount * parseFloat(item.value),
    0
  );
  atmCurrency.total = total;
};

export const convertToFloat = (amount: string): number => {
  let tempNumer = parseFloat(parseFloat(amount).toFixed(2));
  return tempNumer;
};

export const checkPurchaseAmount = (
  bills: AtmCurrencyResult[],
  coins: AtmCurrencyResult[]
): number => {
  let totalAmount: number = 0;
  totalAmount += bills.reduce((acc, curr) => {
    const value = Object.values(curr)[0];
    acc += value;
    return acc;
  }, 0);
  totalAmount += coins.reduce((acc, curr) => {
    const value = Object.values(curr)[0];
    acc += value;
    return acc;
  }, 0);
  return totalAmount;
};

export const getMapOfCoins = (
  atmMoneyList: AtmCurrencyAmount[],
  moneyAmount: number
) => {
  let resultMap = new Map<string, number>();
  let itemAlreadyExist = false;
  let tempNumer: number = 0;
  atmMoneyList.forEach((money) => {
    tempNumer = parseFloat(parseFloat(money.value).toFixed(1));

    while (moneyAmount >= tempNumer && moneyAmount != 0 && money.amount > 0) {
      moneyAmount = parseFloat((moneyAmount - tempNumer).toFixed(2));
      money.amount--;
      itemAlreadyExist = resultMap.has(money.value);
      if (!itemAlreadyExist) {
        resultMap.set(money.value, 1);
      } else {
        resultMap.set(money.value, (resultMap.get(money.value) || 0) + 1);
      }
    }
  });
  return { resultMap, moneyAmount };
};

/**
 * This function work after all validations.
 */
export const updateCurrency = (
  currency: string,
  type: string,
  value: number,
  amount: number,
  atm: AtmCurrency[]
) => {
  const currentCurrencyIndex = atm.findIndex(
    (item) => item.currency === currency
  );
  const stringValue = value.toString();
  atm[currentCurrencyIndex].total += value * amount;
  if (type === MoneyOptions.BILLS) {
    if (
      atm[currentCurrencyIndex].bills.find((item) => item.value === stringValue)
    ) {
      const valueIndex = atm[currentCurrencyIndex].bills.findIndex(
        (item) => item.value === stringValue
      );
      atm[currentCurrencyIndex].bills[valueIndex].amount =
        atm[currentCurrencyIndex].bills[valueIndex].amount + amount;
    } else {
      atm[currentCurrencyIndex].bills.push({
        value: stringValue,
        amount: amount,
      });
    }
  } else {
    if (
      atm[currentCurrencyIndex].bills.find((item) => item.value === stringValue)
    ) {
      const valueIndex = atm[currentCurrencyIndex].coins.findIndex(
        (item) => item.value === stringValue
      );
      atm[currentCurrencyIndex].coins[valueIndex].amount =
        atm[currentCurrencyIndex].coins[valueIndex].amount + amount;
    } else {
      atm[currentCurrencyIndex].coins.push({
        value: stringValue,
        amount: amount,
      });
    }
  }
};

/**
 * This function work after all validations.
 */
export const createAndUpdateCurrency = (
  currency: string,
  type: string,
  value: number,
  amount: number,
  atm: AtmCurrency[]
) => {
  const stringValue = value.toString();
  let newCurrency: AtmCurrency = {
    currency: currency as Currencies,
    bills: [],
    coins: [],
    total: value * amount,
  };
  if (type === MoneyOptions.BILLS) {
    newCurrency.bills.push({ value: stringValue, amount: amount });
  } else {
    newCurrency.coins.push({ value: stringValue, amount: amount });
  }
  atm.push(newCurrency);
};

/**
 * This is the main function of the atm that calculates the total value of the response.
 * The priority is as follows:
 * 1. First check if we have enogh money in the atm with this currency.
 * 2. Give bills first, from high to low.
 * 3. Give coins if there is not enogh, from high to low.
 *
 * @param atm - The atm object that we managed.
 * @param moneyAmount - The amount of money that the user want.
 * @param currency - The type of currency that the user want.
 *
 * edge case 1 - coin is bigger than bills.
 * edge case 2 - not enough money in the atm.
 * edge case 3 - bills are enough to finish the order.
 * edge case 4 - there is no enough amount of spetcific coins to complete the purchase (amount < total && notEnoughCoins).
 *
 * validation 1 - don't have the currency.
 * validation 2 - don't have enough money.
 * validation 3 - maximum withdrawal is reached.
 * validation 4 - maximum amount of coins is reached.
 */
export const withdrawal = (
  currency: string,
  amount: number,
  atm: AtmCurrency[]
) => {
  if (!isMaxAmount(amount))
    throw new TooMuchCoinsException(
      `The max valid amount is ${MAX_AMOUNT_OF_WITHDRAWAL}`
    );
  if (!isCurrencyExist(currency, atm))
    throw new UnSupportedTypeException(
      `The currency ${currency} does not exist.`
    );
  const atmByCurrency = atm.find((item) => item.currency === currency);
  if (!isEnoghtMoney(amount, atmByCurrency))
    throw new ConflictException(
      `There is not enough ${currency} to pay ${amount} ${currency}.`
    );
  let atmResult: AtmResult = {
    result: {
      bills: [],
      coins: [],
    },
  };
  // Bills with priority on coins
  const billsRes = getMapOfCoins(atmByCurrency.bills, amount);
  const amountThatLeft = billsRes.moneyAmount;
  // [...billsRes.resultMap.entries()] -> [["200", 1], ["100", 1]]
  // [...Object.fromEntries(billsRes.resultMap)] -> [{"100": 1, "200": 1}]
  // [...billsRes.resultMap.entries()].map(innerArr => ({ [innerArr[0]]: innerArr[1] })) -> need [{"200", 1}, {"100", 1}]

  atmResult.result.bills = [...billsRes.resultMap.entries()].map(
    (innerArr) => ({ [innerArr[0]]: innerArr[1] })
  );
  if (amountThatLeft === 0) {
    return atmResult;
  }
  const coinsRes = getMapOfCoins(atmByCurrency.coins, amountThatLeft);
  atmResult.result.coins = [...coinsRes.resultMap.entries()].map(
    (innerArr) => ({ [innerArr[0]]: innerArr[1] })
  );
  const enoughCoins = coinsRes.moneyAmount;

  if (
    checkPurchaseAmount(atmResult.result.bills, atmResult.result.coins) >
    MAX_OF_COINS
  )
    throw new TooMuchCoinsException(
      `We don't support withdrawal with amount of coins that bigger then ${MAX_AMOUNT_OF_WITHDRAWAL}.`
    );

  if (enoughCoins > 0)
    throw new ConflictException(
      `There is not enough amount of coints or bills to complete payment of ${amount} ${currency}.`
    );
  return atmResult;
};

/**
 * This function allow adding more currencies and update amounts of the exist ones.
 * The priority is as follows:
 * 1. First check if the currency exists in the atm, if not add it.
 * 2. Second check if the currency have the new value, if not ad it and if yes update the amount.
 *
 * validation 1 - don't have the currency.
 * validation 2 - not valid currency.
 * validation 3 - not valid type.
 * validation 4 - not valid amount or value.
 */
export const addToCurrency = (
  currency: string,
  type: string,
  value: number,
  amount: number,
  atm: AtmCurrency[]
) => {
  if (!isValidCurrency(currency))
    throw new UnSupportedTypeException(
      `The currency ${currency} is not one of systems currencies.`
    );
  if (!isValidType(type))
    throw new UnSupportedTypeException(
      `The type ${type} is not one of money types.`
    );

  if (isCurrencyExist(currency, atm)) {
    updateCurrency(currency, type, value, amount, atm);
  } else {
    createAndUpdateCurrency(currency, type, value, amount, atm);
  }
  return atm;
};
