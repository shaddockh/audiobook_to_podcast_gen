## Audio Book to Podcast Generator

Very simple utility to convert a directory of \*.mp3 files into a podcast feed that can be downloaded to a podcatcher.

## Installation

```npm install```
```npm run build```

## Usage
Take a look at the ```Sample``` directory for an example.  Basically, create a directory, modify the settings.json in that directory and deposit the ```.mp3``` files to convert to a feed in that directory.

run ```npm run generate -- {dirname}```

then run ```npm run server``` to spin up a server

Point your podcatcher at this url and download the episodes.
