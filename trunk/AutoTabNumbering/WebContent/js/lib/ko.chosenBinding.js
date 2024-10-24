
ko.bindingHandlers.chosen = {
	init : function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
		
		var value = valueAccessor();
		var userConfig = value.config;
		
		var defaultConfig = {
				'.chosen-select' : {
					search_contains: true,
					/*width: '215px',*/
					no_results_text : ' '
				},
				'.chosen-select-deselect' : {
					allow_single_deselect : true,
					search_contains: true,
					/*width: '215px',*/
					no_results_text : ' '
				},
				'.chosen-select-no-single' : {
					search_contains: true,
					/*width: '215px',*/
					no_results_text : ' '
				},
				'.chosen-select-no-results' : {
					no_results_text : ' '
				},
				'.chosen-select-width' : {
					/*width : "95%",
					width: '215px',*/
					no_results_text : ' '
				}
			};
		
		var config = userConfig || defaultConfig;
		
		setTimeout(function() {
			$(element).addClass('chzn-select');
			/*$(element).chosen();*/
			
			for ( var selector in config) {
				$(element).chosen(config[selector]);
			}
			
		}, 100);
	},
	update : function(element) {
		//console.info("chosen list updated");
		$(element).trigger('liszt:updated');
	}
	
};

ko.bindingHandlers.skipChildBinding = {
	init : function() {
		return {
			controlsDescendantBindings : true
		};
	}
};

ko.trackChanges = function(observable, key, viewModel, storageType) {
	if(!ko.isObservable(observable)) 
		throw 'item must be observable to track changes';
	
	var store = null;
	
	if(storageType){
		store = System.getStorage(storageType);
	}
	else if(viewModel && viewModel.storageType){
		store = System.getStorage(viewModel.storageType);
	}
	else{
		store = System.getStorage(DEFAULT_STORAGE_TYPE);
	}

	//initialize from stored value, or if no value is stored yet, use the current value
	var value = store(key) || observable();

	//track the changes
	observable.subscribe(function(newValue) {
		store(key, newValue || null);
		if(ko.toJSON(observable()) != ko.toJSON(newValue)) 
			observable(newValue);
	});

	observable(value); //restore current value
};