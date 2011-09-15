//a plugin to pre-process and post-process the generated HTML
$p.plugins.renderWithPrePost = function(ctxt, directive, preProcess, postProcess)
{
	var sel, action, elms, 
	replace_ = function(pobj)
	{
		//alert("inside replace_: "+pobj);
		//alert("inside replace_: "+pobj.length);
		return { // in javascript you cannot have a 'return' on a line by itself or else the object returned is the 'undefined' object!!!!!!!!!
			with_:function(pobj2)
			{
				//alert("inside replace_.with_: "+pobj.length);
				//alert("inside replace_.with_: "+pobj2.length);
				var i = 0;
				pobj.length = Math.max(pobj.length, pobj2.length);
				for(; i<pobj.length; i++)
				{
					if(typeof pobj2[i] !== 'undefined')
					{
						//alert("inside replace_.with_: "+(typeof pobj[i]));
						//alert("inside replace_.with_: "+(typeof pobj2[i]));
						pobj[i] = pobj2[i];
					}
					else
					{
						//alert("delete inside replace_.with_: "+(typeof pobj[i]));
						delete pobj[i];
					}
				}
			}
		}
	};
	
	if(typeof preProcess !== 'undefined')
	{
		for(sel in preProcess)
		{
			action = preProcess[sel];
			//alert("preProcess action is: "+action);
			if(typeof action === 'function')
			{
				//alert("replace_ : "+replace_);
				//alert("replace_ with this: "+this);
				
				// 'this' is the actual PURE plugin object with
				// methods _compiler, _error, autoRender, compile, find, render, renderWithPrePost
				// and it is also a list of nodes containing the actual
				// nodes found by the this.find method using the selector string
				// passed to the top level invocation
				// of the '$' object that is defined by PURE, i.e. $('ul#template').renderWithPrePost
				//var replaceThis = replace_(this);
				
				//alert("replace_(this): "+replaceThis)
				
				// 'preSel' is a list of nodes containing
				// the actual nodes of the dom document found by the
				// this.find(sel) method and sel is the selector string syntax as
				// defined by PURE or stardard W3C syntax
				var preSel = this.find(sel);
				
				//alert("this.find(sel) : "+preSel);
				//replaceThis.with_( preSel );
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
				//alert("replace_ : "+replace_);
				//alert("replace_ with this: "+this);
				//var replaceThis = replace_(this);
				//alert("replace_(this): "+replaceThis)
				var postSel = this.find(sel);
				//alert("this.find(sel) : "+postSel);
				//replaceThis.with_( postSel );
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

