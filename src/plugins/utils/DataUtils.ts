/**
 *
 * @export
 * @class DataUtils
 */
export default class DataUtils {
  static poop(e?: number): string {
    return "poop";
  }

  static encode(stringInput:string) {
	
		return encodeURIComponent(window.btoa(stringInput));
	}
}
