export const encode = (isi) => {
  var data = isi;
  data = data.replace(/ {10}/g, ":s10:");
  data = data.replace(/ {9}/g, ":s9:");
  data = data.replace(/ {8}/g, ":s8:");
  data = data.replace(/ {7}/g, ":s7:");
  data = data.replace(/ {6}/g, ":s6:");
  data = data.replace(/ {5}/g, ":s5:");
  data = data.replace(/ {4}/g, ":s4:");
  data = data.replace(/ {3}/g, ":s3:");
  data = data.replace(/ {2}/g, ":s2:");
  data = data.replace(/ /g, ":s1:");
  data = data.replace(/\n\n\n\n\n/g, ":x5:");
  data = data.replace(/\n\n\n\n/g, ":x4:");
  data = data.replace(/\n\n\n/g, ":x3:");
  data = data.replace(/\n\n/g, ":x2:");
  data = data.replace(/\n/g, ":x1:");
  return data;
};

export const getAbjad = (nama_band) => {
  let lowerCase = nama_band.toLowerCase()
  let intValue = lowerCase.charCodeAt(0)
  if (intValue < 48) {
    return 0
  } else if (intValue < 97) {
    return 1
  } else {
    return intValue - 95
  }
}