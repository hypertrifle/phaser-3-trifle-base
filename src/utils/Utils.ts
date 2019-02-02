export function getCookieToken(): string {
  let name = 'token=';

  let cookie = decodeURIComponent(document.cookie);
  let c = cookie.split(';');

  for (let i = 0; i < c.length; i++) {
    let char = c[i];

    while (char.charAt(0) === ' ') {
      char = char.substring(1);
    }

    if (char.indexOf(name) === 0) {
      return char.substring(name.length, char.length);
    }
  }

  return '';
}

export function hexToBase16Number(s: string): number {
  return parseInt(s.replace('#', ''), 16);
}

export function base16NumberToHex(num: number) {
  return "#" + num.toString(16);
}

export function getToken(): string {
  let token = this.getCookieToken();

  if (token === '') {
    let newToken = '';
    let possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 10; i++) {
      newToken += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
    }

    let date = new Date();
    date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));

    let expiryDate = 'expires=' + date.toUTCString();

    document.cookie = 'token=' + newToken + ';' + expiryDate + ';path=/';

    token = newToken;
  }

  return token;
}

export function getURLHashSegment(defaultValue: string = ''): string {
  let ret = defaultValue;

  if (window.location.hash.length > 1) {
    ret = window.location.hash.replace('#', '');
  }

  return ret;
}

// merges two objects properties together, this will prioritise the second objects properties to the first.
export function MergeObjectRecursive(obj1: any, obj2: any): any {
  for (let p in obj2) {
    try {
      // Property in destination object set; update its value.
      if (obj2[p].constructor === Object) {
        obj1[p] = MergeObjectRecursive(obj1[p], obj2[p]);
      } else {
        obj1[p] = obj2[p];
      }
    } catch (e) {
      // Property in destination object not set; create it and set its value.
      obj1[p] = obj2[p];
    }
  }
  return obj1;
}



export function track(action: string, label: string) {
  // @ts-ignore
  if (typeof gtag === 'function') {
    console.log('sending to google analytics', action, label);
    // @ts-ignore
    gtag('event', action, {
      'event_label': label
    });
  } else {
    console.log('not connected to tracking,', action, label);
  }

}

export function domainCheck(hostname: string) {
  for (let i = 0; i < hostname.length; i++) {
    let char = parseInt(hostname[i]);
    if (!isNaN(char)) {
      if (char === 0) {
        char = 9;
      } else {
        char--;
      }
      hostname = hostname.substr(0, i) + char + hostname.substr(i + 1);
    }

  }
  // todo IE9?
  return atob(hostname);
}





// ==========================================
//
//  ###    ###    ###    ######  ##   ##
//  ## #  # ##   ## ##     ##    ##   ##
//  ##  ##  ##  ##   ##    ##    #######
//  ##      ##  #######    ##    ##   ##
//  ##      ##  ##   ##    ##    ##   ##
//
// ==========================================

export function hextocolor(hex: string): number {
  let h = hex.substring(1);
  return parseInt(h, 16);

}

export function decode(message: string) {
  for (let i = 0; i < message.length; i++) {
    let char = parseInt(message[i]);
    if (!isNaN(char)) {
      if (char === 0) {
        char = 9;
      } else {
        char--;
      }
      message = message.substr(0, i) + char + message.substr(i + 1);
    }

  }
  return atob(message);
}

export function shuffle(array: any[]) {
  let counter = array.length;

  // While there are elements in the array
  while (counter > 0) {
    // Pick a random index
    let index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    let temp = array[counter];
    array[counter] = array[index];
    array[index] = temp;
  }

  return array;

}








export function roundPosition(gameObject: Phaser.GameObjects.Text | Phaser.GameObjects.Image | Phaser.GameObjects.Sprite) {

  // make sure position is a round number
  gameObject.x = Math.round(gameObject.x);
  gameObject.y = Math.round(gameObject.y);
  gameObject.setOrigin(Math.round(gameObject.width * gameObject.originX) / gameObject.width, Math.round(gameObject.height * gameObject.originY) / gameObject.height);
}



