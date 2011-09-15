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
    			
    			return "Inside Function "+count;
			}
    	}
	}
};

var emptyDirective = {};

var preDirective = {
	'li#animals':function()
	{
	    //alert("inside preDirective funtion: "+this);
		var i = 0;
		var dollar = $;
		var dollarThis = dollar(this);
		dollarThis.each(function(){
			var secondDollar = $;
			var secondDollarThis = secondDollar(this);
			//i++ % 2 ? $(this).fadeOut(3000) : $(this).hide(3000);
			i+=1;
			//alert(i+") inside preDirective each function: "+$(this));
			// add code here to remove the siblings of the 'li' element
		});
	}
};

var postDirective = {
	li:function()
	{
	    //alert("inside postDirective funtion: "+this);
		var i = 0;
		var dollar = $;
		var dollarThis = dollar(this);
		dollarThis.each(function(){
			var secondDollar = $;
			var secondDollarThis = secondDollar(this);
			i++ % 2 ? secondDollarThis.fadeOut(3000) : secondDollarThis.hide(3000);
		});
	}
};


