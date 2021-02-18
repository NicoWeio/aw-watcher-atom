# aw-watcher-atom

This extension allows the open source tracking tool [ActivityWatch](http://activitywatch.net/) to keep track of the projects and coding languages you use in Atom.

The source code is available on [GitHub](https://github.com/NicoWeio/aw-watcher-atom).

## Features

Sends the following data to ActivityWatch:

-   current project name (i.e. the name of the first project folder)
-   coding language
-   current file name

## Requirements

To run this extension, you need to have a running ActivityWatch server.
You should be able to see your dashboard at [localhost:5600](http://localhost:5600/).
If you don't use ActivityWatch already,
install it from their [homepage](https://activitywatch.net/downloads/).

## Installing

This is an _Atom Package_.
Upon installation, it will automatically connect to your local ActivityWatch Server and continuously report your usage data to it.
If you're viewing this from within Atom – great!
Just click <kbd>Install</kbd>.
Otherwise, you can find instructions on how to install Atom packages [here](https://flight-manual.atom.io/using-atom/sections/atom-packages/).

## Error reporting

If you run into any errors or have feature requests, please [open an issue on GitHub](https://github.com/NicoWeio/aw-watcher-atom/issues/new).

* * *

## Release Notes

### 0.1.0

Initial release of aw-watcher-atom.
