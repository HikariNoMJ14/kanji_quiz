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

let biglevelplacecount = 0;
let biglevel = 0;
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
let kana;
let kanatoenglish;

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

// function choosekana(file) {
//      console.log('choosekana');
//     kana = Math.random();
//
//     kana = kana * (hz[file].length - 2);
//     kana = Math.ceil(kana) + 1;
//     if (biglevel == 1 && file == x) {
//         kana = itemlocbig[h];
//     }
// }

function answerSlot(button) {
    console.log('answerSlot', button, c);
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

function choices(x, kanatoenglish) {
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
            if (answer == 2) {
                document.getElementById(j).innerHTML = hz[x][1][0];
            }
            // if (answer == 3) {
            //     choosekana(x);
            //     if (question == 2) {
            //         kana = kanatoenglish
            //     }
            //     document.getElementById(j).innerHTML = hz[x][kana];
            // }
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
                if (answer == 2) {
                    document.getElementById(j).innerHTML = hz[o][1][0];
                }
                // if (answer == 3) {
                //     choosekana(o);
                //     document.getElementById(j).innerHTML = hz[o][kana];
                //     differentAnswer[j] = hz[o][kana];
                //     for (let ocCount = 1; ocCount < j; ocCount++) {
                //         if (differentAnswer[ocCount] == hz[o][kana])
                //             chooseAgain = 1;
                //     }
                // }
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

function setLevel() {
    console.log('setLevel');
    itemnumber = left;
    kanawereusing = 2;

    for (let levelplacecount = 1; levelplacecount < left + 1; levelplacecount = levelplacecount + 1) {
        itemloc[levelplacecount] = biglevelplacecount;
        itemlocstated = biglevelplacecount;
        itemcount[levelplacecount] = 1;
        memorycount[levelplacecount] = 1;
        itemlocbig[levelplacecount] = kanawereusing;
        kanawereusing = kanawereusing + 1;

        if ((kanawereusing - 1) > (hz[biglevelplacecount].length - 2)) {
            biglevelplacecount = biglevelplacecount + 1;
            kanawereusing = 2;
        }
    }
}

function newkanji() {
    console.log('newkanji');
    cleark();
    cleare();

    notyet = false;
    kanatoenglish = 0;
    choice();

    if (question == 2)
        document.getElementById("unknown").innerHTML = hz[x][1][0];
    // if (question == 3) {
    //     choosekana(x);
    //     kanatoenglish = kana;
    //     document.getElementById("unknown").innerHTML = hz[x][kana];
    // }
    if (question == 1) {
        document.getElementById("unknown").innerHTML = hz[x][0];
    }

    document.getElementById("debugfield").innerHTML = h;
    choices(x, kanatoenglish);
}

function startquiz() {
    console.log('startquiz');
    question = ques;
    answer = answ;
    badlevel = 1;

    while (badlevel == 1) {
        badlevel = 1;

        if (question == 3) {
            biglevel = 1
        }
        if (answer == 3) {
            biglevel = 1
        }
        level = prompt('Change level: 1-166, or 1a-6a, or all');

        if (parseInt(level) < 68) {
            badlevel = 0;
            itemnumber = 15;
            left = itemnumber;

            for (let levelplacecount = 1; levelplacecount < left + 1; levelplacecount = levelplacecount + 1) {
                itemloc[levelplacecount] = levelplacecount + level * 15 - 15;
                itemlocstated = levelplacecount + level * 15 - 15;
                itemcount[levelplacecount] = 1;
                memorycount[levelplacecount] = 1;
            }

            if (biglevel == 1) {
                left = 0;
                for (let levelplacecount = 1; levelplacecount < 16; levelplacecount = levelplacecount + 1) {
                    biglevelplacecount = levelplacecount + level * 15 - 15;
                    left = left + (hz[biglevelplacecount].length - 2);
                }
                biglevelplacecount = level * 15 - 14;
                setLevel();
            }
        }

        if (
            parseInt(level) == 100 ||
            parseInt(level) == 200 ||
            parseInt(level) == 300 ||
            parseInt(level) == 400 ||
            parseInt(level) == 500 ||
            parseInt(level) == 600 ||
            parseInt(level) == 700 ||
            parseInt(level) == 800 ||
            parseInt(level) == 900 ||
            parseInt(level) == 1000
        ) {
            badlevel = 0;
            itemnumber = 100;
            left = itemnumber;
            for (let levelplacecount = 1; levelplacecount < left + 1; levelplacecount = levelplacecount + 1) {
                itemloc[levelplacecount] = levelplacecount + level * 1 - 100;
                itemlocstated = levelplacecount + level * 1 - 100;
                itemcount[levelplacecount] = 1;
                memorycount[levelplacecount] = 1;
            }

            if (biglevel == 1) {
                left = 0;
                for (let levelplacecount = 1; levelplacecount < 101; levelplacecount = levelplacecount + 1) {
                    biglevelplacecount = levelplacecount + level * 1 - 100;
                    left = left + hz[biglevelplacecount].length - 2;
                }
                biglevelplacecount = level * 1 - 99;
                setLevel();
            }
        }

        if (level == '1a') {
            badlevel = 0;
            left = 80;
            itemnumber = left;
            for (let levelplacecount = 1; levelplacecount <= left; levelplacecount = levelplacecount + 1) {
                itemloc[levelplacecount] = levelplacecount;
                itemlocstated = levelplacecount;
                itemcount[levelplacecount] = 1;
                memorycount[levelplacecount] = 1;
            }
            if (biglevel == 1) {
                left = 0;
                for (let levelplacecount = 1; levelplacecount <= 80; levelplacecount = levelplacecount + 1) {
                    biglevelplacecount = levelplacecount;
                    left = left + hz[biglevelplacecount].length - 2;
                }
                biglevelplacecount = 1;
                setLevel();
            }
        }
        if (level == '2a') {
            badlevel = 0;
            left = 160;
            itemnumber = left;
            for (let levelplacecount = 1; levelplacecount <= left; levelplacecount = levelplacecount + 1) {
                itemloc[levelplacecount] = levelplacecount + 80;
                itemlocstated = levelplacecount + 80;
                itemcount[levelplacecount] = 1;
                memorycount[levelplacecount] = 1;
            }
            if (biglevel == 1) {
                left = 0;
                for (let levelplacecount = 1; levelplacecount <= 160; levelplacecount = levelplacecount + 1) {
                    biglevelplacecount = levelplacecount + 80;
                    left = left + hz[biglevelplacecount].length - 2;
                }
                biglevelplacecount = 81;
                setLevel();
            }
        }
        if (level == '3a') {
            badlevel = 0;
            left = 200;
            itemnumber = left;
            for (let levelplacecount = 1; levelplacecount <= left; levelplacecount = levelplacecount + 1) {
                itemloc[levelplacecount] = levelplacecount + 240;
                itemlocstated = levelplacecount + 240;
                itemcount[levelplacecount] = 1;
                memorycount[levelplacecount] = 1;
            }
            if (biglevel == 1) {
                left = 0;
                for (let levelplacecount = 1; levelplacecount <= 200; levelplacecount = levelplacecount + 1) {
                    biglevelplacecount = levelplacecount + 240;
                    left = left + hz[biglevelplacecount].length - 2;
                }
                biglevelplacecount = 241;
                setLevel();
            }
        }
        if (level == '4a') {
            badlevel = 0;
            left = 199;
            itemnumber = left;
            for (let levelplacecount = 1; levelplacecount <= left; levelplacecount = levelplacecount + 1) {
                itemloc[levelplacecount] = levelplacecount + 440;
                itemlocstated = levelplacecount + 440;
                itemcount[levelplacecount] = 1;
                memorycount[levelplacecount] = 1;
            }
            if (biglevel == 1) {
                left = 0;
                for (let levelplacecount = 1; levelplacecount <= 199; levelplacecount = levelplacecount + 1) {
                    biglevelplacecount = levelplacecount + 440;
                    left = left + hz[biglevelplacecount].length - 2;
                }
                biglevelplacecount = 441;
                setLevel();
            }
        }
        if (level == '5a') {
            badlevel = 0;
            left = 185;
            itemnumber = left;
            for (let levelplacecount = 1; levelplacecount <= left; levelplacecount = levelplacecount + 1) {
                itemloc[levelplacecount] = levelplacecount + 639;
                itemlocstated = levelplacecount + 639;
                itemcount[levelplacecount] = 1;
                memorycount[levelplacecount] = 1;
            }
            if (biglevel == 1) {
                left = 0;
                for (let levelplacecount = 1; levelplacecount <= 185; levelplacecount = levelplacecount + 1) {
                    biglevelplacecount = levelplacecount + 639;
                    left = left + hz[biglevelplacecount].length - 2;
                }
                biglevelplacecount = 640;
                setLevel();
            }
        }
        if (level == '6a') {
            badlevel = 0;
            left = 181;
            itemnumber = left;
            for (let levelplacecount = 1; levelplacecount <= left; levelplacecount = levelplacecount + 1) {
                itemloc[levelplacecount] = levelplacecount + 824;
                itemlocstated = levelplacecount + 824;
                itemcount[levelplacecount] = 1;
                memorycount[levelplacecount] = 1;
            }
            if (biglevel == 1) {
                left = 0;
                for (let levelplacecount = 1; levelplacecount <= 181; levelplacecount = levelplacecount + 1) {
                    biglevelplacecount = levelplacecount + 824;
                    left = left + hz[biglevelplacecount].length - 2;
                }
                biglevelplacecount = 825;
                setLevel();
            }
        }
        if (level == '1-2') {
            badlevel = 0;
            left = 240;
            itemnumber = left;
            for (let levelplacecount = 1; levelplacecount <= left; levelplacecount = levelplacecount + 1) {
                itemloc[levelplacecount] = levelplacecount;
                itemlocstated = levelplacecount;
                itemcount[levelplacecount] = 1;
                memorycount[levelplacecount] = 1;
            }
            if (biglevel == 1) {
                left = 0;
                for (let levelplacecount = 1; levelplacecount <= 80; levelplacecount = levelplacecount + 1) {
                    biglevelplacecount = levelplacecount;
                    left = left + hz[biglevelplacecount].length - 2;
                }
                biglevelplacecount = 1;
                setLevel();
            }
        }

        if (level == '1-3') {
            badlevel = 0;
            left = 440;
            itemnumber = left;
            for (let levelplacecount = 1; levelplacecount <= left; levelplacecount = levelplacecount + 1) {
                itemloc[levelplacecount] = levelplacecount;
                itemlocstated = levelplacecount;
                itemcount[levelplacecount] = 1;
                memorycount[levelplacecount] = 1;
            }
            if (biglevel == 1) {
                left = 0;
                for (let levelplacecount = 1; levelplacecount <= 80; levelplacecount = levelplacecount + 1) {
                    biglevelplacecount = levelplacecount;
                    left = left + hz[biglevelplacecount].length - 2;
                }
                biglevelplacecount = 1;
                setLevel();
            }
        }

        if (level == '1-4') {
            badlevel = 0;
            left = 640;
            itemnumber = left;
            for (let levelplacecount = 1; levelplacecount <= left; levelplacecount = levelplacecount + 1) {
                itemloc[levelplacecount] = levelplacecount;
                itemlocstated = levelplacecount;
                itemcount[levelplacecount] = 1;
                memorycount[levelplacecount] = 1;
            }
            if (biglevel == 1) {
                left = 0;
                for (let levelplacecount = 1; levelplacecount <= 80; levelplacecount = levelplacecount + 1) {
                    biglevelplacecount = levelplacecount;
                    left = left + hz[biglevelplacecount].length - 2;
                }
                biglevelplacecount = 1;
                setLevel();
            }
        }

        if (level == '1-5') {
            badlevel = 0;
            left = 825;
            itemnumber = left;
            for (let levelplacecount = 1; levelplacecount <= left; levelplacecount = levelplacecount + 1) {
                itemloc[levelplacecount] = levelplacecount;
                itemlocstated = levelplacecount;
                itemcount[levelplacecount] = 1;
                memorycount[levelplacecount] = 1;
            }
            if (biglevel == 1) {
                left = 0;
                for (let levelplacecount = 1; levelplacecount <= 80; levelplacecount = levelplacecount + 1) {
                    biglevelplacecount = levelplacecount;
                    left = left + hz[biglevelplacecount].length - 2;
                }
                biglevelplacecount = 1;
                setLevel();
            }
        }

        if (level == 'tutti') {
            badlevel = 0;
            left = 1005;
            itemnumber = left;
            for (let levelplacecount = 1; levelplacecount <= left; levelplacecount = levelplacecount + 1) {
                itemloc[levelplacecount] = levelplacecount;
                itemlocstated = levelplacecount;
                itemcount[levelplacecount] = 1;
                memorycount[levelplacecount] = 1;
            }
            if (biglevel == 1) {
                left = 0;
                for (let levelplacecount = 1; levelplacecount <= 1005; levelplacecount = levelplacecount + 1) {
                    biglevelplacecount = levelplacecount;
                    left = left + hz[biglevelplacecount].length - 2;
                }
                biglevelplacecount = 1;
                setLevel();
            }
        }

        if (level == '2-3') {
            badlevel = 0;
            left = 360;
            itemnumber = left;
            for (let levelplacecount = 1; levelplacecount <= left; levelplacecount = levelplacecount + 1) {
                itemloc[levelplacecount] = levelplacecount + 80;
                itemcount[levelplacecount] = 1;
                memorycount[levelplacecount] = 1;
            }
            if (biglevel == 1) {
                left = 0;
                for (let levelplacecount = 1; levelplacecount <= 80; levelplacecount = levelplacecount + 1) {
                    biglevelplacecount = levelplacecount;
                    left = left + hz[biglevelplacecount].length - 2;
                }
                biglevelplacecount = 1;
                setLevel();
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
