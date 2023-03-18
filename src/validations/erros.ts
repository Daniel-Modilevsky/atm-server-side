const httpStatusCodes = {
  OK: 200,
  BAD_REQUEST: 400,
  CONFLICT: 409,
  CONTENT_TOO_BIG: 413,
  UNSUPPORTED_TYPE: 415,
};

class BaseError extends Error {
  statusCode: number;

  constructor(name: string, statusCode: number) {
    super(name);
    Object.setPrototypeOf(this, new.target.prototype);
    this.name = name;
    this.statusCode = statusCode;
  }
}

export class TooMuchCoinsException extends BaseError {
  constructor(name, statusCode = httpStatusCodes.CONTENT_TOO_BIG) {
    super(name, statusCode);
  }
}

export class UnSupportedTypeException extends BaseError {
  constructor(name, statusCode = httpStatusCodes.UNSUPPORTED_TYPE) {
    super(name, statusCode);
  }
}

export class ConflictException extends BaseError {
  constructor(name, statusCode = httpStatusCodes.CONFLICT) {
    super(name, statusCode);
  }
}

export const errorManager = (statusCodde: number, res, message) => {
  if (statusCodde === 409) return res.status(409).send(message);
};
