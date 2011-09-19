    //note the use of render instead of autoRender and the 2nd parameter with directive
    $('div#template').render(data, directive);
    $('div#templer').render(data, directive);

    // note the use of render instead of autoRender
    //$('ul#template').render(animalData, animalDirective);
    $('ul#template').renderWithPrePost(animalData, animalDirective, preDirective, emptyDirective);
