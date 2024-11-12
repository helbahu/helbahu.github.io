
class useLocalStorage {
    static getToken = () => {

        const signInTime = localStorage.getItem("eventBookSignInTime");
        const timeSinceSignIn = Date.now() - Number(signInTime);
        // 86400000 is 24h
        return timeSinceSignIn < 86400000 ? localStorage.getItem("eventBookUserToken"):null;
    }
    static setToken = (token:string) => {
        localStorage.setItem("eventBookUserToken",token);
        localStorage.setItem("eventBookSignInTime",`${Date.now()}`)
    }
    static removeToken = () => {
        localStorage.removeItem("eventBookUserToken");
    }
    static getUserId = () => {
        const signInTime = localStorage.getItem("eventBookSignInTime");
        const timeSinceSignIn = Date.now() - Number(signInTime);
        // 86400000 is 24h
        return timeSinceSignIn < 86400000 ? localStorage.getItem("eventBookUserId"):null;
    }
    static setUserId = (id:string) => {
        localStorage.setItem("eventBookUserId",id);
    }
    static removeUserId = () => {
        localStorage.removeItem("eventBookUserId");
    }


}

export default useLocalStorage;