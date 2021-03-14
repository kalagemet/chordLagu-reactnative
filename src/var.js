let server = "https://app.desalase.id";
// let server = "http://192.168.43.234";
// let server = "http://10.0.2.2";
// let server = "http://localhost";
let port = "";

let conn = server + port;

//fetch adress
export const terbaru = conn + "/terbaru";
export const populer = conn + "/populer";

export const abjad = (index, page) => {
  return conn + "/abjad?index=" + index + "&page=" + (page + 1);
};

export const band = (string, page) => {
  return conn + "/band?string=" + string + "&page=" + (page + 1);
};

export const lagu = (index, page) => {
  return conn + "/lagu?band=" + index + "&page=" + (page + 1);
};

export const cari = (string, page) => {
  return conn + "/cari?string=" + string + "&page=" + (page + 1);
};

export const chordLagu = (id) => {
  return conn + "/chord/" + id;
};

export const laguTerkait = (id) => {
  return conn + "/terkait/" + id;
};
