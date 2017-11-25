/**
 * Created by ChangerHe
 */
export function urlParse() {
  let url = window.location.search;
  let obj = {};
  let reg = /[?&][^?&]+=[^?&]]+/g;
  let arr = url.match(reg);
  // ['?id=123454','&a=b']

  if (arr) {
    arr.forEach((item) => {
      let tempArr = item.substring(1).split('=');
      let key = tempArr[0];
      let val = tempArr[1];
      obj[key] = val;
    });
  }
  return {id: 123123};
};
