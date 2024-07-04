import { render, fireEvent } from "@testing-library/react";
import '@testing-library/jest-dom'
import Coin from "./Coin";
import coinObj from "./coinObj";

it("renders without crashing",()=>{
    render(<Coin />)
})
  
it("matches snapshot",()=>{
const {asFragment} = render(<Coin />)
expect(asFragment()).toMatchSnapshot();
})

it("hides the coin image when the page loads", ()=>{
    const { container } = render(
        <Coin />
      );
      // expect coin image not to be in the document
      expect(
        container.querySelector('img')
      ).not.toBeInTheDocument();
    
}) 

it("shows the coin image when you click the button", ()=>{
    const { container } = render(
        <Coin />
    );
    // expect coin image not to be in the document when it loads
    expect(
        container.querySelector('img')
    ).not.toBeInTheDocument();

    // move forward in the carousel
    const button = container.querySelector(".Coin-Btn");
    fireEvent.click(button);

    // expect coin image to be in the document when button is clicked
    expect(
        container.querySelector('img')
    ).toBeInTheDocument();

    // expect coin src image to be one of the images in coinObj
    const coin = container.querySelector('img');
    const coinImgArr = coin.src.split("/")
    const coinImg = coinImgArr[coinImgArr.length-1]
    expect([coinObj[0].src,coinObj[1].src]).toContain(coinImg)
      
}) 
