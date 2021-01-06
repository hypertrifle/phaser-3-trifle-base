import { writeFileSync } from "fs";
import ContentModel from '../src/typescript/client/models/ContentModel';
import SaveModel from "../src/typescript/client/models/SaveModel";
import UIModel, { ScalingModel } from "../src/typescript/client/models/UIModels";
import Phaser from 'phaser';

writeFileSync(`src/assets/json/content.json`, JSON.stringify(new ContentModel(), null, 2));


writeFileSync(`src/assets/json/settings.json`, JSON.stringify({
    save: new SaveModel(),
    scaling: new ScalingModel(),
    ui: new UIModel()
}, null, 2));
