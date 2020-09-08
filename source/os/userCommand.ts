module RobOS {
    export class UserCommand {
        constructor(public command:string = "",
                    public args:string[] = []) {
        }
    }
}
