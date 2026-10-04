import bcrypt from 'bcryptjs';
import pool from '../config/db.js';

const initialPoems = [
  // English Poems
  {
    title: "The Flame in the Briar",
    language: "english",
    type: "poem",
    content: `Upon the tangled hedge of thorn and stone,
A quiet spark of wild rebellion grew;
No tender rose that begs to be undone,
Nor violet hiding from the morning dew.

Her petals curved like embers thrown on air,
A scarlet fire crowned with rims of gold;
She climbs the wild dusk without despair,
Untamed by hands that wish to keep and hold.

Some blooms are born for gardens trimmed and neat,
Some burn in solitary grace instead —
She leaves her silent scorch beneath our feet,
A crown of crimson where the shadows tread.`,
    published: true
  },
  {
    title: "A Forgotten Letter",
    language: "english",
    type: "poem",
    content: `I folded you into the quiet dark,
Between two pages where the dust could sleep;
A dried red leaf, a faint and breathless mark,
A promise that we had no right to keep.

Years drifted soft as ashes through the hall,
The ink grew faint, the paper aged to cream;
Yet when the lamplight touches on the wall,
Your unspoken words return into the dream.

We do not lose the things we dare not speak;
They wait like pressed flowers, frail and deep.`,
    published: true
  },
  {
    title: "The Quiet Hour",
    language: "english",
    type: "poem",
    content: `The world outside is dissolving into rain,
A wash of grey across the copper tiles;
Inside, the tallow candle flickers vain,
And measures silence into gentle miles.

Here with the old books smelling of dry tea,
Of leather bindings and forgotten time,
There is no harbor that I'd rather see,
Than this quiet cadence and this untamed rhyme.`,
    published: true
  },
  {
    title: "Sengaanthal",
    language: "english",
    type: "poem",
    content: `Born from the red earth of the ancient south,
You wear the sunset like an unbent bow;
A crimson whisper from a poet’s mouth,
That Sangam verses sang so long ago.

Turn your fiery crowns toward the sky,
And let the monsoon wash your scarlet wings;
For beauty that refuses once to die
Is the only song a quiet spirit sings.`,
    published: true
  },

  // English Haikus
  {
    title: "Flame Lily",
    language: "english",
    type: "haiku",
    content: `Scarlet petals curve,
A fire caught upon the vine,
Burning in the rain.`,
    published: true
  },
  {
    title: "Pressed Flower",
    language: "english",
    type: "haiku",
    content: `Old ink on the page,
A crimson petal still holds
Summer in its sleep.`,
    published: true
  },
  {
    title: "Tallow Lamp",
    language: "english",
    type: "haiku",
    content: `One candle burning,
Moth shadows upon the wall,
Midnight turns the page.`,
    published: true
  },
  {
    title: "Monsoon Dusk",
    language: "english",
    type: "haiku",
    content: `Scent of damp red clay,
Thunder rolls behind the hills,
Flame lilies awake.`,
    published: true
  },
  {
    title: "Silence",
    language: "english",
    type: "haiku",
    content: `Between every word,
An unsaid truth waits softly
Like an unshed tear.`,
    published: true
  },

  // Tamil Poems
  {
    title: "செங்காந்தள் சுடர்",
    language: "tamil",
    type: "poem",
    content: `முள்ளும் புதரும் சூழ்ந்த வேலியிலே,
முளைத்து நின்ற செந்நிறத் தழலே!
மெல்லிய ரோஜாப் பூக்களைப் போலன்றி,
வானம் நோக்கி வளைந்த இதழே.

மழையிலும் அணையாத தீச்சுடராய்,
மண்ணின் மடியில் மலர்ந்தவளே;
தொட்டவர் கைகளில் சிக்காமல்,
சுதந்திரக் காற்றில் ஆடுபவளே.

செங்காந்தளே, உன் அழகு என்பது
அடங்கிப் போவதில் இல்லை —
தனித்து நின்று எரியும் தீயே
வாழ்வின் மெய்யான எல்லை.`,
    published: true
  },
  {
    title: "பழைய புத்தகத்தின் மௌனம்",
    language: "tamil",
    type: "poem",
    content: `காலம் உதிர்த்த ஏடுகளின் நடுவே,
காய்ந்து போன ஒரு பூவிதழ்;
எழுதப்படாத எத்தனையோ சொற்களை,
மௌனமாய் சுமக்கும் ஒரு நிழல்.

எத்தனை இரவுகள் புரட்டப்பட்டதோ,
இந்தத் தேய்ந்த விரல் தடங்கள்;
மறைந்து போன மனிதர்களின் நினைவை,
மறுபடியும் மீட்கும் பக்கங்கள்.

சொற்கள் ஒருபோதும் இறப்பதில்லை,
அவை தாளில் உறங்குகின்றன அவ்வளவே.`,
    published: true
  },
  {
    title: "மழைக்கால அந்தி",
    language: "tamil",
    type: "poem",
    content: `ஓட்டு வீட்டின் ஓரத்திலே,
சொட்டுச் சொட்டாய் வழியும் மழை;
செம்மண் வாசம் கிளம்பும் போதே,
நெஞ்சில் கரையும் பழைய பிழை.

அகண்ட வானம் இருண்டு வர,
அகல் விளக்கின் மெலிந்த ஒளி;
காற்றில் ஆடும் மரங்களின் சத்தம்,
காலம் மறந்த கவிதை மொழி.`,
    published: true
  },
  {
    title: "செம்மலர் நினைவுகள்",
    language: "tamil",
    type: "poem",
    content: `குறிஞ்சி நிலத்தின் கொடி மலரே,
கூந்தலில் சூடிய செந்தழலே;
பண்டைய புலவர் பாடிய வரியாய்,
பலகாலம் கடந்தும் அழியாதவளே.

உன் வளைந்த இதழின் சிவப்புக்குள்,
எத்தனை ஆழமான காதல்;
புத்தக ஏட்டில் பொதிந்து வைத்தேன்,
நீங்காத உன் நினைவின் சாதல்.`,
    published: true
  },

  // Tamil Haikus
  {
    title: "செங்காந்தள்",
    language: "tamil",
    type: "haiku",
    content: `கொடியில் எரியும்
சிவப்புத் தீச்சுடர்,
மழை நனைந்தும் அணையாமல்.`,
    published: true
  },
  {
    title: "முதல் மழை",
    language: "tamil",
    type: "haiku",
    content: `சுட்ட மண் மீது
விழுந்த ஒரு துளி,
உயிர்த்தது வாசனை.`,
    published: true
  },
  {
    title: "பழைய கடிதம்",
    language: "tamil",
    type: "haiku",
    content: `மங்கிய மையில்
இன்னும் காயாமல்
உன் குரல்.`,
    published: true
  },
  {
    title: "நிலா இரவில்",
    language: "tamil",
    type: "haiku",
    content: `புத்தகத்தின் மீது
விழுந்த நிழல்,
வாசிக்கிறது காற்று.`,
    published: true
  },
  {
    title: "மௌனம்",
    language: "tamil",
    type: "haiku",
    content: `இரு சொற்களுக்கு நடுவே
ஒளிந்து கிடக்கிறது
ஒரு கடல்.`,
    published: true
  }
];

