// need to get this data from a JSON server side request

var templateDeferred = $.get('/templates/user.html');
var directiveDeferred = $.getJson('/directives/user');
var dataDeferred = $.getJson('/dataService/user?id=1');

$.when(templateDeferred, directiveDeferred, dataDeferred).done(function() {
//render and insert the template here

}); 

/*    var data = {'who':'BeeBole!', site:'http://beebole.com'};

    var animalData = {
      someAnimals:[
        {name:'mouse'},
        {name:'cat'},
        {name:'bird'},
        {name:'shoe in'},
        {name:'dog'}
      ]
    };
*/