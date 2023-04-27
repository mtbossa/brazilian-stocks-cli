import chalk from "chalk";
import { print_new_line } from "./new_line";

export const print_program_name = () => {
    print_new_line();
    console.log(
        `${chalk.bold(
            `Estratégia de ${chalk.greenBright("ações")} ${chalk.yellowBright("brasileiras")}.`
        )}`
    );
    print_new_line();
};
