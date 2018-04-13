   //example of how to construct classes, see the labelbutton class for simple class extension.
   this.button1 = new LabelButton({
      width: 100,
      height: 50,
      label: "CLick Me",
      callback: this.onButtonOnePress,
      context: this
   });


   //create a sprite / image / gameobject
   this.sprite1 = this.add.sprite();

   