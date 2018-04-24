import { SaveModel } from '../models/Global';
import { Member, Mission } from '../models/SpyModels';

export default class DataController {

    private _data: any; //we really dont want to ever use 'any' but for ease of use lets do this.
    save: SaveModel;

    //this allows this class to act as a singleton.
    private static _instance: DataController;

    //now we decalre the typed models we are going to load into, declared with inferface things, this seems best practice for writing the typedef equivilent.
    //also give us great code completion in a decent code editor

    public members: Member[];
    public missions: Mission[];


    public static get Instance() {
        // Do you need arguments? Make it a regular method instead.
        return this._instance || (this._instance = new this());
    }
    //end singlton functionality.


    constructor() {
        console.log("DataController::constructor");
        this._data = {};
    }




    loadModel(model: any) {
        try {
            this._data = model;
            this.save = JSON.parse(JSON.stringify(this._data.save));

            this.members = [];
            //i love this itterator
            for (let i in model.members) {
                this.members.push(model.members[i] as Member);
            }

            // same for mission (cast to our typed objects)
            this.missions = [];
            for (let i in model.missions) {
                this.missions.push(model.missions[i] as Mission);
            }


        }

        catch (e) {
            console.warn("error loading the the model passed to constants", e);
        }

        console.log("DataController::load:complete");

    }

   validateTeam(teamChoice:Member[]):boolean
    {
        // this is based on our temp level, will need to be tweaked for production
        // if more complex situations are imagined, this would involve al gore. and the level as a parameter.

        let requredMembers = ["attack","hack","steal"];

        for(let i in this.members){
            // lets assumes at least one of each member is required
            // splice from our required members that of the chosen abilitis

                //for each ability
                for(let j in this.members[i].abilities){
                    var indexToRemove:number = requredMembers.indexOf(this.members[i].abilities[j]);
                    if(indexToRemove > -1){
                        //mark as aquired
                        requredMembers.splice(indexToRemove, 1);
                        
                        if(requredMembers.length === 0){
                            //no more required
                            return true;
                        }

                    }
                }
        }



        return false;

    }

    get(key: String, clone: Boolean) {
        let shouldClone = clone || true;
        var obb: any = this._data;

        if (key !== undefined) {
            let parts = key.split(".");
            for (var i = 0; i < parts.length; i++) {
                obb = obb[parts[i]];

                if (obb === undefined) {
                    var errObj = parts.length = i;
                    console.warn("game.data.get, tried to request key of: " + key + " but failed at getting: ", errObj);
                    return null;
                }
            };
        }


        if (obb === undefined) {
            console.warn("game.data.get, key of: " + key + " is not set");
            return null;
        }

        return (shouldClone) ? JSON.parse(JSON.stringify(obb)) : obb;


    }

    destroy() {

    }

}
