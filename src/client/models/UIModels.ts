export class Corners {
  sw?: boolean;
  se?: boolean;
  nw?: boolean;
  ne?: boolean;
}

export class UISettings {
  radius: number = 0;
  colors: ColorPalette;
}

export class ColorPalette {
  primary: string;
  secondary: string;
  hover: string;
  disabled: string;
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
  settings: UISettings;
  buttons: ButtonSettings;
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