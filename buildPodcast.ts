import * as Podcast from "podcast";
import * as fs from "fs";

import { lookup } from "dns";
import { hostname } from "os";
interface PodcastConfig extends IFeedOptions {
    fileRegex: string
}

const defaultPort = 8080;

async function getLocalAddress() {
    return new Promise<string>((resolve, error) => {
        lookup(hostname(), (err, add, fam) => {
            resolve(add);
        });
    });
}

async function buildFeed(rootDir: string) {
    console.log(`Building feed for ${rootDir}`);

    const podcastConfig = JSON.parse(fs.readFileSync(rootDir + "/settings.json", "utf8")).podcast as PodcastConfig;
    let localAddress = await getLocalAddress();
    podcastConfig.feed_url = podcastConfig.feed_url || `http://${localAddress}:${defaultPort}/${rootDir}`;

    let feed = new Podcast(podcastConfig);

    let files = fs.readdirSync(rootDir).filter((fn: string) => {
        return fn.search(podcastConfig.fileRegex) >= 0;
    });

    files.forEach((fn) => {
        console.log(`Processing file: ${fn} `);
        let itemConfig = {
            title: fn,
            guid: fn,
            url: podcastConfig.feed_url + "/" + encodeURIComponent(fn),
            description: fn,
            date: new Date(),
            enclosure: {
                url: podcastConfig.feed_url + "/" + encodeURIComponent(fn),
                file: rootDir + "/" + fn
            }
        };
        feed.item(itemConfig);
    });

    let xmlFile = fs.writeFileSync(rootDir + "/feed.xml", feed.xml("\t"));
    console.log("Feed generation complete.");
}

if (process.argv.length <= 2) {
    console.log("Usage: " + __filename + " directoryName");
    process.exit(-1);
}
buildFeed(process.argv[2]);
