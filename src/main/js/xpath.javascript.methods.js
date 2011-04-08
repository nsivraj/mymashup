
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getElementXPath(elt)
{
     var path = "";
     for (; elt && elt.nodeType == 1; elt = elt.parentNode)
     {
   	idx = getElementIdx(elt);
	xname = elt.tagName;
	if (idx > 1) xname += "[" + idx + "]";
	path = "/" + xname + path;
     }
 
     return path;	
}

function getElementIdx(elt)
{
    var count = 1;
    for (var sib = elt.previousSibling; sib ; sib = sib.previousSibling)
    {
        if(sib.nodeType == 1 && sib.tagName == elt.tagName)	count++
    }
    
    return count;
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function getXPath(node, path) {
        path = path || [];
        if(node.parentNode) {
          path = getXPath(node.parentNode, path);
        }

        if(node.previousSibling) {
          var count = 1;
          var sibling = node.previousSibling
          do {
            if(sibling.nodeType == 1 && sibling.nodeName == node.nodeName) {count++;}
            sibling = sibling.previousSibling;
          } while(sibling);
          if(count == 1) {count = null;}
        } else if(node.nextSibling) {
          var sibling = node.nextSibling;
          do {
            if(sibling.nodeType == 1 && sibling.nodeName == node.nodeName) {
              var count = 1;
              sibling = null;
            } else {
              var count = null;
              sibling = sibling.previousSibling;
            }
          } while(sibling);
        }

        if(node.nodeType == 1) {
          path.push(node.nodeName.toLowerCase() + (node.id ? "[@id='"+node.id+"']" : count > 0 ? "["+count+"]" : ''));
        }
        return path;
      };


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function get_XPath(elt)
         {var path = '';
          for (; elt && elt.nodeType==1; elt=elt.parentNode)
              {var idx=$(elt.parentNode).children(elt.tagName).index(elt)+1;
               idx>1 ? (idx='['+idx+']') : (idx='');
               path='/'+elt.tagName.toLowerCase()+idx+path;
              }
          return path;
         }
get_XPath(document.getElementsByName('start_price')[0]);

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function eval_xpath(xpath)
             {if (document.evaluate) //firefox
                 {return document.evaluate(xpath, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
                 }
              else //ie
                  {//can not use xmldocument.selectSingleNode(xpath);
                   var tags=xpath.slice(1).split('/');
                   var ele=document;
                   for (var i=0; i<tags.length; ++i)
                       {var idx=1;
                        if (tags[i].indexOf('[')!=-1)
                           {idx=tags[i].split('[')[1].split(']')[0];
                            tags[i]=tags[i].split('[')[0];
                           }
                        ele=$(ele).children(tags[i])[idx-1];
                       }
                   return ele;
                  }
             }


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////


var canCElC = document.evaluate( '//a[@class="canc"]' ,document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );

for (var m = 0; m < canCElC.snapshotLength; m++){

	var im = canCElC.snapshotItem(m);

}

var mems = document.evaluate( '//a[contains(@href, "profile")][ not( @class = "skyblue" )]' ,document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );

for (var l = 0; l < mems.snapshotLength; l++){

	var cThis = mems.snapshotItem(l);

}	

var canHazPics = document.evaluate( '//a[@title= "Click for large image"]' ,document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null ).singleNodeValue;

document.evaluate( 'html/body/div/div[7]/table/tbody/tr[2]/td[ not( contains(@id, "main") )]' ,document, null, XPathResult.ORDERED_NODE_SNAPSHOT_TYPE, null );

for(...

//bravo's xpath function shortcut
// if you don't have $x already
function $x(p, c) {
	var i, r = [], x = document.evaluate(p, c || document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
	while(i=x.iterateNext()) r.push(i);
	return r;
}
//
// a function to change history days in links
//
// Usage: ChangeDays(n); where n is 1, 3, 7, 14, 30 or 60 - not sure what other values may do to poor Simones Site
//
function ChangeDays(d) {
	$x('//a[contains(@href, "/forum-user.cfm?id=")][not(contains(@href, "days="))]').forEach(function(e) {
		e.setAttribute('href', e.getAttribute('href').replace(/cfm\?id=/, 'cfm?days='+d+'&id='));
	});
}


// more bravo stuff

// getById
function $i(id) {
	return document.getElementById(id);
}
// xpath unordered nodes
function $xu(p, c) {
	var i, r = [], x = document.evaluate(p, c || document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
	while(i=x.iterateNext()) r.push(i);
	return r;
}
// xpath ordered nodes
function $xo(p, c) {
	var i, r = [], x = document.evaluate(p, c || document, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE, null);
	while(i=x.iterateNext()) r.push(i);
	return r;
}
// xpath single first node
function $xf(p, c) {
	return document.evaluate(p, c || document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
// xpath single any node
function $xa(p, c) {
	return document.evaluate(p, c || document, null, XPathResult.ANY_UNORDERED_NODE_TYPE, null).singleNodeValue;
}
// getByCLASS(className, orderedFlag);
// untested!!
function $c(cls, o) {
	var fn=$xu;
	if(o) fn=$xo;
	return fn('//*[@class = "'+cls+'"' +
				' or contains(@class, " '+cls+' ")' +
				' or starts-with(@class, "' +cls+' ")' +
				' or substring(@class,string-length(@class)-'+cls.length+')=" '+cls+'"]');
}
// create Element
function $ec(type, attributes){
	var node = document.createElement(type);
	for (var attr in attributes) if (attributes.hasOwnProperty(attr)){
		node.setAttribute(attr, attributes[attr]);
	}
	return node;
}
// delete Element
function $ed(element) {
	element.parentNode.removeChild(element);
}
// insert element after
function $ea(newNode, node) {
	return node.parentNode.insertBefore(newNode, node.nextSibling);
}
// insert element before
function $eb(newNode, node) {
	return node.parentNode.insertBefore(newNode, node);
}
// make element first child of par
function $ef(newNode, par) {
	return par.insertBefore(newNode, par.firstChild);
}
// make element last child of par
function $el(newNode, par) {
	return par.appendChild(newNode);
}



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function getXPathElement(xpath, element){
if(!element){
    element = document;
}
var xpathArray = xpath.split("/");

element = findXPathRoot(xpathArray[0],xpathArray[1],element);

for(var i=1; i<xpathArray.length; i++){
    if(xpathArray[i].toLowerCase()=="html"){
        continue;
    }
    if(!element){
        return element;
    }
    element = getXPathElementByIndex(element.childNodes,xpathArray[i]);         
}
return element;
}


function findXPathRoot(rootPath,htmlPath,element){
if(rootPath == ""&&htmlPath.toLowerCase() == "html"){
    return element.documentElement;
}
return document.getElementsByTagName(rootPath)[0];
}
function getXPathElementByIndex(decendents, xpathSegment){
//seperate the index from the element name
var temp = xpathSegment.split("[");
var elementName = temp[0];
//get the index as a number eg. "9]" to 9
if(temp[1]){
    var elementIndex = temp[1].replace("]", "");
}else{
    var elementIndex = 1;
}
//the number of matching elements
var count = 0;
for(var i=0;i < decendents.length; i++){
    if (decendents[i].nodeName.toLowerCase() == elementName.toLowerCase()) {
        count++;
        if(count==elementIndex){
            return decendents[i];
        }
    }
}
return null;
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////



./lib.js:this.getElementXPath = function(element)
./lib.js:        FBTrace.sysout("getInstanceForStyleSheet href:" + styleSheet.href + " mediaText:" + styleSheet.media.mediaText + " path to ownerNode" + (styleSheet.ownerNode && FBL.getElementXPath(styleSheet.ownerNode)), ownerDocument);
./lib.js:        if (FBTrace.DBG_CSS) FBTrace.sysout("getInstanceForStyleSheet: compare href " + i + " " + curSheet.href + " " + curSheet.media.mediaText + " " + (curSheet.ownerNode && FBL.getElementXPath(curSheet.ownerNode)));
./a11y.js:                    panelA11y.reFocusId = getElementXPath(target);
./a11y.js:            panelA11y.reFocusId = getElementXPath(panelA11y.tabStop);
./a11y.js:                panelA11y.reFocusId = getElementXPath(event.target);
./css.js:            FBTrace.sysout("getElementRules "+rules.length+" rules for "+getElementXPath(element), rules);
./css.js:        this.addOldProperties(this.context, getElementXPath(element), inheritMode, props);
./css.js:                    {rule: element, id: getElementXPath(element),
./reps.js:        var xpath = getElementXPath(elt);
./reps.js:        var xpath = getElementXPath(elt);
./html.js:        var xpath = getElementXPath(node);
./html.js:    this.xpath = getElementXPath(node);
nsivraj@thinkpad-laptop:~/.mozilla/firefox/wd0xqc8k.default/extensions/firebug@software.joehewitt.com/content/firebug$ 



////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////




