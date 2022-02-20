import chalk from 'chalk';
import promptSync from 'prompt-sync';
import figlet from 'figlet';
import promptChoices from "prompt-choices"
import enquirer from 'enquirer';
const prompt = promptSync();
// const enquirere = new Enquirer()


/* 
╣║╗╝╚╔╩╦╠╬═ Ascii Characters
Othello Game Board
	1   2   3   4   5   6   7   8      // Line 1
  ╔═══╦═══╦═══╦═══╦═══╦═══╦═══╦═══╗    // Line 2
1 ║   ║   ║   ║   ║   ║   ║   ║   ║    // Line 3
  ╠═══╬═══╬═══╬═══╬═══╬═══╬═══╬═══╣    // Line 4
2 ║   ║   ║   ║   ║   ║   ║   ║   ║    // Line 5
  ╠═══╬═══╬═══╬═══╬═══╬═══╬═══╬═══╣    // Line 6
3 ║   ║   ║   ║   ║   ║   ║   ║   ║    // Line 7
  ╠═══╬═══╬═══╬═══╬═══╬═══╬═══╬═══╣    // Line 8
4 ║   ║   ║   ║   ║   ║   ║   ║   ║    // Line 9
  ╠═══╬═══╬═══╬═══╬═══╬═══╬═══╬═══╣    // Line 10
5 ║   ║   ║   ║   ║   ║   ║   ║   ║    // Line 11
  ╠═══╬═══╬═══╬═══╬═══╬═══╬═══╬═══╣    // Line 12
6 ║   ║   ║   ║   ║   ║   ║   ║   ║    // Line 13
  ╠═══╬═══╬═══╬═══╬═══╬═══╬═══╬═══╣    // Line 14
7 ║   ║   ║   ║   ║   ║   ║   ║   ║    // Line 15
  ╠═══╬═══╬═══╬═══╬═══╬═══╬═══╬═══╣    // Line 16
8 ║   ║   ║   ║   ║   ║   ║   ║   ║    // Line 17
  ╚═══╩═══╩═══╩═══╩═══╩═══╩═══╩═══╝    // Line 18
*/
let fonts = ['Trek', 'Star Wars', 'Graffiti', 'Standard', 'Rounded', 'Epic', 'Cola', 'Braced', 'Caligraphy', 'Broadway']
Math.random()

const black = chalk.black.bold("■");
const white = chalk.white("■");
let board = [];
let currentTurn = "P1";
const playerOnePiece = "Black";
const playerTwoPiece = "White";
const playerOneColor = chalk.redBright;
const playerTwoColor = chalk.blueBright;
const playerOneBgColor = chalk.bgRedBright;
const playerTwoBgColor = chalk.bgBlueBright;
class Cell {
	constructor(piece, xPos, yPos, string) {
		this.piece = piece;
		this.xPos = xPos;
		this.yPos = yPos;
		this.string = string;
	}
}
let movableCellsForTurn = [];
let cellsWithPieces = [];
const othelloText = fonts[Math.floor(Math.random()*fonts.length)];
async function mainMenu() {
	console.log("\x1B[2J")
	console.log(figlet.textSync('Othello', {
		font: othelloText,
		horizontalLayout: 'default',
		verticalLayout: 'default',
		width: 200,
		whitespaceBreak: true
	}), "\n");
	const response = await enquirer.select({
		name: 'MainMenu',
		message: 'Main Menu',
		choices: ["Play", "Options", "Credits"]
	  });
	  return response;
}

let settings = [{showHints: false, description: "Show hints"}, {playerOneColor: chalk.redBright, description: "P1 Color"}, {playerTwoColor: chalk.blueBright, description: "P2 Color"}]

async function options() {
	console.log("\x1B[2J")
	console.log(figlet.textSync('Othello', {
		font: othelloText,
		horizontalLayout: 'default',
		verticalLayout: 'default',
		width: 200,
		whitespaceBreak: true
	}), "\n");
	const response = await enquirer.select({
		name: 'Options',
		message: 'Options',
		choices: [settings[0].description, settings[1].description, settings[2].description, "Return"]
	  });
	  if (response === "Show hints") {
		  const setting1 = await enquirer.toggle({
	  		message: `Change 'Show hints' - ${(settings[0].showHints) ? "Enabled" : "Disabled"}`,
	  		enabled: 'Enabled',
	  		disabled: 'Disabled'
	  	  }).then(res => {
				if (res === true) {
					settings[0].showHints = true;
				} else {
					settings[0].showHints = false;
				}
				return "ReturnOpt"
			})
			return setting1;
	  }
	return response;
}

