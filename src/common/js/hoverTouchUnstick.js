/**
 *
 * имитация ховеров для тач-событий
 * source: https://gist.github.com/rcmachado/7303143
 */
export function hoverTouchUnstick() {
    // Check if the device supports touch events
    if ('ontouchstart' in document.documentElement) {
        // Loop through each stylesheet
        for (let sheetI = document.styleSheets.length - 1; sheetI >= 0; sheetI--) {
            const sheet = document.styleSheets[sheetI];
            // Verify if cssRules exists in sheet
            if (sheet.cssRules) {
                // Loop through each rule in sheet
                for (let ruleI = sheet.cssRules.length - 1; ruleI >= 0; ruleI--) {
                    const rule = sheet.cssRules[ruleI];
                    // Verify rule has selector text
                    if (rule.selectorText) {
                        // Replace hover psuedo-class with active psuedo-class
                        rule.selectorText = rule.selectorText.replace(':hover', ':active');
                    }
                }
            }
        }
    }
}