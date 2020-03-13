var scheduler = require('node-schedule');
const axios = require('axios');
const puppeteer = require('puppeteer');
const cheerio = require("cheerio");
const fs = require('fs');

const URL = 'http://localhost:8000'

const world = "https://docs.google.com/spreadsheets/u/0/d/e/2PACX-1vR30F8lYP3jG7YOq8es0PBpJIE5yvRVZffOyaqC0GgMBN6yt0Q-NI8pxS7hd1F9dYXnowSC6zpZmW9D/pubhtml/sheet?headers=false&gid=0";
const usa = "https://docs.google.com/spreadsheets/u/0/d/e/2PACX-1vR30F8lYP3jG7YOq8es0PBpJIE5yvRVZffOyaqC0GgMBN6yt0Q-NI8pxS7hd1F9dYXnowSC6zpZmW9D/pubhtml/sheet?headers=false&gid=1902046093"
const can = "https://docs.google.com/spreadsheets/u/0/d/e/2PACX-1vR30F8lYP3jG7YOq8es0PBpJIE5yvRVZffOyaqC0GgMBN6yt0Q-NI8pxS7hd1F9dYXnowSC6zpZmW9D/pubhtml/sheet?headers=false&gid=338130207"

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

async function scrapeSite(url) {
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
        console.log(table);
        let rows = Array.from(table.children);
        console.log(rows);
            
        info = [];

        for(var i = 6; i < rows.length-2; i++){
            info.push([
                rows[i].children[1].innerText, 
                rows[i].children[2].innerText,
                rows[i].children[3].innerText,
                rows[i].children[4].innerText,
                rows[i].children[5].innerText,
                rows[i].children[6].innerText,
            ]);
        }
        return info;

        
    });
    await browser.close();
    // console.log(data);
    putPlaces(data);
    // return data;
}

async function putPlaces(data){
    for(var i = 0; i < data.length; i++){
        axios.post(URL + '/places',{
            address: data[i][0],
            count: parseInt(data[i][1]),
        })
    }

}

(async () => {
    data = scrapeSite(can);
    // console.log(data);
    // console.log(data[0]);
    // putPlaces(data);
})()