const CleanName = (t, st = false) => {
  let tt = "";
  // TODO: When st is true return the full text
  if (t.length >= 30 && !st) {
    tt = t.replace(".mp3", "").substring(0, 30) + "...";
  } else if (st) {
    tt = t.replace(".mp3", "");
  } else {
    tt = t.replace(".mp3", "");
  }

  return tt.replace(/_/g, " ");
};

export default CleanName;
