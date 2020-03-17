var scheduler = require('node-schedule');
const axios = require('axios');
const puppeteer = require('puppeteer');
const cheerio = require("cheerio");
const fs = require('fs');

const URL = 'http://localhost:8000'

const world = "https://docs.google.com/spreadsheets/u/0/d/e/2PACX-1vR30F8lYP3jG7YOq8es0PBpJIE5yvRVZffOyaqC0GgMBN6yt0Q-NI8pxS7hd1F9dYXnowSC6zpZmW9D/pubhtml/sheet?headers=false&gid=0";
const usa = "https://docs.google.com/spreadsheets/u/0/d/e/2PACX-1vR30F8lYP3jG7YOq8es0PBpJIE5yvRVZffOyaqC0GgMBN6yt0Q-NI8pxS7hd1F9dYXnowSC6zpZmW9D/pubhtml/sheet?headers=false&gid=1902046093"
const can = "https://docs.google.com/spreadsheets/u/0/d/e/2PACX-1vR30F8lYP3jG7YOq8es0PBpJIE5yvRVZffOyaqC0GgMBN6yt0Q-NI8pxS7hd1F9dYXnowSC6zpZmW9D/pubhtml/sheet?headers=false&gid=338130207"

const ignore = ['Canada', 'United States', 'Diamond Princess', 'Grand Princess', 'OTHER PLACES']

const PATHS = {
    win32: {
        executablePath: "C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe",
        userDataDir: 'C:\\Users\\Raymond\\AppData\\Local\\Temp\\puppeteer_user_data',
    },
    linux: {
        executablePath: "/mnt/c/Program Files (x86)/Google/Chrome/Application/chrome.exe",
        userDataDir: '/mnt/c/Users/Raymond/AppData/Local/Temp/puppeteer_user_data',
    },
}

async function scrapeSite(place) {
    var url = 'https://docs.google.com/spreadsheets/u/0/d/e/2PACX-1vR30F8lYP3jG7YOq8es0PBpJIE5yvRVZffOyaqC0GgMBN6yt0Q-NI8pxS7hd1F9dYXnowSC6zpZmW9D/pubhtml/sheet?headers=false&gid='
    if(place === 'usa'){
        url = url + '1902046093'
    }
    else if(place === 'can'){
        url = url + '338130207'
    }
    else if(place === 'world'){
        url = url + '0'
    }
    const browser = await puppeteer.launch({
                        headless: true,
                        executablePath: PATHS[process.platform].executablePath,
                        userDataDir: PATHS.win32.userDataDir,
                        // headless: false,
                    });
    const page = await browser.newPage();
    await page.goto(url);
    /* Run javascript inside of the page */

    let data = await page.evaluate(() => {
        let table = document.querySelector('table > tbody');
        // let table = document;
        // console.log(table);
        let rows = Array.from(table.children);
        // console.log(rows);
        info = [];

        for(var i = 5; i < rows.length-3; i++){
            info.push({
                state: rows[i].children[1].innerText, 
                cases: parseInt(rows[i].children[2].innerText.replace(/,/g,'')),
                deaths: parseInt(rows[i].children[3].innerText.replace(/,/g,'')),
                serious: parseInt(rows[i].children[4].innerText.replace(/,/g,'')),
                critical: parseInt(rows[i].children[5].innerText.replace(/,/g,'')),
                recovered: parseInt(rows[i].children[6].innerText.replace(/,/g,'')),
            });
        }
        return info;
    });
    browser.close();
    // console.log(data);
    putPlaces(data, place);
    // return data;
}

async function putPlaces(data, place){
    var suf = ""
    // console.log(place);
    if(place === 'usa'){
        suf = ",us"
    }
    for(var i = 0; i < data.length; i++){
    // for(var i = 0; i < 1; i++){
        // console.log(data[i].state + suf);
        if(notIgnore(data[i],place)){
            axios.post(URL + '/places',{
                address: data[i].state + suf,
                cases: data[i]
            })
            .catch(err => {
                console.log(data[i]);
                console.log('Error1: '+err)
            });
        }
    }

}

function notIgnore(data, place){
    if(ignore.includes(data.state)){
        return false;
    }
    if(place == 'usa' && data.state == 'Wuhan'){
        return false;
    }
    return true;
}

(async () => {
    scrapeSite('world');
    // scrapeSite('can');
    // scrapeSite('usa');
})()