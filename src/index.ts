/* eslint @typescript-eslint/no-floating-promises: 0 */
import prompts from "prompts";
import { strategySelectionPrompt } from "./prompts/strategy-selection";
import { print_program_name } from "./helpers/program_name";
import { strategySelectionHandler } from "./handlers/strategy-selection-handler";

(async () => {
    print_program_name();

    const program_ended = false;

    while (!program_ended) {
        const response = await prompts(strategySelectionPrompt);

        await strategySelectionHandler(response);
    }
})();
