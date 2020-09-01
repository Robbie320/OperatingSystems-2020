var RobOS;
(function (RobOS) {
    class UserCommand {
        constructor(command = "", args = []) {
            this.command = command;
            this.args = args;
        }
    }
    RobOS.UserCommand = UserCommand;
})(RobOS || (RobOS = {}));
//# sourceMappingURL=userCommand.js.map