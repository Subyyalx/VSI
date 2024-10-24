//knockout binding
(function ($) {
    ko.bindingHandlers.grid = {
        init: function (element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
            var value = valueAccessor();
            $(element).tabletogrid(value, bindingContext);
            subscribeToSelectEvents(element, value);
            
            //subscribe to grid data events
            value.data.subscribe(function(changes) {
            	dataChanged(element, changes, value);
            }, null, "arrayChange");

            var griddata = value.data();
            
            $(element).jqGrid('filterToolbar', { searchOnEnter: false, searchOperators : true  });
            $(element).clearGridData().setGridParam({ data: ko.toJS(griddata) }).trigger('reloadGrid');
            clearSelectedItems(value);
            
            subscribeForUpdate(element, griddata);
            subscribeForSelectedItems(element, value);
            
            
            
            //tell knockout to ignore descendants of this element
            return { controlsDescendantBindings: true };
        },
        update: function (element, valueAccessor) {
        }
    };
    
    function subscribeForUpdate(element, griddata){
    	for(var i = 0; i < griddata.length; i++){
    		subscribeToColumns(element, griddata[i], i+1);
    	}
    }
    
    function subscribeToColumns(element, cols, rowId){
    	for(var col in cols){
    		subscribeToCell(element, cols[col], rowId, col);
    	}
    }
    
    function subscribeToCell(element, cell, rowId, col){
    	cell.subscribe(function(changes){
			$(element).jqGrid('setCell', rowId, col + '', changes);
			$(element).jqGrid('getLocalRow', rowId)[rowId] = changes;
			
		});
    }
    
    function dataChanged(element, changes, currentValue){
    	for(var i = 0; i < changes.length; i++){
    		var change = changes[i];
    		
    		var value = {};
    		$.extend(true, value, change.value);
    		value = ko.unwrap(value);
    		for(var x in value){
    			value[x] = ko.unwrap(value[x]);
    		}
    		
    		switch(change.status){
    		
    		case "added":
    			subscribeToColumns(element, change.value, change.index+1);
	    		$(element).jqGrid('addRowData', change.index + 1, value);
	    		markSelectedRows(element, currentValue);
	    		reloadGrid(element);
	    		break;
    		case "deleted":
    			$(element).jqGrid('delRowData', change.index + 1, value);
    			markSelectedRows(element, currentValue);
    			reloadGrid(element);
    			break;
    		default:
    			console.info(change.status + " is not handled");
    			break;
	    	}
    	}
    }
    
    function reloadGrid(element){
    	var currentPage = $(element).find(".ui-pg-input").val();
    	$(element).setGridParam({page:currentPage}).trigger("reloadGrid");
    }
    
    function subscribeForSelectedItems(element, value){
    	
    	value.selectedItems.subscribe(function(changes){
    		for(var i = 0; i < changes.length; i++){
        		var change = changes[i];
        		
        		var selRows = $(element).jqGrid('getGridParam', 'selarrrow');
        		var rowId = (value.data().indexOf(change.value) + 1 ) + "";
        		
        		switch(change.status){
        		
        		case "added":
        			if(selRows.indexOf(rowId) == -1){
        				$(element).jqGrid('setSelection', rowId , false);
        			}
    	    		break;
        		case "deleted":
        			if(selRows.indexOf( rowId) != -1){
        				$(element).jqGrid('setSelection', rowId , false);
        			}
        			break;
        		default:
        			console.info(change.status + " is not handled");
        			break;
    	    	}
        	}
    	}, null, "arrayChange");
    }

    function clearSelectedItems(value) {
        if (value.selectedItems) {
            value.selectedItems([]);
        };
    }
    
    function markSelectedRows(element, value){
    	//mark rows as selected which are in selectedItems
		for(var i = 0; i < value.selectedItems().length; i++){
			var rowId = (value.data().indexOf(value.selectedItems()[i]) + 1 ) + "";
			$(element).jqGrid('setSelection', rowId, false); 
		}
    }

    function subscribeToSelectEvents(element, value) {
        $(element).jqGrid('setGridParam', {
            onSelectRow: function (id, selected) {
   
            	var selectedItem = value.data()[parseInt(id) - 1];

                if (value.selectedItem && selected) {
                    value.selectedItem(selectedItem);
                }
                if (value.onSelectRow && selected) {
                    value.onSelectRow(id);
                }
                if (value.selectedItems) {
                    if(selected){
                    	value.selectedItems.push(selectedItem);
                    }
                    else{
                    	value.selectedItems.remove(selectedItem);
                    }
                }
            }
        });
        $(element).jqGrid('setGridParam', {
            onSelectAll: function (ids, selected) {
                if (selected) {
                	var arr = [];
                	for(var i = 0; i < value.data().length; i++){
                		if($.inArray(i+1, ids) == -1){
                			arr.push(value.data()[i]);
                		}
                	}
                	value.selectedItems(arr);
                }
                else {
                    value.selectedItems.removeAll();
                }
            }
        });
        
        $(element).jqGrid('setGridParam', {
        	gridComplete: function() {
        		markSelectedRows(element, value);
        	}
        });
    }

    $.fn.tabletogrid = function (settings, bindingContext) {
        settings = settings || {};
        $(this).each(function () {
            if (this.grid) { return; }
            var element = $(this),
                options = { datatype: 'local', colModel: [], colNames: [], height: 'auto', altRows: true },
                pagerOptions = ko.utils.extend({ target: '#pager', rowNum: 10, rowList: [10, 20, 50] }, settings.pager),
                idParamName = settings.rowid || 'id';

            pagerOptions.pager = $(pagerOptions.target).length == 0 ? null : pagerOptions.target;
            $.extend(options, pagerOptions, { width: element.width(), caption: $('caption', element).text(), localReader: { id: idParamName} });
            
            buildColModel(element, options, bindingContext);
            
            var gridOpts = settings.gridOptions;
            if(gridOpts){
            	for(var prop in gridOpts){
            		options[prop] = gridOpts[prop];
            	}
            }
            
            element.empty().jqGrid(options);
        });
    };

    function buildColModel(element, options, bindingContext) {
        var templates = $('td', element);
        $('th', element).each(function () {
            var source = $(this),
                col = source.attr('id') || source.data().field || $.trim($.jgrid.stripHtml(source.html())).split(' ').join('_'),
                model = { name: col, index: col, width: source.width() },
                template = templates.filter('[data-field="' + model.index + '"]');
            $.extend(model, source.data());
            if (template.length > 0) {
                model.template = template;
                model.formatter = createColumnFormatter(bindingContext);
            }
            options.colModel.push(model);
            options.colNames.push(source.html());
        });
    }

    function createColumnFormatter(bindingContext) {
        //use jqgrid support for custom formatters to enable knockout anonymous template syntax
        //http://www.trirand.com/jqgridwiki/doku.php?id=wiki:custom_formatter
        return function knockoutTemplate(cellval, opts, rwd) {
            if (opts.colModel[0]) {
                var element = $(opts.colModel[0]).clone();
                ko.applyBindingsToNode(element[0], { 'with': rwd }, bindingContext.$data);
                return element.html();
            }
            return cellval;
        };
    }
    
})(jQuery);