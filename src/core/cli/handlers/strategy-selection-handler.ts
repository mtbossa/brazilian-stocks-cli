import prompts from "prompts";
import { Spinner } from "cli-spinner";
import chalk from "chalk";

import { exit } from "@helpers/exit";
import { Choices } from "@core/cli/prompts/choices";
import { AvailableStrategies } from "@core/strategies/available-strategies";
import statusInvest from "@data/scrapers/status-invest/status-invest";
import magicFormula from "@core/strategies/magic-formula/magic-formula";

export const strategySelectionHandler = async (answers: prompts.Answers<Choices.Strategy>) => {
    switch (answers[Choices.Strategy]) {
        case AvailableStrategies.MagicFormula: {
            const spinner = new Spinner(
                `${chalk.blue.bold("%s")} Calculando ${chalk.green.bold(
                    "Magic Formula ranking"
                )}...`
            );
            spinner.setSpinnerString(19);
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
