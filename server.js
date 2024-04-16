const http = require('http');
const axios = require('axios');
const cheerio = require('cheerio');

async function fetchNewestUpdates() {
  try {
    const response = await axios.get('https://time.com/');
    const $ = cheerio.load(response.data);
    const latestUpdates = [];

    $('.tout__list-item').each((index, element) => {
      if (index < 6) { 
        
        const title = $(element).find('.headline').text().trim();
        const link = $(element).find('.tout__list-item-link').attr('href');
        latestUpdates.push({ title, link });
      }
    });

    return latestUpdates;
  } catch (error) {
    console.error('Error fetching newest updates:', error);
    return [];
  }
}

const server = http.createServer(async (req, res) => {
  
  if (req.url === '/getNewestUpdates' && req.method === 'GET') {
    try {
      const latestUpdates = await fetchNewestUpdates();
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(latestUpdates));
    } catch (error) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Internal Server Error');
    }
  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('404 Not Found');
  }
});

server.listen(8001, () => {
  console.log('Server running at http://localhost:8001/');
});
