// // backend/crawler.js
// import axios from 'axios';
// import * as cheerio from 'cheerio';
// import dotenv from 'dotenv';

// dotenv.config();

// const CONFIDENCE_THRESHOLD = 0.3;

// const seedUrls = [
//   'https://www.freecodecamp.org/news/',
//   'https://dev.to/',
//   'https://manassaloi.com/posts/',
//   'https://www.taniarascia.com/',
//   'https://upmostly.com/',
//   'https://davidwalsh.name/',
//   'https://www.robinwieruch.de/blog/',
//   'https://tanaypratap.com/',
//   'https://www.machinelearningisfun.com/',
//   'https://fastml.com/',
//   'https://ai.google/research/',
//   'https://overreacted.io/',
//   'https://jvns.ca/',
//   'https://tommacwright.com/',
//   'https://joshwcomeau.com/blog/',
//   'https://mxb.dev/blog/',
//   'https://auroramazzone.com/blog',
//   'https://waitbutwhy.com/',
//   'https://www.raptitude.com/',
//   'https://zenhabits.net/',
//   'https://markmanson.net/',
//   'https://www.nomadicmatt.com/travel-blog/',
//   'https://legalnomads.com/blog/',
//   'https://alastairsavage.com/',
//   'https://neil-gaiman.com/journal/',
//   'https://brainpickings.org/',
  
// ];

// // 🧠 Step 1: Add classification logic with thresholding
// async function classifyBlog(title, content) {
//   try {
//     const text = `${title} ${content.slice(0, 500)}`;
//     const res = await axios.post('http://localhost:5000/classify', { text });
//     const { label, confidence } = res.data;

//     if (confidence < CONFIDENCE_THRESHOLD) {
//       console.log(`🤔 Skipped (low confidence ${confidence.toFixed(2)}): ${title}`);
//       return 0;
//     }

//     return label;
//   } catch (err) {
//     console.error(`❌ Classification failed: ${err.message}`);
//     return 1; // default to personal if uncertain
//   }
// }

// async function extractContent(url) {
//   try {
//     const { data: html } = await axios.get(url, {
//       timeout: 10000,
//       headers: {
//         'User-Agent':
//           'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0 Safari/537.36',
//       },
//     });

//     const $ = cheerio.load(html);
//     const title = $('title').text().trim().slice(0, 120);
//     const content = $('body').text().replace(/\s+/g, ' ').slice(0, 10000);
//     const snippet = content.slice(0, 300) + '...';
//     const domain = new URL(url).hostname;

//     return { title, content, snippet, domain, url };
//   } catch (err) {
//     console.error(`❌ Failed to crawl ${url}: ${err.message}`);
//     return null;
//   }
// }

// async function saveToDB(blog) {
//   try {
//     await axios.post('http://localhost:8000/api/blogs/add', blog);
//     console.log(`✅ Added blog: ${blog.title}`);
//   } catch (err) {
//     console.error(`❌ Failed to save blog (${blog.url}): ${err.message}`);
//   }
// }

// function sleep(ms) {
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

// (async () => {
//   console.log(`🔍 Crawling ${seedUrls.length} seed URLs...\n`);
//   for (const url of seedUrls) {
//     const blog = await extractContent(url);
//     if (!blog) {
//       console.log(`⚠️ Skipped: ${url}\n`);
//       continue;
//     }

//     const label = await classifyBlog(blog.title, blog.content);
//     if (label === 1) {
//       await saveToDB(blog);
//     } else {
//       console.log(`🛑 Skipped (non-personal): ${blog.title}\n`);
//     }

//     await sleep(2000); // 2 second respectful delay
//   }
// })();


// backend/crawler.js
import axios from 'axios';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';

dotenv.config();

const CONFIDENCE_THRESHOLD = 0.3;
const MAX_DATASET_SIZE_MB = 10;
const MAX_CRAWLED_BLOGS = 100;

