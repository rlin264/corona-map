const puppeteer = require('puppeteer');

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

function NewsScraper(){
    this.scrapeNews = async function (place) {
        const start = Date.now();
        const url = 'https://news.google.com/search?q='+place+' coronavirus'
        const browser = await puppeteer.launch({
                            headless: true,
                            // executablePath: PATHS[process.platform].executablePath,
                            // userDataDir: PATHS.win32.userDataDir,
                            devtools: false,
                            args: [
                                  '--disable-canvas-aa', // Disable antialiasing on 2d canvas
                                  '--disable-2d-canvas-clip-aa', // Disable antialiasing on 2d canvas clips
                                  '--disable-gl-drawing-for-tests', // BEST OPTION EVER! Disables GL drawing operations which produce pixel output. With this the GL output will not be correct but tests will run faster.
                                  '--disable-dev-shm-usage', // ???
                                  '--no-zygote', // wtf does that mean ?
                                  '--use-gl=swiftshader', // better cpu usage with --use-gl=desktop rather than --use-gl=swiftshader, still needs more testing.
                                  '--enable-webgl',
                                  '--hide-scrollbars',
                                  '--mute-audio',
                                  '--no-first-run',
                                  '--disable-infobars',
                                  '--disable-breakpad',
                                  //'--ignore-gpu-blacklist',
                                  '--window-size=1280,1024', // see defaultViewport
                                  '--user-data-dir=./chromeData', // created in index.js, guess cache folder ends up inside too.
                                  '--no-sandbox', // meh but better resource comsuption
                                //   '--proxy-server=socks5://127.0.0.1:9050', // tor if needed
                                  '--disable-setuid-sandbox']
        });
        const page = await browser.newPage();
        await page.goto(url);
        let data = await page.evaluate(() => {
            let articles = document.querySelectorAll('div[class="lBwEZb BL5WZb xP6mwf"] > div');
            var info = [];
            var offset = 0;
            for(var i = 0; i < 5; i++){
                j = i+offset;
                if(articles[j].className.length > 40){
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
            return info;
        }); 
        browser.close();
        console.log('Took', Date.now() - start, 'ms');
        return data;
    }
    
    this.findNews = async function(place){
        data = await this.scrapeNews(place);
        console.log(data);
    }
}
const newsScraper = new NewsScraper();
module.exports = newsScraper;