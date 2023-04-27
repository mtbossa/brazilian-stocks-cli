import { PromptObject } from "prompts";
import { AvailableStrategies } from "strategies/available-strategies";

export default [
    {
        type: "select",
        name: "strategy",
        message: `Selecione uma estratégia para obter os resultados atuais:`,
        choices: [
            {
                title: "Magic Formula - Joel Greenblatt",
                value: AvailableStrategies.MagicFormula,
            },
        ],
    } as PromptObject,
] as PromptObject[];
