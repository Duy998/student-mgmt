import {pageTest, expect} from "@fixtures/pages.fixture"
import { UserApi } from "@API/user.api";

export { expect };
/**
 * Extends pageTest by adding API fixtures.
 *
 * After extension, all test cases using `apiTest`
 * will also have the `userApi` fixture available.
 */
export const apiTest = pageTest.extend<{
    // Declare the fixture data type.
    // VS Code will recognize userApi as the UserApi class.
    userApi: UserApi;

}>({
    /**
     * Fixture for creating UserApi.
     *
     * Playwright only runs this function when a test case
     * actually requires `userApi`.
     *
     * Setup:
     *   - Initialize UserApi
     *
     * use():
     *   - Pass the object to the test case
     *
     * After use():
     *   - Cleanup (if any)
    */
    userApi: async ({}, use) => {
        await use(new UserApi());
    }

});