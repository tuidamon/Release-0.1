# Webpage status checking tool

## Installation

Open the folder in VS Code or in CMD, then enter "npm install". If you don't have npm yet, please go to https://www.npmjs.com/get-npm download and install it.

Install dependencies:
```
npm i --save colors request
```

## Features

1. support both Windows and Unix style command line args (e.g., --version vs. /v)
2. allow passing directory paths vs. file paths, and recursively process all children under that directory
3. add support for more HTTP result codes. For example, redirects with 301, 307, 308 (i.e., follow the redirect to the new location)
4. add support for timeouts, DNS resolution issues, or other server errors when accessing a bad URL. A bad domain, URL, or server shouldn't crash your tool.
5. add feature for ignore url(s). If you enter 'Webpage-status-checking-tool --ignore [ignore url list filename] [url list filename]', this tool test all urls without ignore urls.

## Instructions

Enter "node checkURL.js xxx" xxx is the filename you want to check.

Enter "node checkURL.js --v" to check current version. (or -v, /v, /version)





