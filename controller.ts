enum CMD {
    CREATE = "CREATE",
    LIST = "LIST",
    MOVE = "MOVE",
    DELETE = "DELETE"
}
const SEPARATOR = "/";
export const INDENT = "  ";

// @ts-ignore
type Dir = Record<string, Dir>;

//** return the object at `dir` */
const traverse = (obj: Dir, dir: string): Dir|null => {
    if (dir === "") {
        return obj
    }
    const dirs = dir.split(SEPARATOR);
    let curr = obj;

    // traverse down the object until we reach the end
    for (let x = 0; x < dirs.length; x++) {
        const d = dirs[x];
        if (!(d in curr)) {
            return null
        }
        curr = curr[d]
    }
    return curr
};

//** return dir structure as indented directory hierarchy */
const asStrings = (dir: Dir, level = 0): string[] => {
    let out: string[] = [];
    const keys = Object.keys(dir);
    keys.sort();
    keys.forEach( (d) => {
        out.push(`${INDENT.repeat(level)}${d}`);
        const subObjects = asStrings(dir[d], level+1);
        out = [...out, ...subObjects]
    });
    return out
};

//** stores the directory structure and operations on the dir structure */
export default class Controller {
    private dir: Dir = {};

    processCmd(input): string[] {
        let response: string[] = [input];
        const [cmd, arg1, arg2] = input.split(/\s+/);
        switch(cmd) {
            case CMD.CREATE:
                this.create(arg1);
                break;
            case CMD.LIST:
                response = [...response, ...this.list()];
                break;
            case CMD.MOVE:
                this.move(arg1, arg2);
                break;
            case CMD.DELETE:
                // check if the directory exists, if not found, add an error message
                const dirs = arg1.split(SEPARATOR);
                dirs.reverse();
                let last: string[] = [];
                let found = true;
                while (dirs.length)  {
                    last.push(dirs.pop());
                    if (traverse(this.dir, last.join(SEPARATOR)) === null) {
                        response.push(`Cannot delete ${arg1} - ${last.pop()} doesn't exist`);
                        found = false;
                        break
                    }
                }
                if (found) {
                    // directory exists, delete it
                    this.delete(arg1)
                }
                break;
            default:
                throw new Error(`Command '${cmd}' not recognized`)
        }
        return response;
    }

    /** delete directory signified by  `dir` */
    private delete(dir: string) {
        const dirs = dir.split(SEPARATOR);
        const del = dirs.pop();
        const curr = traverse(this.dir, dirs.join(SEPARATOR));
        if (curr !== null && typeof del === "string") {
            delete curr[del];
        }
    }

    /** move directory `from` to `to` */
    private move(from: string, to: string) {
        // deep copy `from` value
        let fromDir = traverse(this.dir, from);
        fromDir = fromDir !== null ? JSON.parse(JSON.stringify(fromDir)) : fromDir;
        const toDir = traverse(this.dir, to);
        // get the last dir name
        const dir = from.split(SEPARATOR).pop();
        if (!dir || fromDir === null || toDir === null) {
            return
        }
        // copy dir structure at `from` to `to`
        toDir[dir] = fromDir;
        // delete `from`
        this.delete(from)
    }

    /** Return of list of directories in alphabetical order as array of strings,
     *  indent to show hierarchy
     */
    private list(): string[] {
        return asStrings(this.dir)
    }

    /** create the directory signified by the parameter */
    private create(dir: string) {
        if (dir === "") {
            return
        }
        let current = this.dir;
        dir.split(SEPARATOR)
            .forEach( (d) => {
                if (!d) {
                    return
                }
                if(!(d in current)) {
                    current[d] = {};
                }
                current = current[d];
            });
    }
}
