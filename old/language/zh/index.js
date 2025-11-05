let itemloc = new Array(10);
let itemcount = new Array(10);
let itemlocbig = new Array(10);
let memorycount = new Array(10);
let f = Array(9).fill(0);
let question = 1;
let answer = 2;
let ques = 1;
let answ = 2;

let remainingItems;
let score = 0;
let level;
let totalItems;
let notyet = true;
let donothing = 0;

let overscore = 0;
let badlevel = 1;

function batsu() {
    console.log('batsu');
    document.getElementById("hint").innerHTML = "<img id='image' src='../../images/batsu.GIF' alt='batsu'>";
}

function maru() {
    console.log('maru');
    document.getElementById("hint").innerHTML = "<img id='image' src='../../images/maru.GIF' alt='maru'>";
}

function cleare() {
    console.log('cleare');
    document.getElementById("hint").innerHTML = "";
}

function cleark() {
    console.log('cleark');
    document.getElementById("hint").innerHTML = " ";
}

function checkanswer(e) {
    console.log('checkanswer');
    if (!notyet) {
        if (e === x) yes();
        else no();
    }
}

function yes() {
    console.log('yes');
    cleark();

    notyet = true;

    maru();
    setTimeout(quizproceed, 200);

    remainingItems--;
    itemcount[h]--;
    overscore++;
}

function no() {
    console.log('no');
    cleark();

    notyet = true;

    batsu();
    setTimeout(quizproceed, 200);

    remainingItems++;
    itemcount[h]++;
}

function choice() {
    console.log('choice');
    do {
        h = Math.ceil(Math.random() * totalItems);
    } while (itemcount[h] === 0);
    x = itemloc[h];
}

function otherchoice() {
    console.log('otherchoice');
    let i = 0;
    let done = 0;

    while (done !== 1) {
        done = 1;
        i = Math.ceil(Math.random() * totalItems);
        o = itemloc[i];
        for (let j = 1; j <= 8; j++) {
            if (o === f[j]) {
                done = 0;
            }
            if (f[j] > 0) {
                if (hz[o][1][0] === hz[f[j]][1][0]) {
                    done = 0;
                }
            }
        }
    }
}

function choosetranslation(file) {
    console.log('choosetranslation');
    let trans = Math.floor(Math.random() * hz[file][1].length);

    if (file === x) {
        trans = itemlocbig[h];
    }
    return trans;
}

function answerSlot(button) {
    console.log('answerSlot');
    return c === button ? 1 : 0;
}

function crosshash(ovalue, xvalue) {
    console.log('crosshash');
    for (let countx = 0; countx <= 4; countx++) {
        for (let counto = 0; counto <= 4; counto++) {
            if ((hz[ovalue][counto]) === (hz[xvalue][countx])) {
                again = 1;
            }
        }
    }
    if (again === 1) {
        again = 0;
        otherchoice();
        if (o !== x) {
            crosshash(o, x);
        }
    }
}

function choices(x) {
    console.log('choices');
    f.fill(0);
    again = 0;
    c = Math.ceil(Math.random() * 8);

    for (let j = 1; j < 9; j++) {
        if (answerSlot(j) !== 0) {
            if (answer === 3) {
                document.getElementById(j).innerHTML = hz[x][2];
            }
            if (answer === 2) {
                let trans = choosetranslation(x);
                document.getElementById(j).innerHTML = hz[x][1][trans];
            }
            if (answer === 1) {
                document.getElementById(j).innerHTML = hz[x][0];
            }
            f[j] = x;
        } else {
            let chooseAgain = 1;
            while (chooseAgain === 1) {
                chooseAgain = 0;
                otherchoice();
                crosshash(o, x);
                if (answer === 3) {
                    document.getElementById(j).innerHTML = hz[o][2];
                }
                if (answer === 2) {
                    let trans = choosetranslation(o);
                    document.getElementById(j).innerHTML = hz[o][1][trans];
                }
                if (answer === 1) {
                    document.getElementById(j).innerHTML = hz[o][0];
                }
            }
            f[j] = o;
        }
    }
    if (again === 1) {
        choices(x);
    }
}

function setformat(que, ans) {
    console.log('setformat');
    ques = que;
    answ = ans;
}

function sameway() {
    console.log('sameway');
    remainingItems = totalItems;
    document.getElementById("leftfield").innerHTML = remainingItems;

    overscore = 0;
    for (let i = totalItems; i > 0; i--) {
        itemcount[i] = 1;
    }
    score = 1;
    if (donothing !== 1) {
        newhanzi();
    }
}

function newhanzi() {
    console.log('newkanji');
    cleark();
    cleare();

    notyet = false;

    choice();

    if (question === 3) {
        document.getElementById("hint").innerHTML = hz[x][2];
    }
    if (question === 2) {
        let trans = choosetranslation(x);
        document.getElementById("hint").innerHTML = hz[x][1][trans];
    }
    if (question === 1) {
        document.getElementById("hint").innerHTML = hz[x][0];
    }

    document.getElementById("debugfield").innerHTML = h;
    choices(x);
}

