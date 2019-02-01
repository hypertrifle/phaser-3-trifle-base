import { BitmapData } from 'phaser-ce';


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


export function colorToSigned24Bit(s: string): number {

  return parseInt(s.replace('#', ''), 16);
}



export function wrapBitmapText(textObject: Phaser.BitmapText, maxWidth?: number) {

  textObject.visible = false;

  if (!maxWidth) {
    maxWidth = textObject.game.width - 100;
  }

  let words = textObject.text.split(' ');

  let finalString: string = '';
  while (words.length > 0) {
    let w = words.shift();


    textObject.text =  finalString + ' ' + w;
    if (textObject.textWidth > maxWidth) {
      finalString.substring(finalString.length - (w.length + 1) );
      finalString += '\n' + w;
    } else {
      finalString += (' ' + w);
    }

  }

  textObject.visible = true;

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



export function track(action, label) {
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



export function checkOverlap(spriteA: Phaser.Image | Phaser.Sprite, spriteB: Phaser.Image | Phaser.Sprite) {
  let boundsA = spriteA.getBounds();
  let boundsB = spriteB.getBounds();
  return Phaser.Rectangle.intersects(boundsA as Phaser.Rectangle, boundsB as Phaser.Rectangle);

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


// ==========================================================
//
//  ####    ##   ####  #####   ##        ###    ##    ##
//  ##  ##  ##  ##     ##  ##  ##       ## ##    ##  ##
//  ##  ##  ##   ###   #####   ##      ##   ##    ####
//  ##  ##  ##     ##  ##      ##      #######     ##
//  ####    ##  ####   ##      ######  ##   ##     ##
//
// ==========================================================


export function moveAnchor(obj: Phaser.Image | Phaser.Sprite, anchor: Phaser.Point) {
  // reposition
  obj.x = obj.x + (anchor.x - obj.anchor.x) * obj.width;
  obj.y = obj.y + (anchor.y - obj.anchor.y) * obj.height;

  // set anchor
  obj.anchor.setTo(anchor.x, anchor.y);
}

export function addScaleOnOver(game: Game, obj: Phaser.Image | Phaser.Sprite, hasSound: boolean) {

  if (obj.anchor.x !== 0.5 || obj.anchor.y !== 0.5) {
    moveAnchor(obj, new Phaser.Point(0.5, 0.5));

  }

  obj.scale.setTo(0.9);
  obj.inputEnabled = true;
  obj.events.onInputOver.add(function () {
    if (hasSound) {
      game.audio.playSound('ui-feedback');
    }
    game.add.tween(this.scale).to({
      x: 1,
      y: 1
    }, 100, undefined, true);
  }, obj);
  obj.events.onInputOut.add(function () {
    game.add.tween(this.scale).to({
      x: 0.9,
      y: 0.9
    }, 100, undefined, true);
  }, obj);

}



export function defuzzText(textObj: Phaser.Text) {

  // make sure position is a round number
  textObj.x = Math.round(textObj.x);
  textObj.y = Math.round(textObj.y);

  // make sure the anchor is not making the text postion subpixels.
  textObj.anchor.x = Math.round(textObj.width * textObj.anchor.x) / textObj.width;
  textObj.anchor.y = Math.round(textObj.height * textObj.anchor.x) / textObj.height;
}



// draw a rounded corner rectangle
export function RoundedRect(bmd: BitmapData, x: number, y: number, w: number, h: number, r: number, color: string): BitmapData {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  bmd.ctx.beginPath();
  bmd.ctx.moveTo(x + r, y);
  bmd.ctx.arcTo(x + w, y, x + w, y + h, r);
  bmd.ctx.arcTo(x + w, y + h, x, y + h, r);
  bmd.ctx.arcTo(x, y + h, x, y, r);
  bmd.ctx.arcTo(x, y, x + w, y, r);
  bmd.ctx.closePath();
  bmd.ctx.fillStyle = color;
  bmd.ctx.fill();
  return bmd;
}

export function MakePanel(game: Game, w: number, h: number, r: number, color: string): BitmapData {
  let bmd: BitmapData = game.add.bitmapData(w, h);
  return RoundedRect(bmd, 0, 0, w, h, r, color);

}

export function MakePanelImg(game: Game, w: number, h: number, r: number, color: string, x: number, y: number): Phaser.Image {

  let key = 'panelimg' + w + h + r + color;
  if (!game.cache.checkKey(Phaser.Cache.IMAGE, key)) {
    let bmd: BitmapData = MakePanel(game, w, h, r, color);
    game.cache.addSpriteSheet(key, '', bmd.canvas, w, h);

  }
  return game.add.image((x || 1), (y || 1), key );

}

export function MakePanelImgWithPadding(game: Game, w: number, h: number, r: number, color: string, x: number, y: number, padding: number = 20): Phaser.Image {

  let key = 'panelimg' + w + h + r + color + padding;
  if (!game.cache.checkKey(Phaser.Cache.IMAGE, key)) {
    let bmd: BitmapData = game.add.bitmapData(w + (padding * 2), h + (padding * 2));
    bmd = RoundedRect(bmd, padding, padding, w, h, r, color);
    game.cache.addSpriteSheet(key, '', bmd.canvas, w + (padding * 2), h + (padding * 2));

  }
  return game.add.image((x || 1), (y || 1), key );

}


// export function MakeCircle(game, r, color) {
//   let bmd: BitmapData = game.add.bitmapData(r * 2, r * 2);

// }

export function RoundedRectOutline(bmd: BitmapData, x: number, y: number, w: number, h: number, r: number, color: string, strokeWidth: number): BitmapData {

  bmd.ctx.imageSmoothingEnabled = false;
  strokeWidth = strokeWidth || 3;

  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;

  bmd.ctx.beginPath();
  bmd.ctx.moveTo(x + r, y);
  bmd.ctx.arcTo(x + w, y, x + w, y + h, r);
  bmd.ctx.arcTo(x + w, y + h, x, y + h, r);
  bmd.ctx.arcTo(x, y + h, x, y, r);
  bmd.ctx.arcTo(x, y, x + w, y, r);
  bmd.ctx.closePath();
  bmd.ctx.lineWidth = strokeWidth;
  bmd.ctx.strokeStyle = color;
  bmd.ctx.stroke();
  return bmd;
}

export function debugSprite(game: Game, x: number, y: number, w: number, h: number, color: string): Phaser.Sprite {
  // just gerneates a coloured box.
  let bmd = game.add.bitmapData(w, h);

  bmd.ctx.beginPath();
  bmd.ctx.rect(0, 0, w, h);
  bmd.ctx.fillStyle = color;

  bmd.ctx.fill();

  // use the bitmap data as the texture for the sprite
  let sprite = game.add.sprite(x, y, bmd);

  return sprite;
}

export function drawGrid(game: Game, width: number, height: number, gridSize: number, lineCol: number): Phaser.Image {

  let key = 'grid' + width + height + gridSize + lineCol;
  if (!game.cache.checkKey(Phaser.Cache.IMAGE, key)) {

    // @ts-ignore
    let grid: BitmapData = game.create.grid(key, width, height, gridSize, gridSize, '#' + lineCol.toString(16), false) as Phaser.BitmapData;
    game.cache.addSpriteSheet(key, '', grid.canvas, width, height);

  }

  return game.add.image(0, 0, key);

}

export function drawGradientBackground(game: Game, width: number, height: number, ret: boolean = true): Phaser.Image {

  let key = 'drawGradientBackground' + width + height;

  if (!game.cache.checkKey(Phaser.Cache.IMAGE, key)) {


    let myBitmap = game.add.bitmapData(width, height);
    let grd = myBitmap.context.createLinearGradient(0, 0, 0, height);
    grd.addColorStop(0, '#14353d');
    grd.addColorStop(0.4, '#114f6a');
    grd.addColorStop(0.6, '#114f6a');
    grd.addColorStop(1, '#14353d');
    myBitmap.context.fillStyle = grd;
    myBitmap.context.fillRect(0, 0, width, height);
    game.cache.addSpriteSheet(key, '', myBitmap.canvas, width, height);
  }

  if (ret) {
    let t = game.add.image(0, 0, key);
    return t;

  }


}

export function drawCustomGradientBackground(game: Game, width, height, colorArray): Phaser.Image {

  let key = 'drawCustomGradientBackground' + width + height + colorArray.toString();

  if (!game.cache.checkKey(Phaser.Cache.IMAGE, key)) {


    let myBitmap = game.add.bitmapData(width, height);
    let grd = myBitmap.context.createLinearGradient(0, 0, 0, height);
    let colorStops = colorArray;
    console.log(colorStops);
    for (let i = 0; i < colorStops.length; i++) {
      grd.addColorStop(colorStops[i][0], colorStops[i][1]);
    }

    myBitmap.context.fillStyle = grd;
    myBitmap.context.fillRect(0, 0, width, height);
    game.cache.addSpriteSheet(key, '', myBitmap.canvas, width, height);

  }
  let t = game.add.image(0, 0, key);
  return t;
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
