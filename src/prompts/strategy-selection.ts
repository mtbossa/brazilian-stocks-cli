import { PromptObject } from "prompts";
import { Commands } from "src/commands";
import { AvailableStrategies } from "strategies/available-strategies";
import { Choices } from "./choices";

export const strategySelectionPrompt: PromptObject<Choices.Strategy> = {
    type: "select",
    name: Choices.Strategy,
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
};
