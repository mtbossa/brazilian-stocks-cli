import prompts from "prompts";
import { PromptName } from "../prompts/page-move";
import { Choices } from "../prompts/page-move/choices";
import { Commands } from "src/commands";
import { exit } from "@helpers/exit";
import { strategySelectionPrompt } from "../prompts/strategy-selection";
import { strategySelectionHandler } from "./strategy-selection-handler";

export enum PageMoveResult {
    NextPage = "NEXT_PAGE",
    PreviousPage = "PREVIOUS_PAGE",
    FirstPage = "FIRST_PAGE",
    LastPage = "LAST_PAGE",
}

export const pageMoveHandler = async (answers: prompts.Answers<PromptName.Name>) => {
    switch (answers[PromptName.Name]) {
        case Choices.NextPage:
            return PageMoveResult.NextPage;
        case Choices.PreviousPage:
            return PageMoveResult.PreviousPage;
        case Choices.FirstPage:
            return PageMoveResult.FirstPage;
        case Choices.LastPage:
            return PageMoveResult.LastPage;
        case Commands.BackToMenu: {
            const response = await prompts(strategySelectionPrompt);

            await strategySelectionHandler(response);
            break;
        }
        case Commands.Exit:
            exit();
            break;
    }
};
