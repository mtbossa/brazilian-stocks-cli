import { PromptObject } from "prompts";
import { Choices } from "./choices";
import { AvailableStrategies } from "@core/strategies/available-strategies";
import { Commands } from "src/commands";

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
