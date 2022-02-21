#! /usr/bin/env node

import chalk from 'chalk';
import promptSync from 'prompt-sync';
import figlet from 'figlet';
import promptChoices from "prompt-choices"
import Enquirer from 'enquirer';
// import Enquirer from 'enquirer';
const prompt = promptSync();
let enquirer = new Enquirer();
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
let fonts = ['Graffiti', 'Standard', 'Rounded', 'Epic', 'Cola', 'Braced', 'Caligraphy', 'Broadway']
Math.random()
let colors = [chalk.redBright, chalk.greenBright, chalk.yellowBright, chalk.blueBright, chalk.magentaBright, chalk.cyanBright, chalk.white, chalk.grey];
let bgColors = [chalk.bgRedBright, chalk.bgGreenBright, chalk.bgYellowBright, chalk.bgBlueBright, chalk.bgMagentaBright, chalk.bgCyanBright, chalk.bgWhite, chalk.bgGrey];
const black = chalk.black.bold("■");
const white = chalk.white("■");
let board = [];
let currentTurn = "P1";
const playerOnePiece = "Black";
const playerTwoPiece = "White";
let playerOneColor = chalk.redBright;
let playerTwoColor = chalk.blueBright;
let playerOneBgColor = chalk.bgRedBright;
let playerTwoBgColor = chalk.bgBlueBright;
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
const othelloText = fonts[Math.floor(Math.random() * fonts.length)];
async function mainMenu() {
	console.log("\x1B[2J")
	console.log(figlet.textSync('Othello', {
		font: othelloText,
		horizontalLayout: 'default',
		verticalLayout: 'default',
		width: 200,
		whitespaceBreak: true
	}), "\n");
	const response = await Enquirer.select({
		name: 'MainMenu',
		message: 'Main Menu',
		choices: ["Play", "Settings", "About"]
	});
	return response;
}

let config = [{ showHints: false, description: "Show hints" }, { playerOneColor: chalk.redBright, description: "P1 Color" }, { playerTwoColor: chalk.blueBright, description: "P2 Color" }]

