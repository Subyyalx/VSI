
/**
 * View Model for Lookup field.
 * @param data
 * @param event
 * @param targetField
 * @param viewModel
 * @returns
 */
function LookupField(data, event, targetField, viewModel){
	
	var self = this;
	self.searchString = ko.observable("");
	self.clickableColumn = targetField.settings.clickableColumn || 0;
	self.targetField = targetField;
	self.heading = targetField.settings.heading;
	self.settings = targetField.settings;
	self.errorMessage = ko.observable("");
	
	this.lookupSearchClicked = function(data, event){
		console.info(data);
		console.info(event);
		console.info("search string = " + self.searchString());
		
		self.errorMessage("");
		self.lookupResults([]);
		
		System.sendPostRequest(self.settings.url, self.settings.params, function(response){
			self.lookupResults(response.changes);
		}, null);
	};
	
	this.selectColumnClicked = function(data, event, row){
		
		if(self.targetField.selectedOptions().length >= self.settings.maxAllowed ){
			self.errorMessage("Cannot add more than " + self.settings.maxAllowed + " values.");
			return;
		}
		
		var value = event.target.innerText;
		self.targetField.options.push(value);
		
		/*viewModel.setOptions(targetField, ["new opt"]);*/
		
		self.targetField.selectedOptions.push(value);
		self.lookupResults.remove(row);
		
		//TODO: fix it.
		$("#" + targetField.id).trigger('chosen:updated');
	};
	
	this.lookupColumns = ko.observableArray(self.settings.lookupColumns);
	this.lookupResults = ko.observableArray([]);
	
	this.resultCount = ko.computed(function() {
        return "Total Rows = " + self.lookupResults().length;
    }, this);
	
	ko.cleanNode($("#lookupDialogTemplatePlaceHolder")[0]);
	System.bindViewModel(self, "lookupDialogTemplatePlaceHolder");
	
	var dialog = $('#lookupDialog');
	dialog.modal();
}