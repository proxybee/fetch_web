import { expect } from "chai";
import fs from "fs";
import { createSandbox } from "sinon";
import https from "https";
import {
  extractMetadata,
  fetchAndSave,
  fetchUrlPage,
  savePage,
} from "../fetch";
import { IncomingMessage } from "http";

describe("Web Fetcher", () => {
  const sandbox = createSandbox();
  const mockUrl = "https://www.example.com";
  const mockContent = "<html><body>Hello World</body></html>";
  const response: IncomingMessage = {
    on: (event: string, cb: Function) => {
      if (event === "data") {
        cb(Buffer.from(mockContent));
      }
      if (event === "end") {
        cb();
      }
    },
    statusCode: 200,
    headers: {},
  } as IncomingMessage;
  beforeEach(() => {});
  afterEach(() => {
    sandbox.restore();
  });

  describe("fetchUrlPage", () => {
    it("should fetch url page content successfully", async () => {
      sandbox.stub(https, "get").yields(response);
      const content = await fetchUrlPage(mockUrl);
      expect(content).to.equal(mockContent);
    });

    it("should handle any errors that occurs during fetch", async () => {
      const mockUrl = "https://www.example.com";

      sandbox.stub(https, "get").throws(new Error("Fetch error"));

      expect(fetchUrlPage(mockUrl)).to.be.contains(Error("Fetch error"));
    });
  });

  describe("savePage", () => {
    it("should save the fetched content to a file", () => {
      const mockDomain = "testDomain";
      const writeFileSyncStub = sandbox.stub(fs, "writeFileSync");

      savePage(mockContent, mockDomain);

      const expectedPath = `${process.cwd()}/${mockDomain}.html`;
      expect(writeFileSyncStub.calledOnce).to.be.true;
      expect(writeFileSyncStub.calledWith(expectedPath, mockContent)).to.be
        .true;

      writeFileSyncStub.restore();
    });
  });

  describe("extractMetadata", () => {
    it("should extract link and image counts from returned content", () => {
      const mockContent = `
                <html>
                    <body>
                        <a href="https://link1.com">Link 1</a>
                        <a href="https://link2.com">Link 2</a>
                        <img src="image1.png" />
                        <img src="image2.png" />
                    </body>
                </html>`;

      const metadata = extractMetadata(mockContent);
      expect(metadata.numFetch).to.equal(2);
      expect(metadata.images).to.equal(2);
      expect(metadata.lastFetch).to.be.a("string");
    });
  });

  describe("fetchAndSave", () => {
    it("should fetch and save a page and log its metadata", async () => {
      const domain = new URL(mockUrl).hostname;
      sandbox.stub(https, "get").yields(response);

      const writeFileSyncStub = sandbox.stub(fs, "writeFileSync");

      await fetchAndSave([mockUrl]);

      expect(writeFileSyncStub.calledOnce).to.be.true;
      expect(
        writeFileSyncStub.calledWith(
          `${process.cwd()}/${domain}.html`,
          mockContent
        )
      ).to.be.true;
    });

    it("should log an error message if fetching fails", async () => {
      const mockUrl = "https://www.example.com";
      const consoleErrorStub = sandbox.stub(console, "error");

      sandbox.stub(https, "get").throws(new Error("Fetch error"));

      await fetchAndSave([mockUrl]);
      expect(consoleErrorStub.calledOnce).to.be.true;
      expect(
        consoleErrorStub.calledWithMatch(
          `Error fetching ${mockUrl}: Fetch error`
        )
      ).to.be.true;

      consoleErrorStub.restore();
    });
  });
});
