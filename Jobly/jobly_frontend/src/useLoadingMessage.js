import { useState } from "react";

const useLoadingMessage = (initialState=true) => {
    const [isLoading,setIsLoading] = useState(initialState);

    const changeLoadingState = (state=false) => {
        setIsLoading(bool=>state);
    }

    const LoadingMessage = ({children,text=false}) => {
        return(
            <>
                {isLoading ? 
                    (text ? "...Loading":<h4>...Loading</h4>):
                    <>
                        {children}
                    </>
                }
            </>
        )

    }

    return[LoadingMessage,changeLoadingState];

}
export default useLoadingMessage;