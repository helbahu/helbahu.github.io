describe(`Friut Search Core Functions`,()=>{

    it(`The search function accepts a string and filters through the fruit array for all elements that contain the string`,()=>{
        expect(search(`pp`)).toEqual([`Apple`,`Pineapple`,`Custard apple`]);
        expect(search(`lb`)).toEqual([`Bilberry`,`Mulberry`]);
    });

    it(`The showSuggestions function accepts an array and a string, and appends each list element to the suggestions dropdown with the inputVal bold`,()=>{
        showSuggestions([`Test text1`,`Test text2`],`text`);
        let suggestionsList = [...document.querySelectorAll(`.suggestions ul li`)];
        expect(suggestionsList[0].innerHTML).toEqual(`Test <b>text</b>1`);
        expect(suggestionsList[1].innerHTML).toEqual(`Test <b>text</b>2`);
        suggestions.innerHTML = ``;
    })


});
