import answers from './answers';
import colorsList from './colors';
import EightBall from './EightBall';
import ColorBoxes from './ColorBoxes';


function App() {
  return (
    <div>
      <EightBall answers={answers} />
      <ColorBoxes colorList={colorsList}/>
    </div>
  );
}

export default App;