async function seed() {
  console.log('[Seed] Starting database seed process...');
  try {
    // 1. Create Default Admin User
    const adminEmail = 'admin@sengaanthal.com';
    const adminPassword = 'admin123'; // Initial password to be documented in README

    const adminCheck = await pool.query('SELECT id, email FROM users WHERE email = $1', [adminEmail]);

    if (!adminCheck.rows || adminCheck.rows.length === 0) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await pool.query(
        'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)',
        ['Sengaanthal Admin', adminEmail, hashedPassword, 'admin']
      );
      console.log(`[Seed] Created admin account: ${adminEmail}`);
    } else {
      console.log(`[Seed] Admin account ${adminEmail} already exists.`);
    }

    // 2. Check and Seed Poems
    const countRes = await pool.query('SELECT COUNT(*) as count FROM poems');
    const poemCount = Number(countRes.rows[0].count);

    if (poemCount === 0) {
      console.log(`[Seed] Populating ${initialPoems.length} initial poems and haikus into PostgreSQL...`);
      for (const p of initialPoems) {
        await pool.query(
          'INSERT INTO poems (title, language, type, content, published) VALUES ($1, $2, $3, $4, $5)',
          [p.title, p.language, p.type, p.content, p.published]
        );
      }
      console.log('[Seed] All initial poems populated successfully.');
    } else {
      console.log(`[Seed] Database already has ${poemCount} poems. Skipping poem re-insertion.`);
    }

    console.log('\n[Seed Completed Successfully!]');
    if (pool.end) await pool.end();
    process.exit(0);
  } catch (error) {
    console.error('[Seed Error]:', error);
    if (pool.end) await pool.end();
    process.exit(1);
  }
}

seed();