function startquiz() {
    console.log('startquiz');
    question = ques;
    answer = answ;
    badlevel = 1;

    while (badlevel === 1) {
        badlevel = 1;

        level = prompt('Change level: 1-166, or 1st-4th, or all');

        if (parseInt(level) === level && parseInt(level) < 165) {
            badlevel = 0;
            totalItems = Math.min(15);
            remainingItems = totalItems;

            for (let levelplacecount = 1; levelplacecount < remainingItems + 1; levelplacecount++) {
                itemloc[levelplacecount] = levelplacecount + level * 15 - 15;
                itemcount[levelplacecount] = 1;
                memorycount[levelplacecount] = 1;
            }
        }

        if (
            level === '100s' || level === '200s' || level === '300s' ||
            level === '400s' || level === '500s' || level === '600s' ||
            level === '700s' || level === '800s' || level === '900s' || level === '1000s'
        ) {
            badlevel = 0;
            totalItems = 100;
            remainingItems = totalItems;
            for (let levelplacecount = 1; levelplacecount < remainingItems + 1; levelplacecount++) {
                itemloc[levelplacecount] = levelplacecount + level.replace('s', '') * 1 - 100;
                itemcount[levelplacecount] = 1;
                memorycount[levelplacecount] = 1;
            }
        }

        if (level === '1st') {
            badlevel = 0;
            remainingItems = 322;
            totalItems = remainingItems;
            for (let levelplacecount = 1; levelplacecount <= remainingItems; levelplacecount++) {
                itemloc[levelplacecount] = levelplacecount;
                itemcount[levelplacecount] = 1;
                memorycount[levelplacecount] = 1;
            }
        }

        if (level === '2nd') {
            badlevel = 0;
            remainingItems = 180;
            totalItems = remainingItems;
            for (let levelplacecount = 1; levelplacecount <= remainingItems; levelplacecount++) {
                itemloc[levelplacecount] = levelplacecount + 322;
                itemcount[levelplacecount] = 1;
                memorycount[levelplacecount] = 1;
            }
        }

        if (level === '3rd') {
            badlevel = 0;
            remainingItems = 497;
            totalItems = remainingItems;
            for (let levelplacecount = 1; levelplacecount <= remainingItems; levelplacecount++) {
                itemloc[levelplacecount] = levelplacecount + 322 + 180;
                itemcount[levelplacecount] = 1;
                memorycount[levelplacecount] = 1;
            }
        }

        if (level === '4th') {
            badlevel = 0;
            remainingItems = 1482;
            totalItems = remainingItems;
            for (let levelplacecount = 1; levelplacecount <= remainingItems; levelplacecount++) {
                itemloc[levelplacecount] = levelplacecount + 322 + 180 + 497;
                itemcount[levelplacecount] = 1;
                memorycount[levelplacecount] = 1;
            }
        }

        if (level === '1-2') {
            badlevel = 0;
            remainingItems = 502;
            totalItems = remainingItems;
            for (let levelplacecount = 1; levelplacecount <= remainingItems; levelplacecount++) {
                itemloc[levelplacecount] = levelplacecount;
                itemcount[levelplacecount] = 1;
                memorycount[levelplacecount] = 1;
            }
        }

        if (level === '1-3') {
            badlevel = 0;
            remainingItems = 999;
            totalItems = remainingItems;
            for (let levelplacecount = 1; levelplacecount <= remainingItems; levelplacecount++) {
                itemloc[levelplacecount] = levelplacecount;
                itemcount[levelplacecount] = 1;
                memorycount[levelplacecount] = 1;
            }
        }

        if (level === '1-4' || level === 'all') {
            badlevel = 0;
            remainingItems = 2481;
            totalItems = remainingItems;
            for (let levelplacecount = 1; levelplacecount <= remainingItems; levelplacecount++) {
                itemloc[levelplacecount] = levelplacecount;
                itemcount[levelplacecount] = 1;
                memorycount[levelplacecount] = 1;
            }
        }

        if (level === "" || level === " " || level === "undefined" || level === null) {
            badlevel = 0;
            remainingItems = 0;
            donothing = 1;
        }
        if (badlevel === 1) {
            alert('Invalid level. Try again');
        }
    }
    score = 1;
    if (donothing !== 1) {
        document.getElementById("levelfield").innerHTML = level;
        newhanzi();
    }
    document.getElementById("leftfield").innerHTML = remainingItems;
    notyet = false;

    if (ques === 1) {
        document.getElementById("hint").className = "bigText";
    } else if (ques === 2) {
        document.getElementById("hint").className = "smallText";
    } else if (ques === 3) {
        document.getElementById("hint").className = "mediumText";
    }

    if (answ === 1) {
        document.getElementById("choicetable").className = "bigText";
    } else if (answ === 2) {
        document.getElementById("choicetable").className = "smallText";
    } else if (answ === 3) {
        document.getElementById("choicetable").className = "mediumText";
    }
}

function quizproceed() {
    console.log('quizproceed');
    let ascore;

    document.getElementById("leftfield").innerHTML = remainingItems;

    if (remainingItems > 0) {
        score++;
        newhanzi();
    } else {
        score = (overscore / score) * 100;

        if (score !== 100) {
            score = Math.floor(score);
            score = (score - 50) * 2;

            if (score <= 50) ascore = "F";
            if (score >= 51) ascore = "D";
            if (score >= 62) ascore = "C";
            if (score >= 73) ascore = "B";
            if (score >= 83) ascore = "A";
        }
        if (score === 100) ascore = "PERFECT";
        cleare();
        cleark();
        document.getElementById("hint").innerHTML = ascore;
    }
}