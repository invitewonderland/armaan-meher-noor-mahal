export {events,calendarFor,cleanBlessing,readBlessings,storageKey} from '../noor/story.mjs';
export const rooms=[
 {name:'The royal seal',line:'An invitation to an entire world.'},
 {name:'The story of us',line:'Eight moments. One beautiful forever.'},
 {name:'The celebrations',line:'Four rooms filled with our joy.'},
 {name:'The rang mahal',line:'The heartbeat is in your hands.'},
 {name:'The blessing',line:'Your love becomes part of the pattern.'},
 {name:'A letter from our hearts',line:'Our greatest gift is having you there.'},
 {name:'Beyond forever',line:'And this is only the beginning.'}
];
export const photos=[
 {file:'together',width:1199,height:1312,title:'And then,\nthere was you.',em:'you.',caption:'Where the world feels like home.',line:'Of all the places our hearts could have called home,\nthey chose each other.',script:'In this life. In every life.',kicker:'WHEN TWO WORLDS BECOME ONE',alt:'Armaan and Meher resting their heads together in the palace gardens'},
 {file:'palace',width:1199,height:1312,title:'A little closer\nto forever.',em:'forever.',caption:'Every tomorrow begins with you.',line:'A grand palace. A thousand beautiful moments.\nAnd still, the best part is you.',script:'Our favourite place is together.',kicker:'THE BEGINNING OF A BEAUTIFUL FOREVER',alt:'The complete full-length portrait of Armaan and Meher together in ivory and crimson wedding attire'},
 {file:'punjab',width:1199,height:1312,title:'From Punjab,\nwith love.',em:'with love.',caption:'The warmth of home. The colour of love.',line:'The warmth of our people. The colour of our joy.\nA love with its roots in home.',script:'From one soul to another.',kicker:'WHERE OUR HEARTS BELONG',alt:'Armaan and Meher seated together in a sunlit field of yellow mustard flowers'},
 {file:'meher',width:1199,height:1312,title:'Meher.\nAll the light.',em:'All the light.',caption:'A little grace. A world of warmth.',line:'The softness in the grandest celebration.\nThe light in a thousand tomorrows.',script:'The bride. The beautiful beginning.',kicker:'THE BRIDE',alt:'The complete portrait of Meher in her crimson bridal lehenga and traditional jewellery'},
 {file:'armaan',width:1199,height:1312,title:'Armaan.\nAll the heart.',em:'All the heart.',caption:'The heart she would choose, every time.',line:'A quiet kind of strength. An easy kind of joy.\nAnd a heart that has found its home.',script:'The groom. Her favourite forever.',kicker:'THE GROOM',alt:'The complete portrait of Armaan in his ivory sherwani, embroidered shawl and burgundy turban'},
 {file:'mehndi',width:1254,height:1254,title:'A little colour.\nA lot of love.',em:'A lot of love.',caption:'Colour on our hands. Joy in our hearts.',line:'Some moments are made of marigolds,\na little mischief, and all the people we love.',script:'Let the beautiful chaos begin.',kicker:'A CELEBRATION IN EVERY COLOUR',alt:'Armaan and Meher showing their mehndi surrounded by bright marigolds and pink flowers'},
 {file:'sangeet',width:1254,height:1254,title:'The kind of joy\nyou dance to.',em:'you dance to.',caption:'Different steps. The most beautiful rhythm.',line:'For the songs we know by heart.\nFor the nights we never want to end.',script:'A little dance into forever.',kicker:'OUR HAPPIEST KIND OF MUSIC',alt:'Armaan and Meher dancing together beneath glowing chandeliers'},
 {file:'anand',width:1254,height:1254,title:'A sacred beginning.\nA lifetime of love.',em:'A lifetime of love.',caption:'With grace. With blessings. With you.',line:'Surrounded by the love of our families,\na new chapter becomes our forever.',script:'With hearts full of gratitude.',kicker:'THE ANAND KARAJ',alt:'Armaan and Meher seated together during their Anand Karaj under a golden canopy'}
];
export const portraitURL=file=>`assets/beyond/portraits/${file}.webp`;
export const photoForFile=file=>photos.find(photo=>photo.file===file)||photos[0];
export function seedFromWords(text){let hash=2166136261;for(const char of String(text)){hash^=char.codePointAt(0);hash=Math.imul(hash,16777619);}return hash>>>0;}
export function randomFor(seed){let n=seed||1;return ()=>{n=(Math.imul(1664525,n)+1013904223)>>>0;return n/4294967296;};}
