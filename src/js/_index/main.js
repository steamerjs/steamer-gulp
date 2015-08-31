// import boostrap from 'bootstrap';
import React from "react";
import Hello from './man';

main();

function main() {
    React.render(<Hello />, document.getElementById('app'));
}

var _index = require('html!../../tpl/_index.html');

// document.body.innerHTML = '!!!';