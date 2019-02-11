/**
 * Data Model - this holds all information that may be required, some
 * content.json AND setting.json files, and will be ready after the boot state has completed,
 * this will need to be updated for each game to reflect the structure of the data being loaded.
 *
 * @export
 * @class DataModel
 *
 */
/* These are defined in src/models/*.ts and unless they are small settings objects its a good place to abstract them to... */

export interface PageModel {
  id: string, 
  sceneKey: string, 
  label: string,
  strings?:{[key:string]:string}[];
}


export class ContentModel {
  pages: PageModel[] =
    [
      {
        id: "home",
        sceneKey: "HomeScene",
        label: "/"
      },
      {
        id: "about",
        sceneKey: "aboutScene",
        label: "About & Services"
      },
      {
        id: "games",
        sceneKey: "gamesSelectionScene",
        label: "Games & Demos"
      },
      {
        id: "contact",
        sceneKey: "contactScene",
        label: "Contact"
      }
    ];
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
