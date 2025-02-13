"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const handleDuplicateKeyError = (err, res) => {
    const field = Object.keys(err.keyValue)[0];
    const code = 400;
    let errors = {};
    errors[field] = `An account with that ${field} already exists.`;
    res.status(code).send(errors);
};
//handle field formatting, empty fields, and mismatched passwords
const handleValidationError = (err, res) => {
    let errors = {};
    Object.keys(err.errors).forEach((key) => {
        errors[key] = err.errors[key].message;
    });
    res.status(400).send(errors);
};
//error controller function
exports.default = (err, req, res) => {
    try {
        console.log("congrats you hit the error middleware", err);
        if (err.name === "ValidationError")
            return (err = handleValidationError(err, res));
        if (err.code && err.code == 11000)
            return (err = handleDuplicateKeyError(err, res));
        throw "error";
    }
    catch (err) {
        console.log(err);
        res.status(500).send("An unknown error occurred.");
    }
};
