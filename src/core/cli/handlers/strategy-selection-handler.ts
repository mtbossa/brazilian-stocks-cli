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
import { Stock } from "@data/models/stock";
import { table, TableUserConfig } from "table";

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

            const stocks: Stock[] = [];

            for (const stock of result) {
                const parsed = await statusInvest.parseToStock(stock);
                stocks.push(parsed);
            }

            const ranked = magicFormula.calculate(stocks);

            const table_config: TableUserConfig = {
                columns: {
                    3: {
                        width: 5,
                    },
                    6: {
                        width: 5,
                    },
                    7: {
                        width: 20,
                    },
                    8: {
                        width: 20,
                    },
                    9: {
                        width: 20,
                    },
                    10: {
                        width: 5,
                    },
                },
            };

            console.log(
                table(
                    [
                        [
                            "Ticker",
                            "Preço",
                            "EV/EBIT",
                            "Rank EV/EBIT",
                            "ROIC",
                            "Rank ROIC",
                            "Rank Magic Formula",
                            "Setor",
                            "Subsetor",
                            "Segmento",
                            "Deve excluir?",
                        ],
                        ...ranked
                            .map((stock) => {
                                return [
                                    stock.ticker,
                                    stock.currentPrice,
                                    stock.ev_Ebit,
                                    stock.rankEV_EBIT,
                                    stock.roic,
                                    stock.rankROIC,
                                    stock.rankMagicFormula,
                                    stock.setor,
                                    stock.subsetor,
                                    stock.segmento,
                                    stock.shouldExclude ? "Sim" : "Não",
                                ];
                            })
                            .reverse(),
                    ],
                    table_config
                )
            );

            spinner.stop(true);

            break;
        }
        default:
            exit();
            break;
    }
};
