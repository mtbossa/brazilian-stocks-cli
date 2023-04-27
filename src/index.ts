/* eslint @typescript-eslint/no-floating-promises: 0 */
import prompts from "prompts";
import { Spinner } from "cli-spinner";
import chalk from "chalk";

import { AvailableStrategies } from "strategies/available-strategies";
import statusInvest from "scrapers/status-invest/status-invest";
import magicFormula from "strategies/magic-formula/magic-formula";
import strategySelectionPrompt from "./prompts/strategy-selection";
import { print_program_name } from "./helpers/program_name";
import { CHOICE } from "./prompts/choice";
import { strategySelectionHandler } from "./prompts/handlers/strategy-selection-handler";
import { Commands } from "./commands";

(async () => {
    print_program_name();

    const program_ended = false;

    while (!program_ended) {
        const response = await prompts(strategySelectionPrompt);

        await strategySelectionHandler(response);
    }
})();
