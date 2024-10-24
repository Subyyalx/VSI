
/**
 * Set to true for disable logging.
 */
var DISABLE_LOGGING = false;


/**
 * localStorage - stores data with no expiration date
 * sessionStorage - stores data for one session (data is lost when the tab is closed)
 */
var DEFAULT_STORAGE_TYPE = "sessionStorage";


/**
 * Utility methods for managing view and view models.
 * Do not update without good knowledge.
 */
var System = {
	
	/**
	 * Loads global templates and bind index page view model to index page.
	 */
	init:function(){
		require(['js/lib/text!views/global_templates.html',
		         'viewmodels/GlobalViewModels.js' ], 
		function(globalTemplates, globalViewModels) {
			$(document.body).append(globalTemplates);
		});
		
		//bind index page view model
		System.bindViewModel(IndexPageViewModel);
	},
	
	/**
	 * Loads given view and view model asychronously.
	 * @param view Name of view
	 * @param templateId Template id present inside view
	 * @param viewModel Name of view model
	 * @param callBack Call back in case of success
	 */
	loadViewAndViewModel: function(view, templateId, viewModel, callBack){
			
			require(['js/lib/text!views/' + view + '.html', 'viewmodels/' +
			         viewModel], function(template, appViewModel) {
				
				if($("#" + templateId).length == 0){
					$(document.body).append(template);
				}
				
			    if(callBack){
			    	callBack();
			    }
			});
	},
	
	/**
	 * Triggers binding for the given template placeholder
	 * @param viewModel View model to bind
	 * @param placeHolderId 
	 */
	bindViewModel:function(viewModel, placeHolderId){
		
		if(placeHolderId){
			ko.applyBindings(viewModel, $("#" + placeHolderId)[0]);
		}else{
			ko.applyBindings(viewModel);
		}
	},
	
	/**
	 * Sets the given template id inside the template placeholder.
	 * @param placeHolderId Placeholder id
	 * @param newTemplateId Template id to set
	 */
	setTemplateInPlaceHolder:function(placeHolderId, newTemplateId){	
		try{
			ko.cleanNode($("#" + placeHolderId)[0]);
		}catch(e){
			console.info(e);
		}
		
		$("#" + placeHolderId).replaceWith('<div id="'+ placeHolderId + 
				'" data-bind="template:{name:&quot;'+newTemplateId+'&quot; }"></div>');
	},
	
	uuid : "",
	
	/**
	 * Sends ajax post request. Blocks UI and shows waiting message if given waitingMessage.
	 * @param url URL
	 * @param param Parameters
	 * @param callback Callback in case of success
	 * @param waitingMessage Waitings message to display
	 * @param divToMask Target div to mask
	 */
	sendPostRequest:function(url, param, callback, waitingMessage, divToMask)
	{
		var timestamp = new Date().getUTCMilliseconds();
		System.uuid = timestamp;
		
		if(waitingMessage){
			System.showLoadingScreen(waitingMessage, divToMask);
		}
		$.ajax({
			  type: "POST",
			  url: url,
			  data: param,
			  success: function(responseJson)
				{
					if(System.uuid == timestamp){
						if(waitingMessage){
							System.hideLoadingScreen(divToMask);
						}
						callback(responseJson);		
					}else{
						if(waitingMessage){
							System.hideLoadingScreen(divToMask);
						}
					}
				},
			 
			}).fail(function(jqXHR, textStatus) {
				console.info(textStatus);
				IndexPageViewModel.setFooterMessage("error", "<b>Error:</b> Unable to connect to server. Please try again");
				System.hideLoadingScreen(divToMask);
			});
	},
	
	/**
	 * Displays modal of waiting message.
	 * @param message Message to show
	 * @param divToMask Div to mask
	 */
	showLoadingScreen:function(message, divToMask){
		var pleaseWaitDiv = $('#pleaseWaitDialog');
		pleaseWaitDiv.modal();
		$("#pleaseWaitMessage").html(message);
	},
	
	/**
	 * Hides modal of waiting message.
	 * @param divToMask Div to unmask
	 */
	hideLoadingScreen: function(divToMask){
		setTimeout(function(){
			$("#pleaseWaitDialog").modal('hide');
		}, 800);
	},
	
	submitMultiPartForm : function(form, params, url, callBack) {

		var iFrameId = "upload_iframe";

		$("#hidden_params").remove();
		$("#" + iFrameId).remove();
		
		var iframe = $("<iframe id='upload_iframe' name='upload_iframe' style='display:none'></iframe>");
		form.append("<input type='hidden' name='params' id='hidden_params' value='"
						+ params + "' />");

		form.parent().append(iframe);
		form.attr("action", url);
		form.attr("target", iFrameId);
		form.attr("method", "POST");
		form.attr("enctype", "multipart/form-data");
		form.attr("encoding", "multipart/form-data");

		iframe.load(function() {
			var response = iframe.contents().text();
			console.info("response = " + response);
			response = $.parseJSON(response);
			
			if($.isFunction(callBack)){
				callBack(response);
			}
		});

		form.submit();
	},
	
	downloadFile : function(url) {
		var hiddenIFrameID = 'hiddenDownloader';
		var iframe = document.getElementById(hiddenIFrameID);
		if (iframe === null) {
			iframe = document.createElement('iframe');
		    iframe.id = hiddenIFrameID;
		    iframe.style.display = 'none';
		    document.body.appendChild(iframe);
		}
		iframe.src = (url);
	},
	
	getStorage: function(storageType){
		
		var storage = null;
		
		switch(storageType){
		
		case "localStorage":
			storage = amplify.store.localStorage;
			break;
		case "sessionStorage":
			storage = amplify.store.sessionStorage;
			break;
		}
		
		return storage;
	},
	
	removeAllKeysFromStore: function(storageType){
		
		try{
			store = System.getStorage(storageType);
			$.each(store(), function (storeKey) {
				store(storeKey, null);
			});
		}catch(e){
			console.log(e);
		}
	},
	
	clearStorage: function(){
		System.removeAllKeysFromStore("localStorage");
		System.removeAllKeysFromStore("sessionStorage");
	}
};