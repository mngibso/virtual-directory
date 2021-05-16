import { expect } from "chai";
import Controller from "../controller"

describe("Controller", () => {
    let controller;
    describe("processCommand", () => {
        beforeEach(() => {
            controller = new Controller();
        });
        afterEach(() => {
        });
        it("should throw an error if invalid command is sent", () => {
            const invalid = "foo";
            expect(() => controller.processCmd(invalid)).to.throw()
        });
        it("should echo the CREATE command", () => {
            const cmd = "CREATE blah";
            const echo = controller.processCmd(cmd);
            expect(echo).to.eql([cmd])
        });
        it("CREATE command should create a directory", () => {
            const cmd = "CREATE foo";
            const list = "LIST";
            const exp = ["LIST","foo"];
            controller.processCmd(cmd);
            const out = controller.processCmd(list) ;
            expect(out).to.eql(exp)
        });
        it("LIST command should return directories in order", () => {
            const cmd1 = "CREATE foo";
            controller.processCmd(cmd1);
            const cmd2 = "CREATE bar";
            controller.processCmd(cmd2);
            const cmd3 = "CREATE bar/c";
            controller.processCmd(cmd3);
            const cmd4 = "CREATE bar/d";
            controller.processCmd(cmd4);
            const cmd6 = "CREATE foo/1";
            controller.processCmd(cmd6);
            const cmd7 = "CREATE foo/1/b";
            controller.processCmd(cmd7);
            const cmd8 = "CREATE foo/0";
            controller.processCmd(cmd8);
            const cmd5 = "CREATE bar/a";
            controller.processCmd(cmd5);
            const cmd9 = "CREATE foo/1/a";
            controller.processCmd(cmd9);
            const list = "LIST";
            const exp = ["LIST","bar", "  a", "  c", "  d","foo","  0","  1","    a","    b" ];
            const out = controller.processCmd(list) ;
            expect(out).to.eql(exp)
        });
        it("DELETE command should remove the directory", () => {
            const cmd1 = "CREATE foo";
            const cmd2 = "CREATE foo/bar";
            const cmd3 = "DELETE foo/bar";
            const list = "LIST";
            const exp = ["LIST","foo"];
            controller.processCmd(cmd1);
            controller.processCmd(cmd2);
            controller.processCmd(cmd3);
            const out = controller.processCmd(list) ;
            expect(out).to.eql(exp)
        });
        it("MOVE command should move the directory", () => {
            const cmd1 = "CREATE foo";
            const cmd2 = "CREATE foo/bar";
            const cmd3 = "CREATE barfoo";
            const cmd4 = "CREATE foo/bar/BBB";
            const cmd5 = "CREATE foo/bar/AAA";
            const cmd6 = "MOVE foo/bar barfoo";

            const list = "LIST";
            const exp = ["LIST","barfoo","  bar", "    AAA", "    BBB", "foo"];
            controller.processCmd(cmd1);
            controller.processCmd(cmd2);
            controller.processCmd(cmd3);
            controller.processCmd(cmd4);
            controller.processCmd(cmd5);
            controller.processCmd(cmd6);
            const out = controller.processCmd(list) ;
            expect(out).to.eql(exp)
        });
        it("DELETE command should delete the directory", () => {
            const cmd1 = "CREATE foo";
            const cmd2 = "CREATE foo/bar";
            const cmd3 = "CREATE barfoo";
            const cmd4 = "DELETE foo/bar";
            const list = "LIST";
            const exp = ["LIST", "barfoo", "foo"];
            controller.processCmd(cmd1);
            controller.processCmd(cmd2);
            controller.processCmd(cmd3);
            controller.processCmd(cmd4);
            const out = controller.processCmd(list) ;
            expect(out).to.eql(exp)
        });
        it("DELETE command should return a message if the directory doesn't exist", () => {
            const cmd1 = "CREATE foo";
            const cmd2 = "CREATE foo/bar";
            const cmd3 = "CREATE barfoo";
            const cmd4 = "DELETE barfoo/bar";
            const exp = [cmd4, "Cannot delete barfoo/bar - bar doesn't exist" ];
            controller.processCmd(cmd1);
            controller.processCmd(cmd2);
            controller.processCmd(cmd3);
            const out = controller.processCmd(cmd4) ;
            expect(out).to.eql(exp)
        });
        it("DELETE command should return a message containing the directory that doesn't exist", () => {
            const cmd1 = "CREATE foo";
            const cmd2 = "CREATE foo/bar";
            const cmd3 = "CREATE barfoo";
            const cmd4 = "DELETE invalid/bar";
            const exp = [cmd4, "Cannot delete invalid/bar - invalid doesn't exist" ];
            controller.processCmd(cmd1);
            controller.processCmd(cmd2);
            controller.processCmd(cmd3);
            const out = controller.processCmd(cmd4) ;
            expect(out).to.eql(exp)
        });
    });
});
