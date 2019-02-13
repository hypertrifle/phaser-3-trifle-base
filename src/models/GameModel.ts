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
        label: "Home"
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

  testParagraph:string = "Sunt vel porro saepe voluptatibus molestias qui eaque. Quae cumque cumque et unde consequatur. Quidem eius repellat dolores rerum eveniet laudantium earum odio et. Dolore sint sunt nam ut natus ut commodi deserunt autem. Voluptatum beatae totam qui.";


  testTitle:string = "Quae repellat labore atque culpa et.";
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
