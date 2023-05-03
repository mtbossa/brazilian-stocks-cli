import prompts from "prompts";
import { Spinner } from "cli-spinner";
import chalk from "chalk";

import { exit } from "@helpers/exit";
import statusInvest from "@data/scrapers/status-invest/status-invest";
import magicFormula from "@core/strategies/magic-formula/magic-formula";
import config from "@config";
import { Stock } from "@data/models/stock";
import * as Table from "table";
import { printer } from "../printer";
import { PromptName } from "../prompts/strategy-selection/prompt-name";
import { Choices } from "../prompts/strategy-selection";

export const strategySelectionHandler = async (answers: prompts.Answers<PromptName.Name>) => {
    switch (answers[PromptName.Name]) {
        case Choices.MagicFormula: {
            console.clear();

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

            spinner.stop(true);

            console.clear();

            const headers = [
                "Posição",
                "Ticker",
                "Preço",
                "EV/EBIT",
                "Rank EV/EBIT",
                "ROIC",
                "Rank ROIC",
                "Rank Magic Formula",
                "Liquidez Média Diária",
                "Setor",
                "Subsetor",
                "Segmento",
                "Deve excluir?",
            ];
            const stream_config: Table.StreamUserConfig = {
                columnDefault: {
                    width: 10,
                    wrapWord: true,
                },
                columns: {
                    0: {
                        width: 3,
                    },
                    1: {
                        width: 6,
                    },
                    4: {
                        width: 5,
                    },
                    6: {
                        width: 5,
                    },
                    7: {
                        width: 5,
                    },
                    8: {
                        width: 13,
                    },
                    9: {
                        width: 20,
                    },
                    10: {
                        width: 20,
                    },
                    11: {
                        width: 20,
                    },
                    12: {
                        width: 5,
                    },
                },
                columnCount: headers.length,
            };

            await printer
                .resetLastSelectedChoice()
                .setHeaders(headers.map((header) => chalk.bold(header)))
                .setTableConfig(stream_config)
                .setRows(
                    ranked.map((stock, index) => {
                        return [
                            String(index + 1),
                            String(stock.ticker),
                            String(stock.currentPrice),
                            stock.ev_Ebit <= 0
                                ? chalk.red(String(stock.ev_Ebit))
                                : chalk.green(String(stock.ev_Ebit)),
                            String(stock.rankEV_EBIT),
                            stock.roic <= 0
                                ? chalk.red(String(stock.roic) + "%")
                                : chalk.green(String(stock.roic) + "%"),
                            String(stock.rankROIC),
                            String(stock.rankMagicFormula),
                            String(stock.liquidezMediaDiaria),
                            String(stock.setor),
                            String(stock.subsetor),
                            String(stock.segmento),
                            String(
                                stock.shouldExclude
                                    ? chalk.bold.red("Sim")
                                    : chalk.bold.green("Não")
                            ),
                        ];
                    })
                )
                .printTable();

            break;
        }
        default:
            exit();
            break;
    }
};
