let itemloc = new Array(10);
let itemcount = new Array(10);
let itemlocbig = new Array(10);
let memorycount = new Array(10);
let differentAnswer = new Array(7);
let f = new Array(9);
let question = 1;
let answer = 2;
let ques = 1;
let answ = 2;

let left;
let score = 0;
let level;
let itemnumber;
let notyet = true;
let donothing = 0;

let overscore = 0;
let badlevel = 1;
let itemlocstated;
let kanawereusing;

let again;
let x;
let o;
let c;
let h;

function batsu() {
    console.log('batsu');
    document.getElementById("unknown").innerHTML = "<img id='image' src='../../images/batsu.GIF' name='batsu'>";
}

function maru() {
    console.log('maru');
    document.getElementById("unknown").innerHTML = "<img id='image' src='../../images/maru.GIF' name='maru'>";
}

function cleare() {
    console.log('cleare');
    document.getElementById("unknown").innerHTML = "";
}

function cleark() {
    console.log('cleark');
    document.getElementById("unknown").innerHTML = " ";
}

function checkanswer(e) {
    console.log('checkanswer');
    if (notyet == false) {
        if (e == x) yes();
        else no();
    }
}

function yes() {
    console.log('yes');
    cleark();

    notyet = true;

    maru();
    setTimeout(quizproceed, 200);

    left = left - 1;
    itemcount[h] = itemcount[h] - 1;
    overscore = overscore + 1;
}

function no() {
    console.log('no');
    cleark();

    notyet = true;

    batsu();
    setTimeout(quizproceed, 200);

    left = left + 1;
    itemcount[h] = itemcount[h] + 1;
}

function choice() {
    console.log('choice');
    var g = 0;
    while (g == 0) {
        h = Math.random();
        h = h * itemnumber;
        h = Math.ceil(h);
        g = itemcount[h];
    }
    x = itemloc[h];
}

function otherchoice() {
    console.log('otherchoice');
    let i = 0;
    let done = 0;

    while (done != 1) {
        done = 1;
        i = Math.random();
        i = i * itemnumber;
        i = Math.ceil(i);
        o = itemloc[i];
        for (i = 1; i <= 8; i++) {
            if (o == f[i]) {
                done = 0;
            }
            if (f[i] > 0) {
                if (hz[o][1][0] == hz[f[i]][1][0]) {
                    done = 0;
                }
            }
        }
    }
}

function choosetranslation(file) {
    console.log('choosetranslation');
    let trans = Math.random();

    trans = trans * (hz[file][1].length);
    trans = Math.floor(trans);

    if (file == x) {
        trans = itemlocbig[h];
    }
    return trans;
}

function answerSlot(button) {
    console.log('answerSlot');
    if (c == button)
        return 1;
    return 0;
}

function crosshash(ovalue, xvalue) {
    console.log('crosshash');
    for (let countx = 0; countx <= 4; countx = countx + 1) {
        for (let counto = 0; counto <= 4; counto = counto + 1) {
            if ((hz[ovalue][counto]) == (hz[xvalue][countx])) {
                again = 1;
            }
        }
    }
    if (again == 1) {
        again = 0;
        otherchoice();
        crosshash(o, x);
    }
}

