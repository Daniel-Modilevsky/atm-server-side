import { withdrawal, updateAtmCurrencyTotal } from "../utils/atmUtils";
import {
  ConflictException,
  TooMuchCoinsException,
  UnSupportedTypeException,
} from "../validations/erros";
import { ATM_MOCK } from "./mocks/mock_data";

describe("Testing atm cashing responses", () => {
  let atm = [];

  beforeEach(() => {
    ATM_MOCK.forEach((currencyItem) => {
      if (currencyItem) atm.push({ ...currencyItem });
    });
  });

  test("Testing sucess purches", () => {
    const atmILS = { ...atm[0] };
    updateAtmCurrencyTotal(atmILS);
    const res1 = withdrawal("ILS", 300, atm);
    const res2 = withdrawal("ILS", 10, atm);
    const res3 = withdrawal("ILS", 501, atm);
    const res4 = withdrawal("ILS", 1000, atm);

    const result1 = {
      result: { bills: [{ "200": 1 }, { "100": 1 }], coins: [] },
    };
    const result2 = { result: { bills: [], coins: [{ "5": 2 }] } };
    const result3 = {
      result: { bills: [{ "200": 2 }, { "100": 1 }], coins: [{ "0.1": 10 }] },
    };
    // Becouse it is updated it is not 5 of 200
    const result4 = {
      result: { bills: [{ "200": 4 }, { "100": 2 }], coins: [] },
    };

    expect(res1).toStrictEqual(result1);
    expect(res2).toStrictEqual(result2);
    expect(res3).toStrictEqual(result3);
    expect(res4).toStrictEqual(result4);
    updateAtmCurrencyTotal(atmILS);
  });

  test("Testing failed purches", () => {
    const atm = [...ATM_MOCK];
    updateAtmCurrencyTotal(atm[0]);

    expect(() => withdrawal("ILS", 2000, atm)).toThrow(
      new ConflictException("There is not enough ILS to pay 2000 ILS.")
    );
    expect(() => withdrawal("USD", 10, atm)).toThrow(
      new UnSupportedTypeException("The currency USD does not exist.")
    );
    expect(() => withdrawal("ILS", 14, atm)).toThrow(
      new ConflictException(
        "There is not enough amount of coints or bills to complete payment of 14 ILS."
      )
    );
    expect(() => withdrawal("ILS", 2001, atm)).toThrow(
      new TooMuchCoinsException("The max valid amount is 2000")
    );
  });

  test.skip("Testing run out of money", () => {
    const atmILS = { ...atm[0] };
    updateAtmCurrencyTotal(atmILS);

    const res1 = withdrawal("ILS", 1826, atm);
    const res2 = withdrawal("ILS", 10, atm);

    const result1 = {
      result: {
        bills: [{ "200": 7 }, { "100": 4 }, { "20": 1 }],
        coins: [{ "5": 1 }, { "0.1": 10 }],
      },
    };
    const result2 =
      "There is not enough amount of coints or bills to complete payment of 10 ILS.";
    expect(res1).toStrictEqual(result1);
    expect(res2).toStrictEqual(result2);
    updateAtmCurrencyTotal(atmILS);
  });
});
