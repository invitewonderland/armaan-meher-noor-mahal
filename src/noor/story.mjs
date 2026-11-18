export const chapters = ['The first light','The portrait salon','From Punjab, with love','The celebrations','The heartbeat','The phulkari of wishes','An invitation from the heart','Our forever'];
export const portraits = [
 {file:'together',title:'The world feels like home.',alt:'Armaan and Meher resting their heads together in the palace gardens'},
 {file:'palace',title:'A little closer to forever.',alt:'Armaan and Meher embracing in their wedding clothes in a palace courtyard'},
 {file:'meher',title:'Meher. A little grace. All the light.',alt:'Meher smiling in her crimson bridal lehenga and traditional jewellery'},
 {file:'armaan',title:'Armaan. The calm in her beautiful chaos.',alt:'Armaan smiling in his ivory sherwani and burgundy turban'},
 {file:'punjab',title:'Where the heart has always belonged.',alt:'The couple together in a sunlit mustard field'},
 {file:'mehndi',title:'Colour on our hands. You in our heart.',alt:'The couple showing their mehndi surrounded by bright flowers'},
 {file:'sangeet',title:'The kind of joy you dance to.',alt:'Armaan and Meher dancing together under chandeliers'},
 {file:'anand',title:'A sacred beginning. A lifetime together.',alt:'Armaan and Meher seated together during their Anand Karaj'}
];
// Creative concept details selected with the user's permission. Noor Mahal is an imagined venue.
export const events = [
 {name:'Mehndi',image:'mehndi',kicker:'COLOUR ON OUR HANDS. JOY IN OUR HEARTS.',line:'A little colour, a little mischief.\nAnd a whole lot of love.',date:'Friday, 18 December 2026',time:'3:00 PM',short:'18 DECEMBER · 3:00 PM',venue:'The Marigold Court',dress:'Sunshine hues & playful Punjabi elegance',start:'2026-12-18T15:00:00+05:30',hours:3},
 {name:'Sangeet',image:'sangeet',kicker:'A THOUSAND BEATS. TWO VERY HAPPY HEARTS.',line:'For the songs we know by heart.\nAnd the night we will never forget.',date:'Saturday, 19 December 2026',time:'7:00 PM',short:'19 DECEMBER · 7:00 PM',venue:'The Sheesh Mahal',dress:'Jewel tones & your most joyful dancing shoes',start:'2026-12-19T19:00:00+05:30',hours:4},
 {name:'Anand Karaj',image:'anand',kicker:'WITH GRACE. WITH BLESSINGS. WITH YOU.',line:'Two hearts, surrounded by love.\nA beautiful beginning to our forever.',date:'Sunday, 20 December 2026',time:'10:00 AM',short:'20 DECEMBER · 10:00 AM',venue:'The Darbar Sahib',dress:'Traditional attire, with a head covering for the ceremony',start:'2026-12-20T10:00:00+05:30',hours:2},
 {name:'Reception',image:'palace',kicker:'THE FIRST EVENING OF A THOUSAND TOMORROWS.',line:'A night of sparkling conversations.\nA lifetime of beautiful memories.',date:'Sunday, 20 December 2026',time:'7:30 PM',short:'20 DECEMBER · 7:30 PM',venue:'The Palace Gardens',dress:'Regal eveningwear & a little sparkle',start:'2026-12-20T19:30:00+05:30',hours:4}
];
export function escapeICS(value){return String(value).replace(/\\/g,'\\\\').replace(/\r?\n/g,'\\n').replace(/;/g,'\\;').replace(/,/g,'\\,');}
export function calendarFor(event,now=new Date()){
 const stamp=value=>new Date(value).toISOString().replace(/[-:]/g,'').replace(/\.\d{3}Z$/,'Z');
 const lines=['BEGIN:VCALENDAR','VERSION:2.0','PRODID:-//Invite Wonderland//Noor Mahal//EN','CALSCALE:GREGORIAN','METHOD:PUBLISH','BEGIN:VEVENT',`UID:armaan-meher-${event.image}-${stamp(event.start)}@invitewonderland`, `DTSTAMP:${stamp(now)}`,`DTSTART:${stamp(event.start)}`,`DTEND:${stamp(new Date(Date.parse(event.start)+event.hours*3600000))}`,`SUMMARY:${escapeICS(`Armaan & Meher — ${event.name}`)}`,`LOCATION:${escapeICS(`${event.venue}, Noor Mahal, Patiala`)}`,`DESCRIPTION:${escapeICS(`With love, the Singh & Kaur families.\n${event.line}\n${event.dress}`)}`,'END:VEVENT','END:VCALENDAR'];
 // RFC 5545 folding is measured in UTF-8 bytes, including the continuation space.
 const encoder=new TextEncoder();
 return lines.map(line=>{let result='',part='',bytes=0;for(const char of line){const n=encoder.encode(char).length;if(bytes+n>75){result+=part+'\r\n';part=' ';bytes=1;}part+=char;bytes+=n;}return result+part;}).join('\r\n')+'\r\n';
}
export function cleanBlessing(name,text){return {name:String(name||'').trim().slice(0,40),text:String(text||'').trim().slice(0,180)};}
export const storageKey='invitewonderland-noor-blessings-v1';
export function readBlessings(storage){try{const value=JSON.parse(storage.getItem(storageKey)||'[]');return Array.isArray(value)?value.filter(x=>x&&typeof x.text==='string').map(x=>cleanBlessing(x.name,x.text)).filter(x=>x.text).slice(-8):[];}catch{return [];}}
