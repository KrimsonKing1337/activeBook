/**
 *
 * @param min {number}
 * @param max {number}
 */
export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}