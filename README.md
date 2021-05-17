
# Virtual Directory tree
A common method of organizing files on a computer is to store them in hierarchical directories. For instance:

Run a series of commands to create a list a virtual directory tree.

See `input.txt` for example.

## prerequisites
typescript and ts-node must be installed globally
```bash
npm install -g typescript
npm install -g ts-node
```

## install
```bash
git clone https://github.com/mngibso/virtual-directory.git
cd virtual-directory
npm install
```

## run
Reads from file specified in command line.
```bash
ts-node index.ts ./input.txt
```

## testing
```bash
npm test
```
