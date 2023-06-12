import back from '../pictures/back.png';
import _2c from '../pictures/2_of_clubs.png';
import _2d from '../pictures/2_of_diamonds.png';
import _2h from '../pictures/2_of_hearts.png';
import _2s from '../pictures/2_of_spades.png';
import _3c from '../pictures/3_of_clubs.png';
import _3d from '../pictures/3_of_diamonds.png';
import _3h from '../pictures/3_of_hearts.png';
import _3s from '../pictures/3_of_spades.png';
import _4c from '../pictures/4_of_clubs.png';
import _4d from '../pictures/4_of_diamonds.png';
import _4h from '../pictures/4_of_hearts.png';
import _4s from '../pictures/4_of_spades.png';
import _5c from '../pictures/5_of_clubs.png';
import _5d from '../pictures/5_of_diamonds.png';
import _5h from '../pictures/5_of_hearts.png';
import _5s from '../pictures/5_of_spades.png';
import _6c from '../pictures/6_of_clubs.png';
import _6d from '../pictures/6_of_diamonds.png';
import _6h from '../pictures/6_of_hearts.png';
import _6s from '../pictures/6_of_spades.png';
import _7c from '../pictures/7_of_clubs.png';
import _7d from '../pictures/7_of_diamonds.png';
import _7h from '../pictures/7_of_hearts.png';
import _7s from '../pictures/7_of_spades.png';
import _8c from '../pictures/8_of_clubs.png';
import _8d from '../pictures/8_of_diamonds.png';
import _8h from '../pictures/8_of_hearts.png';
import _8s from '../pictures/8_of_spades.png';
import _9c from '../pictures/9_of_clubs.png';
import _9d from '../pictures/9_of_diamonds.png';
import _9h from '../pictures/9_of_hearts.png';
import _9s from '../pictures/9_of_spades.png';
import _10c from '../pictures/10_of_clubs.png';
import _10d from '../pictures/10_of_diamonds.png';
import _10h from '../pictures/10_of_hearts.png';
import _10s from '../pictures/10_of_spades.png';
import jc from '../pictures/jack_of_clubs.png';
import jd from '../pictures/jack_of_diamonds.png';
import jh from '../pictures/jack_of_hearts.png';
import js from '../pictures/jack_of_spades.png';
import kc from '../pictures/king_of_clubs.png';
import kd from '../pictures/king_of_diamonds.png';
import kh from '../pictures/king_of_hearts.png';
import ks from '../pictures/king_of_spades.png';
import qc from '../pictures/queen_of_clubs.png';
import qd from '../pictures/queen_of_diamonds.png';
import qh from '../pictures/queen_of_hearts.png';
import qs from '../pictures/queen_of_spades.png';
import ac from '../pictures/ace_of_clubs.png';
import ad from '../pictures/ace_of_diamonds.png';
import ah from '../pictures/ace_of_hearts.png';
import as from '../pictures/ace_of_spades.png';

const cardImages = {
    back,
    '2c': _2c,
    '2d': _2d,
    '2h': _2h,
    '2s': _2s,
    '3c': _3c,
    '3d': _3d,
    '3h': _3h,
    '3s': _3s,
    '4c': _4c,
    '4d': _4d,
    '4h': _4h,
    '4s': _4s,
    '5c': _5c,
    '5d': _5d,
    '5h': _5h,
    '5s': _5s,
    '6c': _6c,
    '6d': _6d,
    '6h': _6h,
    '6s': _6s,
    '7c': _7c,
    '7d': _7d,
    '7h': _7h,
    '7s': _7s,
    '8c': _8c,
    '8d': _8d,
    '8h': _8h,
    '8s': _8s,
    '9c': _9c,
    '9d': _9d,
    '9h': _9h,
    '9s': _9s,
    'tc': _10c,
    'td': _10d,
    'th': _10h,
    'ts': _10s,
    jc,
    jd,
    jh,
    js,
    kc,
    kd,
    kh,
    ks,
    qc,
    qd,
    qh,
    qs,
    ac,
    ad,
    ah,
    as,
  };  

export const getCardImage = (cardName) => {
    return cardImages[cardName] || null;
};