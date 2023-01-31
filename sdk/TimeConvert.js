export const TimeConvert = (d) => {
  let minutes = Math.floor(d / 60);
  let seconds = d - minutes * 60;
  let proSec = parseInt(seconds);

  if (proSec < 10) {
    return `${minutes}:0${parseInt(seconds)}`;
  } else {
    return `${minutes}:${parseInt(seconds)}`;
  }
};

export const TimeConvertMil = (millis) => {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
};
