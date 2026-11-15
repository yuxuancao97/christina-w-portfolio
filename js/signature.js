/* ─────────────────────────────────────────────────────────────
   The signature on the cover.

   The name is set in the handwriting font, then uncovered by a pen
   that travels along the middle of every stroke, in the order and
   direction a hand would write them. Each entry below is one stroke:
     pts   points along the centre of the stroke, start to finish
           (units of the 1100 x 340 drawing; the text sits at x 30, baseline y 250)
     lift  pause before this stroke, in ms (the pen leaving the paper)
   The points were traced from the letter shapes of "Christina W" in
   Reenie Beanie at 240 units. They only fit that text in that font:
   to sign a different name, trace it again.

   Pacing lives in `pace`:
     perUnit  ms per unit of stroke length (higher = slower pen)
     base     ms added to every stroke (the pen starting and stopping)
     lift     multiplies every pause between strokes (1 = as written below)
     width    thickness of the pen that uncovers the letters
   ───────────────────────────────────────────────────────────── */
window.SIGNATURE = {
  text: 'Christina W',
  font: 'Reenie Beanie',
  size: 240,
  origin: [30, 250],
  viewBox: [22, 78, 990, 178],
  pace: { perUnit: 0.5, base: 28, lift: 0.6, width: 28 },
  strokes: [
    /* C */ { lift: 0,   pts: '84,140 69,162 52,203 47,221 47,230 49,236 53,240 64,244 77,243 90,240 102,234 115,224 129,211 137,200 139,193' },
    /* h */ { lift: 70,  pts: '172,90 173,124 183,199 186,213 191,217 192,224' },
            { lift: 25,  pts: '191,217 197,213 204,196 210,188 212,180 214,190 216,196 218,205 224,214 234,212 238,208' },
    /* r */ { lift: 60,  pts: '270,176 271,182 270,188 270,195 271,212 275,226' },
            { lift: 25,  pts: '272,182 292,177 309,177' },
    /* i */ { lift: 60,  pts: '335,188 349,227' },
    /* s */ { lift: 60,  pts: '416,172 408,170 394,171 389,173 384,181 387,194 394,200 414,211 417,217 416,222 411,226 400,229 388,231 378,230' },
    /* t */ { lift: 60,  pts: '458,115 467,159 477,199 481,224' },
    /* i */ { lift: 60,  pts: '524,187 538,227' },
    /* n */ { lift: 60,  pts: '566,169 565,176 565,212 566,218 569,221 567,227' },
            { lift: 25,  pts: '569,221 575,218 583,193 588,186 590,175 591,187 593,194 597,208 607,219 617,223 626,221' },
    /* a */ { lift: 60,  pts: '678,190 675,178 671,174 665,178 658,190 653,206 653,217 656,226 659,227 664,225 671,214 678,209 681,212 685,220 693,227 699,230 710,231 723,229 735,223 747,212 753,202' },
    /* back to cross the t and dot both i's, as people do once the word is down */
    /* t bar */ { lift: 150, pts: '415,188 453,166 467,160 483,153 505,141' },
    /* i dot */ { lift: 90,  pts: '331,141 340,139' },
    /* i dot */ { lift: 80,  pts: '520,141 529,139' },
    /* W */ { lift: 190, pts: '853,155 861,185 870,206 877,219 881,223 886,225 890,223 892,220 894,208 896,196 894,189 898,204 904,207 923,225 940,235 947,237 959,237 963,235 967,229 968,222 967,208 959,179 936,119 925,100' }
  ]
};
