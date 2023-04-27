/* eslint @typescript-eslint/no-floating-promises: 0 */
import prompts from "prompts";
import { Spinner } from "cli-spinner";
import chalk from "chalk";

import { AvailableStrategies } from "strategies/available-strategies";
import statusInvest from "scrapers/status-invest/status-invest";
import magicFormula from "strategies/magic-formula/magic-formula";
import strategySelectionPrompt from "./prompts/strategy-selection";
import { print_program_name } from "./helpers/program_name";

(async () => {
    print_program_name();

    const response = await prompts(strategySelectionPrompt);

    if (response.strategy === AvailableStrategies.MagicFormula) {
        const spinner = new Spinner(
            `${chalk.blue.bold("%s")} Calculando ${chalk.green.bold("Magic Formula ranking")}...`
        );
        spinner.setSpinnerString(19);
        spinner.start();
        const result = await statusInvest.scrape();
        const parsed = result.map((stock) => statusInvest.parseToStock(stock));
        const ranked = magicFormula.calculate(parsed);
        spinner.stop(true);
        console.table(ranked);
    }
})();
