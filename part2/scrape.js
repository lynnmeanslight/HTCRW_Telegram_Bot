import cheerio from 'cheerio';
import fetch from 'node-fetch';
import { modifyExchangeRate } from './utils.js';

export async function scrapeWebsite() {
    const url = `https://coinmarketcap.com/`;
    
    try {
        const response = await fetch(url);
        const html = await response.text();
        const $ = cheerio.load(html);
        // const exchangeRate = $('td div span');
        const rows= $('tr');
        const result = [];

        for (let index = 1; index < rows.length; index++) {
            const row = rows[index];

            const cryptoName = $(row).find('td:nth-child(3) div a div div div p:nth-child(1)').html();
            
            const exchangeRateElement = $(row).find('td:nth-child(4) div a span').html().split("$")[1];

            const exchangeRate = modifyExchangeRate(exchangeRateElement);
            result.push([cryptoName,exchangeRate]);
            if (index === 10) { // Break when index is 10 (zero-based index)
                break;
            }
        }
        return result;
    } catch (error) {
        console.error('Error:', error);
        return [];
    }
}

