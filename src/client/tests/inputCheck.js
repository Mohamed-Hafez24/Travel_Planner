function checkInput(leavingFrom, destination) {
  let urlRGEX = /^[a-zA-Z\s]{0,255}$/;
  if (urlRGEX.test(leavingFrom) && urlRGEX.test(destination)) {
    return
  } else {
    alert("please enter a valid name");
  }
}

export { checkInput }