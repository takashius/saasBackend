const handleDuplicateKeyError = (err: any, res: any) => {
  const field = Object.keys(err.keyValue)[0];
  const code = 400;
  let errors = {};
  errors[field] = `An account with that ${field} already exists.`;
  res.status(code).send(errors);
};

//handle field formatting, empty fields, and mismatched passwords
const handleValidationError = (err: any, res: any) => {
  let errors = {};

  Object.keys(err.errors).forEach((key) => {
    errors[key] = err.errors[key].message;
  });

  res.status(400).send(errors);
};

//error controller function
export default (err: any, req: any, res: any) => {
  try {
    console.log("congrats you hit the error middleware", err);
    if (err.name === "ValidationError")
      return (err = handleValidationError(err, res));
    if (err.code && err.code == 11000)
      return (err = handleDuplicateKeyError(err, res));
    if (err.name === "custom") return res.status(400).send(err.message);
    throw "error";
  } catch (err) {
    console.log(err);
    res.status(500).send("An unknown error occurred.");
  }
};
