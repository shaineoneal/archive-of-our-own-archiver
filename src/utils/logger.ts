const log = (function (environment) {
    if (environment === 'development') {
        return (...args: any) => console.log(...args);
    } else {
        return function () {}
    }
})(process.env.NODE_ENV)

export default log;
