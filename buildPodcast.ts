import * as Podcast from "podcast";
import * as fs from "fs";

function buildFeed(rootDir: string) {
    console.log(`Building feed for ${rootDir}`);
    const podcastConfig = JSON.parse(fs.readFileSync(rootDir + "/settings.json", "utf8")).podcast;

    let feed = new Podcast(podcastConfig);

    let files = fs.readdirSync(rootDir).filter((fn: string) => {
        return fn.search(podcastConfig.fileRegex) >= 0;
    });

    files.forEach((fn) => {
        console.log(`Processing file: ${fn}`);
        let itemConfig = {
            title: fn,
            guid: fn,
            url: encodeURIComponent(podcastConfig.feed_url + "/" + fn),
            description: fn,
            date: new Date(),
            enclosure: {
                url: podcastConfig.feed_url + "/" + fn,
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
