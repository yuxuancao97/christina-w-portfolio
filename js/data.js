/* ─────────────────────────────────────────────────────────────
   ALL PORTFOLIO CONTENT LIVES IN THIS FILE.

   The work is a selection from the 2025 portfolio (52 pages), one
   chapter per project, and inside each chapter one group per kind
   of work. Images are in images/work/.

   Her legal name, phone number, birth date and personal email are
   left out on purpose. The email below is a placeholder.

   Editing
   • A piece in a group:
       { label: 'Booth backdrop', ratio: [3, 1], image: 'images/work/….webp', note: '…' }
     `ratio` is the size the tile is shown at, [width, height].
     `note` shows beside the piece in the viewer.
     `tall: true` for a long poster: the tile shows its top, the viewer scrolls it.
     `reel: false` keeps a piece out of the moving strip near the top.
   • A group: the first wide piece leads at full width and the rest are
     packed into rows. `cols: 2` (or 3) lays the pieces out in even rows
     of that many instead. `text` is the line beside the group's title.
   • A chapter: `accent` is its colour, `cover` the image shown for it in
     the index, `facts` three [label, value] rows on its opening panel.

   A piece without an `image` is drawn as a placeholder from
   `art: [style, palette]` (see js/art.js).
   ───────────────────────────────────────────────────────────── */

const W = 'images/work/';
const WIDE = [16, 9];

