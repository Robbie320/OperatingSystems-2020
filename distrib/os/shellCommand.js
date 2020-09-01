var RobOS;
(function (RobOS) {
    class ShellCommand {
        constructor(func, command = "", description = "") {
            this.func = func;
            this.command = command;
            this.description = description;
        }
    }
    RobOS.ShellCommand = ShellCommand;
})(RobOS || (RobOS = {}));
//# sourceMappingURL=shellCommand.js.map