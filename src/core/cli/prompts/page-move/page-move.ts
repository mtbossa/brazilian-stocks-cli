import prompts, { PromptObject } from "prompts";
import { Commands } from "src/commands";
import { PromptName } from "./prompt-name";
import { Choices } from "./choices";

export const pageMovePrompt: (
    currentPage: number,
    totalPages: number,
    lastSelectedChoice?: Choices | Commands
) => PromptObject<PromptName.Name> = (
    currentPage: number,
    totalPages: number,
    lastSelectedChoice?: Choices | Commands
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

    choices.push(
        {
            title: "Voltar para estratégias",
            value: Commands.BackToMenu,
            selected: true,
        },
        {
            title: "Sair do programa",
            value: Commands.Exit,
        }
    );

    const initial = choices.findIndex((choice) => choice.value === lastSelectedChoice);

    return {
        type: "select",
        name: PromptName.Name,
        message: `Selecione uma opção:`,
        initial: initial > -1 ? initial : 0,
        choices,
    };
};
