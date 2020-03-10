var scheduler = require('node-schedule');
const axios = require('axios');
const puppeteer = require('puppeteer');
const cheerio = require("cheerio");
const fs = require('fs');

const bno = "https://docs.google.com/spreadsheets/u/0/d/e/2PACX-1vR30F8lYP3jG7YOq8es0PBpJIE5yvRVZffOyaqC0GgMBN6yt0Q-NI8pxS7hd1F9dYXnowSC6zpZmW9D/pubhtml/sheet?headers=false&gid=0";

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

async function scrapeSite() {
    const browser = await puppeteer.launch({
                        // headless: true,
                        executablePath: PATHS[process.platform].executablePath,
                        userDataDir: PATHS.win32.userDataDir,
                        headless: false,
                    });
    const page = await browser.newPage();
    /* Go to the IMDB Movie page and wait for it to load */
    await page.goto(bno);
    /* Run javascript inside of the page */
    console.log('step');
    // await page.waitFor('tr');
    // console.log('ASD');

    let data = await page.evaluate(() => {
        let table = document.querySelector('table');
        // let table = document;
        console.log(table);
        let rows = Array.from(table.children);
            
        // let info = rows.map(rows => {
        //     let title = rows.querySelector("tr").textContent;
        //     // let datetime = rows.querySelector(".datetime").textContent;
        //     // let episode_download_page = rows_panel
        //     //   .querySelector(".download")
        //     //   .getAttribute("href");
        //     return { title, datetime, episode_download_page };
        // });
        // console.log(info);
    });
    // await browser.close();
    // return info;
   

    // let data = await page.evaluate(() => {
    //     // let title = document.querySelector('table[class="waffle no-grid] > tbody > tr[style=height: 39px]]) > td[class="s9"]').innerText;
    //     let title = document.querySelector('td[class="s16"]').innerText;
    //     console.log(title);
    //     return {
    //         title,
    //         // rating,
    //         // ratingCountg
    //     }
    //     // console.log(title);
    // //   let rating = document.querySelector('span[itemprop="ratingValue"]').innerText;
    // //   let ratingCount = document.querySelector('span[itemprop="ratingCount"]').innerText;
    //   /* Returning an object filled with the scraped data */
    // });
    // /* Outputting what we scraped */
    // console.log(data);
    // await browser.close();
}
scrapeSite();