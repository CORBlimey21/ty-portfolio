export const rubric = [
  ['learner', 'Being a Learner'],
  ['growth', 'Personal Growth'],
  ['community', 'Civic and Community Engagement'],
  ['career', 'Career Exploration'],
];

export const chapters = [
  {
    id: 'dcu-engineering',
    object: 'breadboard',
    title: 'DCU engineering',
    lines: ['DCU', 'engineering'],
    subtitle: 'Circuits, calculations and lab notes',
    intro: "This has been an absolutely amazing experience. Not just the actual modules, but in particular, the travel and independence, and the people from all over I've met.",
    entries: [
      {
        id: 'breadboard-circuit',
        title: 'Building the circuit',
        rubric: ['learner', 'career'],
        artefacts: [
          {
            type: 'image', url: 'media/dcu-built-circuit.jpg', width: 768, height: 1024,
            alt: 'A hand adjusting a wired breadboard with switches, clips and a battery.',
            caption: 'The circuit we built at DCU.',
          },
        ],
        reflection: "It was one thing to follow the instructions, but quite another when our group was left to figure out a circuit by ourselves. It was a great chance to both think critically and communicate with teammates. As to how a chair got disassembled and its screws incorporated into the circuit, I suppose we'll never know.",
      },
      {
        id: 'calculations',
        title: 'Working out the values',
        rubric: ['learner'],
        artefacts: [
          {
            type: 'image', url: 'media/dcu-mesh-analysis.jpg', width: 1024, height: 768,
            alt: 'Notebook page with a hand-drawn circuit, three labelled mesh currents and simultaneous equations.',
            caption: 'Mesh analysis notes from DCU.',
          },
        ],
        reflection: "There was quite a lot of material to cover mathematically, but it was interesting to see how maths that might've seemed purposeless in secondary is actually highly important in uni. Although I must say I would've been quite happy to leave three-unknown simultaneous equations back in secondary school!",
      },
    ],
  },
  {
    id: 'rowing-and-coaching',
    object: 'erg',
    title: 'Rowing & coaching',
    lines: ['Rowing &', 'coaching'],
    subtitle: 'Coaching, race days and the North Mon',
    intro: "Rowing has been a huge part of my life for many years, but in TY, I've had the opportunity to see it from the other side of the coach/athlete split.",
    artefacts: [
      {
        type: 'image', url: 'media/rowing-launch.jpg', width: 1024, height: 768,
        alt: 'Rowers and shells gathered around two pontoons on calm water.',
        caption: 'Rowing shells at the launch pontoons.',
      },
    ],
    entries: [
      {
        id: 'race-results',
        title: 'Race results',
        rubric: ['growth'],
        artefacts: [
          {
            type: 'image', url: 'media/rowing-race-medal.jpg', width: 1773, height: 2839,
            alt: 'A gold-coloured medal on a green Rowing Ireland 1K Classic ribbon.',
            caption: 'Rowing Ireland 1K Classic medal.',
          },
        ],
        reflection: 'The race, which lasted just over three and a half minutes, was won by 0.7 seconds. It was quite a wild example of how even enormous amounts of work and training can result in tiny performance advantages. I must admit I was delighted that that tiny difference was in our favour though.',
      },
      {
        id: 'cbc-novices',
        title: 'Cork Boat Club Novices',
        rubric: ['growth', 'learner'],
        artefacts: [
          {
            type: 'image', url: 'media/rowing-boat-club.jpg', width: 665, height: 1182,
            alt: 'Oars and rigging seen from inside a rowing shell on the water.',
            caption: 'On the water with Cork Boat Club.',
          },
        ],
        reflection: "Nearly every Saturday and Sunday for the last two months, I've spent two hours down in the club after my own training to help the novices. Over the weeks, I've gotten to know the rowers, and I've gotten to know other people in my club much better, coaching at their side. There have been so many laughs along the way, and many opportunities to improve one's confidence in crisis management when things take a turn for the, shall we say, more interesting.",
      },
      {
        id: 'north-mon',
        title: 'Coaching at North Mon',
        rubric: ['community', 'growth'],
        artefacts: [
          {
            type: 'image', url: 'media/rowing-north-mon.jpg', width: 768, height: 1024,
            alt: 'Rowing machines set up on a wooden hall floor.',
            caption: 'Rowing machines set up at North Mon.',
          },
        ],
        reflection: "Separate to coaching at my own club, I've also been coaching with the Get Going Get Rowing programme, which travels school to school introducing kids to rowing. Unlike at Cork Boat Club, this largely involves rowing machines, with games to keep everyone happy while we cycle people on and off the machines. It was really rewarding to see their confidence improve over the six weeks I spent at the North Monastery Primary School, and the games of B-O-M-B we played I think will always be imprinted on my brain.",
      },
    ],
  },
  {
    id: 'leeway-and-urban-cybernetics',
    object: 'cork',
    title: 'LeeWay & Urban Cybernetics',
    lines: ['LeeWay & Urban', 'Cybernetics'],
    subtitle: 'Cork buses, simulations and an app',
    intro: "I've spent a... we'll go with 'mildly concerning'... amount of time investigating how traffic moves, and why Cork buses seem to have such creative interpretations of their arrival times. Between the research, experiments, competitions and app development, it's been an enormous undertaking, but one I've genuinely loved working on.",
    entries: [
      {
        id: 'simulation',
        title: 'Traffic simulation',
        rubric: ['learner'],
        artefacts: [
          {
            type: 'image', url: 'media/cork-traffic-simulation.webp', width: 3024, height: 1717,
            alt: 'The Urban Cybernetics workbench showing a 3D Cork City network with coloured links for simulated storage utilisation.',
            caption: 'Cork City traffic simulation in the Urban Cybernetics workbench.',
          },
        ],
        reflection: "I think there's something rather funny about spending months developing an extraordinarily complicated system whose job, at the end of the day, is to make little vehicles drive around roads. Unfortunately, those little vehicles have an alarming number of ways to behave incorrectly. It's been an enormous exercise in testing, questioning assumptions, and discovering that getting a simulation to run is quite a different thing from getting it to run correctly.",
      },
      {
        id: 'paper',
        title: 'Paper submission',
        rubric: ['learner', 'career'],
        artefacts: [
          {
            type: 'image', url: 'media/traffic-manuscript-title.webp', width: 1720, height: 584,
            alt: 'Manuscript title, An auditable packetised link transmission model with canonical physical-event histories, and the author details with the email redacted.',
            caption: 'Title and author details of the traffic simulation manuscript.',
          },
        ],
        reflection: "On 7 October, I submitted my first research paper to a scientific journal. On 1 November, I received my first desk rejection, because the journal did not currently have an Area Editor covering my field. Not quite the fairy-tale ending, then! Still, the process of writing the paper, checking the results and trying to make every claim defensible was a fascinating introduction to scientific publishing. And, rather inconveniently for whoever eventually has to review it, I haven't given up on getting it published.",
      },
      {
        id: 'bus-prediction',
        title: 'Bus prediction experiments',
        rubric: ['learner'],
        artefacts: [
          {
            type: 'image', url: 'media/bus-prediction-errors.webp', width: 1438, height: 738,
            alt: 'Mean absolute error for TFI API, median correction, boosting and boosting with GPS. At 2–5 minutes the errors are 2.1, 1.9, 1.7 and 1.6 minutes. At 8½–11½ minutes they are 4.3, 3.4, 3.2 and 3.3 minutes.',
            caption: 'Bus arrival prediction errors for four methods at two prediction horizons.',
          },
        ],
        reflection: "I'm not entirely sure at what point being annoyed by Cork buses turned into collecting 49,191 observations and training machine-learning models, but here we are. I wanted to see whether I could produce more accurate arrival predictions than the existing system, and, rather pleasingly, the results suggested that I could. Of course, the buses remain perfectly capable of proving both predictions wrong, but at least now I can measure just how wrong!",
      },
      {
        id: 'passenger-app',
        title: 'LeeWay passenger app',
        rubric: ['learner', 'community'],
        artefacts: [
          {
            type: 'image', url: 'media/leeway-irish-welcome.webp', width: 1179, height: 2400,
            alt: 'The Irish-language LeeWay welcome screen with a route drawn across a map.',
            caption: 'LeeWay’s Irish-language welcome screen.',
          },
        ],
        reflection: "Having spent rather a lot of time researching public transport, I eventually came to the conclusion that it might be nice if people could actually use some of the results. What began as an attempt to improve bus arrival predictions has since grown into an entire journey-planning app, complete with walking routes, live information, and the occasional warning that one's bus may not actually exist. It's been fascinating to discover how much work goes into making something seem simple, and how very different building a working system is from building one people might actually enjoy using.",
      },
      {
        id: 'competition',
        title: 'Competition work',
        rubric: ['career', 'growth'],
        artefacts: [
          {
            type: 'image', url: 'media/scifest-submission.webp', width: 2295, height: 1130,
            alt: 'SciFest NGSF 2026 confirmation page saying the abstract and project details submission was received.',
            caption: 'SciFest confirmation for the abstract and project details submission.',
          },
        ],
        reflection: "After winning Best Overall at SciFest@MTU earlier this year, I was invited to the National Final in December, with the Young Scientist Exhibition in January also on the horizon. Preparing for both has involved a rather interesting challenge: trying to explain months of research into traffic simulation and bus predictions without subjecting the poor soul listening to an entire lecture on network dynamics. There's still quite a lot to do, but I'm really looking forward to both events.",
      },
    ],
  },
  {
    id: 'oliver',
    object: 'keys',
    title: 'Oliver!',
    lines: ['Oliver!'],
    subtitle: 'Producing, accompanying and rehearsing',
    intro: "I'm producing Oliver!, and so far I'd be selling it short saying I've had some of the most memorable moments of my school life from it.",
    entries: [
      {
        id: 'producing',
        title: 'Producing the show',
        rubric: ['career', 'growth'],
        artefacts: [
          {
            type: 'image', url: 'media/oliver-production-whiteboard.jpg', width: 768, height: 1024,
            alt: 'A classroom whiteboard with Oliver written in Arabic script in green marker.',
            caption: 'Oliver! on the whiteboard.',
          },
        ],
        reflection: "I don't think I'd quite appreciated how much organising goes into making a musical appear even vaguely effortless. As one of three producers, I've found myself involved in all sorts of decisions and occasional complications that the audience will hopefully never know existed. There have certainly been some, as we call them in the trade, interesting moments along the way, but getting to tackle them with the others has been half the fun, and I've thoroughly enjoyed it.",
      },
      {
        id: 'accompanying',
        title: 'At the piano',
        rubric: ['learner', 'growth'],
        artefacts: [
          {
            type: 'image', url: 'media/oliver-score-excerpt.jpg', width: 3898, height: 1838,
            alt: 'An excerpt from the Oliver! JR. piano and vocal score showing a dialogue cue above the opening staff.',
            caption: 'An excerpt from the Oliver! JR. piano and vocal score.',
          },
        ],
        reflection: "Through my seemingly insufficient protests, I've found myself at the piano for Oliver! on many an occasion. It's been very different from the piano playing I've been trained in, but I must say I've enjoyed it so much. There's so much fun to be found in getting everyone roaring along to a song, and I feel so lucky to have been part of it.",
      },
    ],
  },
  {
    id: 'atmospheric-re-entry',
    object: 'shield',
    title: 'Atmospheric re-entry',
    lines: ['Atmospheric', 're-entry'],
    subtitle: "One of the projects I've worked on as part of the CBC TY Xmas exams",
    intro: 'I built a site about what happens when a spacecraft comes back through the atmosphere. I also recorded a flight in Kerbal Space Program to give it a visual angle.',
    link: { url: 'https://corblimey21.github.io/re-entry/', label: 'Open RE-ENTRY' },
    entries: [
      {
        id: 'kerbal',
        title: 'A Kerbal re-entry',
        rubric: ['learner', 'growth'],
        artefacts: [
          { type: 'link', url: 'https://www.youtube.com/watch?v=nxjYnuj-WCc', caption: 'Watch my Kerbal Space Program recording' },
        ],
        reflection: "I remember, many years ago, thinking uploading a video to YouTube would be 'like, the coolest thing ever'. Only a few weeks ago, I found myself actually uploading my first video to YouTube, and thinking nothing of it. That change of something my younger self would've found incredible to something I now found utterly unremarkable is, in my opinion, itself remarkable.",
      },
      {
        id: 'physics',
        title: 'The physics',
        rubric: ['learner', 'growth'],
        artefacts: [
          {
            type: 'image', url: 'media/re-entry-heat-shield.webp', width: 3024, height: 1716,
            alt: 'The RE-ENTRY interactive diagram with the middle layer selected, between the ablating surface and the supporting structure.',
            caption: 'The heat-shield diagram on RE-ENTRY, with the unreacted ablator selected.',
          },
        ],
        reflection: "It turns out that atmospheric re-entry is rather more complicated than a spacecraft getting hot because it's rubbing against the air. Between bow shocks, compressed gases and ablative heat shields that deliberately sacrifice themselves to protect what's underneath, there was quite a lot to get one's head around. I really enjoyed trying to make all of that understandable without removing the very physics that makes it interesting in the first place. Who knew un-going to space could be quite so complicated?",
      },
    ],
  },
  {
    id: 'vision-for-the-eu',
    object: 'europe',
    title: 'Vision for the EU',
    lines: ['Vision for', 'the EU'],
    subtitle: 'An interactive group project',
    intro: 'We formed a team and made an interactive project about our vision for the future of the European Union, for a competition for TY students across the country.',
    link: { url: 'https://corblimey21.github.io/vision-for-the-eu/', label: 'Open Vision for the EU' },
    entries: [
      {
        id: 'interactive-project',
        title: 'The group project',
        rubric: ['community', 'learner'],
        artefacts: [
          {
            type: 'image', url: 'media/vision-eu-offshore-wind.webp', width: 3024, height: 1717,
            alt: 'The Ireland’s next steps section of Vision for the EU, with an offshore wind illustration on the interactive globe and subtitles beside it.',
            caption: 'The offshore wind section of Vision for the EU.',
          },
        ],
        reflection: "Although we didn't win, I found it a really enjoyable experience. I was lucky enough to be brought together in a brilliant team, and the feeling of us all meshing together, communicating, and working to a common goal was really rewarding, and a really fun way to improve those skills. After we spent so much time debating colour palettes, I feel I have grown not only as a person, but as a formidable interior designer."  
      },
    ],
  },
];
