export type GameCategory = 'all' | 'arcade' | 'puzzle' | 'strategy' | 'reflex' | 'brain';

export interface GameInfo {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: GameCategory;
  categoryLabel: string;
  estimatedTime: string;
  controlsSummary: string;
  accentColor: string;
  badge?: string;
  scoreType: 'points' | 'wpm' | 'ms' | 'moves' | 'streak' | 'wins';
  scoreLabel: string;
  lowerScoreIsBetter?: boolean;
  featured?: boolean;
  popular?: boolean;
  instructions: string[];
  controls: { key: string; action: string }[];
  route: string;
}

export const GAMES_CATALOG: GameInfo[] = [
  {
    id: 'snake',
    title: 'Neon Snake',
    tagline: 'Maneuver the serpent, gather energy orbs, and test your precision reflexes.',
    description: 'A smooth retro-modern recreation of the timeless arcade classic. Eat glowing energy pellets to grow your cyber-serpent, avoid collision with walls and your own tail, and unlock higher speed tiers as your score climbs.',
    category: 'arcade',
    categoryLabel: 'Arcade',
    estimatedTime: '3-5 min',
    controlsSummary: 'Arrow Keys / WASD / D-Pad',
    accentColor: '#B7FF35', // Neon Lime
    badge: 'Popular',
    scoreType: 'points',
    scoreLabel: 'Points',
    featured: true,
    popular: true,
    instructions: [
      'Direct the snake to eat the bright glowing energy food pellets.',
      'Each regular food item extends your length and grants 10 points.',
      'Rare golden power pellets grant 25 bonus points.',
      'Hitting the perimeter arena walls or colliding with your own body causes game over.',
      'Speed scales up slightly as your score milestone increases.'
    ],
    controls: [
      { key: 'Arrow Keys / WASD', action: 'Change snake movement direction' },
      { key: 'Space', action: 'Pause / Resume game' },
      { key: 'R', action: 'Instant restart' },
      { key: 'Touch D-Pad', action: 'Mobile directional controls' },
    ],
    route: '/games/snake',
  },
  {
    id: '2048',
    title: '2048 Cyber',
    tagline: 'Slide and merge identical numbers to engineer the legendary 2048 tile.',
    description: 'The addictive numeric puzzle reimagined with rich tactile dark-mode surfaces and smooth tile animations. Merge numbers strategically across the 4x4 matrix to unlock the 2048 tile and aim for record-breaking scores.',
    category: 'puzzle',
    categoryLabel: 'Puzzle',
    estimatedTime: '5-15 min',
    controlsSummary: 'Swipe / Arrows / WASD',
    accentColor: '#A855F7', // Purple
    badge: 'Classic',
    scoreType: 'points',
    scoreLabel: 'Score',
    featured: true,
    popular: true,
    instructions: [
      'Slide the grid in any of four cardinal directions (Up, Down, Left, Right).',
      'When two tiles with the exact same number collide, they combine into one with double value.',
      'Every valid move spawns a new tile (either a 2 or a 4) on an empty grid square.',
      'Reach the 2048 tile to win, and keep playing to rack up the highest score possible.',
      'The game ends when no legal moves remain.'
    ],
    controls: [
      { key: 'Arrow Keys / WASD', action: 'Slide grid tiles' },
      { key: 'Swipe Gestures', action: 'Touchscreen tile movement' },
      { key: 'U', action: 'Undo last single move' },
      { key: 'R', action: 'Reset board' },
    ],
    route: '/games/2048',
  },
  {
    id: 'memory-match',
    title: 'Relic Memory Match',
    tagline: 'Uncover paired mythical gaming artifacts with precision memory.',
    description: 'A sharp visual memory test designed to challenge spatial recall. Flip face-down cards to match gaming runes, swords, shields, potions, and dragon gems with the lowest possible move count and fastest elapsed time.',
    category: 'brain',
    categoryLabel: 'Brain & Memory',
    estimatedTime: '2-4 min',
    controlsSummary: 'Click / Tap',
    accentColor: '#38BDF8',
    scoreType: 'moves',
    scoreLabel: 'Moves',
    lowerScoreIsBetter: true,
    featured: false,
    popular: true,
    instructions: [
      'Select any face-down card to reveal its relic illustration.',
      'Select a second card to discover if it matches the first.',
      'If the pair matches, both cards remain revealed.',
      'If they do not match, both flip face-down after a brief glimpse.',
      'Complete the entire board in the minimum moves and time to earn a 3-star rating.'
    ],
    controls: [
      { key: 'Mouse Click / Tap', action: 'Reveal card' },
      { key: 'R', action: 'Shuffle and deal new board' },
    ],
    route: '/games/memory-match',
  },
  {
    id: 'tic-tac-toe',
    title: 'Tic-Tac-Toe AI',
    tagline: 'Outmaneuver computer logic in the timeless battle of Xs and Os.',
    description: 'Test your tactical foresight against a responsive computer opponent. Choose between Casual, Tactical, and Master difficulty levels, featuring crisp vector marks and a win/draw tracker.',
    category: 'strategy',
    categoryLabel: 'Strategy',
    estimatedTime: '1-2 min',
    controlsSummary: 'Click / Tap',
    accentColor: '#B7FF35',
    scoreType: 'wins',
    scoreLabel: 'Wins',
    featured: false,
    popular: false,
    instructions: [
      'You are player X; the computer plays as O.',
      'Take turns placing your symbol in an open square of the 3x3 grid.',
      'First to align 3 consecutive marks horizontally, vertically, or diagonally wins.',
      'Select between Casual (gentle mistakes), Tactical (smart blocks), or Master (optimal minimax).'
    ],
    controls: [
      { key: 'Click / Tap Cell', action: 'Place your mark' },
      { key: 'R', action: 'Clear board for next match' },
    ],
    route: '/games/tic-tac-toe',
  },
  {
    id: 'rock-paper-scissors',
    title: 'Rock Paper Scissors',
    tagline: 'Fast-paced showdown of instincts with streak multipliers.',
    description: 'A streamlined edition of the classic hand showdown. Play the standard triangle or switch to the extended Lizard-Spock mode. Build win streaks and analyze computer counter-patterns.',
    category: 'arcade',
    categoryLabel: 'Arcade',
    estimatedTime: '1-3 min',
    controlsSummary: 'Quick Tap / 1-3 Keys',
    accentColor: '#F59E0B',
    scoreType: 'streak',
    scoreLabel: 'Streak',
    featured: false,
    popular: false,
    instructions: [
      'Select Rock, Paper, or Scissors before the reveal timer counts down.',
      'Rock smashes Scissors; Scissors cut Paper; Paper covers Rock.',
      'Chain consecutive victories together to build an active winning streak.',
      'Toggle the optional Lizard-Spock mode for deep 5-way tactical variety.'
    ],
    controls: [
      { key: '1, 2, 3 Keys', action: 'Select Rock, Paper, or Scissors' },
      { key: 'Click / Tap', action: 'Direct touch selection' },
    ],
    route: '/games/rock-paper-scissors',
  },
  {
    id: 'whack-a-mole',
    title: 'Cyber Whack-a-Mole',
    tagline: 'Strike cyber-moles before they vanish in a rapid 30-second blitz.',
    description: 'Fast-paced arcade reflex test. Whack standard neon moles for +10 points, watch out for golden jackpot moles worth +25, and avoid radioactive trap bots that deduct your hard-earned points.',
    category: 'reflex',
    categoryLabel: 'Reflex',
    estimatedTime: '30 sec',
    controlsSummary: 'Click / Fast Tap',
    accentColor: '#EC4899',
    badge: 'Fast',
    scoreType: 'points',
    scoreLabel: 'Points',
    featured: true,
    popular: true,
    instructions: [
      'Hit Start to begin the 30-second countdown blitz.',
      'Tap or click moles immediately when they pop out of subterranean conduits.',
      'Standard Green Moles = +10 Points.',
      'Golden King Moles = +25 Points.',
      'Red Glitch Traps = -15 Points penalty.'
    ],
    controls: [
      { key: 'Left Click / Touch Tap', action: 'Whack surfacing target' },
      { key: 'Space', action: 'Start / Restart round' },
    ],
    route: '/games/whack-a-mole',
  },
  {
    id: 'reaction-time',
    title: 'Reaction Benchmark',
    tagline: 'Benchmark human visual reflex speed down to the millisecond.',
    description: 'Accurate neuro-reflex testing system. Wait through the randomized red staging screen until the display flashes vivid neon-lime, then click as fast as humanly possible. Computes an aggregate 5-trial average with gamer rank evaluation.',
    category: 'reflex',
    categoryLabel: 'Reflex',
    estimatedTime: '1-2 min',
    controlsSummary: 'Click / Tap Anywhere',
    accentColor: '#B7FF35',
    scoreType: 'ms',
    scoreLabel: 'Best Time',
    lowerScoreIsBetter: true,
    featured: true,
    popular: true,
    instructions: [
      'Click or tap anywhere on the test arena to begin the trial.',
      'The screen turns red: hold your readiness and do not click prematurely.',
      'When the screen turns NEON LIME, click as quickly as you can.',
      'Clicking while the screen is still red triggers a false-start penalty.',
      'Complete 5 trials to generate your official benchmark grade and average reaction latency.'
    ],
    controls: [
      { key: 'Click / Spacebar / Touch', action: 'Trigger reflex response' },
    ],
    route: '/games/reaction-time',
  },
  {
    id: 'typing-speed',
    title: 'Typing Speed Test',
    tagline: 'Measure words per minute and accuracy across gaming lore.',
    description: 'A crisp, responsive typing speed trainer. Measures real-time Words Per Minute (WPM), Characters Per Minute (CPM), and exact keystroke accuracy with instant visual feedback and smooth character tracking.',
    category: 'brain',
    categoryLabel: 'Brain & Skill',
    estimatedTime: '1 min',
    controlsSummary: 'Full Keyboard',
    accentColor: '#10B981',
    badge: 'Skill',
    scoreType: 'wpm',
    scoreLabel: 'WPM',
    featured: false,
    popular: true,
    instructions: [
      'Start typing the presented text snippet as soon as you are ready.',
      'The timer commences automatically upon your very first keystroke.',
      'Correctly typed characters illuminate in clean lime green; typos appear in red.',
      'Backspace allows correcting errors as you go.',
      'Upon passage completion, view your Net WPM, Raw WPM, and final Accuracy percentage.'
    ],
    controls: [
      { key: 'Keyboard Typing', action: 'Type indicated passage' },
      { key: 'Tab + Enter', action: 'Quick reset to new passage' },
    ],
    route: '/games/typing-speed',
  },
];
