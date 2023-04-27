/* eslint @typescript-eslint/no-floating-promises: 0 */
import prompts from "prompts";
import { Spinner } from "cli-spinner";
import chalk from "chalk";

import { print_new_line } from "./helpers/new_line";
import { AvailableStrategies } from "strategies/available-strategies";
import statusInvest from "scrapers/status-invest/status-invest";
import magicFormula from "strategies/magic-formula/magic-formula";

(async () => {
    print_new_line();
    console.log("Estratégia de ações brasileiras.");
    print_new_line();

    const response = await prompts([
        {
            type: "select",
            name: "strategy",
            message: `Selecione uma estratégia para obter os resultados atuais:`,
            choices: [
                {
                    title: "Magic Formula - Joel Greenblatt",
                    value: AvailableStrategies.MagicFormula,
                },
            ],
        },
    ]);

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
