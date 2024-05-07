/** Command-line tool to generate Markov text. */

const { MarkovMachine } = require('./markov')


describe('Testing the MarkovMachine class',()=>{

    test('Tests MarkovMachine instance with text',()=>{
        const markovInstance = new MarkovMachine('The sun dipped below the horizon, casting a warm glow across the tranquil meadow. Birds chirped in the nearby trees, their melodies blending with the soft rustling of leaves. A gentle breeze carried the scent of wildflowers, and the grass swayed in response. As evening settled in, the world seemed to hold its breath, waiting for the night to unfold.');
        expect(markovInstance.chains['the']).toEqual(['horizon','tranquil','nearby','soft','scent','grass','world','night']);

        const markovText = markovInstance.makeText(numWords=20);
        let markovTextArr = markovText.split(' ');
        expect(markovTextArr.length).toEqual(20);

    })

    test('Tests MarkovMachine instance with a file',()=>{
        const markovInstance = new MarkovMachine('test.txt',type='file')
        MarkovMachine.readFile('test.txt',(data)=>{
            let words = data.split(/[ \s\r\n]+/);
            markovInstance.words = words.filter(c => c !== "");
            markovInstance.makeChains();                          
            expect(markovInstance.chains['run']).toEqual([null,'away','cold'])
            
            const markovText = markovInstance.makeText(numWords=40);
            let markovTextArr = markovText.split(' ');
            expect(markovTextArr.length).toEqual(40);
    

        })


    })

    test('Tests MarkovMachine instance with a url',()=>{
        let url = 'http://www.gutenberg.org/files/11/11-0.txt';
        const markovInstance = new MarkovMachine(url,type='file')
        MarkovMachine.readUrl(url,(data)=>{
            let words = data.split(/[ \s\r\n]+/);
            markovInstance.words = words.filter(c => c !== "");
            markovInstance.makeChains();                              

            const markovText = markovInstance.makeText();
            let markovTextArr = markovText.split(' ');
            expect(markovTextArr.length).toEqual(100);

        })

    })


    // test('',()=>{
        
    // })
    

})

