import prompts, { PromptObject } from "prompts";
import { AvailableStrategies } from "@core/strategies/available-strategies";
import { Commands } from "src/commands";
import { PromptName } from "./prompt-name";
import { Choices } from "./choices";

export const pageMovePrompt: (
    currentPage: number,
    amountPerPage: number,
    totalPages: number
) => PromptObject<PromptName.Name> = (
    currentPage: number,
    amountPerPage: number,
    totalPages: number
) => {
    const choices: prompts.Choice[] = [];

    if (totalPages > 1 && !(currentPage === totalPages)) {
        choices.push({
            title: "Próxima página",
            value: Choices.NextPage,
        });
    }

    if (currentPage > 1) {
        choices.push({
            title: "Página anterior",
            value: Choices.PreviousPage,
        });

        choices.push({
            title: "Ir para primeira página",
            value: Choices.FirstPage,
        });
    }

    if (currentPage !== totalPages) {
        choices.push({
            title: "Ir para última página",
            value: Choices.LastPage,
        });
    }

    return {
        type: "select",
        name: PromptName.Name,
        message: `Selecione uma estratégia para obter os resultados atuais:`,
        choices: [
            ...choices,
            {
                title: "Voltar para estratégias",
                value: Commands.BackToMenu,
            },
            {
                title: "Sair do programa",
                value: Commands.Exit,
            },
        ],
    };
};
