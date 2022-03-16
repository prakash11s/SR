import moment from "moment";

export const readableDate = (Date: string) => {
  return moment(Date).format("DD-MM-YYYY");
};
export const readableDateTime = (Date: string) => {
  return moment(Date).format("DD-MM-YYYY hh:mm");
};
export const readableDateTimeLocale = (Date: string, Format: string) => {
  let formattedDate = "-";
  if (Date && Format) {
    formattedDate = moment(Date).format(Format);
  }
  return formattedDate;
};
// sort objects based on keys
export const sortObjectOnKeys = (data: any) => {
  let sortedData = {};
  let sort = Object.keys(data).sort((a, b) => {
    if (a > b) return 1;
    if (a < b) return -1;
    return 0;
  });
  sort.forEach((item) => {
    sortedData[item] = data[item];
  });
  return sortedData;
};

export const currencyConventor = (amount, currencyCode = "EUR", locale = "nl")=>{
  var formatter = new Intl.NumberFormat(locale,{
    style: 'currency',
    currency: currencyCode || 'EUR',
  })
  return formatter.format(amount)
}

export const formatPrice = (price: number | string) => {
  if (price === "GRATIS" || price === "FREE") {
    return price;
  }
  if (price && price.toString().length > 2) {
    const priceStr = price.toString();
    return (
      priceStr.slice(0, priceStr.length - 2) +
      "," +
      priceStr.slice(priceStr.length - 2)
    );
  } else if (price) {
    return price;
  }
  return "0,00";
};
