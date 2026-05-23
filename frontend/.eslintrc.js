module.exports = {
  env: {
    es6: true,
    browser: true,
    jest: true
  },
  extends: ["react-app"],
  rules: {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
};
