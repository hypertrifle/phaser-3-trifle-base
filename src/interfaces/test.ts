interface PickUpConfig extends GameObjectConfig {
   frame: string;
   lane: number;
   totalBands: number;
   owner: Array<OtherClass>;
   roadPosition: number[];

}

interface OtherClass extends GameObjectConfig {
   frame: string;
   lane: number;
   totalBands: number;
   roadPosition: number;
}

// const game:PickUpConfig;