import fs from "fs";
import https from "https";
import { URL } from "url";

export const fetchUrlPage = (inputUrl: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    https
      .get(inputUrl, (res) => {
        let data = "";
        res.on("data", (chunk) => {
          data += chunk;
        });
        res.on("end", () => resolve(data));
      })
      .on("error", (err) => reject(new Error(err.message)));
  });
};

export const savePage = (content: string, domain: string): void => {
  const filename = `${process.cwd()}/${domain}.html`;
  fs.writeFileSync(filename, content);
  console.log(`Saved: ${filename}`);
};

export const extractMetadata = (content: string) => {
  const numFetch = (
    content.match(/<a\s+[^>]*href=["']?[^"'>]+["']?[^>]*>/gi) || []
  ).length;
  const images = (
    content.match(/<img\s+[^>]*src=["']?[^"'>]+["']?[^>]*>/gi) || []
  ).length;
  return {
    numFetch,
    images,
    lastFetch: new Date().toISOString(),
  };
};

export const fetchAndSave = async (urls: string[]) => {
  for (const pageUrl of urls) {
    const domain = new URL(pageUrl).hostname;
    try {
      const content = await fetchUrlPage(pageUrl);
      savePage(content, domain);
      const metadata = extractMetadata(content);
      console.log(`Site ${pageUrl}:`, "\n", metadata);
    } catch (err: any) {
      console.error(`Error fetching ${pageUrl}: ${err.message}`);
    }
  }
};

const argL = 3;
const args = process.argv.slice(argL);
if (args.length === 0) {
  console.log("Please provide at least one URL.");
} else {
  fetchAndSave(args);
}
