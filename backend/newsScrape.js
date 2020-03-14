const CurrentsAPI = require('currentsapi');
const currentsapi = new CurrentsAPI('buEioRPUsASndlM42FwsZDPOK1AW-CSMeeaxscPa-tfgn_aV');
const fs = require('fs') 
const axios = require('axios');
const puppeteer = require('puppeteer-core');
const cheerio = require("cheerio");

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

// const url = 'https://news.google.com/search?q=montreal coronavirus'

async function scrapeSite(url) {
    const browser = await puppeteer.launch({
                        headless: true,
                        executablePath: PATHS[process.platform].executablePath,
                        userDataDir: PATHS.win32.userDataDir,
                        // headless: false,
    });
    const page = await browser.newPage();
    await page.goto(url);
    let data = await page.evaluate(() => {
        let articles = document.querySelectorAll('div[class="lBwEZb BL5WZb xP6mwf"] > div');
        var info = [];
        var offset = 0;
        for(var i = 0; i < 5; i++){
            // console.log(articles[i].className.length);
            j = i+offset;
            // console.log(articles[j].className.length);
            // console.log(articles[j]);
            if(articles[j].className.length > 40){
                // console.log(articles[i].childNodes[0].childNodes[0].childNodes[0].childNodes[0].src);
                // console.log(articles[i].childNodes[0].childNodes[1].childNodes[3].childNodes[0].childNodes[3].innerText);
                info.push({
                    title: articles[j].childNodes[0].childNodes[1].childNodes[1].innerText,
                    link:articles[j].childNodes[0].childNodes[1].childNodes[0].href,
                    source:articles[j].childNodes[0].childNodes[1].childNodes[3].childNodes[0].childNodes[2].innerText,
                    time:articles[j].childNodes[0].childNodes[1].childNodes[3].childNodes[0].childNodes[3].innerText,
                    img:articles[j].childNodes[0].childNodes[0].childNodes[0].childNodes[0].src
                })
            }
            else if(articles[j].className.length > 33){
                // console.log(articles[i].childNodes[0]);
                info.push({
                    title: articles[j].childNodes[1].childNodes[0].childNodes[1].innerText,
                    link:articles[j].childNodes[1].childNodes[0].childNodes[0].href,
                    source: articles[j].childNodes[1].childNodes[0].childNodes[3].childNodes[0].childNodes[2].innerText,
                    time: articles[j].childNodes[1].childNodes[0].childNodes[3].childNodes[0].childNodes[3].innerText,
                    img: articles[j].childNodes[0].childNodes[0].childNodes[0].src,
                })
            }
            else{
                offset = offset+1;
                i = i-1;
            }
        }
        // console.log(info);
        return info;
    }); 
    // console.log(data);
    await browser.close();
    return data;
}

async function findNews(place){
    data = await scrapeSite('https://news.google.com/search?q='+place+' coronavirus');
    console.log(data);
}

findNews("montreal");