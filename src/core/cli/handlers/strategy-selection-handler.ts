import prompts from "prompts";
import { Spinner } from "cli-spinner";
import chalk from "chalk";

import { exit } from "@helpers/exit";
import { Choices } from "@core/cli/prompts/choices";
import { AvailableStrategies } from "@core/strategies/available-strategies";
import statusInvest from "@data/scrapers/status-invest/status-invest";
import magicFormula from "@core/strategies/magic-formula/magic-formula";
import config from "@config";
import { print_new_line } from "@helpers/new_line";

export const strategySelectionHandler = async (answers: prompts.Answers<Choices.Strategy>) => {
    switch (answers[Choices.Strategy]) {
        case AvailableStrategies.MagicFormula: {
            print_new_line();

            const spinner = new Spinner(
                `${chalk.blue.bold("%s")} Calculando ranking da ${chalk.green.bold(
                    "Magic Formula"
                )}...`
            );
            spinner.setSpinnerString(config.spinnerId);
            spinner.start();

            const result = await statusInvest.scrape();
            const parsed = result.map((stock) => statusInvest.parseToStock(stock));
            const ranked = magicFormula.calculate(parsed);

            spinner.stop(true);

            console.table(ranked);

            break;
        }
        default:
            exit();
            break;
    }
};
