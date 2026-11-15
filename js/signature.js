/* ─────────────────────────────────────────────────────────────
   The signature on the cover.

   It is drawn as ink on a canvas: a pen travels along each stroke
   below, in the order and direction a hand would write them, and
   leaves a line behind it. Only the newest bit of line is drawn on
   each frame, so it stays smooth on any machine.

   Each entry is one stroke:
     pts   points along the stroke, start to finish
           (units of an 1100 x 340 drawing)
     join  true when the pen carries on from the last stroke without leaving the paper
     lift  a set pause before the stroke, in ms; left out, the pause is worked out from
           how far the hand has to travel to get there
     dab   true for a dot: the pen just touches down
   The points were traced from "Christina W" written in Reenie Beanie.
   To sign a different name, trace it again.

   Tempo follows how hands write. The pen slows in tight curves and runs faster where the
   line is straighter, every stroke starts from rest and settles at its end, and the hand
   pauses longer the further it has to move between strokes. `pace` tunes that:
     speed        pen speed on a gentle curve, in units per ms (lower = slower signature)
     slowest      how far the pen may slow in the tightest turn (share of `speed`)
     fastest      how far it may speed up on straight runs
     liftBase     ms for the pen to leave and meet the paper
     liftPerUnit  ms added per unit of distance the hand travels in the air
     dab          ms a dot takes
   `pen` sets the line:
     width        thickness, in drawing units
     taper        how much thinner the line is where the pen lands and leaves (0 = none)
   ───────────────────────────────────────────────────────────── */
window.SIGNATURE = {
  text: 'Christina W',
  viewBox: [22, 78, 990, 178],
  pace: { speed: 1.1, slowest: 0.42, fastest: 1.28, liftBase: 42, liftPerUnit: 0.3, dab: 85 },
  pen: { width: 12, taper: 0.42 },
  strokes: [
    /* C */ { pts: '84,140 69,162 52,203 47,221 47,230 49,236 53,240 64,244 77,243 90,240 102,234 115,224 129,211 137,200 139,193' },
    /* h */ { pts: '172,90 173,124 183,199 186,213 191,217 192,224' },
            { join: true, pts: '191,217 197,213 204,196 210,188 212,180 214,190 216,196 218,205 224,214 234,212 238,208' },
    /* r */ { pts: '270,176 271,182 270,188 270,195 271,212 275,226' },
            { pts: '272,182 292,177 309,177' },
    /* i */ { pts: '335,188 349,227' },
    /* s */ { pts: '416,172 408,170 394,171 389,173 384,181 387,194 394,200 414,211 417,217 416,222 411,226 400,229 388,231 378,230' },
    /* t */ { pts: '458,115 467,159 477,199 481,224' },
    /* i */ { pts: '524,187 538,227' },
    /* n */ { pts: '566,169 565,176 565,212 566,218 569,221 567,227' },
            { join: true, pts: '569,221 575,218 583,193 588,186 590,175 591,187 593,194 597,208 607,219 617,223 626,221' },
    /* a */ { pts: '678,190 675,178 671,174 665,178 658,190 653,206 653,217 656,226 659,227 664,225 671,214 678,209 681,212 685,220 693,227 699,230 710,231 723,229 735,223 747,212 753,202' },
    /* the hand comes back to cross the t once the word is down */
    /* t bar */ { pts: '415,188 453,166 467,160 483,153 505,141' },
    /* W */ { pts: '853,155 861,185 870,206 877,219 881,223 886,225 890,223 892,220 894,208 896,196 894,189 898,204 904,207 923,225 940,235 947,237 959,237 963,235 967,229 968,222 967,208 959,179 936,119 925,100' },
    /* last of all, the two dots on a beat: one, two */
    /* i dot */ { dab: true, lift: 300, pts: '331,141 340,139' },
    /* i dot */ { dab: true, lift: 230, pts: '520,141 529,139' }
  ]
};
