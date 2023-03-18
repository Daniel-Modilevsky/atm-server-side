import { addToCurrency } from "../utils/atmUtils";
import { Currencies, MoneyOptions } from "../types/type_atm";
import { ATM_MOCK } from "./mocks/mock_data";
import { UnSupportedTypeException } from "../validations/erros";

describe("Testing atm adding and updating", () => {
  let atm = [...ATM_MOCK];

  test("Testing sucess adding", () => {
    const res1 = addToCurrency(
      Currencies.USD,
      MoneyOptions.BILLS,
      100,
      10,
      atm
    );
    const result1 = [
      {
        bills: [
          { amount: 7, value: "200" },
          { amount: 4, value: "100" },
          { amount: 0, value: "50" },
          { amount: 1, value: "20" },
        ],
        coins: [
          { amount: 0, value: "10" },
          { amount: 2, value: "5" },
          { amount: 0, value: "1" },
          { amount: 12, value: "0.1" },
          { amount: 21, value: "0.01" },
        ],
        currency: "ILS",
        total: 1831.41,
      },
      {
        bills: [{ amount: 10, value: "100" }],
        coins: [],
        currency: "USD",
        total: 1000,
      },
    ];
    expect(res1).toStrictEqual(result1);

    const res2 = addToCurrency(Currencies.EUR, MoneyOptions.BILLS, 50, 5, atm);
    const result2 = [
      {
        bills: [
          { amount: 7, value: "200" },
          { amount: 4, value: "100" },
          { amount: 0, value: "50" },
          { amount: 1, value: "20" },
        ],
        coins: [
          { amount: 0, value: "10" },
          { amount: 2, value: "5" },
          { amount: 0, value: "1" },
          { amount: 12, value: "0.1" },
          { amount: 21, value: "0.01" },
        ],
        currency: "ILS",
        total: 1831.41,
      },
      {
        bills: [{ amount: 10, value: "100" }],
        coins: [],
        currency: "USD",
        total: 1000,
      },
      {
        bills: [{ amount: 5, value: "50" }],
        coins: [],
        currency: "EUR",
        total: 250,
      },
    ];
    expect(res2).toStrictEqual(result2);
  });
  test("Testing sucess update", () => {
    const res1 = addToCurrency(
      Currencies.USD,
      MoneyOptions.BILLS,
      100,
      10,
      atm
    );
    const result1 = [
      {
        bills: [
          { amount: 7, value: "200" },
          { amount: 4, value: "100" },
          { amount: 0, value: "50" },
          { amount: 1, value: "20" },
        ],
        coins: [
          { amount: 0, value: "10" },
          { amount: 2, value: "5" },
          { amount: 0, value: "1" },
          { amount: 12, value: "0.1" },
          { amount: 21, value: "0.01" },
        ],
        currency: "ILS",
        total: 1831.41,
      },
      {
        bills: [{ amount: 20, value: "100" }],
        coins: [],
        currency: "USD",
        total: 2000,
      },
      {
        bills: [{ amount: 5, value: "50" }],
        coins: [],
        currency: "EUR",
        total: 250,
      },
    ];
    expect(res1).toStrictEqual(result1);
  });
  test("Testing failed adding", () => {
    expect(() =>
      addToCurrency("dummy", MoneyOptions.BILLS, 100, 10, atm)
    ).toThrow(
      new UnSupportedTypeException(
        "The currency dummy is not one of systems currencies."
      )
    );
    expect(() => addToCurrency(Currencies.USD, "dummy", 100, 10, atm)).toThrow(
      new UnSupportedTypeException("The type dummy is not one of money types.")
    );
  });
});