// draw a rounded corner rectangle
export function RoundedRect(gfx: Phaser.GameObjects.Graphics, x: number, y: number, w: number, h: number, r: number, color: string): Phaser.GameObjects.Graphics {
  return gfx;
}

export function debugSprite(scene: Phaser.Scene, x: number, y: number, w: number, h: number, color: number | string): Phaser.GameObjects.Graphics {
  // just gerneates a coloured box.
  let canvas = scene.add.graphics();
  let col: number = (typeof(color) === "string") ? hexToBase16Number(color) : color;
  canvas.fillStyle(col,1);
  canvas.fillRect(0,0,w,h);
  return canvas;
}


enum eCharType {
  UNDEFINED = -1,
  SPACE = 1,
  NEWLINE = 2,
  CHARACTER = 3,
  // SPECIAL = 4 // for future
}

export class TextWrapper {
  static mText: string;
  static mTextPosition: number;
  static mFontData: any;

  // -------------------------------------------------------------------------
  private static hasNext(): boolean {
      return TextWrapper.mTextPosition < TextWrapper.mText.length;
  }

  // -------------------------------------------------------------------------
  private static getChar(): string {
      return TextWrapper.mText.charAt(TextWrapper.mTextPosition++);
  }

  // -------------------------------------------------------------------------
  private static peekChar(): string {
      return TextWrapper.mText.charAt(TextWrapper.mTextPosition);
  }

  // -------------------------------------------------------------------------
  private static getPosition(): number {
      return TextWrapper.mTextPosition;
  }

  // -------------------------------------------------------------------------
  private static setPosition(aPosition: number): void {
      TextWrapper.mTextPosition = aPosition;
  }

  // -------------------------------------------------------------------------
  private static getCharAdvance(aCharCode: number, aPrevCharCode: number): number {
      let charData = TextWrapper.mFontData.chars[aCharCode];

      // width
      let advance: number = charData.xAdvance;

      // kerning
      if (aPrevCharCode > 0 && charData.kerning[aPrevCharCode])
          advance += charData.kerning[aPrevCharCode];

      return advance;
  }

  // -------------------------------------------------------------------------
  private static getCharType(aChar: string): eCharType {
      if (aChar === ' ')
          return eCharType.SPACE;
      else if (/(?:\r\n|\r|\n)/.test(aChar))
          return eCharType.NEWLINE;
      else
          return eCharType.CHARACTER;
  }

