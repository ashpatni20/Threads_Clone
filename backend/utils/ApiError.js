class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong",
        errors = [],
    ){
        super();
        this.statusCode = statusCode;
        this.message = message;
        this.success = false;
        this.errors = errors;
        this.data = null;

    }
}

module.exports = ApiError