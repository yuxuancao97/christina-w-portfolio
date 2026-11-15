/* ─────────────────────────────────────────────────────────────
   ALL PORTFOLIO CONTENT LIVES IN THIS FILE.

   Everything below is sample content: names, clients and copy
   are invented. Replace them with your own.

   Using your real artwork
   • Poster:          add  image: 'images/posters/my-poster.jpg'
   • Campaign format: add  image: 'images/campaigns/launch-kv.jpg'
                      and set `ratio` to the image's [width, height]
   • A+ page:         add  modules: ['images/aplus/x-1.jpg', 'images/aplus/x-2.jpg', …]
                      (one image per content module, top to bottom)

   Any item without an image shows a generated placeholder, drawn
   from `art: [style, palette]`.
     styles:   orb · arcs · dots · glyph · bands · blocks · rays · lines
     palettes: paper · cobalt · forest · rose · noir · lilac · tang ·
               sand · mint · oxblood · sky · butter
   ───────────────────────────────────────────────────────────── */
window.PORTFOLIO = {
  profile: {
    name: 'Christina W',
    role: 'Graphic designer',
    location: 'Lisbon, Portugal',
    availability: 'Booking January 2027',
    email: 'hello@example.com',
    socials: [
      { label: 'Instagram', url: '#' },
      { label: 'Behance', url: '#' },
      { label: 'LinkedIn', url: '#' },
      { label: 'Download CV', url: '#' }
    ],
    clients: ['Halle Contemporary', 'Noise Garden Festival', 'Sola Skin', 'Nordlys', 'Kettle & Fern', 'Riverside Run Club']
  },

  /* How many posters show before the "Show all" button. */
  postersInitial: 12,

  posters: [
    { title: 'Slow Sundays',    client: 'The Depot Jazz Club',   year: '2026', format: '50 × 70 cm, offset',      art: ['orb', 'cobalt'] },
    { title: 'Form & Void',     client: 'Halle Contemporary',    year: '2026', format: 'A1, screenprint',         art: ['blocks', 'paper'] },
    { title: 'Noise Garden',    client: 'Noise Garden Festival', year: '2025', format: '50 × 70 cm, offset',      art: ['bands', 'tang'] },
    { title: 'Type in Motion',  client: 'Kerning Conference',    year: '2025', format: 'A2, two-colour riso',     art: ['glyph', 'noir'] },
    { title: 'Late Bloom',      client: 'Sunday Flower Market',  year: '2025', format: 'A2, offset',              art: ['dots', 'rose'] },
    { title: 'Kino Nights',     client: 'Rooftop Cinema Club',   year: '2025', format: '70 × 100 cm, offset',     art: ['rays', 'oxblood'] },
    { title: 'Paper Moon',      client: 'Little Theatre Co.',    year: '2024', format: 'A1, offset',              art: ['arcs', 'butter'] },
    { title: 'Analog Days',     client: 'City Record Fair',      year: '2024', format: 'A2, screenprint',         art: ['lines', 'sand'] },
    { title: 'Salt & Stone',    client: 'Ceramics Biennial',     year: '2024', format: '50 × 70 cm, offset',      art: ['orb', 'mint'] },
    { title: 'Tide Tables',     client: 'Coastal Film Week',     year: '2024', format: 'A1, offset',              art: ['bands', 'sky'] },
    { title: 'Second Draft',    client: 'Writers’ Festival',     year: '2023', format: 'A2, offset',              art: ['glyph', 'lilac'] },
    { title: 'Hello Neighbour', client: 'Open Studios Weekend',  year: '2023', format: 'A3, riso',                art: ['blocks', 'forest'] },
    { title: 'Colour Theory',   client: 'School of Design',      year: '2023', format: 'A1, screenprint',         art: ['arcs', 'paper'] },
    { title: 'After Hours',     client: 'Club Vesper',           year: '2023', format: 'A2, fluorescent offset',  art: ['dots', 'noir'] },
    { title: 'Field Notes',     client: 'Studio Talk Series',    year: '2022', format: 'A2, offset',              art: ['lines', 'cobalt'] },
    { title: 'Zero Waste Week', client: 'City Council',          year: '2022', format: 'A1, recycled stock',      art: ['rays', 'mint'] }
  ],

  campaigns: [
    {
      title: 'Open Late',
      client: 'Halle Contemporary',
      year: '2026',
      summary: 'A summer of late openings at the museum. One sun-coloured mark carries the idea from the building banner down to a phone screen.',
      scope: ['Key visual', 'OOH', 'Social toolkit', 'Motion', 'Signage'],
      art: ['rays', 'cobalt'],
      formats: [
        { label: 'Key visual', ratio: [16, 9] },
        { label: 'Square post', ratio: [1, 1] },
        { label: 'Feed', ratio: [4, 5] },
        { label: 'Story', ratio: [9, 16] },
        { label: 'Billboard', ratio: [3, 1] }
      ]
    },
    {
      title: 'Fresh Daily',
      client: 'Greenhouse Market',
      year: '2025',
      summary: 'Seasonal produce campaign for a neighbourhood grocer. Modular shapes swap with the harvest, so the system refreshes itself every month.',
      scope: ['Key visual', 'In-store', 'Social toolkit', 'Packaging stickers'],
      art: ['blocks', 'forest'],
      formats: [
        { label: 'Key visual', ratio: [16, 9] },
        { label: 'Poster', ratio: [5, 7] },
        { label: 'Feed', ratio: [4, 5] },
        { label: 'Square post', ratio: [1, 1] },
        { label: 'Shelf strip', ratio: [4, 1] }
      ]
    },
    {
      title: 'Run the River',
      client: 'Riverside Run Club',
      year: '2025',
      summary: 'Identity and launch campaign for a 10K along the waterfront. The course line became the graphic, printed on everything from bibs to bus shelters.',
      scope: ['Key visual', 'OOH', 'Race kit', 'Social toolkit'],
      art: ['bands', 'tang'],
      formats: [
        { label: 'Key visual', ratio: [16, 9] },
        { label: 'Story', ratio: [9, 16] },
        { label: 'Square post', ratio: [1, 1] },
        { label: 'Feed', ratio: [4, 5] },
        { label: 'Billboard', ratio: [3, 1] }
      ]
    },
    {
      title: 'The Big Eleven',
      client: 'Marketplace seasonal sale',
      year: '2024',
      summary: 'Sale-event graphics for a homeware brand: storefront banners, deal badges and listing tiles built from one loud numeral so shoppers spot the offer anywhere.',
      scope: ['Storefront banners', 'Deal badges', 'Listing tiles', 'Email', 'Social ads'],
      art: ['glyph', 'butter'], glyph: '11',
      formats: [
        { label: 'Storefront hero', ratio: [3, 1] },
        { label: 'Listing tile', ratio: [1, 1] },
        { label: 'Social ad', ratio: [4, 5] },
        { label: 'Story ad', ratio: [9, 16] },
        { label: 'Email header', ratio: [2, 1] }
      ]
    }
  ],

  aplus: [
    {
      title: 'Glow C Serum',
      brand: 'Sola Skin',
      category: 'Beauty',
      marketplace: 'Amazon · Premium A+',
      year: '2026',
      summary: 'Launch page for a vitamin C serum. Warm tonal palette, one hero claim, and a comparison chart that routes shoppers across the range.',
      product: 'bottle', palette: 'apricot', style: 'arcs',
      copy: {
        headline: 'Glow that gets up early.',
        sub: '15% vitamin C serum with ferulic acid, for brighter skin in four weeks.',
        badge: 'New formula',
        features: [
          ['Brightens', 'Fades dullness and evens out skin tone.'],
          ['Protects', 'Antioxidants shield skin from daily stress.'],
          ['Absorbs fast', 'Light texture, no sticky finish under SPF.']
        ],
        story: { head: 'Made in small batches.', body: 'Vitamin C loses strength once it meets air. We bottle weekly in amber glass so every drop arrives as potent as the day it was made.' },
        statement: 'Good skin is a morning habit.',
        compare: {
          title: 'Find your serum',
          cols: ['Glow C', 'Calm B5', 'Night A'],
          rows: [['Brightening', 1, 0, 1], ['Sensitive skin', 1, 1, 0], ['Daily use', 1, 1, 0], ['Fragrance free', 1, 1, 1]]
        },
        steps: [['Cleanse', 'Start with a clean, dry face.'], ['Apply', 'Press three drops into skin.'], ['Protect', 'Follow with moisturiser and SPF.']]
      }
    },
    {
      title: 'Ceremonial Matcha',
      brand: 'Kettle & Fern',
      category: 'Grocery',
      marketplace: 'Amazon · A+ Content',
      year: '2025',
      summary: 'Product story for a stone-ground matcha. The page slows down on purpose: origin first, preparation second, range last.',
      product: 'jar', palette: 'matcha', style: 'orb',
      copy: {
        headline: 'A calmer kind of energy.',
        sub: 'First-harvest ceremonial matcha, stone-ground in small lots in Uji.',
        badge: 'First harvest',
        features: [
          ['Shade grown', 'Three weeks under cover for a sweeter leaf.'],
          ['Stone ground', 'Milled slowly to keep colour and aroma.'],
          ['Nothing added', 'One ingredient. No sugar, no fillers.']
        ],
        story: { head: 'From one family farm.', body: 'We buy the whole spring harvest from a single grower, which means we can tell you the field, the week and the hands that picked your tin.' },
        statement: 'Whisk. Breathe. Begin.',
        compare: {
          title: 'Choose your grade',
          cols: ['Ceremonial', 'Daily', 'Culinary'],
          rows: [['Drink straight', 1, 1, 0], ['Lattes', 1, 1, 1], ['Baking', 0, 0, 1], ['First harvest', 1, 0, 0]]
        },
        stepsTitle: 'How to prepare',
        steps: [['Sift', 'One teaspoon through a fine sieve.'], ['Whisk', 'Add 70 ml hot water and whisk in a W.'], ['Enjoy', 'Drink straight or top with milk.']]
      }
    },
    {
      title: 'Trail Flask 750',
      brand: 'Nordlys',
      category: 'Outdoors',
      marketplace: 'Amazon · Premium A+',
      year: '2025',
      summary: 'Feature-led page for an insulated bottle. Cool palette, specification modules and a range chart built for quick mobile scanning.',
      product: 'can', palette: 'glacier', style: 'lines',
      copy: {
        headline: 'Cold for 24. Hot for 12.',
        sub: 'Double-wall steel flask built for long days out and the commute back.',
        badge: '750 ml',
        features: [
          ['Leakproof', 'A quarter-turn lid that stays shut in a bag.'],
          ['Fits holders', 'Slim base sits in car and bike cages.'],
          ['Built to last', 'Powder coat that shrugs off scuffs.']
        ],
        story: { head: 'Tested north of the circle.', body: 'Every flask is filled, frozen and dropped before it ships. If it survives a winter in Tromsø, it will survive your desk.' },
        statement: 'Take the long way home.',
        compare: {
          title: 'Pick your size',
          cols: ['Trail 750', 'City 500', 'Summit 1L'],
          rows: [['Cup holder fit', 1, 1, 0], ['24 h cold', 1, 0, 1], ['Carry loop', 1, 0, 1], ['Dishwasher safe', 1, 1, 1]]
        },
        stepsTitle: 'Care',
        steps: [['Rinse', 'Warm water before first use.'], ['Fill', 'Leave a finger of space below the rim.'], ['Seal', 'Quarter turn until it clicks.']]
      }
    },
    {
      title: 'House Blend',
      brand: 'Dawn Patrol Coffee',
      category: 'Grocery',
      marketplace: 'Amazon · A+ Content',
      year: '2024',
      summary: 'Subscription-focused page for a specialty roaster. Earthy tones, a tasting-note system and brew steps that double as social cut-downs.',
      product: 'pouch', palette: 'roast', style: 'dots',
      copy: {
        headline: 'Roasted Monday. Yours by Friday.',
        sub: 'A sweet, round house blend with notes of cocoa, hazelnut and orange peel.',
        badge: 'Whole bean',
        features: [
          ['Roast to order', 'Nothing sits on a shelf for months.'],
          ['Traceable', 'Two farms, named on every bag.'],
          ['Any brewer', 'Forgiving in espresso, filter or press.']
        ],
        story: { head: 'Paid fairly, roasted lightly.', body: 'We pay growers well above market price and roast just far enough to let their work speak. The result is a cup that tastes like where it came from.' },
        statement: 'First light, first cup.',
        compare: {
          title: 'Explore the roasts',
          cols: ['House', 'Bright', 'Dark'],
          rows: [['Espresso', 1, 0, 1], ['Filter', 1, 1, 0], ['With milk', 1, 0, 1], ['Fruity notes', 0, 1, 0]]
        },
        stepsTitle: 'Brew guide',
        steps: [['Grind', 'Medium-fine, right before brewing.'], ['Bloom', 'Wet the grounds and wait 30 seconds.'], ['Pour', 'Slow circles until you reach 250 ml.']]
      }
    }
  ]
};
