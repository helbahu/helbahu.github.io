import { render, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import Cell from './Cell';

// test("",()=>{})
test("renders without crashing",()=>{
  render(<Cell isLit={true} flipCellsAroundMe={null}/>)
})

test("matches snapshot",()=>{
  const {asFragment} = render(<Cell isLit={true} flipCellsAroundMe={null}/>)
  expect(asFragment()).toMatchSnapshot();
})

test("color depends on the isLit prop", function() {
  const { container } = render(<Cell isLit={true} flipCellsAroundMe={null}/>);

  // expect a lit light to have the 'Cell-lit class'
  expect(
    container.querySelector('.Cell-lit')
  ).toBeInTheDocument();

});
