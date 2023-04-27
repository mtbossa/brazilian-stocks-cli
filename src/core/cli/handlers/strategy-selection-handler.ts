import prompts from "prompts";
import { Choices } from "../prompts/choices";
import { AvailableStrategies } from "src/core/strategies/available-strategies";
import { Spinner } from "cli-spinner";
import chalk from "chalk";
import magicFormula from "src/core/strategies/magic-formula/magic-formula";
import { exit } from "src/helpers/exit";
import statusInvest from "src/data/scrapers/status-invest/status-invest";

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
