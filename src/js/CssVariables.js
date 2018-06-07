export class CssVariables {
    constructor() {

    }

    /**
     *
     * @param variableName {string}
     */
    static get(variableName) {
        const bodyStyles = window.getComputedStyle(document.body);

        return bodyStyles.getPropertyValue(variableName);
    }

    /**
     *
     * @param variableName {string}
     * @param newValue {string}
     */
    static set(variableName, newValue) {
        document.body.style.setProperty(variableName, newValue);
    }
}