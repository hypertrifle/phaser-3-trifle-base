/**
 *
 * @export
 * @class DataUtils
 */
export default class DataUtils {
  static encode(stringInput: string) {
  return encodeURIComponent(window.btoa(stringInput));
  }

  static quickHash(length: number = 10, letterList: string = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789") {

    let text: string = "";
    for (let i = 0; i < length; i++)
    text += letterList.charAt(Math.floor(Math.random() * letterList.length));

    return text;

  }

  static reduceToDiff(orginal_object:any, new_object : any) {

      

  }

  static getTokenForKey(key: string) {
    let stored = localStorage.getItem(key);

    if (stored === null || stored === "") {
      stored = this.quickHash(10);
      localStorage.setItem(key, stored);
    }

    return stored;

  }
}
