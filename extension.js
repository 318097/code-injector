// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require("vscode");
const fs = require("fs");
const path = require("path");
const process = require("process");
const { v4: uuidv4 } = require("uuid");

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  // Use the console to output diagnostic information (console.log) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  console.log('Congratulations, your extension "code-injector" is now active!');

  // The command has been defined in the package.json file
  // Now provide the implementation of the command with  registerCommand
  // The commandId parameter must match the command field in package.json
  let disposable = vscode.commands.registerCommand(
    "code-injector.ci",

    async function () {
      let cifilepath = `${__dirname}/snippets.json`;
      const textEditor = vscode.window.activeTextEditor;
      let document = textEditor.document;
      let selection = textEditor.selection;

      let selectedCode = document.getText(selection);

      let snippetPrefixInput = {
        prompt: "Set a prefix for your snippet",
        placeHolder: "Prefix",
      };

      let snippet = {};
      let snippetsObject = JSON.parse(fs.readFileSync(cifilepath, "utf8"));

      // fs.readFile(cifilepath, (data) => snippetsObject = data );
      // console.log(snippetsObject);

      if (selectedCode.length > 0) {
        console.log(selectedCode);
        snippet.prefix = await vscode.window.showInputBox(snippetPrefixInput);
        snippet.name = uuidv4();

        snippetsObject[snippet.name] = {
          prefix: [`ci-${snippet.prefix}`, snippet.prefix],
          body: snippetBody(selectedCode),
          description: selectedCode,
        };

        let newSnippet = JSON.stringify(snippetsObject, null, "\t");
        fs.writeFileSync(cifilepath, newSnippet, "utf8");
      } else console.log("please select some code ");
      // console.log(__dirname);
    }
  );

  context.subscriptions.push(disposable);
}
exports.activate = activate;

const snippetBody = (content) => {
  let body = content.replace(/\t/g, "\\t");
  return body.split("\n");
};

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
};
