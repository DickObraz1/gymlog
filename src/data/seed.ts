import type { Exercise, Workout, User } from '../types';

export const DATA_VERSION = '2';

export const ADMIN_USER: User = {
  id: 'admin',
  name: 'Admin',
  isAdmin: true,
};

export const EXERCISES: Exercise[] = [
  {
    id: 'squat',
    name: 'Dřep s osou',
    muscleGroup: 'Kvadricepsy, hýždě',
    emoji: '🏋️',
    instructions:
      'Postav se pod osu na spodní část trapézů, chodidla na šíři ramen, špičky mírně vytočené ven. Pomalu seď dolů tak, aby stehna byla alespoň rovnoběžně s podlahou, kolena sledují směr špičky. Záda udržuj rovná, hrudník vzpřímený. Vydechni silně nahoru při vystoupení. Nejčastější chyba: kolena padají dovnitř a záda se zakulacují – raději sniž váhu a procvič techniku.'
  },
  {
    id: 'bench',
    name: 'Bench press',
    muscleGroup: 'Prsa, tricepsy, přední ramena',
    emoji: '🫸',
    instructions:
      'Leh na lavičku, oči pod osou, chodidla celou plochou na zemi. Uchop osu o něco šíř než je šíře ramen. Při spouštění nadechni a zadrž dech (Valsalva), osa putuje po šikmé dráze na spodní část hrudníku. Lokty nejsou kolmo ven, ale pod úhlem cca 45–75°. Tlač osu zpět nahoru s výdechem. Nikdy neodtrhávej záda od lavičky – oblouk je v pořádku, ale záda musí být stabilní.'
  },
  {
    id: 'row',
    name: 'Přítahy velké činky v předklonu',
    muscleGroup: 'Záda, bicepsy',
    emoji: '🚣',
    instructions:
      'Nakloň trup do úhlu cca 45° až rovnoběžně s podlahou, záda rovná, kolena mírně pokrčená. Drž osu podhmatem nebo nadhmatem, tahy přitáhni osu k pupku, lopatky stisknout v krajní poloze. Nepoužívej setrvačnost zad – pohyb vychází z lopatek a bicepsů. Dýchej: nadech dole, výdech při tahu nahoru. Chyba: zakulacená záda a houpání trupem přidávají těžší váhu, ale kazí techniku a zatěžují páteř.'
  },
  {
    id: 'leg-curl',
    name: 'Zakopávání na hamstringy',
    muscleGroup: 'Hamstringy',
    emoji: '🦵',
    instructions:
      'Lehni na břicho na stroj, polstrování umísti nad paty, ne na Achillovu šlachu. Pomalu zakopni chodidla k hýždím co nejdál, v krajní poloze krátce zadrž. Vracíme se zpomaleně (2–3 vteřiny) – to je nejdůležitější část pohybu. Boky nepozvedávej od podložky. Dýchej: výdech při zakopnutí nahoru, nadech při spouštění.'
  },
  {
    id: 'tricep-pushdown',
    name: 'Triceps – stlačování kladky',
    muscleGroup: 'Tricepsy',
    emoji: '💪',
    instructions:
      'Postav se těsně ke kladce, uchop provaz nebo tyč nadhmatem. Lokty drž pevně u boků po celou dobu – pohybují se jen předloktí. Stlač rukojeť dolů až do plného natažení paží, v krajní poloze stiskni tricepsy. Pomalu vrať do výchozí polohy. Chyba: předklánění se dopředu a použití váhy celého těla – to odnímá stimul ze svalů.'
  },
  {
    id: 'lateral-raise',
    name: 'Upažování s jednoručkami',
    muscleGroup: 'Střední ramena',
    emoji: '🙆',
    instructions:
      'Stoj rovně, jednoručky podél těla, malý pokrčení v loktech. Pomalu upažuj do výšky ramen – prsty mírně níže než loket (jako bys přelíval skleničku). Nezvedej ramena k uším. Spouštění by mělo trvat déle než samotný zdvih. Chyba: příliš těžká váha a houpání – raději lehčí s čistou technikou, protože střední část deltového svalu se snadno předráždí.'
  },
  {
    id: 'bicep-curl',
    name: 'Bicepsový zdvih s jednoručkami / na kladce',
    muscleGroup: 'Bicepsy',
    emoji: '💪',
    instructions:
      'Stoj rovně nebo sed, jednoručky v rukou, lokty těsně u boků. Zdvihej střídavě nebo obouruč, v horní části pohybu mírně otoč zápěstí (supinace) pro plný stah bicepsu. Spouštění kontrolovaně dolů – nenechávej váhu padat. Dýchej: výdech při zdvihu, nadech při spouštění. Chyba: houpání trupem – to přenáší váhu na záda a sníží efektivitu cviku.'
  },
  {
    id: 'trap-deadlift',
    name: 'Mrtvý tah s trap barem',
    muscleGroup: 'Záda, stehna, hýždě',
    emoji: '🏋️',
    instructions:
      'Vstup do středu trap baru, chodidla na šíři boků, uchop rukojeťe nadhmatem. Snižuj boky, hrudník vzpřímený, záda rovná, pohled mírně dolů. Zvedej tlakem nohou do podlahy a zároveň táhni zády, až jsou boky i ramena ve stejné výšce. Osa nepřekračuje šíři ramen. Výdech při vytahování. Chyba: záda se zkruž nebo boky jdou nahoru dříve než ramena – to přetěžuje bederní páteř.'
  },
  {
    id: 'shoulder-press',
    name: 'Tlaky na ramena na multipressu nebo stroji',
    muscleGroup: 'Ramena, tricepsy',
    emoji: '🙌',
    instructions:
      'Seď vzpřímeně, záda v kontaktu s opěradlem, uchop rukojeťe na úrovni brady nebo uší. Tlač přímo nahoru bez zakloňování, v horní poloze paže téměř nataženy. Pomalu spouštěj dolů na výchozí pozici. Na multipressu dráha vede mírně šikmo. Dýchej: výdech při tlaku, nadech při spouštění. Chyba: výrazné prohnutí v zádech a zakloňování – to přetěžuje bederní páteř a ramena.'
  },
  {
    id: 'lat-pulldown',
    name: 'Přítahy horní kladky',
    muscleGroup: 'Záda (Lat), bicepsy',
    emoji: '🧗',
    instructions:
      'Sed pod kladku, stehna pevně pod polstrováním. Uchop tyč širším nadhmatem, o něco šíř než ramena. Mírně zakloň trup (10–15°), tahy stáhni tyč k horní části hrudníku, lopatky dolů a k sobě. Vracíme se pomalu s kontrolou, ruce jdou nahoru se zavřenýma loktama. Chyba: příliš velký náklon dozadu mění cvik na weslování a snižuje aktivaci zad.'
  },
  {
    id: 'leg-extension',
    name: 'Předkopávání na kvadricepsy',
    muscleGroup: 'Kvadricepsy',
    emoji: '🦵',
    instructions:
      'Sed na stroj, opěrka holení pod spodní část bérce. Pomalu extenduj nohy do plného natažení, v horní poloze krátce zadrž a stiskni čtyřhlavé svaly. Vracíme se plynule dolů za 2–3 vteřiny. Neprovádíme rázy ani švihy. Dýchej: výdech při zdvihu nahoru. Chyba: příliš rychlé tempo a plácání závaží – to zatěžuje kolenní vaz a sníží svalový stimul.'
  },
  {
    id: 'tricep-dip-machine',
    name: 'Triceps – stroj',
    muscleGroup: 'Tricepsy',
    emoji: '💪',
    instructions:
      'Sed na stroj, záda opřena, ruce uchopí rukojeti vedle boků. Tlač dolů plným rozsahem pohybu, v dolní poloze plně natáhni paže. Pomalu vrať nahoru. Lopatky drž stažené, nehorb ramena. Dýchej: výdech při tlaku dolů, nadech při návratu. Chyba: ramena jdou nahoru k uším – to přetěžuje trapézy místo tricepsů.'
  },
  {
    id: 'reverse-fly',
    name: 'Pec Deck – zadní ramena (reverse fly)',
    muscleGroup: 'Zadní ramena, horní záda',
    emoji: '🦅',
    instructions:
      'Otočíš se čelem k opěradlu (obráceně), uchopíš rukojeti před sebou. Pomalu upažuj lokty do stran (reverse fly), lopatky se stahují k sobě. V krajní poloze zadrž 1 sekundu. Vracíme se pomalu s kontrolou. Výška rukojetí = výška ramen. Chyba: příliš těžká váha a houpání trupem – to zapojí záda místo zadních deltoidů.'
  },
  {
    id: 'barbell-curl',
    name: 'Bicepsový zdvih s osou',
    muscleGroup: 'Bicepsy',
    emoji: '💪',
    instructions:
      'Stoj rovně, osa podhmatem na šíři ramen. Lokty pevně u boků, zdvíháme osu obloukem nahoru k ramenům. V horní poloze stiskni bicepsy. Spouštění pomalu dolů – plný rozsah pohybu. Dýchej: výdech při zdvihu, nadech při spouštění. Chyba: houpání trupem a lokty jdou dopředu – snižuje to rozsah pohybu bicepsu a přetěžuje záda.'
  },
  {
    id: 'leg-press',
    name: 'Leg press',
    muscleGroup: 'Kvadricepsy, hýždě, hamstringy',
    emoji: '🦵',
    instructions:
      'Sed do stroje, chodidla na desce na šíři ramen ve střední výšce. Uvolni pojistky a pomalu spouštěj desku dolů – kolena sledují špičky, nejdou dovnitř. Dno pohybu: stehna rovnoběžně nebo o něco hlouběji. Tlač desku zpět bez zamčení kolen v horní poloze. Dýchej: nadech dolů, výdech při tlaku. Chyba: lifting hýždí od sedáku v dolní poloze – to přetěžuje záda.'
  },
  {
    id: 'pec-deck',
    name: 'Pec deck (rozpažky na stroji)',
    muscleGroup: 'Prsa',
    emoji: '🦋',
    instructions:
      'Sed na stroj, záda přitisknuta k opěradlu, předloktí nebo ruce na páčkách ve výšce ramen. Pomalu přitáhni páčky k sobě před hrudník, lopatky se lehce odtlačí. V přitažené poloze zadrž 1 sekundu a stiskni prsní svaly. Vracíme se pomalu s kontrolou, nenatahuj ramena přes výchozí polohu. Chyba: příliš velký rozsah dozadu – to přetěžuje ramenní klouby.'
  },
  {
    id: 'seated-row-machine',
    name: 'Přítahy na záda vsedě na stroji',
    muscleGroup: 'Záda, bicepsy',
    emoji: '🚣',
    instructions:
      'Sed na stroj, hrudník opřen o polstrování, uchop rukojeti. Tahy přitáhni k sobě, lopatky stiskni za sebou, lokty jdou dozadu. V krajní poloze zadrž 1 sekundu. Vracíme se pomalu s kontrolou. Záda zůstávají rovná po celou dobu. Dýchej: výdech při tahu, nadech při návratu. Chyba: hrbení ramen a používání setrvačnosti – to kazí aktivaci zad.'
  },
  {
    id: 'bulgarian-squat',
    name: 'Bulharské dřepy',
    muscleGroup: 'Kvadricepsy, hýždě',
    emoji: '🏃',
    instructions:
      'Zadní nohu polož na lavičku, přední stojí cca 60–80 cm před ní. Drž jednoručku nebo vlastní váhu. Pomalu seď dolů na přední noze, koleno přední nohy nepřekračuje špičku. Záda vzpřímená. Spouštěj až téměř ke kontaktu zadního kolena se zemí. Výdech při zdvihu. Jedná se o náročný unilaterální cvik – začni s lehčí váhou, dokud není technika stabilní.'
  },
  {
    id: 'hammer-curl',
    name: 'Bicepsové kladiva s jednoručkami',
    muscleGroup: 'Bicepsy, brachialis',
    emoji: '💪',
    instructions:
      'Stoj rovně, jednoručky v neutrálním úchopu (palce nahoru) podél těla. Zdvíháme střídavě nebo obouruč, zápěstí zůstává neutrální – neotáčíme (rozdíl od klasických bicepsových zdvihů). Lokty pevně u boků. Pohyb pomalý a kontrolovaný. Dýchej: výdech při zdvihu, nadech při spouštění. Tento cvik více pracuje s brachialis a brachioradialis, doplňuje klasický bicepsový zdvih.'
  },
  {
    id: 'french-press',
    name: 'Francouzský tlak (triceps)',
    muscleGroup: 'Tricepsy',
    emoji: '💪',
    instructions:
      'Leh na lavičku, osu nebo jednoručku drž nad hrudníkem nataženýma rukama. Pomalu ohýbej lokty dolů – předloktí jdou k čelu nebo za hlavu, horní část paže zůstává kolmo. Zpět natáhni paže explozivněji. Lokte drž u sebe – nerozevíraj. Dýchej: nadech při spouštění, výdech při natažení. Chyba: lokty jdou do stran a boční pohyb loktů – to omezuje izolaci tricepsů.'
  },
];

