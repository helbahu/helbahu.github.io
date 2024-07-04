import { render, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import Card from "./Card.js";
import TEST_IMAGES from "./_testCommon.js";

it("renders without crashing",()=>{
    const img = TEST_IMAGES[0];
    render(<Card caption={img.caption} src={img.src} currNum={1} totalNum={3} />);    
})

it("matches snapshot",()=>{
    const img = TEST_IMAGES[0];
    const {asFragment} = render(<Card caption={img.caption} src={img.src} currNum={1} totalNum={3} />);
    expect(asFragment()).toMatchSnapshot();
})
