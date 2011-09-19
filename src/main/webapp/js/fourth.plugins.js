$p.plugins.removeAllSiblings = function()
{
	// add code here to remove ALL the siblings of the selected element
	var nodesToRemove = [];
	for(var j=0; j < this.length; j++)
	{
		var parentsChildren = this[j].parentNode.children;
		for(var i=0; i < parentsChildren.length; i++)
		{
			if(parentsChildren[i] !== this[j])
			{
				//this[j].parentNode.removeChild(parentsChildren[i]);
				nodesToRemove.push(this[j].parentNode);
				nodesToRemove.push(parentsChildren[i]);
			}
		}			
	}
	
	for(var k=0; k < nodesToRemove.length; k+=2)
	{
		//k is parentNode
		nodesToRemove[k].removeChild(nodesToRemove[k+1]);
	}

}


//register removeAllSiblings as a jquery extension
jQuery.fn.extend({
	removeAllSiblings:function()
	{ 
		return jQuery( $p( this[0] ).removeAllSiblings(  ) ); 
	}
});

//a plugin to pre-process and post-process the generated HTML
$p.plugins.renderWithPrePost = function(ctxt, directive, preProcess, postProcess)
{
	var sel, action, elms;
	
	if(typeof preProcess !== 'undefined')
	{
		for(sel in preProcess)
		{
			action = preProcess[sel];
			//alert("preProcess action is: "+action);
			if(typeof action === 'function')
			{
				// 'this' is the actual PURE plugin object with
				// methods _compiler, _error, autoRender, compile, find, render, renderWithPrePost
				// and it is also a list of nodes containing the actual
				// nodes found by the this.find method using the selector string
				// passed to the top level invocation
				// of the '$' object that is defined by PURE, i.e. $('ul#template').renderWithPrePost
				
				// 'preSel' is a list of nodes containing
				// the actual nodes of the dom document found by the
				// this.find(sel) method and sel is the selector string syntax as
				// defined by PURE or stardard W3C syntax
				var preSel = this.find(sel);
				
				//alert("this.find(sel) : "+preSel);
				//action.call(this);
				action.call(preSel);
			}
		}
	} 
	
	this.render( ctxt, directive );
	
	if(typeof postProcess !== 'undefined')
	{
		for(sel in postProcess)
		{
			action = postProcess[sel];
			//alert("postProcess action is: "+action);
			if(typeof action === 'function')
			{
				var postSel = this.find(sel);
				//alert("this.find(sel) : "+postSel);
				//action.call(this);
				action.call(postSel);
			}
		}
	} 
	
	return this;
};

//register renderWithPrePost as a jquery extension
jQuery.fn.extend({
	renderWithPrePost:function(ctxt, directive, preProcess, postProcess)
	{ 
		return jQuery( $p( this[0] ).renderWithPrePost( ctxt, directive, preProcess, postProcess ) ); 
	}
});

