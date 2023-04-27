import prompts from "prompts";
import { Commands } from "src/commands";
import { CHOICE } from "../choice";
import { AvailableStrategies } from "strategies/available-strategies";
import { Spinner } from "cli-spinner";
import chalk from "chalk";
import statusInvest from "scrapers/status-invest/status-invest";
import magicFormula from "strategies/magic-formula/magic-formula";
import { exit } from "src/helpers/exit";

export const strategySelectionHandler = async (answers: prompts.Answers<string>) => {
    switch (answers[CHOICE]) {
        case AvailableStrategies.MagicFormula:
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
        default:
            exit();
            break;
    }
};
