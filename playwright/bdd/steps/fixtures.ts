import { createBdd, test } from "playwright-bdd";

export { test };
export const { Given, When, Then, Step } = createBdd(test);
