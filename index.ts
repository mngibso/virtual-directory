import * as fs from "fs"
import Controller from "./controller"

const main = async (fn: string) => {
    const processor = new Controller();
    const commands = fs.readFileSync(fn, 'utf8');
    // send each line in file to command processor
    // output for each command is added to array
    const output = commands
        .split(/\r?\n/)
        .filter( (c) => {
            // ignore blank lines
            return !!c.trim();
        })
        .reduce( (out, command) => {
            return [...out, ...processor.processCmd(command) ]
        }, []);
    // print output of each command
    output.forEach( (o) => console.log(o))
};

const [ cmd, file, fn ] = process.argv;
if (fn === undefined) {
    console.error( `Usage: ${cmd} ${file} <input-file>`);
    process.exit();
}
main(fn);