async function settings() {
	console.log("\x1B[2J")
	console.log(figlet.textSync('Settings', {
		font: othelloText,
		horizontalLayout: 'default',
		verticalLayout: 'default',
		width: 200,
		whitespaceBreak: true
	}), "\n");
	const response = await Enquirer.select({
		name: 'Options',
		message: 'Options',
		choices: [config[0].description, config[1].description, config[2].description, "Return"]
		,
	});
	if (response === "Show hints") {
		const setting1 = await Enquirer.toggle({
			message: `Change 'Show hints' - ${(config[0].showHints) ? "Enabled" : "Disabled"}`,
			enabled: 'Enabled',
			disabled: 'Disabled'
		}).then(res => {
			if (res === true) {
				config[0].showHints = true;
			} else {
				config[0].showHints = false;
			}
			return "ReturnOpt"
		})
		return setting1;
	}
	let colorsString = [];
	
	if (response === "P1 Color") {
		const questions = [{
			type: 'select',
			name: 'P1Color',
			message: `Change 'P1 Color' - ${playerOneColor("Current P1 Color")}`,
			initial: 0,
			choices: () => {
				let colorsArray = [];
						for (let i = 0; i < colors.length; i++) {
				// let colors = [chalk.redBright, chalk.greenBright, chalk.yellowBright, chalk.blueBright, chalk.magentaBright, chalk.cyanBright, chalk.white, chalk.grey];
							let colorName;
							switch (i) {
								case 0:
									colorName = 'Red'
									break;
								case 1:
									colorName = 'Green'
									break;
								case 2:
									colorName = 'Yellow'
									break;
								case 3:
									colorName = 'Blue'
									break;
								case 4:
									colorName = 'Magenta'
									break;
								case 5:
									colorName = 'Cyan'
									break;
								case 6:
									colorName = 'White'
									break;
								case 7:
									colorName = 'Grey'
									break;
								default:
									break;
							}
							colorsArray.push(
								{ name: i, message: `${colors[i](colorName)}`, value: colors[i]}
							)
						}
						colorsArray.push({name: 'Return', message: 'Return', value: 'Return'});
						return colorsArray;
					}
		  }];
		let answers = await enquirer.prompt(questions).then(res => {
			console.log(res.P1Color);
			if (res.P1Color === "Return") {
				return "ReturnOpt"
			}
			playerOneColor = colors[res.P1Color];
			playerOneBgColor = bgColors[res.P1Color]
		})
		return "ReturnOpt";
	} else if (response === "P2 Color") {
		const questions = [{
			type: 'select',
			name: 'P2Color',
			message: `Change 'P2 Color' - ${playerTwoColor("Current P2 Color")}`,
			initial: 0,
			choices: () => {
				let colorsArray = [];
						for (let i = 0; i < colors.length; i++) {
				// let colors = [chalk.redBright, chalk.greenBright, chalk.yellowBright, chalk.blueBright, chalk.magentaBright, chalk.cyanBright, chalk.white, chalk.grey];
							let colorName;
							switch (i) {
								case 0:
									colorName = 'Red'
									break;
								case 1:
									colorName = 'Green'
									break;
								case 2:
									colorName = 'Yellow'
									break;
								case 3:
									colorName = 'Blue'
									break;
								case 4:
									colorName = 'Magenta'
									break;
								case 5:
									colorName = 'Cyan'
									break;
								case 6:
									colorName = 'White'
									break;
								case 7:
									colorName = 'Grey'
									break;
								default:
									break;
							}
							colorsArray.push(
								{ name: i, message: `${colors[i](colorName)}`, value: colors[i]}
							)
						}
						colorsArray.push({name: 'Return', message: 'Return', value: 'Return'});
						return colorsArray;
					}
		  }];
		let answers = await enquirer.prompt(questions).then(res => {
			console.log(res.P2Color);
			if (res.P2Color === "Return") {
				return "ReturnOpt"
			}
			playerTwoColor = colors[res.P2Color];
			playerTwoBgColor = bgColors[res.P2Color]
		})
		return "ReturnOpt";
	}
	return response;
}

