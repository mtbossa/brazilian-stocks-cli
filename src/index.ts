/* eslint @typescript-eslint/no-floating-promises: 0 */
import prompts from "prompts";
import { print_new_line } from "./helpers/new_line.js";

(async () => {
    print_new_line();
    console.log("Estratégia de ações brasileiras.");
    print_new_line();

    const response = await prompts([
        {
            type: "select",
            name: "strategy",
            message: `Selecione uma estratégia para obter os resultados atuais:`,
            choices: [{ title: "Magic Formula - Joel Greenblatt", value: "MAGIC_FORMULA" }],
        },
    ]);
})();
