import { useState } from "react";

const useBoolean = (defaultVal=false) => {
    const [isBoolean,setIsBoolean] = useState(defaultVal);

    const toggleBoolean = () => {
        setIsBoolean(bool=>!bool);
    }
    
    return [isBoolean,toggleBoolean];
}

export default useBoolean;