async function credits() {
	console.log("\x1B[2J")
	console.log(figlet.textSync('About', {
		font: othelloText,
		horizontalLayout: 'default',
		verticalLayout: 'default',
		width: 200,
		whitespaceBreak: true
	}), "\n");
	console.log("MIT LICENSE ©️ DJBlueSlime 2022\nVersion 1.0.0\n\nOthello game in console!\n");
	const response = await Enquirer.select({
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
	const response = await Enquirer.select({
		name: 'MainMenu',
		message: 'Main Menu',
		choices: ["Play", "Settings", "About"]
	});
	return response;
}

async function screenHandler(screen) {
	if (screen === "Settings" || screen === "ReturnOpt") {
		return await settings();
	}
	if (screen === "Main Menu") {
		return await mainMenu();
	}
	if (screen === "About") {
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
	if (e === "Settings" || e === "About") {
		await screenHandler(e).then(async res => {

			// console.log(res, "res")
			nextScreen = res;
		})
	}
});

while (!play) {
	if (nextScreen != null) {
		await screenHandler(nextScreen).then(res => {
			if (res === "Play") {
				play = true;
				initGame();
			}
			nextScreen = res;
		})
	}
}


async function initGame() {
	// This 'for' creates board
	board.length = 0;
	for (let y = 0; y < 8; y++) {
		let row = [];
		for (let x = 0; x < 8; x++) {
			let cell = new Cell(null, y, x, " ");
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
	await printBoard(board);
	await playTurn(currentTurn);
}

// initGame();

async function printBoard(boardToPrint) {
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

// playTurn(currentTurn);

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
	console.log("func executed");
}

async function checkPlay(xPos, yPos, checkForPiecesFunc) {
	let origin = [xPos, yPos]
	let whitePiece = [];
	let blackPiece = [];
	let hasFoundFirstBlack = false;
	let hasFoundFirstWhite = false;
	for (let i = 0; i < 7 - xPos; i++) {
		for (let j = 0; j < 7 - yPos; j++) {
			// console.log("For " + i, "J " + j);
			let x = xPos;
			let y = yPos;

			let topLeft = [x - 1, y - 1]
			let top = [x, y - 1]
			let topRight = [x + 1, y - 1]

			let midLeft = [x - 1, y]
			let mid = [x, y]
			let midRight = [x + 1, y]

			let botLeft = [x - 1, y + 1]
			let bot = [x, y + 1]
			let botRight = [x + 1, y + 1];
			console.log(currentTurn);

			console.log(board[botRight[0]][botRight[1]]);
			if (board[mid[0]][mid[1]].piece === playerOnePiece && currentTurn === "P1") {
				hasFoundFirstBlack = true;
			} else if (board[bot[0]][bot[1]].piece === playerTwoPiece && currentTurn === "P2") {
				hasFoundFirstWhite = true;
			}
			if (board[bot[0]][bot[1]].piece) {
				if (board[bot[0]][bot[1]].piece === playerOnePiece) {
					// hasFoundFirstBlack = true;
					blackPiece.push(board[bot[0]][bot[1]]);
					if (hasFoundFirstBlack && currentTurn === "P1") {
						whitePiece.push(board[bot[0]][bot[1]]);
					} else if (hasFoundFirstWhite && currentTurn === "P2") {
						blackPiece.push(board[bot[0]][bot[1]]);
					}
				}
				if (board[bot[0]][bot[1]].piece === playerTwoPiece) {
					// console.log("White piece found!");
					// hasFoundFirstWhite = true;
					if (hasFoundFirstBlack && currentTurn === "P1") {
						whitePiece.push(board[bot[0]][bot[1]]);
					} else if (hasFoundFirstWhite && currentTurn === "P2") {
						blackPiece.push(board[bot[0]][bot[1]]);
					}
				}
			}

			if (board[botRight[0]][botRight[1]].piece) {
				if (board[botRight[0]][botRight[1]].piece === playerOnePiece) {
					hasFoundFirstBlack = true;
					blackPiece.push(board[botRight[0]][botRight[1]]);
					if (hasFoundFirstBlack) {
						whitePiece.push(board[botRight[0]][botRight[1]]);
					} else if (hasFoundFirstWhite) {
						blackPiece.push(board[botRight[0]][botRight[1]]);
					}
				}
				if (board[botRight[0]][botRight[1]].piece === playerTwoPiece) {
					// console.log("White piece found!");
					hasFoundFirstWhite = true;
					if (hasFoundFirstBlack) {
						whitePiece.push(board[botRight[0]][botRight[1]]);
					} else if (hasFoundFirstWhite) {
						blackPiece.push(board[botRight[0]][botRight[1]]);
					}
				}
			}

			if (board[botLeft[0]][botLeft[1]].piece) {
				if (board[botLeft[0]][botLeft[1]].piece === playerOnePiece) {
					// hasFoundFirstBlack = true;
					blackPiece.push(board[botLeft[0]][botLeft[1]]);
					if (hasFoundFirstBlack && currentTurn === "P1") {
						whitePiece.push(board[botLeft[0]][botLeft[1]]);
					} else if (hasFoundFirstWhite && currentTurn === "P2") {
						blackPiece.push(board[botLeft[0]][botLeft[1]]);
					}
				}
				if (board[botLeft[0]][botLeft[1]].piece === playerTwoPiece) {
					// console.log("White piece found!");
					// hasFoundFirstWhite = true;
					if (hasFoundFirstBlack && currentTurn === "P1") {
						whitePiece.push(board[botLeft[0]][botLeft[1]]);
					} else if (hasFoundFirstWhite && currentTurn === "P2") {
						blackPiece.push(board[botLeft[0]][botLeft[1]]);
					}
				}
			}

			if (board[top[0]][top[1]].piece) {
				if (board[top[0]][top[1]].piece === playerOnePiece) {
					// hasFoundFirstBlack = true;
					blackPiece.push(board[top[0]][top[1]]);
					if (hasFoundFirstBlack && currentTurn === "P1") {
						whitePiece.push(board[top[0]][top[1]]);
					} else if (hasFoundFirstWhite && currentTurn === "P2") {
						blackPiece.push(board[top[0]][top[1]]);
					}
				}
				if (board[top[0]][top[1]].piece === playerTwoPiece) {
					// console.log("White piece found!");
					// hasFoundFirstWhite = true;
					if (hasFoundFirstBlack && currentTurn === "P1") {
						whitePiece.push(board[top[0]][top[1]]);
					} else if (hasFoundFirstWhite && currentTurn === "P2") {
						blackPiece.push(board[top[0]][top[1]]);
					}
				}
			}

			if (board[topRight[0]][topRight[1]].piece) {
				if (board[topRight[0]][topRight[1]].piece === playerOnePiece) {
					// hasFoundFirstBlack = true;
					blackPiece.push(board[topRight[0]][topRight[1]]);
					if (hasFoundFirstBlack && currentTurn === "P1") {
						whitePiece.push(board[topRight[0]][topRight[1]]);
					} else if (hasFoundFirstWhite && currentTurn === "P2") {
						blackPiece.push(board[topRight[0]][topRight[1]]);
					}
				}
				if (board[topRight[0]][topRight[1]].piece === playerTwoPiece) {
					// console.log("White piece found!");
					// hasFoundFirstWhite = true;
					if (hasFoundFirstBlack && currentTurn === "P1") {
						whitePiece.push(board[topRight[0]][topRight[1]]);
					} else if (hasFoundFirstWhite && currentTurn === "P2") {
						blackPiece.push(board[topRight[0]][topRight[1]]);
					}
				}
			}

			if (board[midLeft[0]][midLeft[1]].piece) {
				if (board[midLeft[0]][midLeft[1]].piece === playerOnePiece) {
					// hasFoundFirstBlack = true;
					blackPiece.push(board[midLeft[0]][midLeft[1]]);
					if (hasFoundFirstBlack && currentTurn === "P1") {
						whitePiece.push(board[midLeft[0]][midLeft[1]]);
					} else if (hasFoundFirstWhite && currentTurn === "P2") {
						blackPiece.push(board[midLeft[0]][midLeft[1]]);
					}
				}
				if (board[midLeft[0]][midLeft[1]].piece === playerTwoPiece) {
					// console.log("White piece found!");
					// hasFoundFirstWhite = true;
					if (hasFoundFirstBlack && currentTurn === "P1") {
						whitePiece.push(board[midLeft[0]][midLeft[1]]);
					} else if (hasFoundFirstWhite && currentTurn === "P2") {
						blackPiece.push(board[midLeft[0]][midLeft[1]]);
					}
				}
			}

			if (board[topLeft[0]][topLeft[1]].piece) {
				if (board[topLeft[0]][topLeft[1]].piece === playerOnePiece) {
					// hasFoundFirstBlack = true;
					blackPiece.push(board[topLeft[0]][topLeft[1]]);
					if (hasFoundFirstBlack && currentTurn === "P1") {
						whitePiece.push(board[topLeft[0]][topLeft[1]]);
					} else if (hasFoundFirstWhite && currentTurn === "P2") {
						blackPiece.push(board[topLeft[0]][topLeft[1]]);
					}
				}
				if (board[topLeft[0]][topLeft[1]].piece === playerTwoPiece) {
					// console.log("White piece found!");
					// hasFoundFirstWhite = true;
					if (hasFoundFirstBlack && currentTurn === "P1") {
						whitePiece.push(board[topLeft[0]][topLeft[1]]);
					} else if (hasFoundFirstWhite && currentTurn === "P2") {
						blackPiece.push(board[topLeft[0]][topLeft[1]]);
					}
				}
			}

			if (board[midRight[0]][midRight[1]].piece) {
				if (board[midRight[0]][midRight[1]].piece === playerOnePiece) {
					// hasFoundFirstBlack = true;
					blackPiece.push(board[midRight[0]][midRight[1]]);
					if (hasFoundFirstBlack && currentTurn === "P1") {
						whitePiece.push(board[midRight[0]][midRight[1]]);
					} else if (hasFoundFirstWhite && currentTurn === "P2") {
						blackPiece.push(board[midRight[0]][midRight[1]]);
					}
				}
				if (board[midRight[0]][midRight[1]].piece === playerTwoPiece) {
					// console.log("White piece found!");
					// hasFoundFirstWhite = true;
					if (hasFoundFirstBlack && currentTurn === "P1") {
						whitePiece.push(board[midRight[0]][midRight[1]]);
					} else if (hasFoundFirstWhite && currentTurn === "P2") {
						blackPiece.push(board[midRight[0]][midRight[1]]);
					}
				}
			}

			if (blackPiece && currentTurn === "P1") {
				whitePiece.forEach(element => {
					element.piece = playerOnePiece
					element.string = black;
				})
			}

		}
	}
	if (checkForPiecesFunc) {
		return;
	}
}

async function playTurn(playerToMove) {
	let input;
	let xPos;
	let yPos;
	// let canMove = false;
	if (playerToMove === "P1") {
		class InputPrompt extends Enquirer.Input {

			constructor(options = {}) {
				super(options);
				this.cursorHide();
				this.render()
			}
			render() {
				this.clear(); // clear previously rendered prompt from the terminal
				this.write(`${this.state.message}${this.state.input}`);
			}
		}
		// enquirer.Enqregister()
		enquirer.register('inputmove', InputPrompt)
		const promptInput = new InputPrompt({
			type: 'prompt',
			message: `${playerOneColor("(" + playerToMove + ")")} ${playerOneBgColor.black(" Input move! ")} ${chalk.gray("[Format must be: X, Y]:")} `,
			autofill: "show",
			prompt: "A"
		})
		await promptInput.run().then(res => input = res)
		// input = prompt(`${playerOneColor("(" + playerToMove + ")")} ${playerOneBgColor(" Input move! ")} ${chalk.gray("[Format must be: X, Y]:")} `)
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
		console.log(xPos, yPos);
		let canMove = new Promise(async (resolve, reject) => {
			let valid = movableCellsForTurn.filter(v => v.xPos == xPos && v.yPos == yPos);
			valid[0].string = "a"
			board[valid[0].xPos][valid[0].yPos].string = "a"
			board[0][0].string = "a"
			// console.log(playerToMove);
			board[Number(xPos)][Number(yPos)].string = (playerToMove === "P1") ? black : white;
			board[Number(xPos)][Number(yPos)].piece = (playerToMove === "P1") ? playerOnePiece : playerTwoPiece;
			// console.log(board[valid[0].xPos][valid[0].yPos].string);
			// console.log(valid);
			await checkPlay(Number(xPos), Number(yPos)).then(res => console.log(res))
			resolve("Resuelto");
			return true;
		})
		await canMove.then(async res => {
			console.log(res);
			if (!res) {
				console.log(chalk.red("\nERROR: Invalid Move!\n"));
				gameloop()
			}
		})
	} else {
		input = prompt(`${playerTwoColor("(" + playerToMove + ")")} ${playerTwoBgColor.black(" Input move! ")} ${chalk.gray("[Format must be: X, Y]:")} `)
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
	console.log("printed", board[3][4]);
	gameloop();
}

async function gameloop() {
	// movableCellsForTurn.length = 0;
	await playTurn(currentTurn)
}

// playTurn(currentTurn)