async function credits() {
	console.log("\x1B[2J")
	console.log(figlet.textSync('Othello', {
		font: othelloText,
		horizontalLayout: 'default',
		verticalLayout: 'default',
		width: 200,
		whitespaceBreak: true
	}), "\n");
	console.log(chalk.bgWhite.black("Developer:") + " DJBlueSlime\n");
	const response = await enquirer.select({
		name: 'Options',
		message: 'Options',
		choices: ["Return"]
	  });
	return response;
}

async function returnFunc() {
	console.log("\x1B[2J")
	console.log(figlet.textSync('Othello', {
		font: othelloText,
		horizontalLayout: 'default',
		verticalLayout: 'default',
		width: 200,
		whitespaceBreak: true
	}), "\n");
	const response = await enquirer.select({
		name: 'MainMenu',
		message: 'Main Menu',
		choices: ["Play", "Options", "Credits"]
	  });
	  return response;
}

async function screenHandler(screen) {
	if (screen === "Options" || screen === "ReturnOpt") {
		return await options();
	}
	if (screen === "Main Menu") {
		return await mainMenu();
	}
	if (screen === "Credits") {
		return await credits()
	}
	if (screen === "Return") {
		return await returnFunc();
	}
}
let nextScreen;
let play = false;
await screenHandler("Main Menu").then(async e => {
	if (e === "Play") {
		play = true;
		initGame()
	}
	if (e === "Options" || e === "Credits") {
		await screenHandler(e).then(async res => {

			console.log(res, "res")
			nextScreen = res;
		})
	}
});

while (!play) {
	if (nextScreen != null) {
		await screenHandler(nextScreen).then(res => {
			if (res === "Play") {
				play = true;
				// initGame();
			}
			nextScreen = res;
		})
	}
}


function initGame() {
	// This 'for' creates board
	for (let y = 0; y < 8; y++) {
		let row = [];
		for (let x = 0; x < 8; x++) {
			let cell = new Cell(null, x, y, " ");
			row.push(cell);
		}
		board.push(row);
	}
	[board[3][3].string, board[3][3].piece] = [white, playerTwoPiece];
	[board[3][4].string, board[3][4].piece] = [black, playerOnePiece];
	[board[4][3].string, board[4][3].piece] = [black, playerOnePiece];
	[board[4][4].string, board[4][4].piece] = [white, playerTwoPiece];

	checkNumberOfPiecesInBoard();
	checkForMovableCells(currentTurn);
	printBoard(board)
}

// initGame();

