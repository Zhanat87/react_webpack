// require("!style!css!./style.css"); // webpack ./entry.js bundle.js
require("./style.css"); // webpack ./entry.js bundle.js --module-bind 'css=style!css'

document.write("It works. 22");

document.write(require("./content.js"));
