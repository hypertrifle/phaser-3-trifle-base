export function getCookieToken(): string {
  const name = 'token=';

  const cookie = decodeURIComponent(document.cookie);
  const c = cookie.split(';');

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
    const possibleChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < 10; i++) {
      newToken += possibleChars.charAt(Math.floor(Math.random() * possibleChars.length));
    }

    const date = new Date();
    date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));

    const expiryDate = 'expires=' + date.toUTCString();

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
  for (const p in obj2) {
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
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
  // @ts-ignore

  if (typeof gtag === 'function') {
    console.log('sending to google analytics', action, label);
  // eslint-disable-next-line @typescript-eslint/ban-ts-ignore
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
  const h = hex.substring(1);
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
    const index = Math.floor(Math.random() * counter);

    // Decrease counter by 1
    counter--;

    // And swap the last element with it
    const temp = array[counter];
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
  const canvas = scene.add.graphics();
  const col: number = (typeof(color) === "string") ? hexToBase16Number(color) : color;
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


export function bestFit(currentWidth: number,currentHeight: number,maxWidth: number,maxHeight: number): number {
  const wScale = maxWidth / currentWidth;
  const hScale = maxHeight / currentHeight;
  return Math.min(wScale,hScale);
}