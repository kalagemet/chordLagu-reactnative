export const decode = (isi) => {
  var data = isi;
  data = data.replace(/Gb/g, "F#");
  data = data.replace(/Ab/g, "G#");
  data = data.replace(/Bb/g, "A#");
  data = data.replace(/Db/g, "C#");
  data = data.replace(/Eb/g, "D#");
  data = data.replace(/A:s1:([a-z])/g, "a:s1:$1");
  data = data.replace(/:([A-Z])(.*?):/g, ":<span>$1$2</span>:");
  data = data.replace(
    /:s10:/g,
    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
  );
  data = data.replace(
    /:s9:/g,
    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
  );
  data = data.replace(
    /:s8:/g,
    "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;"
  );
  data = data.replace(/:s7:/g, "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
  data = data.replace(/:s6:/g, "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
  data = data.replace(/:s5:/g, "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;");
  data = data.replace(/:s4:/g, "&nbsp;&nbsp;&nbsp;&nbsp;");
  data = data.replace(/:s3:/g, "&nbsp;&nbsp;&nbsp;");
  data = data.replace(/:s2:/g, "&nbsp;&nbsp;");
  data = data.replace(/:s1:/g, "&nbsp;");
  data = data.replace(/:x5:/g, "<br><br><br><br><br>");
  data = data.replace(/:x4:/g, "<br><br><br><br>");
  data = data.replace(/:x3:/g, "<br><br><br>");
  data = data.replace(/:x2:/g, "<br><br>");
  data = data.replace(/:x1:/g, "<br>");
  return data;
};