export const WORKOUTS: Workout[] = [
  {
    id: 'workout-a',
    name: 'Trénink A',
    exercises: [
      { exerciseId: 'squat', targetSets: 4, targetReps: '5–8', referenceWeight: 'max 92,5 kg' },
      { exerciseId: 'bench', targetSets: 4, targetReps: '6–8', referenceWeight: 'max 80 kg' },
      { exerciseId: 'row', targetSets: 3, targetReps: '8–10', referenceWeight: '25 kg' },
      { exerciseId: 'leg-curl', targetSets: 3, targetReps: '10–12', referenceWeight: '65 kg' },
      { exerciseId: 'tricep-pushdown', targetSets: 3, targetReps: '10–12', referenceWeight: '45 kg' },
      { exerciseId: 'lateral-raise', targetSets: 3, targetReps: '12–15', referenceWeight: 'max 9 kg' },
      { exerciseId: 'bicep-curl', targetSets: 3, targetReps: '10–12', referenceWeight: '10–12,5 kg' },
    ],
  },
  {
    id: 'workout-b',
    name: 'Trénink B',
    exercises: [
      { exerciseId: 'trap-deadlift', targetSets: 4, targetReps: '4–6', referenceWeight: 'osa 24 kg + 50 kg' },
      { exerciseId: 'shoulder-press', targetSets: 4, targetReps: '8–10', referenceWeight: '30 kg / stroj max 45 kg' },
      { exerciseId: 'lat-pulldown', targetSets: 3, targetReps: '8–10', referenceWeight: '45 kg' },
      { exerciseId: 'leg-extension', targetSets: 3, targetReps: '10–12', referenceWeight: '75 kg' },
      { exerciseId: 'tricep-dip-machine', targetSets: 3, targetReps: '10–12', referenceWeight: '65 kg' },
      { exerciseId: 'reverse-fly', targetSets: 3, targetReps: '12–15', referenceWeight: '55 kg / max 10 kg' },
      { exerciseId: 'barbell-curl', targetSets: 3, targetReps: '10–12', referenceWeight: '20–25 kg' },
    ],
  },
  {
    id: 'workout-c',
    name: 'Trénink C',
    exercises: [
      { exerciseId: 'leg-press', targetSets: 4, targetReps: '10–12', referenceWeight: '220 kg' },
      { exerciseId: 'pec-deck', targetSets: 4, targetReps: '10–12', referenceWeight: '45 kg' },
      { exerciseId: 'seated-row-machine', targetSets: 3, targetReps: '10–12', referenceWeight: '55 kg' },
      { exerciseId: 'bulgarian-squat', targetSets: 3, targetReps: '8–10 na každou nohu', referenceWeight: '2× 7,5 kg' },
      { exerciseId: 'hammer-curl', targetSets: 3, targetReps: '10–12', referenceWeight: '10–12,5 kg' },
      { exerciseId: 'french-press', targetSets: 3, targetReps: '10–12', referenceWeight: '15 kg' },
    ],
  },
];
