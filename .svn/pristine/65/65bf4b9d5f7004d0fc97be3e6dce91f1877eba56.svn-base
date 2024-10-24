/**
 * View Model for the index page. Will handle the screen notes, error/success/warning
 * messages and anything that is present in index page.
 * It should be Singleton. 
 */
var IndexPageViewModel  = {
		
		screenNotes : ko.observable("Welcome."),	//set screen notes in it.
		footerMessage: ko.observable(""),			//success/error/warning message
		footerMessageType: ko.observable(),		//type should be one of success/error/warning
		
		/**
		 * Sets screen note.
		 */
		setScreenNotes: function(notes){
			IndexPageViewModel.screenNotes(notes);
		},
		
		/**
		 * Displays message in the footer.
		 * @param type Type should be one of success/error/warning
		 * @param message Message to display
		 * @param timeOut Optional parameter for hiding the message after this duration.
		 */
		setFooterMessage: function(type, message, timeOut){
			type = type.toLowerCase();
			IndexPageViewModel.footerMessageType(type);
			IndexPageViewModel.footerMessage(message);
			
			if(timeOut){
				setTimeout(function(){
					IndexPageViewModel.footerMessageType("");
				}, timeOut);	
			}
			
		}/*,
		
		handleLookupField: function(data, event, settings){
			
			
			//var field = new LookupField(data, event, settings);
			
			
		},*/
		
		
		                
		
		
	};