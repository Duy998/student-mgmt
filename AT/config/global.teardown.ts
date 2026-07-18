// config/global.teardown.ts

async function globalTeardown() {

    console.log("========== GLOBAL TEARDOWN ==========");



    console.log("Cleaning test data...");

    console.log("Closing connection...");

    console.log("Generate report...");

    console.log("========== FINISHED ==========");

}

export default globalTeardown;