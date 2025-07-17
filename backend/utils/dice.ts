// src/utils/dice.ts

/**
 * Rolls a d100 and returns the result.
 * @returns {number} A random integer between 1 and 100.
 */
export const rollD100 = (): number => {
  return Math.floor(Math.random() * 100) + 1;
};
