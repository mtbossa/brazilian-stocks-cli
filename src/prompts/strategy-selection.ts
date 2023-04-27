import { PromptObject } from "prompts";
import { Commands } from "src/commands";
import { AvailableStrategies } from "strategies/available-strategies";
import { CHOICE } from "./choice";

export default [
    {
        type: "select",
        name: CHOICE,
        message: `Selecione uma estratégia para obter os resultados atuais:`,
        choices: [
            {
                title: "Magic Formula - Joel Greenblatt",
                value: AvailableStrategies.MagicFormula,
            },
            {
                title: "Sair do programa",
                value: Commands.Exit,
            },
        ],
    } as PromptObject,
] as PromptObject[];
