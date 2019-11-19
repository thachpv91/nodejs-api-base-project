/* eslint-disable no-param-reassign */
const debug = require('debug')('ExtendableError');

class ExtendableError extends Error {
    constructor(msg, name, status, code, data) {
        super(msg);
        msg = msg || 'Error';
        let errors;
        let message;
        let newData;

        if (msg instanceof Error) {
            message = msg.message || 'Error';

            // NOTE: This is typically to handle validation errors
            if (msg.errors) {
                errors = msg.errors;
            }
        } else if (typeof msg === 'object') {
            message = msg.message || 'Error';
            data = msg;
        } else { // message is just a string
            message = msg;
        }

        if (data) {
            newData = JSON.parse(JSON.stringify(data));
            if (newData.errors) {
                errors = newData.errors;
                delete newData.errors;
            } else if (data.errors) {
                errors = JSON.parse(JSON.stringify(data.errors));
            }
        }

        this.type = 'ExtendableError';
        this.name = name;
        this.status = status;
        this.message = message;
        this.code = code;
        this.data = newData;
        this.errors = errors || {};

        debug(`${this.name}${this.status}(${this.code}): ${this.message}`);
        debug(this.errors);

        if (Error.captureStackTrace) {
            Error.captureStackTrace(this, ExtendableError);
        } else {
            this.stack = (new Error()).stack;
        }
    }

    toJSON() {
        return {
            name: this.name,
            status: this.status,
            message: this.message,
            code: this.code,
            data: this.data,
            errors: this.errors
        }
    }
}


// 400 - Bad Request
class BadRequest extends ExtendableError {
    constructor({ code, message }, data) {
        super(message, 'BadRequest', 400, code , data);
    }
}

// 401 - Not Authenticated
class NotAuthenticated extends ExtendableError {
    constructor({ code, message }, data) {
        super(message, 'NotAuthenticated', 401, code , data);
    }
}

// 402 - Payment Error
class PaymentError extends ExtendableError {
    constructor({ code, message }, data) {
        super(message, 'PaymentError', 402, code , data);
    }
}

// 403 - Forbidden
class Forbidden extends ExtendableError {
    constructor({ code, message }, data) {
        super(message, 'Forbidden', 403, code, data);
    }
}


// 404 - Not Found
class NotFound extends ExtendableError {
    constructor({ code, message }, data) {
        super(message, 'NotFound', 404, code, data);
    }
}

// 405 - Method Not Allowed
class MethodNotAllowed extends ExtendableError {
    constructor({ code, message }, data) {
        super(message, 'MethodNotAllowed', 405, code, data);
    }
}

// 406 - Not Acceptable
class NotAcceptable extends ExtendableError {
    constructor({ code, message }, data) {
        super(message, 'NotAcceptable', 406, code, data);
    }
}

// 408 - Timeout
class Timeout extends ExtendableError {
    constructor({ code, message }, data) {
        super(message, 'Timeout', 408, code, data);
    }
}

// 409 - Conflict
class Conflict extends ExtendableError {
    constructor(message, code, data) {
        super(message, 'Conflict', 409, code, data);
    }
}

// 411 - Length Required
class LengthRequired extends ExtendableError {
    constructor(message, code, data) {
        super(message, 'LengthRequired', 411, code, data);
    }
}

// 422 Unprocessable
class Unprocessable extends ExtendableError {
    constructor(message, data) {
        super(message, 'Unprocessable', 422, 422, data);
    }
}

// 429 Too Many Requests
class TooManyRequests extends ExtendableError {
    constructor(message , data) {
        super(message, 'TooManyRequests', 429, 429, data);
    }
}

// 500 - Internal Server Error
class InternalServerError extends ExtendableError {
    constructor(message, data) {
        super(message, 'InternalServerError', 500, 500, data);
    }
}

// 500 - General Error
class GeneralError extends ExtendableError {
    constructor({ code, message }, data) {
        super(message, 'GeneralError', 500, code, data);
    }
}

// 501 - Not Implemented
class NotImplemented extends ExtendableError {
    constructor(message, data) {
        super(message, 'NotImplemented', 501, 501, data);
    }
}


// 502 - Bad Gateway
class BadGateway extends ExtendableError {
    constructor(message, data) {
        super(message, message, 'BadGateway', 502, 502, data);
    }
}

// 503 - Unavailable
class Unavailable extends ExtendableError {
    constructor(message, data) {
        super(message, 'Unavailable', 503, 503, data);
    }
}

const errors = {
    ExtendableError,
    BadRequest,
    NotAuthenticated,
    PaymentError,
    Forbidden,
    NotFound,
    MethodNotAllowed,
    NotAcceptable,
    Timeout,
    Conflict,
    LengthRequired,
    Unprocessable,
    TooManyRequests,
    InternalServerError,
    GeneralError,
    NotImplemented,
    BadGateway,
    Unavailable,
    400: BadRequest,
    401: NotAuthenticated,
    402: PaymentError,
    403: Forbidden,
    404: NotFound,
    405: MethodNotAllowed,
    406: NotAcceptable,
    408: Timeout,
    409: Conflict,
    411: LengthRequired,
    422: Unprocessable,
    429: TooManyRequests,
    500: InternalServerError,
    501: NotImplemented,
    502: BadGateway,
    503: Unavailable
};

const convert = (error) => {
    if (!error) {
        return error;
    }

    const extendableError = errors[error.name];
    const result = extendableError
        ? new ExtendableError(error.message, error.data)
        : new Error(error.message || error);

    if (typeof error === 'object') {
        Object.assign(result, error);
    }

    return result;
}

export default { ...errors, convert};
