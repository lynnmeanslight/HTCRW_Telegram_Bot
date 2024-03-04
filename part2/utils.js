export function modifyExchangeRate(rawString) {
  if (rawString.includes(",")) {
    const num = parseFloat(rawString.split(",").join(""));
    return num;
  }
  return parseFloat(rawString);
}

export function checkCrypto(cryptoNameList, targetCrypto, cryptoPriceList) {
  let cryptoName = "";
  const result = {}
  cryptoNameList.forEach((element) => {
    if (element.includes(targetCrypto)) {
      cryptoName = element[2];
    }
  });
  for (let index = 0; index < cryptoPriceList.length; index++) {
    const element = cryptoPriceList[index];
    if (element[0] === cryptoName) {
      result.name = element[0];
      result.price = element[1];
      return result;
    }
    
  }
}
