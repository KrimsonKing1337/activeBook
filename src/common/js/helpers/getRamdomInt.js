/**
 *
 * @param min {number}
 * @param max {number}
 */
export function getRandomInt(min, max) {
  return Math.floor(min + Math.random() * (max + 1 - min));
}
