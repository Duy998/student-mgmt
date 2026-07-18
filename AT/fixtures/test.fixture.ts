import {apiTest, expect } from "@fixtures/api.fixture"


export { expect };
/**
 * Extends pageTest by adding API fixtures.
 *
 * After extension, all test cases using `apiTest`
 * will also have access to the `userApi` fixture.
 */
export const test = apiTest.extend<{
    // Declare the fixture data type.

}>({


});