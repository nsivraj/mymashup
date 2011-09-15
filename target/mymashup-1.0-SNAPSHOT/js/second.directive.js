        var directive = {
          'a.theWho':'who', //look for the tag 'a' and place the value of the property 'who' in its node value
          'a.theWho@href':'site' //look for the tag a, and set its attribute 'href' to the value of the property 'site'
        }

        //declaration of the actions PURE has to do
        var animalDirective = {
          'li':{
            'animal<-animals':{
              '.':'animal.name'
            }
          }
        };
