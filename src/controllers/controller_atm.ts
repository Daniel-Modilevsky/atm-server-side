import { ATM_MOCK } from "../tests/mocks/mock_data";
import { addToCurrency, withdrawal } from "../utils/atmUtils";

export const makeWithdrawal = (req, res) => {
  try {
    const currency = req.body.currency;
    const amount = req.body.amount;
    const withdrawalResult = withdrawal(currency, parseInt(amount), ATM_MOCK);
    res.status(200).send(withdrawalResult);
  } catch (err) {
    res.status(err.statusCode).send(err.name);
  }
};

export const makeCurrencyUpdate = (req, res) => {
  try {
    const currency = req.body.currency;
    const amount = req.body.amount;
    const value = req.body.value;
    const type = req.body.type;
    const addingCurrencyResult = addToCurrency(
      currency,
      type,
      parseFloat(value),
      parseInt(amount),
      ATM_MOCK
    );
    res.status(200).send(addingCurrencyResult);
  } catch (err) {
    res.status(err.statusCode).send(err.name);
  }
};
