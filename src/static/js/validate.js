export function isPoneAvailable(str) {
  var myreg=/^[1][3,4,5,6,7,8,9][0-9]{9}$/;
  if (!myreg.test(str)) {
      return false;
  } else {
      return true;
  }
}

export function checkLength(str, min, max) {
  return str.split('').length>=min && str.split('').length<=max
}