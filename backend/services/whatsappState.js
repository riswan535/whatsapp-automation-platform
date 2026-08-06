let isLoggingOut = false;
let isBackingUp = false;

module.exports = {

    get isLoggingOut() {
        return isLoggingOut;
    },

    set isLoggingOut(value) {
        isLoggingOut = value;
    },

    get isBackingUp() {
        return isBackingUp;
    },

    set isBackingUp(value) {
        isBackingUp = value;
    }

};