var styles = require('./main.css');


module.exports = function () {
    var element = document.createElement('h1');


    element.innerHTML = 'Hello world 2222';

    // Attach the generated class name
    // element.className = styles.redButton;

    element.className = 'pure-button';

    return element;
};