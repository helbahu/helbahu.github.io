import { useState } from "react";

const useToggle = (initialValue) => {
    const [value,setValue] = useState(initialValue)

    const toggle = () => {
        setValue(val => !val);
      };
    
    return [value,toggle];
}
export default useToggle;