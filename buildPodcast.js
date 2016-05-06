"use strict";
var Podcast = require("podcast");
var fs = require("fs");
function buildFeed(rootDir) {
    console.log("Building feed for " + rootDir);
    var podcastConfig = JSON.parse(fs.readFileSync(rootDir + "/settings.json", "utf8")).podcast;
    var feed = new Podcast(podcastConfig);
    var files = fs.readdirSync(rootDir).filter(function (fn) {
        return fn.search(podcastConfig.fileRegex) >= 0;
    });
    files.forEach(function (fn) {
        console.log("Processing file: " + fn);
        var itemConfig = {
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
    var xmlFile = fs.writeFileSync(rootDir + "/feed.xml", feed.xml("\t"));
    console.log("Feed generation complete.");
}
if (process.argv.length <= 2) {
    console.log("Usage: " + __filename + " directoryName");
    process.exit(-1);
}
buildFeed(process.argv[2]);
