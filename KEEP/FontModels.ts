export interface FontStyle {
   fontFamily: string;//', 'Courier' ],
   fontSize: string;
   fontStyle?: string;
   backgroundColor?: string;
   color?: string;
   stroke?: string;
   strokeThickness?: number;
   shadow?: {
      offsetX: number;
      offsetY: number;
      color: string;
      blur?: number;
      stroke?: boolean;
      fill?: boolean;
   };
   align?: string;
   maxLines?: number
   fixedWidth?: number
   fixedHeight?: number
   resolution?: number
   rtl?: boolean
   testString?: string;
   baselineX?: number;
   baselineY?: number;
   wordWrap?: {
      width?: number;
      callback?: () => void;
      callbackScope?: any;
      useAdvancedWrap?: boolean;
   }
}