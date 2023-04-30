/* eslint @typescript-eslint/no-floating-promises: 0 */
import prompts from "prompts";

import { strategySelectionHandler } from "./core/cli/handlers/strategy-selection-handler";
import { print_program_name } from "./helpers/program_name";
import { strategySelectionPrompt } from "./core/cli/prompts/strategy-selection";
import csvParser from "csv-parser";
import path from "path";
import fs from "fs";

(async () => {
    print_program_name();

    const program_ended = false;

    while (!program_ended) {
        const response = await prompts(strategySelectionPrompt);

        await strategySelectionHandler(response);
    }
})();
