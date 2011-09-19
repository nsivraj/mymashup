var directive = {
	'a#theWho':'who', //look for the tag 'a' and place the value of the property 'who' in its node value
	'a#theWho@href':'site' //look for the tag a, and set its attribute 'href' to the value of the property 'site'
};

//declaration of the actions PURE has to do
var count=0;
var animalDirective = {
	'li#animals':{
    	'animal<-someAnimals':{
			'.':function(arg)
			{
    	        count+=1;
    			//alert(count+") "+arg); // arg is the passed in argument
    			//alert(count+") arg.context: "+arg.context); // not sure what arg.context is yet
    			//alert(count+") arg.animal: "+arg.animal); // arg.animal is the current json data object and is equal to arg.animal.item
    			//alert(count+") arg.animal.item: "+arg.animal.item); // arg.animal.item is the actual current item and is equal to arg.animal.items[arg.pos]
    			//alert(count+") arg.animal.items: "+arg.animal.items); // arg.animal.items is the actual list of items from the json data source
    			//alert(count+") arg.animal.items.length: "+arg.animal.items.length); // arg.animal.items.length is the actual number of items in arg.animal.items 
    			//alert(count+") arg.pos: "+arg.pos); // arg.pos is the index of the current item (arg.animal.item) in the items array
    			//alert(count+") this: "+this); // not sure what 'this' is referring to yet
    			
    			// add code to remove all sibling nodes
    			
    			return "Inside Function "+count+" :: "+arg.item.name;
			}
    	}
	}
};


var emptyDirective = {};

var preDirective = {
	'li#animals':function()
	{
		$(this).removeAllSiblings();
	}
};

var postDirective = {
	li:function()
	{
		var i=0;
		$(this).each(function(){
			//i++ % 2 ? $(this).fadeOut(3000) : $(this).hide(3000);
			$(this).hide(3000);
		});
	}
};


