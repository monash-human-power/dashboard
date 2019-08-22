function removeCapitalLetter(inputString) {
  return inputString.charAt(0).toLowerCase() + inputString.slice(1);
}

module.exports = {
  removeCapitalLetter,
};
