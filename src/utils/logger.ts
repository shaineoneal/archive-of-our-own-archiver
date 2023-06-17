const log = (function (environment) {
    //if (environment === "production") {
    //    return () => { }
    //}
    return (...args: any) => {
        console.log(...args)
    }
})(process.env.NODE_ENV);


export {
    log
};
