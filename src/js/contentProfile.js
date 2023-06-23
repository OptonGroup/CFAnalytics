var problems = new Map();
var ratings = new Map();
var levels = new Map();
var tags = new Map();
var verdicts = new Map();
var languages = new Map();
var ratingChartLabel = [];
var ratingChartData = [];
var ratingChartBackgroundColor = [];
var levelsChartLabel = [];
var levelsChartData = [];
var levelsChartBackgroundColor = [];
var tagChartLabel = [];
var tagChartData = [];
var verdictsChartLabel = [];
var verdictsChartData = [];
var languagesChartLabel = [];
var languagesChartData = [];
var countSolvedTasks = 0;
var sumSolvedTasksLevels = 0;

ratings[Symbol.iterator] = function*() {
    yield*[...ratings.entries()].sort((a, b) => {
        if (a[0] < b[0]) {
            return -1;
        } else if (a[0] > b[0]) {
            return 1;
        } else return 0;
    });
}
levels[Symbol.iterator] = function*() {
    yield*[...levels.entries()].sort((a, b) => {
        if (a[0] < b[0]) {
            return -1;
        } else if (a[0] > b[0]) {
            return 1;
        } else return 0;
    });
}
tags[Symbol.iterator] = function*() {
    yield*[...tags.entries()].sort((a, b) => {
        if (a[1] < b[1]) {
            return 1;
        } else if (a[1] > b[1]) {
            return -1;
        } else return 0;
    });
}
verdicts[Symbol.iterator] = function*() {
    yield*[...verdicts.entries()].sort((a, b) => {
        if (a[1] < b[1]) {
            return 1;
        } else if (a[1] > b[1]) {
            return -1;
        } else return 0;
    });
}
languages[Symbol.iterator] = function*() {
    yield*[...languages.entries()].sort((a, b) => {
        if (a[1] < b[1]) {
            return 1;
        } else if (a[1] > b[1]) {
            return -1;
        } else return 0;
    });
}


//Material Design 400 light
const colorArray = ['#e57373', '#f06292', '#ba68c8', '#9575cd', '#7986cb', '#64b5f6', '#4fc3f7', '#4dd0e1', '#4db6ac', '#81c784', '#aed581', '#dce775', '#fff176', '#ffd54f', '#ffb74d', '#ff8a65'];
const colorVerdicts = { "OK": '#43a047', "WRONG_ANSWER": '#e53935', "TIME_LIMIT_EXCEEDED": '#1e88e5', "Other": '#8e24aa' }
const colorVerdicts2 = []
chrome.runtime.sendMessage({ todo: "appendHTML" }, function(response) {
    $('#pageContent').append(response.htmlResponse);
    const profileId = getProfileIdFromUrl(window.location.href);
    console.log(profileId);
    $.get(`https://codeforces.com/api/user.status?handle=${profileId}`, function(data) {
        if (data.status == "OK") {
            //processdata
            processData(data.result);
            createProblemRatingChart();
            createProblemLevelsChart();
            createTagChart();
            createVerdictsChart();
            createLanguagesChart();
        } else {
            //response not loaded
            console.error(data.status + ' : ' + data.comment);
        }
    })
});

function getProfileIdFromUrl(url) {
    var arr = url.split("/");
    var temp = arr.slice(-1);
    temp = temp[0].split('?', 1);
    return temp;
}