function printBoard(boardToPrint) {
	console.log(
		`       ${chalk.bgWhite.black.bold("  B   O   A   R   D   ")}

    0   1   2   3   4   5   6   7 
  ╔═══╦═══╦═══╦═══╦═══╦═══╦═══╦═══╗
0 ║ ${boardToPrint[0][0].string} ║ ${boardToPrint[1][0].string} ║ ${boardToPrint[2][0].string} ║ ${boardToPrint[3][0].string} ║ ${boardToPrint[4][0].string} ║ ${boardToPrint[5][0].string} ║ ${boardToPrint[6][0].string} ║ ${boardToPrint[7][0].string} ║                                                                                                                              
  ╠═══╬═══╬═══╬═══╬═══╬═══╬═══╬═══╣
1 ║ ${boardToPrint[0][1].string} ║ ${boardToPrint[1][1].string} ║ ${boardToPrint[2][1].string} ║ ${boardToPrint[3][1].string} ║ ${boardToPrint[4][1].string} ║ ${boardToPrint[5][1].string} ║ ${boardToPrint[6][1].string} ║ ${boardToPrint[7][1].string} ║  ${chalk.bgWhite.black.bold(" Y ")}
  ╠═══╬═══╬═══╬═══╬═══╬═══╬═══╬═══╣  ${chalk.bgWhite.black.bold("   ")}
2 ║ ${boardToPrint[0][2].string} ║ ${boardToPrint[1][2].string} ║ ${boardToPrint[2][2].string} ║ ${boardToPrint[3][2].string} ║ ${boardToPrint[4][2].string} ║ ${boardToPrint[5][2].string} ║ ${boardToPrint[6][2].string} ║ ${boardToPrint[7][2].string} ║  ${chalk.bgWhite.black.bold(" | ")}
  ╠═══╬═══╬═══╬═══╬═══╬═══╬═══╬═══╣  ${chalk.bgWhite.black.bold("   ")}
3 ║ ${boardToPrint[0][3].string} ║ ${boardToPrint[1][3].string} ║ ${boardToPrint[2][3].string} ║ ${boardToPrint[3][3].string} ║ ${boardToPrint[4][3].string} ║ ${boardToPrint[5][3].string} ║ ${boardToPrint[6][3].string} ║ ${boardToPrint[7][3].string} ║  ${chalk.bgWhite.black.bold(" A ")}
  ╠═══╬═══╬═══╬═══╬═══╬═══╬═══╬═══╣  ${chalk.bgWhite.black.bold("   ")}                               
4 ║ ${boardToPrint[0][4].string} ║ ${boardToPrint[1][4].string} ║ ${boardToPrint[2][4].string} ║ ${boardToPrint[3][4].string} ║ ${boardToPrint[4][4].string} ║ ${boardToPrint[5][4].string} ║ ${boardToPrint[6][4].string} ║ ${boardToPrint[7][4].string} ║  ${chalk.bgWhite.black.bold(" x ")}
  ╠═══╬═══╬═══╬═══╬═══╬═══╬═══╬═══╣  ${chalk.bgWhite.black.bold("   ")}
5 ║ ${boardToPrint[0][5].string} ║ ${boardToPrint[1][5].string} ║ ${boardToPrint[2][5].string} ║ ${boardToPrint[3][5].string} ║ ${boardToPrint[4][5].string} ║ ${boardToPrint[5][5].string} ║ ${boardToPrint[6][5].string} ║ ${boardToPrint[7][5].string} ║  ${chalk.bgWhite.black.bold(" i ")}
  ╠═══╬═══╬═══╬═══╬═══╬═══╬═══╬═══╣  ${chalk.bgWhite.black.bold("   ")}
6 ║ ${boardToPrint[0][6].string} ║ ${boardToPrint[1][6].string} ║ ${boardToPrint[2][6].string} ║ ${boardToPrint[3][6].string} ║ ${boardToPrint[4][6].string} ║ ${boardToPrint[5][6].string} ║ ${boardToPrint[6][6].string} ║ ${boardToPrint[7][6].string} ║  ${chalk.bgWhite.black.bold(" s ")}
  ╠═══╬═══╬═══╬═══╬═══╬═══╬═══╬═══╣
7 ║ ${boardToPrint[0][7].string} ║ ${boardToPrint[1][7].string} ║ ${boardToPrint[2][7].string} ║ ${boardToPrint[3][7].string} ║ ${boardToPrint[4][7].string} ║ ${boardToPrint[5][7].string} ║ ${boardToPrint[6][7].string} ║ ${boardToPrint[7][7].string} ║
  ╚═══╩═══╩═══╩═══╩═══╩═══╩═══╩═══╝
        ${chalk.bgWhite.black.bold(" X  -  A   x   i   s ")}


${chalk.grey(`# = Cells where can be moved, colored for each player color.`)}
${chalk.grey("Current turn: ")}${(currentTurn === "P1") ? playerOneColor(currentTurn) : playerTwoColor(currentTurn)}`);
}

// printBoard(board);
function checkNumberOfPiecesInBoard() {
	let piecesInBoard = 0;
	cellsWithPieces.length = 0;
	for (let y = 0; y < 8; y++) {
		for (let x = 0; x < 8; x++) {
			if (board[x][y].piece != null) {
				piecesInBoard++;
				cellsWithPieces.push(board[x][y]);
			}
		}
	}
	return piecesInBoard;
}

playTurn(currentTurn);

function checkForMovableCells(playerTurn) {
	movableCellsForTurn.length = 0;
	for (let i = 0; i < cellsWithPieces.length; i++) {


		let result;
		result = [];
		let x = cellsWithPieces[i].xPos;
		let y = cellsWithPieces[i].yPos;
		for (let dx = (x > 0 ? -1 : 0); dx <= (x < 7 ? 1 : 0); ++dx) {
			for (let dy = (y > 0 ? -1 : 0); dy <= (y < 7 ? 1 : 0); ++dy) {
				if (dx !== 0 || dy !== 0) {
					result.push(board[x + dx][y + dy]);
					let adjacent = board[x + dx][y + dy];
					if (board[x + dx][y + dy].piece == null && board[x][y].piece === playerOnePiece && playerTurn === "P1") {
						for (let y2 = 0; y2 < 8; y2++) {
							for (let x2 = 0; x2 < 8; x2++) {
								if (board[x2][y2].string === playerTwoColor("#")) {
									board[x2][y2].string = " "
								}
							}
						}
						board[x + dx][y + dy].string = playerOneColor("#")
						movableCellsForTurn.push(adjacent);
						continue;
					}
					if (board[x + dx][y + dy].piece == null && board[x][y].piece === playerTwoPiece && playerTurn === "P2") {
						for (let y2 = 0; y2 < 8; y2++) {
							for (let x2 = 0; x2 < 8; x2++) {
								if (board[x2][y2].string === playerOneColor("#")) {
									board[x2][y2].string = " "
								}
							}
						}
						board[x + dx][y + dy].string = playerTwoColor("#")
						movableCellsForTurn.push(adjacent);
					}
				}
			}
		}
	}
}

async function playTurn(playerToMove) {
	let input;
	let xPos;
	let yPos;
	let canMove = false;
	if (playerToMove === "P1") {
		input = prompt(`${playerOneColor("(" + playerToMove + ")")} ${playerOneBgColor(" Input move! ")} ${chalk.gray("[Format must be: X, Y]:")} `)
		if (!input) {
			console.log("Exiting...");
			process.exit(1)
		}
		if (!input.includes(",")) {
			console.log(chalk.red("\nERROR: Invalid Input!\n"));
			gameloop();
		}
		xPos = input.split(",")[0].trim();
		yPos = input.split(",")[1].trim();
		movableCellsForTurn.filter(v => v.xPos == xPos && v.yPos == yPos).forEach(element => {
			console.log(chalk.redBright(`P1 moved [ ${element.xPos}, ${element.yPos} ]`), "\n");
			for (let i = 0; i < 7 - element.xPos; i++) {
				if (board[i][element.yPos].piece != null) {
					console.log("Ne");
				}
				for (let j = 0; j < 7 - element.yPos; j++) {
					if (board[i][j].piece != null) {
						console.log("Ye");
					}
				}
				
			}
			// for (let dx = (element.xPos > 0 ? -1 : 0); dx <= (element.xPos < 7 ? 1 : 0); ++dx) {
			// 	for (let dy = (element.yPos > 0 ? -1 : 0); dy <= (element.yPos < 7 ? 1 : 0); ++dy) {
			// 		if (dx !== 0 || dy !== 0) {
			// 			let adjacent = board[element.xPos + dx][element.yPos + dy];
			// 			console.log(dy + dy);
			// 			if (adjacent.piece != null) {
			// 				console.log("There is a piece adjacent to the move: " + adjacent.piece);
			// 				console.log(7-element.yPos);
			// 				for (let i = 0; i < 7-element.yPos; i++) {
			// 					console.log(board[element.xPos][element.yPos+i].piece);
			// 				}
			// 			}
			// 		}
			// 	}
			// }
			board[Number(xPos)][Number(yPos)].string = (playerToMove === "P1") ? black : white;
			board[Number(xPos)][Number(yPos)].piece = (playerToMove === "P1") ? playerOnePiece : playerTwoPiece;
			canMove = true;
		});
		if (!canMove) {
			console.log(chalk.red("\nERROR: Invalid Move!\n"));
			gameloop()
		}
	} else {
		input = prompt(`${playerTwoColor("(" + playerToMove + ")")} ${playerTwoBgColor(" Input move! ")} ${chalk.gray("[Format must be: X, Y]:")} `)
		if (!input) {
			console.log("Exiting...");
			process.exit(1)
		}
		if (!input.includes(",")) {
			console.log(chalk.red("\nERROR: Invalid Input!\n"));
			gameloop();
		}
		xPos = input.split(",")[0].trim();
		yPos = input.split(",")[1].trim();
		movableCellsForTurn.filter(v => v.xPos === xPos && v.yPos === yPos).forEach(element => {
			console.log(chalk.redBright(`P1 moved [ ${element.xPos}, ${element.yPos} ]`), "\n");
			board[Number(xPos)][Number(yPos)].string = (playerToMove === "P1") ? black : white;
			board[Number(xPos)][Number(yPos)].piece = (playerToMove === "P1") ? playerOnePiece : playerTwoPiece;
			canMove = true;
		});
		if (!canMove) {
			console.log(chalk.red("\nERROR: Invalid Move!\n"));
			gameloop()
		}
	}
	// let [xPos, yPos] = [Number(input.split(",")[0].trim()), Number(input.split(",")[1].trim())];
	// board[xPos][yPos].string = (playerToMove === "P1") ? black : white;
	// board[xPos][yPos].piece = (playerToMove === "P1") ? playerOnePiece : playerTwoPiece;
	currentTurn = (playerToMove === "P1") ? "P2" : "P1";


	checkNumberOfPiecesInBoard();
	checkForMovableCells(currentTurn);
	printBoard(board);
	gameloop();
}

function gameloop() {
	// movableCellsForTurn.length = 0;
	playTurn(currentTurn)
}

playTurn(currentTurn)