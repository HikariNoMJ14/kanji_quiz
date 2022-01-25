var XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
var fs = require('fs');

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4) {
            if (rawFile.status === 200 || rawFile.status == 0) {
                let data = rawFile.responseText;

                return callback(data);
            }
        }
    };
    rawFile.send(null);
}

function saveToFile(file, jsonData) {
    fs.writeFile(file, jsonData, function(err) {
        if (err) {
            console.log(err);
        }
    });
}

async function readDictionary(data) {
    let dictionary = [];

    await data.split('\n').forEach((line) => {
        let elements = line.split('\t');
        if (elements.length < 6) return;
        let key = elements[0];
        let hskLevel = elements[6] === 'original' ? parseInt(elements[5]) : '-';
        let tocflLevel = elements[8] === 'original' ? parseInt(elements[7]) : '-';

        let english = elements[4].split('/').filter((definition) => {
            return !definition.startsWith("CL:");
        }).join('; ');

        let entry = {
            // key: key,
            // characters: " " + elements[1] + " " + elements[2] + " ",
            traditional: elements[1],
            simplified: elements[2],
            pinyin: elements[3],
            english: english,
            // hsk: hskLevel,
            // hskCategory: elements[6],
            tocfl: tocflLevel,
            tocflCategory: elements[7]
        };
        dictionary.push(entry);
    });

    var jsonData = JSON.stringify(dictionary);
    saveToFile('../../data/tocfl_dict.json', jsonData);
}

function readSentences(file, setState) {
    axios.get(file).then(result => {
        var sentenceDictionary = [];
        result.data.split('\n').forEach((line, index) => {
            let elements = line.split('\t');
            if (elements.length < 2) return;
            let entry = {
                key: index,
                tt_eng: elements[0],
                tt_cmn: elements[1],
                english: elements[2],
                simplified: elements[3],
                pinyin: elements[4],
                traditional: elements[5],
                hsk: elements[6],
                tocfl: elements[7],
            };
            sentenceDictionary.push(entry);
        });
        var hskOrder = [];
        var tocflOrder = [];
        sentenceDictionary.forEach(sentence => {
            hskOrder[sentence.hsk - 1] = sentence.key;
            tocflOrder[sentence.tocfl - 1] = sentence.key;
        });
        setState({sentenceDictionary: sentenceDictionary, hskSentenceOrder: hskOrder, tocflSentenceOrder: tocflOrder});
    });
}

function readWordList(file, type, setState) {
    axios.get(file).then(result => {
        let wordLevels = {};
        result.data.split('\n').forEach((line) => {
            let elements = line.split('\t');
            if (elements.length < 2) return;
            wordLevels[elements[0]] = wordLevels[elements[0]] || parseInt(elements[2]);
        });
        let state = {};
        state[type + 'Levels'] = wordLevels;
        setState(state);
    });
}

readTextFile("file:////media/manu/Data/PycharmProjects/kanji_quiz/data/tocfl_dict.txt", readDictionary);