function processData(resultArr) {
    for (var i = resultArr.length - 1; i >= 0; i--) {
        var sub = resultArr[i];
        var problemId = sub.problem.contestId + '-' + sub.problem.index;
        if (!problems.has(problemId)) {
            problems.set(problemId, {
                solved: false,
                rating: sub.problem.rating,
                contestId: sub.problem.contestId,
                index: sub.problem.index,
                tags: sub.problem.tags,
            });
        }
        if (sub.verdict == "OK") {
            let obj = problems.get(problemId);
            obj.solved = true;
            problems.set(problemId, obj);
        }
        // verdicts
        verdict = sub.verdict;
        if (verdict != "WRONG_ANSWER" && verdict != "OK" && verdict != "TIME_LIMIT_EXCEEDED") {
            verdict = "Other";
        }
        if (!verdicts.has(verdict)) {
            verdicts.set(verdict, 0);
        }
        cnt = verdicts.get(verdict);
        cnt++;
        verdicts.set(verdict, cnt);

        // languages
        language = sub.programmingLanguage;
        if (language.indexOf("C++") != -1) {
            language = "C++";
        } else if (language.indexOf("C#") != -1) {
            language = "C#";
        } else if (language.indexOf("Go") != -1) {
            language = "Go";
        } else if (language.indexOf("Haskell") != -1) {
            language = "Haskell";
        } else if (language.indexOf("Java 1") != -1) {
            language = "Java";
        } else if (language.indexOf("Kotlin") != -1) {
            language = "Kotlin";
        } else if (language.indexOf("OCaml") != -1) {
            language = "OCaml";
        } else if (language.indexOf("Delphi") != -1) {
            language = "Delphi";
        } else if (language.indexOf("Pascal") != -1) {
            language = "Pascal";
        } else if (language.indexOf("Perl") != -1) {
            language = "Perl";
        } else if (language.indexOf("PHP") != -1) {
            language = "PHP";
        } else if (language.indexOf("Python") != -1) {
            language = "Python";
        } else if (language.indexOf("PyPy") != -1) {
            language = "PyPy";
        } else if (language.indexOf("Ruby") != -1) {
            language = "Ruby";
        } else if (language.indexOf("Rust") != -1) {
            language = "Rust";
        } else if (language.indexOf("Scala") != -1) {
            language = "Scala";
        } else if (language.indexOf("JavaScript") != -1) {
            language = "JavaScript";
        } else if (language.indexOf("Node.js") != -1) {
            language = "Node.js";
        }
        if (!languages.has(language)) {
            languages.set(language, 0);
        }
        cnt = languages.get(language);
        cnt++;
        languages.set(language, cnt);

        // levels
        level = sub.problem.index[0]
        if (!levels.has(level)) {
            levels.set(level, 0);
        }
        cnt = levels.get(level);
        cnt++;
        levels.set(level, cnt);
    }
    problems.forEach(function(prob) {
        if (prob.rating && prob.solved === true) {
            // rating
            if (!ratings.has(prob.rating)) {
                ratings.set(prob.rating, 0);
            }
            let cnt = ratings.get(prob.rating);
            cnt++;
            ratings.set(prob.rating, cnt);
        }
        if (prob.solved === true) {
            prob.tags.forEach(function(tag) {

                if (!tags.has(tag)) {
                    tags.set(tag, 0);
                }
                let cnt = tags.get(tag);
                cnt++;
                tags.set(tag, cnt);
            })
        }
    })
    for (let [key, val] of ratings) {
        // console.log(key + '-' + val);
        ratingChartLabel.push(key);
        ratingChartData.push(val);
        ratingChartBackgroundColor.push(ratingBackgroundColor(key));

        countSolvedTasks += val;
        sumSolvedTasksLevels += key*val;
    }
    for (let [key, val] of levels) {
        // console.log(key + '-' + val);
        levelsChartLabel.push(key);
        levelsChartData.push(val);
        levelsChartBackgroundColor.push(ratingBackgroundColor(key));
    }
    for (let [key, val] of tags) {
        // console.log(key + '-' + val);
        tagChartLabel.push(key);
        tagChartData.push(val);
    }
    for (let [key, val] of verdicts) {
        // console.log(key + '-' + val);
        verdictsChartLabel.push(key);
        verdictsChartData.push(val);
        colorVerdicts2.push(colorVerdicts[key]);
    }
    for (let [key, val] of languages) {
        // console.log(key + '-' + val);
        languagesChartLabel.push(key);
        languagesChartData.push(val);
    }
}

function findProblemURL(contestId, index) {
    if (contestId && contestId.toString().length <= 4) {
        return `https://codeforces.com/problemset/problem/${contestId}/${index}`;
    } else {
        return `https://codeforces.com/problemset/gymProblem/${contestId}/${index}`;
    }
}

