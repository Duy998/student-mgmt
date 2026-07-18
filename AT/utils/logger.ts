import { APIResponse } from "@playwright/test";

export async function logApi(
    name: string,
    method: string,
    url: string,
    requestBody: unknown,
    response: APIResponse
) {
    console.log(`
========================================================
🚀 API     : ${name}
🌐 URL     : ${url}
📌 METHOD  : ${method}

📤 REQUEST
--------------------------------------------------------
${JSON.stringify(requestBody, null, 2)}

📥 RESPONSE
--------------------------------------------------------
Status : ${response.status()}

${await response.text()}
========================================================
`);
}