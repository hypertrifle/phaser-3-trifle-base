export class Corners {
  sw?: boolean;
  se?: boolean;
  nw?: boolean;
  ne?: boolean;
}

export class ColorPalette {
  primary = "#C65DD2";
  secondary = "#85F7BF";
  hover = "#1C005F";
  disabled = "#DDDDDD";

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

  toSignedNumber(hex: string): number {
    return (parseInt(hex.substr(1), 16) << 8) / 256;
  }

}

export class UISettings {
  radius = 0;
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
  fonts: { [key: string]: Phaser.Types.GameObjects.Text.TextStyle } =
    {
      debug: {
        fontFamily: "Roboto Mono",
        fontSize: "8px",
        color: "#ffffff",
        align: "left",
        fontStyle: "normal",
        wordWrap: {
          width: 900
        }
      },
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
  resizeToParent = true; // priority.
  expandToParent = true;
  shouldForceOrientationOnMobile = true;
  shouldForceLandscaprOnMobile = true;
  maxWidth: number = undefined;
  maxHeight: number = undefined;
}