function createProblemRatingChart() {
    var averageTaskLevel = Math.round(sumSolvedTasksLevels / countSolvedTasks);
    // console.log(averageTaskLevel);
    var averageTaskLevelElement = document.getElementById('averageTaskLevel');
    averageTaskLevelElement.innerText = averageTaskLevel;
    averageTaskLevelElement.style.color = ratingBackgroundColor(averageTaskLevel);
    

    var ctx = document.getElementById('problemRatingChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ratingChartLabel,
            datasets: [{
                label: 'Problems Solved',
                data: ratingChartData,
                backgroundColor: ratingChartBackgroundColor,
                borderColor: 'rgba(0  ,0  ,0  ,1)', //ratingChartBorderColor,
                borderWidth: 0.75,
            }]
        },
        options: {
            aspectRatio: 2.5,
            scales: {
                x: {
                    title: {
                        text: 'Problem Rating',
                        display: false,
                    }
                },
                y: {
                    title: {
                        text: 'Problems Solved',
                        display: false,
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

function createProblemLevelsChart() {
    var ctx = document.getElementById('problemLevelsChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: levelsChartLabel,
            datasets: [{
                label: 'Problems Solved',
                data: levelsChartData,
                backgroundColor: levelsChartBackgroundColor,
                borderColor: 'rgba(0  ,0  ,0  ,1)', //ratingChartBorderColor,
                borderWidth: 0.75,
            }]
        },
        options: {
            aspectRatio: 2.5,
            scales: {
                x: {
                    title: {
                        text: 'Problem Rating',
                        display: false,
                    }
                },
                y: {
                    title: {
                        text: 'Problems Solved',
                        display: false,
                    },
                    beginAtZero: true
                }
            }
        }
    });
}

function createTagChart() {
    var ctx = document.getElementById('tagChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: tagChartLabel,
            datasets: [{
                label: 'Tags Solved',
                data: tagChartData,
                backgroundColor: colorArray,
                borderColor: 'rgba(0,0,0,0.5)',
                borderWidth: 0.5,
            }]
        },
        options: {
            aspectRatio: 2,
            plugins: {
                legend: {
                    display: false,
                    position: 'right',
                },
            }
        },
    });
    for (var i = 0; i < tagChartLabel.length; i++) {
        $('#legend_unordered_list').append(`<li>
			<svg width="12" height="12">
				<rect width="12" height="12" style="fill:${colorArray[i % (colorArray.length)]};stroke-width:1;stroke:rgb(0,0,0)" />
			</svg>
			${tagChartLabel[i]} : ${tagChartData[i]}
		</li>`)
    }
}

function createVerdictsChart() {
    var ctx = document.getElementById('VerdictsChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: verdictsChartLabel,
            datasets: [{
                label: 'Verdicts of Problems',
                data: verdictsChartData,
                backgroundColor: colorVerdicts2,
                borderColor: 'rgba(0,0,0,0.5)',
                borderWidth: 0.5,
            }]
        },
        options: {
            aspectRatio: 2,
            plugins: {
                legend: {
                    display: false,
                    position: 'right',
                },
            }
        },
    });
    for (var i = 0; i < verdictsChartLabel.length; i++) {
        $('#legend_verdicts_list').append(`<li>
			<svg width="12" height="12">
				<rect width="12" height="12" style="fill:${colorVerdicts[verdictsChartLabel[i]]};stroke-width:1;stroke:rgb(0,0,0)" />
			</svg>
			${verdictsChartLabel[i]} : ${verdictsChartData[i]}
		</li>`)
    }
}

function createLanguagesChart() {
    var ctx = document.getElementById('LanguagesChart').getContext('2d');
    var myChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: languagesChartLabel,
            datasets: [{
                label: 'Languages of Problems',
                data: languagesChartData,
                backgroundColor: colorArray,
                borderColor: 'rgba(0,0,0,0.5)',
                borderWidth: 0.5,
            }]
        },
        options: {
            aspectRatio: 2,
            plugins: {
                legend: {
                    display: false,
                    position: 'right',
                },
            }
        },
    });
    for (var i = 0; i < languagesChartLabel.length; i++) {
        $('#legend_languages_list').append(`<li>
			<svg width="12" height="12">
				<rect width="12" height="12" style="fill:${colorArray[i % (colorArray.length)]};stroke-width:1;stroke:rgb(0,0,0)" />
			</svg>
			${languagesChartLabel[i]} : ${languagesChartData[i]}
		</li>`)
    }
}

function ratingBackgroundColor(rating) {
    const legendaryGrandmaster = 'rgba(170,0  ,0  ,0.9)';
    const internationalGrandmaster = 'rgba(255,51 ,51 ,0.9)';
    const grandmaster = 'rgba(255,119,119,0.9)';
    const internationalMaster = 'rgba(255,187,85 ,0.9)';
    const master = 'rgba(255,204,136,0.9)';
    const candidateMaster = 'rgba(255,136,255,0.9)';
    const expert = 'rgba(170,170,255,0.9)';
    const specialist = 'rgba(119,221,187,0.9)';
    const pupil = 'rgba(119,255,119,0.9)';
    const newbie = 'rgba(204,204,204,0.9)';
    if (rating >= 3000) {
        return legendaryGrandmaster;
    } else if (rating >= 2600 && rating <= 2999) {
        return internationalGrandmaster;
    } else if (rating >= 2400 && rating <= 2599) {
        return grandmaster;
    } else if (rating >= 2300 && rating <= 2399) {
        return internationalMaster;
    } else if (rating >= 2100 && rating <= 2299) {
        return master;
    } else if (rating >= 1900 && rating <= 2099) {
        return candidateMaster;
    } else if (rating >= 1600 && rating <= 1899) {
        return expert;
    } else if (rating >= 1400 && rating <= 1599) {
        return specialist;
    } else if (rating >= 1200 && rating <= 1399) {
        return pupil;
    } else {
        return newbie;
    }
}