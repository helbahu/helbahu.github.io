import { useEffect, useState } from "react";
import axios from "axios";
import {v1 as uuid} from "uuid";

const useFlip = (initialValue=true) => {
    const [value,setValue] = useState(initialValue)

    const flip = () => {
        setValue(val => !val);
      };
    
    return [value,flip];
}

const useAxios = (baseUrl,formatData,localStorageKey='') => {
    const [dataList,setDataList] = useState([]);
    const [getData,clearData] = useLocalStorage(localStorageKey,dataList);
    const addToDataList = async (path=null) => {
        const response = await axios.get(path ? baseUrl+'/'+path : baseUrl);
        setDataList(data => [...dataList, { ...formatData(response.data), id: uuid() }]);
    };

    useEffect(()=>{
        if(localStorageKey){
            const savedData = getData();
            console.log(savedData);
            if(savedData)setDataList(data=>savedData);    
        }
    },[])

    const clearDataList = () => {
        setDataList(list=>[]);
        clearData();
    };

    return [dataList,addToDataList,clearDataList];
}


const useLocalStorage = (key,updateList) => {
    const get = () => {
        return JSON.parse(localStorage.getItem(key));
    }
    const set = (val) => {
        const stringVal = JSON.stringify(val);
        localStorage.setItem(key,stringVal);
    }
    const clear = () => {
        localStorage.removeItem(key);
    }

    useEffect(()=>{
        if(updateList.length > 0){
            set(updateList);
        }
    },[updateList])


    return [get,clear];
}


export { useFlip, useAxios, useLocalStorage };