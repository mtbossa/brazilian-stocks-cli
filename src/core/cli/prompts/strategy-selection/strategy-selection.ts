import { PromptObject } from "prompts";
import { Commands } from "src/commands";
import { PromptName } from "./prompt-name";
import { Choices } from "./choices";

export const strategySelectionPrompt: PromptObject<PromptName.Name> = {
    type: "select",
    name: PromptName.Name,
    message: `Selecione uma estratégia para obter os resultados atuais:`,
    choices: [
        {
            title: "Magic Formula - Joel Greenblatt",
            value: Choices.MagicFormula,
        },
        {
            title: "Sair do programa",
            value: Commands.Exit,
        },
    ],
};
