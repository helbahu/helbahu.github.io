import { render, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import Board from './Board';

// test("",()=>{})
test("renders without crashing",()=>{
  render(<Board/>);
})

test("matches snapshot",()=>{
  const {asFragment} = render(<Board />);
  expect(asFragment()).toMatchSnapshot();
})

test("color depends on the isLit prop", function() {
    // made chanceLightIsOn to be 100% so w know what to expect.
    const { container } = render(<Board chanceLightStartsOn={1}/>);


  // expect a lit light to have the 'Cell-lit class'. Starting out all cells have this class.
    let cellList = container.querySelectorAll('td');
    // This list has all cells (indexes):
        //  0   1   2
        //  3   4   5
        //  6   7   8

    expect(cellList.length).toBe(9);
  expect(cellList[0]).toHaveClass('Cell-lit');
  expect(cellList[1]).toHaveClass('Cell-lit');
  expect(cellList[2]).toHaveClass('Cell-lit');
  expect(cellList[3]).toHaveClass('Cell-lit');

  // Fireevent on the top left corner Cell.
  const topLeftCell = cellList[0];
  fireEvent.click(topLeftCell);
    //TopLeftCell when clicked, O = on, X = off:
        //  O   O   O       X   X   O
        //  O   O   O   ==> X   O   O
        //  O   O   O       O   O   O

  expect(cellList[0]).not.toHaveClass('Cell-lit');
  expect(cellList[1]).not.toHaveClass('Cell-lit');
  expect(cellList[2]).toHaveClass('Cell-lit');
  expect(cellList[3]).not.toHaveClass('Cell-lit');

});
