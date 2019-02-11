export enum UniformType {
   float = "float",
   sampler2D = "sampler2D",
   vec2= "vec2",
   vec3= "vec3",
   vec4= "vec4",

}


export interface Uniform {
   name: string;
   type: UniformType;
   value: any; // TODO: what can I do here?
}

export default class BaseEffect extends Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline {

    private _time: number = 0;
    private _resolution: {x: number, y: number} = {x: 0,y: 0};



    set time(i: number) {
      this._time = i;
      this.setFloat1("time", this._time);
    }

    get time(): number {
      return this._time;
    }

    set res(i: {x: number, y: number}) {
      this._resolution = i;
      this.setFloat2("resolution", this._resolution.x, this._resolution.y);

    }

    get res(): {x: number, y: number} {
      return this._resolution;
    }

   


     constructor(game: Phaser.Game,id: string, source: string, config?: any, vertexSource?: string ) {

       super({
         game: game,
         renderer: game.renderer,
         fragShader: source,
         vertShader: vertexSource
        });

         // add to the games renderer as as pipline with the id supplied
         (game.renderer as Phaser.Renderer.WebGL.WebGLRenderer).addPipeline(id, this);

         // defaults
         this.time = 0;
         this.res = {x: this.game.scale.width, y: this.game.scale.height};



     }

  }
