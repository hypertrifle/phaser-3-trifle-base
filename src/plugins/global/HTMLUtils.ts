export interface FormSubmissionData {
  name?:string;
  email?:string;

}

export default class HTMLUtils extends Phaser.Plugins.BasePlugin {
  /**
   * @constructor Creates an instance of the HTMLUtils plugin (that handles any non phaser HTML based content / functionallity).
   * @param {Phaser.Plugins.PluginManager} pluginManager
   * @memberof GameData
   */
  constructor(pluginManager: Phaser.Plugins.PluginManager) {
    super(pluginManager);
    console.log("HTMLUtils::constructor");

    // TODO: setup any dom elements that may need to be required (EI popup containers.)

    // TODO: listen to any resize events to allow ups to keep out HTML content in the same size and format of that of the game.

    // TODO: parse and validate all of our popups and look for issues now?
  }




  markup:string = `
  <a id="closeButton" href="#" class="close">X</a>
	<div class="score-intro">
	  <p>Your score is:</p>
	  <p id="scoreString" class="score">1 minute 59s</p>
	</div>
	<form id="mainForm"> 
		<fieldset> 
		    <legend>Enter your name &amp; email to submit your high score, and you could win a prize:</legend>
		    <label class="half">
		        <b>Your Name *</b>
		        <input id="nameInput" type="text" placeholder="name", maxlength="6" required>
		    </label>
		    <label class="half">
		        <b>Your Email</b>
		        <input id="emailInput" type="email" placeholder="email" required >
		    </label>
		    <div class="checkbox">
		     <input type="checkbox" id="termsCheck" required value="true">
		        <label for="termscheck">By supplying your email address you agree to accept our <a href="#">privacy policy</a> and <a href="#">terms and conditions</a></label>
		    </div>
		    <div><button id="submitDataButton" type="submit"><span>Submit</span></button></div> 

		</fieldset>
	</form>
	<form>
		<button id="noThanksButton" type="submit"><span>No thanks</span></button>
	</form>`

  callback:(data:FormSubmissionData)=>void;
  context:Phaser.Scene;

  addFormAndlistenForSubmit(onComplete:(data:FormSubmissionData)=>void, completeContext:any, score:string){

    this.callback = onComplete;
    this.context = completeContext;

    let el:Element = document.getElementById("overlay");
    el.innerHTML = this.markup;
   

    document.getElementById("scoreString").innerHTML = score;


    document.getElementById("submitDataButton").addEventListener("click", function(ev:TouchEvent){
      this.onFormSubmit(true);
      ev.stopImmediatePropagation();
    }.bind(this));
    document.getElementById("noThanksButton").addEventListener("click", function(ev:TouchEvent){
      this.onFormSubmit(false);
      ev.stopImmediatePropagation();
    }.bind(this));
    document.getElementById("closeButton").addEventListener("click", function(ev:TouchEvent){
      this.onFormSubmit(false);
      ev.stopImmediatePropagation();
    }.bind(this));


    el.classList.add("show");
  } 

  validateEmail(email:string) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

  onFormSubmit(capture:boolean = false){

    if(capture){
      //any minor validation?
      //return if there is.

      //@ts-ignore
      console.log(document.getElementById("termsCheck").checked);
      //@ts-ignore
      let termsFilled = document.getElementById("termsCheck").checked;
      //@ts-ignore
      let nameEntered = (document.getElementById("nameInput").value !== "");
      //@ts-ignore
      let emailValid = this.validateEmail(document.getElementById("emailInput").value);

      if(!termsFilled || !nameEntered || ! emailValid){
        document.getElementById("mainForm").classList.add("error");
        return;
      }


      this.callback.apply(this.context,[{
        //@ts-ignore
        name: document.getElementById("nameInput").value,
        //@ts-ignore
        email: document.getElementById("emailInput").value
      }]);

      //return the object.

    } else {
      this.callback.apply(this.context);

    }


    //clean up and remove.
    document.getElementById("submitDataButton").removeEventListener("click", function(ev:TouchEvent){
      this.onFormSubmit(true);
      ev.stopImmediatePropagation();
    }.bind(this));
    document.getElementById("noThanksButton").addEventListener("click", function(ev:TouchEvent){
      this.onFormSubmit(false);
      ev.stopImmediatePropagation();
    }.bind(this));
    document.getElementById("closeButton").addEventListener("click", function(ev:TouchEvent){
      this.onFormSubmit(false);
      ev.stopImmediatePropagation();
    }.bind(this));

    let el:Element = document.getElementById("overlay");
    el.innerHTML = "";
    el.classList.remove("show");



  }
} 
