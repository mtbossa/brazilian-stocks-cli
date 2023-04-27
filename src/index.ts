import prompts from "prompts";
import { print_new_line } from "./helpers/new_line.js";

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
