

function StaticFormViewModel(params) {
	var self = this;
	self.visible = ko.observable(false);
	self.baseNumber = ko.observable(params.keyValueParams.ContextName);
	var itemNum=self.baseNumber();
	self.req=ko.observable(false);
	self.sequenceEnabled=ko.observable(false);
	self.seqLength=ko.observable(3);
	self.description = ko.observable("").extend({
		required: true,
	});
	self.sequenceNumber = ko.observable().extend({
	  enabled:false,
      required: self.req,
      maxLength: self.seqLength,
      pattern: {
    	  message: 'Only numbers allowed',
          params: '^[0-9]*$'
      }
	});
	
	var list=["Document"];
	self.listOptions = ko.observableArray(list);
	self.selListOptions = ko.observableArray().extend({
		 required: true
	});
	
	self.setListValue = function(data){

		if(!data.hasError) {		
			var classes=[];
			 //Creating map of sequenceLength and enableSequence against subclasses
		    for (index = 0; index < data.classes.length; index++) {	    	
		    	classes.push(data.classes[index].name);
		    	enableSequenceInput [data.classes[index].name]=data.classes[index].sequenceRequired;
		    	sequenceLength [data.classes[index].name]=data.classes[index].sequenceLength;
		    }

			self.listOptions(classes);
			$("#list1").trigger("chosen:updated");

		} else {
			showError(data.errorMessage);
		}
	};
	
	var enableSequenceInput={};
	var sequenceLength={};
	
	self.submitClicked = function(){
		//validate all fields
		var result = ko.validation.group(self, {deep: true});
	    if (!self.isValid()) 
	    {
	        result.showAllMessages(true);	//show error messages on invalid fields
	        return false;
	    }
	    	   
		 var data={};	 //Map to add values to be sent in request
	     data["baseNumber"]=self.baseNumber();
	     data["baseClass"]=params.keyValueParams.ContextType;
	     data["subClass"]=self.selListOptions()[0];
	     data["sequenceNum"]=self.sequenceNumber;
	     data["description"]=self.description;
	    
		var formJSON = ko.mapping.toJSON(data);
		 //Send Request to create item 
		System.sendPostRequest("CreateItemsServlet", data, self.setresponse, "Please Wait. Creating Document...");		
	};	
	
	self.setresponse = function(data){
		if(!data.hasError) {
			var num = data.itemNumberToCreate;
			var url = data.url;	
			location.href = url;
		  //Display item num and url of the item created 
		  //$("#screen0").html( "<h4 class='confirmation'>  Item Created: </h4>" + "<h5 class='confirmation'>" + num+  "</h5>"  + "<h4 class='confirmation'>  Access it with this link : </h4>" + "<a href='" + url+"' style='margin-left:6%;'>" + url + "</a>");

		} else {
			showError(data.errorMessage);
		}
	};
	  
	showError = function(errorMessage) {
		$("#screen0").html( "<h4 class='confirmation'>  Error: </h4>" + "<h5 class='confirmation'>" + errorMessage+  "</h5>");
	};
	
	self.init = function(){
		var arr = [];
		var param= "type=list" +"&baseClass="+ params.keyValueParams.ContextType + "&num="+ itemNum; 
		System.sendPostRequest("CreateItemsServlet", param , self.setListValue, "Please Wait. Loading data from Agile...");
		self.listOptions = ko.observableArray(arr);
	};
	
	self.cancelClicked = function(){
		
		self.description("");
		self.selListOptions("");
		self.sequenceNumber("");
		
		var result = ko.validation.group(self, {deep: true});
	    if (!self.isValid()) 
	    {
	        result.showAllMessages(false);	//show error messages on invalid fields
	        return false;
	    }	
	};

	
	 self.fieldChanged = function(data, event) {

        if (enableSequenceInput[self.selListOptions()[0]])
  		{

        	self.sequenceEnabled(true);       	
        	self.seqLength(sequenceLength[self.selListOptions()[0]]);   	
        	self.req(true);
  		}
        else{
        	self.sequenceEnabled(false);
    		self.sequenceNumber("");
        	self.req(false);
        }
	 };
     
     $("#static_form").ready(function(){
    	 self.visible(true);
 	 });
     
     self.init();  
}
	

