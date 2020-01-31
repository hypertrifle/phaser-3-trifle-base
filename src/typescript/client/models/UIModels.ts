export class Corners {
  sw?: boolean;
  se?: boolean;
  nw?: boolean;
  ne?: boolean;
}

export class ColorPalette {
  primary: string = "#C65DD2";
  secondary: string = "#85F7BF";
  hover: string = "#1C005F";
  disabled: string = "#DDDDDD";

  get primaryNumber(): number {
    return this.toSignedNumber(this.primary);
  }
  get secondaryNumber(): number {
    return this.toSignedNumber(this.secondary);
  }
  get hoverNumber(): number {
    return this.toSignedNumber(this.hover);
  }
  get disabledNumber(): number {
    return this.toSignedNumber(this.disabled);
  }

  toSignedNumber(hex: string) {
    return (parseInt(hex.substr(1), 16) << 8) / 256;
  }

}

export class UISettings {
  radius: number = 0;
  colors: ColorPalette = new ColorPalette();
}


export class ButtonSettings {
  color_up: number;
  color_hover: number;
  color_down: number;
  colour_disabled: number;
  opacity: number;
  radius: number;
}

export default class UIModel {
  settings: UISettings = new UISettings();
  buttons: ButtonSettings = new ButtonSettings();
  fonts: { [id: string]: Phaser.Types.GameObjects.Text.TextStyle } =
    {
      h1: {
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: "46px",
        color: "#ffffff",
        align: "center",
        fontStyle: "bold",
        wordWrap: {
          width: 900
        }
      }
    }
    ;
}

/* small so just whack it here */
export class ScalingModel {
  resizeToParent: boolean = true; // priority.
  expandToParent: boolean = true;
  shouldForceOrientationOnMobile: boolean = true;
  shouldForceLandscaprOnMobile: boolean = true;
  maxWidth: number = undefined;
  maxHeight: number = undefined;
}
