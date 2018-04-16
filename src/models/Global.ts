export class SaveModel {
   identifier:String;
   version:String;
   shouldPersistData:Boolean;
}

export class StateModel {
   id:String = "";
   assets:Array<any> =  [];
}