window.PORTFOLIO = {
  profile: {
    name: 'Christina W',
    role: 'Visual communication designer',
    span: '2020 - 2025 Portfolio',
    email: 'hello@example.com',
    socials: [],
    /* The signature on the cover lives in js/signature.js. */
    hello: 'Hello, I design brand identities, digital campaigns, characters & packaging.',
    bio: 'I am a visual communication design graduate with a foundation in fine art and four and a half years of in-house experience. I build cohesive visual systems that carry each brand’s character, from the logo to the last exhibition panel.',
    facts: [
      ['Experience', '4.5 years, in-house'],
      ['Sectors', 'Automotive electronics, fitness, cross-border e-commerce'],
      ['Off duty', 'Reading, photography, singing']
    ],
    /* Resume rows: [left, right]. */
    experience: [
      ['2023.04 - 2025.01', 'Kunyi Electronic Technology (Shanghai), Graphic Designer'],
      ['2022.01 - 2023.04', 'Shuhua Sports, Graphic Designer'],
      ['2020.04 - 2021.12', 'Sainuoweier Technology, Graphic Designer']
    ],
    education: [
      ['2014.09 - 2018.06', 'Jincheng College, BA Visual Communication Design'],
      ['2014 - 2018', 'Scholarship in each of the four years']
    ],
    skills: [
      ['Ps', 'Photoshop'],
      ['Ai', 'Illustrator'],
      ['C4D', 'Cinema 4D, character modelling'],
      ['Design', 'Visual identity, layout, typeface, packaging'],
      ['Also', 'Illustration, advertising, photography']
    ],
    certificates: [
      ['CET-6', 'College English Test, Band 6'],
      ['CET-4', 'College English Test, Band 4']
    ]
  },

  /* Feature band near the top: a headline, a line of text, a few facts and a moving
     strip of pieces. `from` is the id of the chapter whose work fills the strip. */
  feature: {
    lead: 'Take your brand',
    accent: 'across the seas',
    text: 'Brand websites, product detail pages and sale campaigns for brands selling to customers overseas.',
    facts: [
      ['Channels', 'Brand website, marketplace listings, social'],
      ['Work', 'Key visuals, category pages, feature graphics, promotions']
    ],
    from: 'vivosun'
  },

  work: [
    /* ───────── 01 ───────── */
    {
      id: 'kunyi',
      title: 'KUNYI', mark: 'Kunyi',
      kind: 'Brand identity',
      accent: '#ff5a1f',
      cover: W + 'kunyi-identity.webp',
      years: '2023.04 - 2025.01',
      summary: 'Rooted in electronics, driven by R&D, moving toward the future. A new mark for Kunyi Electronic Technology, carried through product literature, corporate-culture walls and the materials for exhibitions and user conferences at home and abroad.',
      facts: [
        ['Sector', 'Automotive electronics'],
        ['Date', '2023.04 - 2025.01'],
        ['Role', 'Graphic designer, leading brand visual design']
      ],
      groups: [
        {
          title: 'Identity',
          text: 'Electronic-component forms and technology-inspired blocks, with the initials K and Y built into the mark.',
          items: [
            { label: 'Identity concept', ratio: WIDE, image: W + 'kunyi-identity.webp', note: 'The logo combines electronic-component forms with technology-inspired blocks to create a memorable symbol that reflects the industry. The initials K and Y are integrated into the mark to make it distinctive to KUNYI.' },
            { label: 'Logo construction', ratio: WIDE, image: W + 'kunyi-construction.webp', note: 'Geometric construction and proportional guidelines for the identity.' },
            { label: 'AD Station Pro key visual', ratio: WIDE, image: W + 'kunyi-adstation.webp', note: 'Key visual for the autonomous-driving data-processing workstation.' }
          ]
        },
        {
          title: 'Product literature',
          text: 'Brochures and technical display panels for the autonomous-driving test range.',
          items: [
            { label: 'AD Station 3000 Pro brochure', ratio: [1800, 921], image: W + 'kunyi-brochure.webp', note: 'Product literature for the AD Station 3000 Pro data-collection workstation.' },
            { label: 'Cubestack display panel', ratio: [3, 4], tall: true, image: W + 'kunyi-poster-1.webp', note: 'Technical product display for the Cubestack cluster-testing system.' },
            { label: 'ADS 4000 display panel', ratio: [3, 4], tall: true, image: W + 'kunyi-poster-2.webp', note: 'Technical product display for advanced autonomous-driving validation.' },
            { label: 'Data-collection vehicle panel', ratio: [3, 4], tall: true, image: W + 'kunyi-poster-3.webp', note: 'Exhibition graphic for the intelligent-driving data-collection vehicle solution.' }
          ]
        },
        {
          title: 'Culture wall & events',
          text: 'Company history and culture graphics, and the brand across the 2024 user conference.',
          items: [
            { label: 'Corporate communications', ratio: WIDE, image: W + 'kunyi-corporate.webp', note: 'Company history, company profile and corporate-culture graphics.' },
            { label: 'Events & printed collateral', ratio: WIDE, image: W + 'kunyi-events.webp', note: 'Brand applications across conferences, exhibitions and printed materials.' }
          ]
        }
      ]
    },

    /* ───────── 02 ───────── */
    {
      id: 'shuhua',
      title: 'Shuhua Fitness', mark: 'Shuhua Fitness',
      kind: 'Brand identity & campaigns',
      accent: '#3fe6c0',
      cover: W + 'shuhua-brand.webp',
      years: '2022.01 - 2023.04',
      summary: 'The commercial visual system for the Shuhua Fitness sub-brand and its directly operated clubs: identity, supporting graphics, wayfinding, WeChat marketing and seasonal campaigns, taken from proofing through to delivery.',
      facts: [
        ['Sector', 'Fitness'],
        ['Date', '2022.01 - 2023.04'],
        ['Role', 'Graphic designer, working independently']
      ],
      groups: [
        {
          title: 'Visual identity',
          text: 'An exercise heart-rate curve meets an extended form of the logo; rounded contours become running-track lines.',
          items: [
            { label: 'Brand applications', ratio: WIDE, image: W + 'shuhua-brand.webp', note: 'Visual marketing and branded fitness environments.' },
            { label: 'Supporting graphics', ratio: WIDE, image: W + 'shuhua-graphics.webp', note: 'The supporting graphic combines an exercise heart-rate curve with an extended form of the logo. Rounded contours develop into running-track lines, linking the visual system to movement and fitness.' },
            { label: 'Environmental wayfinding', ratio: WIDE, image: W + 'shuhua-wayfinding.webp', note: 'Signage for the strength, cardio, personal training and Pilates areas, the training camp, fitness assessment, members’ room and changing rooms.' }
          ]
        },
        {
          title: 'Print & digital touchpoints',
          text: 'Class schedules, promotional cards and the identity on screen.',
          items: [
            { label: 'Touchpoints', ratio: [4, 3], image: W + 'shuhua-touchpoints.webp', note: 'Class schedules, promotional cards and mobile presentation of the identity.' },
            { label: 'Class schedule & cards', ratio: [4, 3], image: W + 'shuhua-schedule.webp', note: 'Group class schedule, business cards and WeChat contact cards.' }
          ]
        },
        {
          title: 'Opening campaign',
          text: 'Grand opening and calorie-challenge materials for a new club.',
          items: [
            { label: 'Grand-opening poster', ratio: [1061, 1501], image: W + 'shuhua-opening-poster.webp', note: 'Grand-opening and calorie-challenge campaign poster.' },
            { label: 'Calorie-challenge campaign kit', ratio: [1100, 1214], image: W + 'shuhua-opening-kit.webp', note: 'Key visual and long-form WeChat pages for the calorie challenge.' }
          ]
        },
        {
          title: 'Spring Festival 2023',
          text: 'Seasonal fitness posters. Original lettering and layouts.',
          items: [
            { label: 'Spring Festival poster 01', ratio: [845, 1501], image: W + 'shuhua-spring-1.webp' },
            { label: 'Spring Festival poster 02', ratio: [845, 1501], image: W + 'shuhua-spring-2.webp' },
            { label: 'Spring Festival poster 03', ratio: [845, 1501], image: W + 'shuhua-spring-3.webp' }
          ]
        }
      ]
    },

    /* ───────── 03 ───────── */
    {
      id: 'vivosun',
      title: 'VIVOSUN', mark: 'Vivosun',
      kind: 'Digital & campaigns',
      accent: '#3ddc55',
      cover: W + 'vivosun-smart-grow.webp',
      summary: 'A digital storefront for an indoor-growing brand: category pages, product presentation, feature graphics that explain the product at a glance, and the campaign visuals that bring shoppers in.',
      facts: [
        ['Sector', 'Cross-border e-commerce'],
        ['Channels', 'Brand website, product pages, social'],
        ['Work', 'Key visuals, page design, feature graphics']
      ],
      groups: [
        {
          title: 'Campaigns & social',
          text: 'Hero visuals for the connected growing range, Black Friday, Prime Day and a follower giveaway.',
          items: [
            { label: 'Smart Grow System', ratio: WIDE, image: W + 'vivosun-smart-grow.webp', note: 'Hero visual for the connected growing product range.' },
            { label: 'Black Friday campaign', ratio: WIDE, image: W + 'vivosun-black-friday.webp', note: 'Promotional hero visual.' },
            { label: '50K followers giveaway', ratio: [1, 1], image: W + 'vivosun-social-1.webp', note: 'Follower-giveaway visual for social.' },
            { label: 'Lifestyle campaign', ratio: [1732, 1076], image: W + 'vivosun-lifestyle-2.webp', note: 'Indoor-growing product visual.' },
            { label: 'Prime Day deals', ratio: [1, 1], image: W + 'vivosun-social-2.webp', note: 'Prime Day campaign visual.' }
          ]
        },
        {
          title: 'Brand website',
          text: 'Storefront and product-category pages: grow tents, grow lights, gardening, ventilation and aquarium.',
          items: [
            { label: 'Storefront & category pages', ratio: WIDE, image: W + 'vivosun-web-1.webp', note: 'Storefront and product-category page design.' },
            { label: 'Category pages', ratio: WIDE, image: W + 'vivosun-web-2.webp', reel: false, note: 'Grow tents, grow lights, gardening and aquarium categories.' },
            { label: 'Website & product pages', ratio: WIDE, image: W + 'vivosun-web-3.webp', reel: false, note: 'Digital storefront, lifestyle content and product presentation.' }
          ]
        },
        {
          title: 'Product detail pages',
          text: 'Feature graphics: structure, mobility, materials, filtration, noise and airflow.',
          items: [
            { label: 'Sturdy design', ratio: [1, 1], image: W + 'vivosun-detail-1.webp', note: 'Feature graphic for a plant stand.' },
            { label: 'Smooth-steering wheels', ratio: [1, 1], image: W + 'vivosun-detail-2.webp', note: 'Feature graphic for rotating, lockable wheels.' },
            { label: 'Lightproof reflectivity', ratio: [1, 1], image: W + 'vivosun-detail-3.webp', note: 'Feature graphic for reflective fabric.' },
            { label: 'Activated-carbon filtration', ratio: [1, 1], image: W + 'vivosun-detail-4.webp', note: 'Feature graphic for activated-carbon filtration.' },
            { label: 'Low noise level', ratio: [1, 1], image: W + 'vivosun-detail-5.webp', note: 'Feature graphic for noise levels.' },
            { label: 'Air freshing', ratio: [1, 1], image: W + 'vivosun-detail-6.webp', note: 'Feature graphic for airflow.' }
          ]
        }
      ]
    },

    /* ───────── 04 ───────── */
    {
      id: 'retail',
      title: 'Retail & packaging', mark: 'Retail & Packaging',
      kind: 'Product presentation',
      accent: '#f5b82e',
      cover: W + 'retail-trampolines.webp',
      summary: 'Outdoor and home products made ready for the shelf and the shipping bay: retail information graphics, product-range layouts, printed boxes and line-drawn shipping cartons.',
      facts: [
        ['Sector', 'Outdoor & home products'],
        ['Formats', 'Retail graphics, colour boxes, kraft cartons'],
        ['Work', 'Layout, information graphics, dielines']
      ],
      groups: [
        {
          title: 'Retail graphics',
          text: 'Product-range graphics for trampolines and information graphics for sleeping bags.',
          items: [
            { label: 'Trampoline range', ratio: WIDE, image: W + 'retail-trampolines.webp', note: 'Retail product-range graphics and digital promotional layouts.' },
            { label: 'Oversized flannel sleeping bag', ratio: [1100, 1420], image: W + 'retail-sleeping-1.webp', note: 'Product presentation and retail information graphics.' },
            { label: '0°F sleeping bag', ratio: [1632, 1168], image: W + 'retail-sleeping-2.webp', note: 'Product presentation and retail information graphics.' }
          ]
        },
        {
          title: 'Packaging',
          text: 'A printed colour box for a noodle maker and kraft shipping cartons for outdoor play equipment.',
          items: [
            { label: 'Noodle maker box', ratio: [1800, 719], image: W + 'pack-noodle.webp', note: 'Printed product-packaging layout.' },
            { label: 'Trampoline cartons', ratio: WIDE, image: W + 'pack-carton-1.webp', note: 'Original shipping-carton graphics.' },
            { label: 'Seesaw & slide cartons', ratio: WIDE, image: W + 'pack-carton-2.webp', note: 'Original shipping-carton graphics for a seesaw and slide.' }
          ]
        }
      ]
    },

    /* ───────── 05 ───────── */
    {
      id: 'cici',
      title: 'Cici & Pearl', mark: 'Cici & Pearl',
      kind: 'Character design',
      accent: '#ff7aa2',
      cover: W + 'cici-collection.webp',
      years: '2022',
      summary: 'Cici is nine centimetres tall and curious about the world: gentle but determined, fond of travel and adventure, equally at home being active or quiet. Drawn, modelled in 3D and taken through to toy packaging, with Pearl, a retro girl in a qipao, alongside.',
      facts: [
        ['Type', 'Cartoon mascot & IP design'],
        ['Date', '2022'],
        ['Work', 'Character sheets, 3D models, expressions, packaging']
      ],
      groups: [
        {
          title: 'Cici',
          text: 'Cartoon mascot design, from the key visual to the toy on the shelf.',
          items: [
            { label: 'Cici key visual', ratio: WIDE, image: W + 'cici-hero.webp', note: 'Cartoon mascot design. The character name on the original artwork is retained.' },
            { label: 'Toy & packaging applications', ratio: WIDE, image: W + 'cici-toys.webp', note: 'Character models shown with their original packaging concepts.' },
            { label: 'Collection', ratio: WIDE, image: W + 'cici-collection.webp', note: 'Three character variations presented together.' }
          ]
        },
        {
          title: '3D models',
          text: 'Three variations, each in front, side and back views.',
          cols: 3,
          items: [
            { label: '3D model, swim ring', ratio: WIDE, image: W + 'cici-3d-1.webp', note: 'Front, side and back views.' },
            { label: '3D model, blue dress', ratio: WIDE, image: W + 'cici-3d-2.webp', note: 'Front, side and back views.' },
            { label: '3D model, pink overalls', ratio: WIDE, image: W + 'cici-3d-3.webp', note: 'Front, side and back views.' }
          ]
        },
        {
          title: 'Character sheets',
          text: 'Profiles, turnarounds and expression sets for Cici and Pearl.',
          cols: 2,
          items: [
            { label: 'Cici character profile', ratio: WIDE, image: W + 'cici-profile.webp', note: 'A curious girl with a gentle but determined spirit. She loves travel and adventure, enjoys time alone, and is equally at home being active or quiet.' },
            { label: 'Cici turnaround', ratio: WIDE, image: W + 'cici-turnaround.webp', note: 'Front, back and side views.' },
            { label: 'Cici expression set', ratio: WIDE, image: W + 'cici-expressions.webp', note: 'Great job! Keep learning! Delicious! Wow! Haha! Let me think. Pretty please! Huh?' },
            { label: 'Pearl character profile', ratio: WIDE, image: W + 'pearl-profile.webp', note: 'A retro girl who loves pearl necklaces and qipao dresses. She has a beautiful singing voice and is also a swing dancer. Playful and quirky, she is sensitive to the finer shades of emotion.' }
          ]
        }
      ]
    },

    /* ───────── 06 ───────── */
    {
      id: 'illustration',
      title: 'Illustration & book design', mark: 'Illustration',
      kind: 'Illustration',
      accent: '#5aa9ff',
      cover: W + 'illo-go-wild.webp',
      summary: 'Explorations away from the brand work: campaign illustration, a family of everyday objects, a piece shown from pen-tool paths to finished colour, and Whispers of the Solar Terms, a book of ink-wash illustrations.',
      facts: [
        ['Type', 'Illustration & editorial'],
        ['Media', 'Vector, digital painting, ink wash'],
        ['Work', 'Campaign artwork, icon sets, book design']
      ],
      groups: [
        {
          title: 'Illustration',
          text: 'Campaign artwork, outdoor scenes and a coordinated set of objects.',
          items: [
            { label: 'Adventure campaign', ratio: WIDE, image: W + 'illo-adventure.webp', note: 'Original illustrated campaign artwork.' },
            { label: 'Go Wild', ratio: WIDE, image: W + 'illo-go-wild.webp', note: 'Original outdoor-themed illustration.' },
            { label: 'Everyday objects', ratio: WIDE, image: W + 'illo-objects.webp', note: 'A coordinated collection of stylized object illustrations.' },
            { label: 'From linework to colour', ratio: WIDE, image: W + 'illo-linework.webp', note: 'Left: pen-tool paths. Right: finished colour artwork.' }
          ]
        },
        {
          title: 'Whispers of the Solar Terms',
          text: 'Book design. Ink-wash illustrations inspired by China’s traditional solar terms.',
          cols: 2,
          items: [
            { label: 'Book design', ratio: WIDE, image: W + 'book-solar-1.webp', note: 'Ink-wash illustrations inspired by elements of China’s traditional solar terms.' },
            { label: 'Illustration series', ratio: WIDE, image: W + 'book-solar-2.webp', note: 'Book spreads and the original ink-wash illustrations.' }
          ]
        }
      ]
    }
  ]
};
