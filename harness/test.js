/* jsdom harness for Clan Hub — run: NODE_PATH=~/workspace/axzio-arrival/node_modules node harness/test.js */
const fs = require('fs'); const path = require('path');
const { JSDOM } = require('jsdom');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');
const data = fs.readFileSync(path.join(root, 'data.js'), 'utf8');
const app = fs.readFileSync(path.join(root, 'app.js'), 'utf8');
const dom = new JSDOM(html, { url: 'https://ne3ula.github.io/clan-hub/', runScripts: 'outside-only', pretendToBeVisual: true });
const { window } = dom;
let pass = 0, fail = 0;
function check(name, cond) { if (cond) { pass++; console.log('PASS', name); } else { fail++; console.log('FAIL', name); } }
// jsdom lacks clipboard / share — stub
window.navigator.clipboard = { writeText: async (t) => { window.__copied = t; } };
window.eval(data); window.eval(app);
const d = window.document;
check('event title renders PoE Covens', d.querySelector('#eventTitle').textContent.includes('Covens') === false && d.querySelector('#eventKicker').textContent.includes('Covens of Umbra'));
check('countdown populated', d.querySelector('#cdD').textContent !== '—');
check('spotify embed is correct playlist', d.querySelector('#spotifyEmbed').src.includes('33U09gTplZ4R0NqG1Rgp2T'));
check('soundcloud embed is correct set', d.querySelector('#scEmbed').src.includes('lord-of-kaos-leauge-mix-26'));
check('schedule has 4 items', d.querySelectorAll('.schedule-item').length === 4);
check('checklist has 7 items', d.querySelectorAll('[data-check]').length === 7);
check('twitch embed uses ne3ula_db + parent', d.querySelector('#twitchEmbed').src.includes('channel=ne3ula_db') && d.querySelector('#twitchEmbed').src.includes('parent=ne3ula.github.io'));
// LFG flow
d.querySelector('#lfgName').value = 'TestExile'; d.querySelector('#lfgBuild').value = 'Chaos Witch';
d.querySelector('#lfgForm').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
check('LFG post adds card', d.querySelectorAll('.lfg-card').length === 1);
check('LFG persists to localStorage', (window.localStorage.getItem('clan-hub-v1-lfg') || '').includes('TestExile'));
// Ready flow
d.querySelector('#readyName').value = 'Jesse';
d.querySelector('#readyForm').dispatchEvent(new window.Event('submit', { bubbles: true, cancelable: true }));
check('ready check adds member', d.querySelectorAll('.ready-card').length === 1);
// Event switch to PoE2
const sel = d.querySelector('#eventSelect'); sel.value = 'poe2-conquerors-2026'; sel.dispatchEvent(new window.Event('change', { bubbles: true }));
check('event switch renders PoE2', d.querySelector('#eventKicker').textContent.includes('Path of Exile 2'));
check('PoE2 shows no-mix note', d.querySelector('#noMixNote').hidden === false);
console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail ? 1 : 0);
