var w = 1100;
var h = 790;

var grid = [];
var record = [];
var colors = ["", "#F8F8F8", "#FF6633", "000066"];
var index = 0;
var cols = 150;
var rows = 190;
var nTimes = 0;
var gridSize = (cols * rows);

var avgContact = 2;
var timeInfection = 3;
var timeRecover = 100;
var initialInfected = 1;
var tProb = 0.2;


for (var i = 0; i < rows; i++) {
    for (var j = 0; j < cols; j++) {
        grid.push([i * 5, j * 5, "circle-" + index++, 1, 0]);
    }
}


var svg = d3.select("body")
    .append("svg")
    .attr("width", w)
    .attr("height", h)
    .append("g")
    .attr("transform", "translate(20,20)");


svg.selectAll("circle")
    .data(grid)
    .enter()
    .append("circle")
    .attr("id", function (d) {
        return d[2];
    })
    .attr("cx", function (d) {
        return d[0];
    })
    .attr("cy", function (d) {
        return d[1];
    })
    .attr("r", function (d) {
        return 2;
    })
    .attr("fill", colors[1])
    .attr("stroke", "#666");

function init() {
    for (var x = 0; x < initialInfected; x++) {
        var i = Math.round(Math.random() * (gridSize - 1));
        var cell = grid[i];
        if (cell[3] === 1) {
            cell[3] = 2;
            cell[4] = timeInfection;
        }
        grid[i] = cell;
    }
    prepareStep();
}

init();


async function update() {
    nextStep();
    prepareStep();
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function prepareStep() {

    noSus = 0;
    noInfected = 0;
    noRecover = 0;
    nTimes++;

    for (var i = 0; i < gridSize; i++) {
        var cell = grid[i];

        svg.select("#" + cell[2]).style("fill", colors[cell[3]]);

        if (cell[3] === 1) {
            noSus++;
        } else if (cell[3] === 2) {
            noInfected++;
        } else if (cell[3] === 3) {
            noRecover++;
        }
    }
    record.push([noSus, noInfected, noRecover]);
    document.getElementById("status").innerHTML = "Susceptible: " + noSus + "   Infected: " + noInfected + " Recovered: " + noRecover + " Step: " + nTimes;
}


function nextStep() {

    for (var i = 0; i < gridSize; i++) {
        var cell = grid[i];

        if (cell[3] === 3) {

            if (cell[4] > 0) {
                cell[4] = cell[4] - 1;

            } else {
                cell[3] = 1;
                cell[4] = 0;
            }

        } else {
            for (var j = 0; j < avgContact; j++) {

                var sId = Math.round(Math.random() * (gridSize - 1));
                var sCell = grid[sId];

                if (cell[3] === sCell[3]) {
                    continue;
                } else if (cell[3] === 2 && sCell[3] === 1) {

                    if (Math.random() <= tProb) {

                        sCell[3] = 2;
                        sCell[4] = timeInfection;

                    }

                } else if (cell[3] === 1 && sCell[3] === 2) {

                    if (Math.random() <= tProb) {

                        cell[3] = 2;
                        cell[4] = timeInfection;


                    }
                }
                grid[sId] = sCell;
            }
        }

        if (cell[3] === 2 && cell[4] === 0) {

            cell[3] = 3;
            cell[4] = timeRecover;

        } else if (cell[3] === 2 && cell[4] > 0) {

            cell[4] = cell[4] - 1;

        }

        grid[i] = cell;
    }
}

function statistics() {

    document.getElementById("txArea").value = "" + record;

}
