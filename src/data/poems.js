/**
 * SENGAANTHAL — Poetry & Haiku Collection
 * by Lakshana
 *
 * Easy to extend: Add or replace any poem / haiku in this array.
 * Each item has:
 *  - id: unique string identifier
 *  - language: 'english' | 'tamil'
 *  - type: 'poem' | 'haiku'
 *  - title: title string
 *  - content: array of string lines (or stanzas with empty string lines)
 *  - subtitle / epigraph (optional)
 *  - date / note (optional)
 */

export const poems = [
  // ==========================================
  // ENGLISH POEMS
  // ==========================================
  {
    id: "eng-poem-01",
    language: "english",
    type: "poem",
    title: "The Flame in the Briar",
    subtitle: "On Gloriosa Superba",
    content: [
      "Upon the tangled hedge of thorn and stone,",
      "A quiet spark of wild rebellion grew;",
      "No tender rose that begs to be undone,",
      "Nor violet hiding from the morning dew.",
      "",
      "Her petals curved like embers thrown on air,",
      "A scarlet fire crowned with rims of gold;",
      "She climbs the wild dusk without despair,",
      "Untamed by hands that wish to keep and hold.",
      "",
      "Some blooms are born for gardens trimmed and neat,",
      "Some burn in solitary grace instead —",
      "She leaves her silent scorch beneath our feet,",
      "A crown of crimson where the shadows tread."
    ],
    note: "Pencil & parchment, autumn"
  },
  {
    id: "eng-poem-02",
    language: "english",
    type: "poem",
    title: "A Forgotten Letter",
    subtitle: "Between two pages of yellowed vellum",
    content: [
      "I folded you into the quiet dark,",
      "Between two pages where the dust could sleep;",
      "A dried red leaf, a faint and breathless mark,",
      "A promise that we had no right to keep.",
      "",
      "Years drifted soft as ashes through the hall,",
      "The ink grew faint, the paper aged to cream;",
      "Yet when the lamplight touches on the wall,",
      "Your unspoken words return into the dream.",
      "",
      "We do not lose the things we dare not speak;",
      "They wait like pressed flowers, frail and deep."
    ],
    note: "Written at midnight"
  },
  {
    id: "eng-poem-03",
    language: "english",
    type: "poem",
    title: "The Quiet Hour",
    subtitle: "Rain against the bay window",
    content: [
      "The world outside is dissolving into rain,",
      "A wash of grey across the copper tiles;",
      "Inside, the tallow candle flickers vain,",
      "And measures silence into gentle miles.",
      "",
      "Here with the old books smelling of dry tea,",
      "Of leather bindings and forgotten time,",
      "There is no harbor that I'd rather see,",
      "Than this quiet cadence and this untamed rhyme."
    ],
    note: "Monsoon evening"
  },
  {
    id: "eng-poem-04",
    language: "english",
    type: "poem",
    title: "Sengaanthal",
    subtitle: "The State Flower of Tamil Nadu",
    content: [
      "Born from the red earth of the ancient south,",
      "You wear the sunset like an unbent bow;",
      "A crimson whisper from a poet’s mouth,",
      "That Sangam verses sang so long ago.",
      "",
      "Turn your fiery crowns toward the sky,",
      "And let the monsoon wash your scarlet wings;",
      "For beauty that refuses once to die",
      "Is the only song a quiet spirit sings."
    ],
    note: "Sangam tribute"
  },

  // ==========================================
  // ENGLISH HAIKUS
  // ==========================================
  {
    id: "eng-haiku-01",
    language: "english",
    type: "haiku",
    title: "Flame Lily",
    content: [
      "Scarlet petals curve,",
      "A fire caught upon the vine,",
      "Burning in the rain."
    ]
  },
  {
    id: "eng-haiku-02",
    language: "english",
    type: "haiku",
    title: "Pressed Flower",
    content: [
      "Old ink on the page,",
      "A crimson petal still holds",
      "Summer in its sleep."
    ]
  },
  {
    id: "eng-haiku-03",
    language: "english",
    type: "haiku",
    title: "Tallow Lamp",
    content: [
      "One candle burning,",
      "Moth shadows upon the wall,",
      "Midnight turns the page."
    ]
  },
  {
    id: "eng-haiku-04",
    language: "english",
    type: "haiku",
    title: "Monsoon Dusk",
    content: [
      "Scent of damp red clay,",
      "Thunder rolls behind the hills,",
      "Flame lilies awake."
    ]
  },
  {
    id: "eng-haiku-05",
    language: "english",
    type: "haiku",
    title: "Silence",
    content: [
      "Between every word,",
      "An unsaid truth waits softly",
      "Like an unshed tear."
    ]
  },

  // ==========================================
  // TAMIL POEMS (தமிழ் கவிதைகள்)
  // ==========================================
  {
    id: "tam-poem-01",
    language: "tamil",
    type: "poem",
    title: "செங்காந்தள் சுடர்",
    subtitle: "குறிஞ்சிக் காட்டின் தழல்",
    content: [
      "முள்ளும் புதரும் சூழ்ந்த வேலியிலே,",
      "முளைத்து நின்ற செந்நிறத் தழலே!",
      "மெல்லிய ரோஜாப் பூக்களைப் போலன்றி,",
      "வானம் நோக்கி வளைந்த இதழே.",
      "",
      "மழையிலும் அணையாத தீச்சுடராய்,",
      "மண்ணின் மடியில் மலர்ந்தவளே;",
      "தொட்டவர் கைகளில் சிக்காமல்,",
      "சுதந்திரக் காற்றில் ஆடுபவளே.",
      "",
      "செங்காந்தளே, உன் அழகு என்பது",
      "அடங்கிப் போவதில் இல்லை —",
      "தனித்து நின்று எரியும் தீயே",
      "வாழ்வின் மெய்யான எல்லை."
    ],
    note: "செம்மண் நிலத்தின் நினைவுகள்"
  },
  {
    id: "tam-poem-02",
    language: "tamil",
    type: "poem",
    title: "பழைய புத்தகத்தின் மௌனம்",
    subtitle: "மஞ்சள் ஏடுகளின் வாசனை",
    content: [
      "காலம் உதிர்த்த ஏடுகளின் நடுவே,",
      "காய்ந்து போன ஒரு பூவிதழ்;",
      "எழுதப்படாத எத்தனையோ சொற்களை,",
      "மௌனமாய் சுமக்கும் ஒரு நிழல்.",
      "",
      "எத்தனை இரவுகள் புரட்டப்பட்டதோ,",
      "இந்தத் தேய்ந்த விரல் தடங்கள்;",
      "மறைந்து போன மனிதர்களின் நினைவை,",
      "மறுபடியும் மீட்கும் பக்கங்கள்.",
      "",
      "சொற்கள் ஒருபோதும் இறப்பதில்லை,",
      "அவை தாளில் உறங்குகின்றன அவ்வளவே."
    ],
    note: "இரவு வாசிப்பு"
  },
  {
    id: "tam-poem-03",
    language: "tamil",
    type: "poem",
    title: "மழைக்கால அந்தி",
    subtitle: "சாரல் பொழியும் பொழுது",
    content: [
      "ஓட்டு வீட்டின் ஓரத்திலே,",
      "சொட்டுச் சொட்டாய் வழியும் மழை;",
      "செம்மண் வாசம் கிளம்பும் போதே,",
      "நெஞ்சில் கரையும் பழைய பிழை.",
      "",
      "அகண்ட வானம் இருண்டு வர,",
      "அகல் விளக்கின் மெலிந்த ஒளி;",
      "காற்றில் ஆடும் மரங்களின் சத்தம்,",
      "காலம் மறந்த கவிதை மொழி."
    ],
    note: "மழைத்துளிச் சிந்தனை"
  },
  {
    id: "tam-poem-04",
    language: "tamil",
    type: "poem",
    title: "செம்மலர் நினைவுகள்",
    subtitle: "சங்க இலக்கிய நினைவில்",
    content: [
      "குறிஞ்சி நிலத்தின் கொடி மலரே,",
      "கூந்தலில் சூடிய செந்தழலே;",
      "பண்டைய புலவர் பாடிய வரியாய்,",
      "பலகாலம் கடந்தும் அழியாதவளே.",
      "",
      "உன் வளைந்த இதழின் சிவப்புக்குள்,",
      "எத்தனை ஆழமான காதல்;",
      "புத்தக ஏட்டில் பொதிந்து வைத்தேன்,",
      "நீங்காத உன் நினைவின் சாதல்."
    ],
    note: "சங்கத் தடம்"
  },

  // ==========================================
  // TAMIL HAIKUS (தமிழ் ஹைக்கூ)
  // ==========================================
  {
    id: "tam-haiku-01",
    language: "tamil",
    type: "haiku",
    title: "செங்காந்தள்",
    content: [
      "கொடியில் எரியும்",
      "சிவப்புத் தீச்சுடர்,",
      "மழை நனைந்தும் அணையாமல்."
    ]
  },
  {
    id: "tam-haiku-02",
    language: "tamil",
    type: "haiku",
    title: "முதல் மழை",
    content: [
      "சுட்ட மண் மீது",
      "விழுந்த ஒரு துளி,",
      "உயிர்த்தது வாசனை."
    ]
  },
  {
    id: "tam-haiku-03",
    language: "tamil",
    type: "haiku",
    title: "பழைய கடிதம்",
    content: [
      "மங்கிய மையில்",
      "இன்னும் காயாமல்",
      "உன் குரல்."
    ]
  },
  {
    id: "tam-haiku-04",
    language: "tamil",
    type: "haiku",
    title: "நிலா இரவில்",
    content: [
      "புத்தகத்தின் மீது",
      "விழுந்த நிழல்,",
      "வாசிக்கிறது காற்று."
    ]
  },
  {
    id: "tam-haiku-05",
    language: "tamil",
    type: "haiku",
    title: "மௌனம்",
    content: [
      "இரு சொற்களுக்கு நடுவே",
      "ஒளிந்து கிடக்கிறது",
      "ஒரு கடல்."
    ]
  }
];

export const PREFACE_CONTENT = {
  title: "PREFACE",
  lines: [
    "Some words are not written",
    "to be understood.",
    "",
    "Some are written simply",
    "because they refuse to disappear.",
    "",
    "These pages hold them here."
  ],
  author: "— Lakshana"
};

export const PREFACE_CONTENT_TAMIL = {
  title: "முன்னுரை",
  lines: [
    "சில சொற்கள் புரிந்து கொள்வதற்காக",
    "மட்டும் எழுதப்படுவதில்லை.",
    "",
    "சில சொற்கள் மறைந்து போக மறுப்பதாலேயே",
    "எழுதப்பட்டு நிற்கின்றன.",
    "",
    "இந்தப் பக்கங்கள் அவற்றை",
    "இங்கே தாங்கி நிற்கின்றன."
  ],
  author: "— லக்ஷனா"
};
