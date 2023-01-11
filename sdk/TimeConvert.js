const TimeConvert = (d) => {
  let minutes = Math.floor(d / 60);
  let seconds = d - minutes * 60;
  let proSec = parseInt(seconds);

  if (proSec < 10) {
    return `${minutes}:0${parseInt(seconds)}`;
  } else {
    return `${minutes}:${parseInt(seconds)}`;
  }
};

export default TimeConvert;
