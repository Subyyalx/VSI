$(document).ready(function(){
	
	/**
	 * Initialize application.
	 */
	System.init();
	
	
	/**
	 * Default Hash.
	 */
	var DefaultURL = "#staticForm";

	/**
	 * Mappings list for URL to view/view model mapping.
	 */
	var Mappings = [
	                {
	                	url: "PendingChanges",
	                	templateId: "pendingChangesTemplate",
	                	placeHolder: "mainPlaceHolder"
	                },
	                {
	                	url: "genericForm",
	                	view: "generic_form",
	                	viewModel: "GenericFormsViewModel",
	                	templateId: "createItemsTemplate",
	                	placeHolder: "mainPlaceHolder",
	                	screenNotes : "This screen shows generic form"	//optional
	                },
	                {
	                	url: "staticForm",
	                	view: "static_form",
	                	viewModel: "StaticFormViewModel",
	                	templateId: "staticFormTemplate",
	                	placeHolder: "mainPlaceHolder"
	                },
	                {
	                	url: "grid",
	                	view: "generic_grid",
	                	viewModel: "GenericGridViewModel",
	                	templateId: "genericGrid",
	                	placeHolder: "mainPlaceHolder",
	                	screenNotes : "This screen shows jqgrid"
	                }
	                
	 ];
	
	
	/**
	 * Event handler for hash changes in the URL. 
	 * Uses Mappings list to select appropriate mapping
	 */
	Sammy(function() {
		
		//Catch all possible patterns of hash.
		this.get(/\#(.*)/, function() {
        	
			var allParams = this.params.splat[0].split("/");
			var url = allParams[0];
			var hashParams = [];
			var requestParams = {};
			var params = {};
			
			for (var key in this.params){
				if(!($.isArray(this.params[key]) || $.isFunction(this.params[key]))){
					requestParams[key] = this.params[key];
				}
			}
			
			try{
				hashParams = allParams.slice(1);
			}catch(e){
				console.info(e);
			}
			
			params.hashParams = hashParams;
			params.keyValueParams = requestParams;
			
			for(var i = 0; i < Mappings.length; i++){
				if(Mappings[i].url == url){
					
					var mapping = Mappings[i];
					
					var view = mapping.view || mapping.url;
					var viewModel = mapping.viewModel || (mapping.url + "ViewModel");
					
					System.setTemplateInPlaceHolder(mapping.placeHolder, mapping.templateId);
				
					System.loadViewAndViewModel(view, mapping.templateId, viewModel, function(){
						$("#" + mapping.placeHolder).fadeOut('' , function(){
							var vm = new window[viewModel](params);
							System.bindViewModel(vm, mapping.placeHolder);
							IndexPageViewModel.setScreenNotes(mapping.screenNotes);
							$("#" + mapping.placeHolder).fadeIn('');
						});
					});
					
					return false;
				}
			}
			
			console.error("No mapping found for this url = [" + url + "]");
        });
        
    }).run(DefaultURL);

});