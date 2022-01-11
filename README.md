Fall 2020 Browser-based Operating System in TypeScript
=================================================

This is Alan's Operating Systems class initial project.
See https://www.labouseur.com/courses/os/ for details.
It was originally developed by Alan and then enhanced by Bob Nisco and Rebecca Murphy over the years.
Fork this (or clone, but fork is probably better in case Alan changes anything about the initial project) into your own private repository. Or download it as a ZIP file. Then add Alan (userid *Labouseur*) as a collaborator.

Setup TypeScript
================

1. Install the [npm](https://www.npmjs.org/) package manager if you don't already have it.
1. Run `npm install -g typescript` to get the TypeScript Compiler. (You may need to do this as root.)

Command List
===============
ver - Displays the current version data.
            
help - This is the help command. Seek help.

shutdown - Shuts down the virtual OS but leaves the underlying host / hardware simulation running.

cls - Clears the screen and resets the cursor position.

man <topic> - Displays the MANual page for <topic>.

trace <on | off> - Turns the OS trace on or off.

rot13 <string> - Does rot13 obfuscation on <string>.

prompt <string> - Sets the prompt.

date - Displays the current date and time.

whereami - Tells you where you are on Earth.

loz - Displays triforce text art...

status <string> - Sets your preferred status.

bsod - Displays a BSOD message.

load - Load UPI into memory for execution.

run <pid> - Runs a program already loaded in memory.

runall - Execute all programs at once.

clearmem - Clear all memory partitions.

ps - Display the PID and state of all processes.

kill <id> - Kill one process.

killall - Kill all processes.

quantum <int> - Sets the RR (Round Robin) quantum.

create <filename> - Create a new file.

read <filename> - Read and display the contents of a file.

write <filename> - Write the data inside the quotes to the file.

delete <filename> - Remove the file from storage.

format - Initalize all blocks in all sectors in all sectors in all tracks.

ls - List the files currently stored on the disk.

setschedule - Set a specified CPU scheduling algorithm.

getschedule - Return the currently selected CPU scheduling algorithm.

Workflow
=============

Some IDEs (e.g., Visual Studio Code, IntelliJ, others) natively support TypeScript-to-JavaScript compilation 
and have tools for debugging, syntax highlighting, and more.
If your development environment lacks these then you'll need to automate the compilation process with something like Gulp.

- Setup Gulp
1. `npm install -g gulp` to get the Gulp Task Runner.
1. `npm install -g gulp-tsc` to get the Gulp TypeScript plugin.

Run `gulp` at the command line in the root directory of this project.
Edit your TypeScript files in the source/scripts directory.

Gulp will automatically:

* Watch for changes in your source/scripts/ directory for changes to .ts files and run the TypeScript Compiler on them.
* Watch for changes to your source/styles/ directory for changes to .css files and copy them to the distrib/ folder if you have them there.


I find Gulp annoying, so consider use a compile script from the command line.

A Few Notes
===========

**What's TypeScript?**
TypeScript is a language that allows you to write in a statically-typed language that outputs standard JavaScript.
It's all kinds of awesome.

**Why should I use it?**
This will be especially helpful for an OS or a Compiler that may need to run in the browser as you will have all of the great benefits of strong type checking and scope rules built right into your language.

**Where can I get more info on TypeScript**
[Right this way!](http://www.typescriptlang.org/)