function choices(x) {
    console.log('choices');
    for (let i = 1; i <= 8; i++) {
        f[i] = 0
    }
    again = 0;
    c = Math.random();
    c *= 8;
    c = Math.ceil(c);

    for (let j = 1; j < 9; j++) {
        if (answerSlot(j) != 0) {
            if (answer == 3) {
                document.getElementById(j).innerHTML = hz[x][2];
            }
            if (answer == 2) {
                let trans = choosetranslation(x);
                document.getElementById(j).innerHTML = hz[x][1][trans];
            }
            if (answer == 1) {
                document.getElementById(j).innerHTML = hz[x][0];
            }
            f[j] = x;
        }
        else {
            let chooseAgain = 1;
            while (chooseAgain == 1) {
                chooseAgain = 0;
                otherchoice();
                crosshash(o, x);
                if (answer == 3) {
                    document.getElementById(j).innerHTML = hz[o][2];
                }
                if (answer == 2) {
                    let trans = choosetranslation(o);
                    document.getElementById(j).innerHTML = hz[o][1][trans];
                }
                if (answer == 1)
                    document.getElementById(j).innerHTML = hz[o][0];
            }
            f[j] = o;
        }
    }
    if (again == 1) {
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
    left = itemnumber;
    document.getElementById("leftfield").innerHTML = left;

    overscore = 0;
    for (let i = itemnumber; i > 0; i--)
        itemcount[i] = 1
    score = 1;
    if (donothing != 1)
        newkanji();
}

function newkanji() {
    console.log('newkanji');
    cleark();
    cleare();

    notyet = false;

    choice();

    if (question == 3) {
        document.getElementById("unknown").innerHTML = hz[x][2];
    }
    if (question == 2) {
        let trans = choosetranslation(x);
        document.getElementById("unknown").innerHTML = hz[x][1][trans];
    }
    if (question == 1) {
        document.getElementById("unknown").innerHTML = hz[x][0];
    }

    document.getElementById("debugfield").innerHTML = h;
    choices(x);
}

function startquiz() {
    console.log('startquiz');
    question = ques;
    answer = answ;
    badlevel = 1;

    while (badlevel == 1) {
        badlevel = 1;

        level = prompt('Change level: 1-166, or 1st-4th, or all');

        if (parseInt(level) < 165) {
            badlevel = 0;
            itemnumber = Math.min(15);
            left = itemnumber;

            for (let levelplacecount = 1; levelplacecount < left + 1; levelplacecount = levelplacecount + 1) {
                itemloc[levelplacecount] = levelplacecount + level * 15 - 15;
                itemlocstated = levelplacecount + level * 15 - 15;
                itemcount[levelplacecount] = 1;
                memorycount[levelplacecount] = 1;
            }
        }

        if (
            level == '100s' || level == '200s' || level == '300s' ||
            level == '400s' || level == '500s' || level == '600s' ||
            level == '700s' || level == '800s' || level == '900s' || level == '1000s'
        ) {
            badlevel = 0;
            itemnumber = 100;
            left = itemnumber;
            for (let levelplacecount = 1; levelplacecount < left + 1; levelplacecount = levelplacecount + 1) {
                itemloc[levelplacecount] = levelplacecount + level.replace('s', '') * 1 - 100;
                itemlocstated = levelplacecount + level.replace('s', '') * 1 - 100;
                itemcount[levelplacecount] = 1;
                memorycount[levelplacecount] = 1;
            }
        }

        if (level == '1st') {
            badlevel = 0;
            left = 322;
            itemnumber = left;
            for (let levelplacecount = 1; levelplacecount <= left; levelplacecount = levelplacecount + 1) {
                itemloc[levelplacecount] = levelplacecount;
                itemlocstated = levelplacecount;
                itemcount[levelplacecount] = 1;
                memorycount[levelplacecount] = 1;
            }
        }

        if (level == '2nd') {
            badlevel = 0;
            left = 180;
            itemnumber = left;
            for (let levelplacecount = 1; levelplacecount <= left; levelplacecount = levelplacecount + 1) {
                itemloc[levelplacecount] = levelplacecount + 80;
                itemlocstated = levelplacecount + 80;
                itemcount[levelplacecount] = 1;
                memorycount[levelplacecount] = 1;
            }
        }

        if (level == '3rd') {
            badlevel = 0;
            left = 497;
            itemnumber = left;
            for (let levelplacecount = 1; levelplacecount <= left; levelplacecount = levelplacecount + 1) {
                itemloc[levelplacecount] = levelplacecount + 240;
                itemlocstated = levelplacecount + 240;
                itemcount[levelplacecount] = 1;
                memorycount[levelplacecount] = 1;
            }
        }

        if (level == '4th') {
            badlevel = 0;
            left = 1482;
            itemnumber = left;
            for (let levelplacecount = 1; levelplacecount <= left; levelplacecount = levelplacecount + 1) {
                itemloc[levelplacecount] = levelplacecount + 440;
                itemlocstated = levelplacecount + 440;
                itemcount[levelplacecount] = 1;
                memorycount[levelplacecount] = 1;
            }
        }

        // if (level == '5th') {
        //     badlevel = 0;
        //     left = 185;
        //     itemnumber = left;
        //     for (let levelplacecount = 1; levelplacecount <= left; levelplacecount = levelplacecount + 1) {
        //         itemloc[levelplacecount] = levelplacecount + 639;
        //         itemlocstated = levelplacecount + 639;
        //         itemcount[levelplacecount] = 1;
        //         memorycount[levelplacecount] = 1;
        //     }
        // }
        //
        // if (level == '6th') {
        //     badlevel = 0;
        //     left = 181;
        //     itemnumber = left;
        //     for (let levelplacecount = 1; levelplacecount <= left; levelplacecount = levelplacecount + 1) {
        //         itemloc[levelplacecount] = levelplacecount + 824;
        //         itemlocstated = levelplacecount + 824;
        //         itemcount[levelplacecount] = 1;
        //         memorycount[levelplacecount] = 1;
        //     }
        // }

        if (level == '1-2') {
            badlevel = 0;
            left = 502;
            itemnumber = left;
            for (let levelplacecount = 1; levelplacecount <= left; levelplacecount = levelplacecount + 1) {
                itemloc[levelplacecount] = levelplacecount;
                itemlocstated = levelplacecount;
                itemcount[levelplacecount] = 1;
                memorycount[levelplacecount] = 1;
            }
        }

        if (level == '1-3') {
            badlevel = 0;
            left = 999;
            itemnumber = left;
            for (let levelplacecount = 1; levelplacecount <= left; levelplacecount = levelplacecount + 1) {
                itemloc[levelplacecount] = levelplacecount;
                itemlocstated = levelplacecount;
                itemcount[levelplacecount] = 1;
                memorycount[levelplacecount] = 1;
            }
        }


        if (level == '1-4' || level == 'all')  {
            badlevel = 0;
            left = 2481;
            itemnumber = left;
            for (let levelplacecount = 1; levelplacecount <= left; levelplacecount = levelplacecount + 1) {
                itemloc[levelplacecount] = levelplacecount;
                itemlocstated = levelplacecount;
                itemcount[levelplacecount] = 1;
                memorycount[levelplacecount] = 1;
            }
        }

        if (level == "" || level == " " || level == "undefined" || level == null) {
            badlevel = 0;
            left = 0;
            donothing = 1;
        }
        if (badlevel == 1) {
            alert('Livello non valido. Riprova');
        }
    }
    score = 1;
    if (donothing != 1) {
        document.getElementById("levelfield").innerHTML = level;
        newkanji();
    }
    document.getElementById("leftfield").innerHTML = left;
    notyet = false;

    if (ques == 1) {
        document.getElementById("unknown").className = "bigText";
    } else if (ques == 2) {
        document.getElementById("unknown").className = "smallText";
    } else if (ques == 3) {
        document.getElementById("unknown").className = "mediumText";
    }

    if (answ == 1) {
        document.getElementById("choicetable").className = "bigText";
    } else if (answ == 2) {
        document.getElementById("choicetable").className = "smallText";
    } else if (answ == 3) {
        document.getElementById("choicetable").className = "mediumText";
    }
}

function quizproceed() {
    console.log('quizproceed');
    let ascore;

    document.getElementById("leftfield").innerHTML = left;

    if (left > 0) {
        score = score + 1;
        newkanji();
    }
    else {
        score = overscore / score;
        score = score * 100;

        if (score != 100) {
            score = Math.floor(score);
            score = score - 50;
            score = score * 2;

            if (score <= 50) ascore = "F";
            if (score >= 51) ascore = "D";
            if (score >= 62) ascore = "C";
            if (score >= 73) ascore = "B";
            if (score >= 83) ascore = "A";
        }
        if (score == 100) ascore = "PERFETTO";
        cleare();
        cleark();
        document.getElementById("unknown").innerHTML = ascore;
    }
}