const seedUrls = [
  'https://www.taniarascia.com/',
  'https://upmostly.com/',
  'https://davidwalsh.name/',
  'https://www.robinwieruch.de/blog/',
  'https://tanaypratap.com/',
  'https://www.machinelearningisfun.com/',
  'https://fastml.com/',
  'https://ai.google/research/',
  'https://overreacted.io/',
  'https://jvns.ca/',
  'https://tommacwright.com/',
  'https://www.raptitude.com/',
  'https://zenhabits.net/',
  'https://markmanson.net/',
  'https://www.nomadicmatt.com/travel-blog/',
  'https://legalnomads.com/blog/',
  'https://alastairsavage.com/',
  'https://neil-gaiman.com/journal/',
  'https://brainpickings.org/',
];

const visitedUrls = new Set();
let crawledCount = 0;
let totalSizeMB = 0;

async function classifyBlog(title, content) {
  try {
    const text = `${title} ${content.slice(0, 500)}`;
    const res = await axios.post('http://localhost:5000/classify', { text });
    const { label, confidence } = res.data;

    if (confidence < CONFIDENCE_THRESHOLD) {
      console.log(`🤔 Skipped (low confidence ${confidence.toFixed(2)}): ${title}`);
      return 0;
    }

    return label;
  } catch (err) {
    console.error(`❌ Classification failed: ${err.message}`);
    return 1;
  }
}

async function extractContent(url) {
  try {
    const { data: html } = await axios.get(url, {
      timeout: 10000,
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/91.0 Safari/537.36',
      },
    });

    const $ = cheerio.load(html);
    const title = $('title').text().trim().slice(0, 120);
    const content = $('body').text().replace(/\s+/g, ' ').slice(0, 10000);
    const snippet = content.slice(0, 300) + '...';
    const domain = new URL(url).hostname;

    return { title, content, snippet, domain, url };
  } catch (err) {
    console.error(`❌ Failed to crawl ${url}: ${err.message}`);
    return null;
  }
}

async function saveToDB(blog) {
  try {
    await axios.post('http://localhost:8000/api/blogs/add', blog);
    console.log(`✅ Added blog: ${blog.title}`);
  } catch (err) {
    console.error(`❌ Failed to save blog (${blog.url}): ${err.message}`);
  }
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function estimateSizeInMB(text) {
  const bytes = new TextEncoder().encode(text).length;
  return bytes / (1024 * 1024);
}

async function bfsCrawl(seedUrls) {
  const queue = [...seedUrls];

  while (queue.length && crawledCount < MAX_CRAWLED_BLOGS && totalSizeMB < MAX_DATASET_SIZE_MB) {
    const url = queue.shift();
    if (visitedUrls.has(url)) continue;
    visitedUrls.add(url);

    const blog = await extractContent(url);
    if (!blog) continue;

    const sizeMB = estimateSizeInMB(blog.content);
    if (totalSizeMB + sizeMB > MAX_DATASET_SIZE_MB) {
      console.log(`📦 Skipped (size limit): ${blog.title}`);
      continue;
    }

    const label = await classifyBlog(blog.title, blog.content);
    if (label === 1) {
      await saveToDB(blog);
      crawledCount++;
      totalSizeMB += sizeMB;
    } else {
      console.log(`🛑 Skipped (non-personal): ${blog.title}`);
    }

    try {
      const $ = cheerio.load(await axios.get(url).then(res => res.data));
      const links = $('a')
        .map((_, el) => $(el).attr('href'))
        .get()
        .filter(href => href && href.startsWith('http') && !visitedUrls.has(href));

      queue.push(...links);
    } catch (err) {
      console.error(`⚠️ Error extracting links from ${url}: ${err.message}`);
    }

    await sleep(1500);
  }

  console.log(`\n✅ BFS Crawl complete. Blogs saved: ${crawledCount}, Total size: ${totalSizeMB.toFixed(2)} MB`);
}

(async () => {
  console.log(`🔍 Starting BFS crawl with ${seedUrls.length} seed URLs...\n`);
  await bfsCrawl(seedUrls);
})();