  // -------------------------------------------------------------------------
  static wrapText(aText: string, aWidth: number, aHeight: number, aFontName: string, aSize?: number): string[] {
      // set vars for text processing
      TextWrapper.mText = aText;
      TextWrapper.setPosition(0);
      // font data
      // TextWrapper.mFontData = PIXI.fonts[aFontName];

      // game.cache.bitmapfont.font.lineheight
      // game.cache.bitmapfont.font.size

      // if size not defined then take default size
      if (aSize === undefined)
          aSize = TextWrapper.mFontData.size;

      let scale: number = aSize / TextWrapper.mFontData.size;
      // height of line scaled
      let lineHeight: number = TextWrapper.mFontData.lineHeight * scale;
      // instead of scaling every single character we will scale line in opposite direction
      let lineWidth: number = aWidth / scale;

      // result
      let mLineStart: number[] = [];
      let mLineChars: number[] = [];
      let mPageStart: number[] = [];
      let mMaxLine: number = 0;
      let firstLineOnPage: boolean = true;
      let pageCounter: number = 0;

      // char position in text
      let currentPosition: number = 0;
      // first line position
      mLineStart[mMaxLine] = currentPosition;
      // first page
      mPageStart[pageCounter++] = 0;
      // remaining height of current page
      let remainingHeight: number = aHeight;


      // whole text
      while (TextWrapper.hasNext()) {
          let charCount: number = 0;
          // saves number of chars before last space
          let saveSpaceCharCount: number = 0;
          let saveCharPosition: number = -1;
          // (previous) type of character
          let type: eCharType = eCharType.UNDEFINED;
          let previousType: eCharType = eCharType.UNDEFINED;
          // remaining width will decrease with words read
          let remainingWidth: number = lineWidth;
          // previous char code
          let prevCharCode: number = -1;

          // single line
          while (TextWrapper.hasNext()) {
              currentPosition = TextWrapper.getPosition();
              // read char and move in text by 1 character forward
              let char: string = TextWrapper.getChar();
              // get type and code
              type = TextWrapper.getCharType(char);
              let charCode: number = char.charCodeAt(0);

              // process based on type
              if (type === eCharType.SPACE) {
                  if (previousType !== eCharType.SPACE)
                      saveSpaceCharCount = charCount;

                  ++charCount;
                  remainingWidth -= TextWrapper.getCharAdvance(charCode, prevCharCode);
              } else if (type === eCharType.CHARACTER) {
                  if (previousType !== eCharType.CHARACTER)
                      saveCharPosition = currentPosition;

                  remainingWidth -= TextWrapper.getCharAdvance(charCode, prevCharCode);

                  if (remainingWidth < 0)
                      break;

                  ++charCount;
              } else if (type === eCharType.NEWLINE) {
                  let breakLoop: boolean = false;

                   // if there is no more text then ignore new line
                  if (TextWrapper.hasNext()) {
                      breakLoop = true;
                      saveSpaceCharCount = charCount;
                      saveCharPosition = TextWrapper.getPosition();
                      currentPosition = saveCharPosition;
                      // simulate normal width overflow
                      remainingWidth = -1;
                      type = eCharType.CHARACTER;
                  }

                  if (breakLoop)
                      break;
              }

              previousType = type;
              prevCharCode = charCode;
          }


          // lines / pages
          remainingHeight -= lineHeight;
          // set new page if not enough remaining height
          if (remainingHeight < 0)
              mPageStart[pageCounter++] = mMaxLine;

          if (remainingWidth < 0 && type === eCharType.CHARACTER) {
              if (saveSpaceCharCount !== 0)
                  mLineChars[mMaxLine] = saveSpaceCharCount;
              else // for too long words that do not fit into one line (and Chinese texts)
                  mLineChars[mMaxLine] = charCount;

              // does new line still fits into current page?
              firstLineOnPage = false;

              // set new page
              if (remainingHeight < 0) {
                  firstLineOnPage = true;
                  remainingHeight = aHeight - lineHeight;
              }

              if (saveSpaceCharCount !== 0) {
                  mLineStart[++mMaxLine] = saveCharPosition;
                  TextWrapper.setPosition(saveCharPosition);
              } else {
                  mLineStart[++mMaxLine] = currentPosition;
                  TextWrapper.setPosition(currentPosition);
              }
          } else if (!TextWrapper.hasNext()) {
              if (type === eCharType.CHARACTER) {
                  mLineChars[mMaxLine] = charCount;
              } else if (type === eCharType.SPACE) {
                  mLineChars[mMaxLine] = saveSpaceCharCount;
              }
          }
      }

      mPageStart[pageCounter] = mMaxLine + 1;


      // lines into string[]
      let result: string[] = [];

      for (let i = 1; i <= pageCounter; i++) {
          let firstLine: number = mPageStart[i - 1];
          let lastLine: number = mPageStart[i];

          let pageText: string[] = [];
          for (let l = firstLine; l < lastLine; l++) {
              pageText.push(TextWrapper.mText.substr(mLineStart[l], mLineChars[l]));
          }

          result.push(pageText.join('\n'));
      }

      return result;
  }
}


export function bestFit(currentWidth:number,currentHeight:number,maxWidth:number,maxHeight:number):number {
  const w_scale = maxWidth / currentWidth;
  const h_scale = maxHeight / currentHeight;
  return Math.min(w_scale,h_scale);
}