// ═══════════════════════════════════════════════════════════
// Word Pools — Curated word lists for typing
// ═══════════════════════════════════════════════════════════

export const WORD_POOLS = {
  /** Common English words (tiered by difficulty) */
  common: [
    // 3-letter
    'the', 'and', 'for', 'are', 'but', 'not', 'you', 'all', 'can', 'had',
    'her', 'was', 'one', 'our', 'out', 'day', 'get', 'has', 'him', 'his',
    'how', 'its', 'let', 'may', 'new', 'now', 'old', 'see', 'way', 'who',
    'boy', 'did', 'end', 'far', 'big', 'run', 'set', 'top', 'use', 'air',
    // 4-letter
    'that', 'with', 'have', 'this', 'will', 'your', 'from', 'they', 'been',
    'call', 'come', 'each', 'find', 'give', 'good', 'help', 'here', 'just',
    'know', 'last', 'life', 'like', 'long', 'look', 'make', 'many', 'more',
    'most', 'much', 'must', 'name', 'only', 'over', 'part', 'said', 'same',
    'take', 'tell', 'than', 'them', 'then', 'time', 'turn', 'upon', 'very',
    'want', 'well', 'went', 'what', 'when', 'wide', 'work', 'year', 'blue',
    // 5-letter
    'about', 'after', 'again', 'being', 'below', 'build', 'could', 'every',
    'first', 'found', 'great', 'house', 'large', 'learn', 'never', 'night',
    'other', 'place', 'plant', 'point', 'right', 'small', 'sound', 'spell',
    'still', 'study', 'their', 'there', 'these', 'thing', 'think', 'three',
    'under', 'water', 'where', 'which', 'world', 'would', 'write', 'young',
    'brain', 'dream', 'flame', 'ghost', 'heart', 'light', 'magic', 'power',
    // 6-letter
    'always', 'around', 'before', 'change', 'differ', 'follow', 'letter',
    'mother', 'number', 'people', 'should', 'answer', 'better', 'change',
    'create', 'design', 'engine', 'future', 'golden', 'happen', 'island',
    'jungle', 'knight', 'launch', 'market', 'nature', 'object', 'planet',
    'random', 'screen', 'secret', 'shadow', 'signal', 'silver', 'simple',
    'spirit', 'stream', 'system', 'target', 'theory', 'travel', 'unique',
    // 7-letter
    'another', 'because', 'between', 'country', 'example', 'general',
    'history', 'however', 'include', 'instant', 'already', 'balance',
    'capture', 'command', 'complex', 'connect', 'current', 'defense',
    'digital', 'element', 'endless', 'explore', 'factory', 'graphic',
    'imagine', 'journey', 'kingdom', 'message', 'mission', 'mystery',
    'network', 'pattern', 'problem', 'program', 'project', 'quality',
    'reality', 'request', 'service', 'special', 'support', 'surface',
    // 8+ letter
    'absolute', 'business', 'children', 'complete', 'continue', 'critical',
    'database', 'decision', 'discover', 'document', 'dynamics', 'elephant',
    'feedback', 'generate', 'guardian', 'hardware', 'immortal', 'keyboard',
    'language', 'material', 'movement', 'national', 'personal', 'platform',
    'position', 'powerful', 'practice', 'presence', 'question', 'resource',
    'response', 'security', 'software', 'solution', 'standard', 'strategy',
    'strength', 'surprise', 'thousand', 'together', 'treasure', 'ultimate',
    'universe', 'velocity', 'whatever', 'yourself', 'mountain', 'paradise',
    'adventure', 'algorithm', 'beautiful', 'character', 'challenge', 'dangerous',
    'education', 'evolution', 'framework', 'highlight', 'important', 'knowledge',
    'legendary', 'narrative', 'operation', 'processor', 'reference', 'structure',
    'transform', 'wonderful', 'animation', 'architect', 'brilliant', 'conductor',
  ],

  /** Programming keywords & terms (differentiator for dev portfolio) */
  programming: [
    // Short (3-4)
    'var', 'let', 'int', 'for', 'map', 'set', 'get', 'new', 'try', 'api',
    'css', 'sql', 'git', 'npm', 'tsx', 'jsx', 'dom', 'cli', 'ssh', 'pub',
    'null', 'void', 'bool', 'enum', 'func', 'type', 'else', 'case', 'true',
    'goto', 'this', 'self', 'from', 'with', 'then', 'each', 'push', 'pull',
    // Medium (5-7)
    'async', 'await', 'const', 'class', 'super', 'yield', 'throw', 'catch',
    'fetch', 'array', 'float', 'union', 'props', 'state', 'hooks', 'query',
    'route', 'mutex', 'stack', 'queue', 'graph', 'debug', 'build', 'merge',
    'patch', 'parse', 'token', 'scope', 'trait', 'index', 'match', 'slice',
    'return', 'import', 'export', 'static', 'switch', 'delete', 'string',
    'number', 'object', 'symbol', 'module', 'render', 'effect', 'filter',
    'reduce', 'stream', 'socket', 'cursor', 'schema', 'deploy', 'docker',
    'lambda', 'server', 'client', 'router', 'buffer', 'kernel', 'thread',
    // Long (8+)
    'function', 'template', 'abstract', 'callback', 'compiler', 'database',
    'debugger', 'endpoint', 'frontend', 'generate', 'hardware', 'instance',
    'iterator', 'pipeline', 'platform', 'polymorphism', 'protocol', 'reactive',
    'refactor', 'registry', 'resolver', 'runtime', 'selector', 'serialize',
    'singleton', 'snapshot', 'terminal', 'variable', 'viewport', 'websocket',
    'algorithm', 'analytics', 'architect', 'benchmark', 'component', 'container',
    'decorator', 'exception', 'framework', 'generator', 'immutable', 'interface',
    'lifecycle', 'middleware', 'namespace', 'normalize', 'operation', 'parameter',
    'partition', 'primitive', 'recursion', 'rendering', 'restoring', 'scheduler',
    'substring', 'template', 'transform', 'typescript', 'undefined', 'validator',
    'kubernetes', 'observable', 'repository', 'dependency', 'encryption', 'microservice',
    'postgresql', 'javascript', 'responsive', 'deployment', 'continuous', 'integration',
  ],

  /** Boss words — long phrases */
  boss: [
    'tower defense',
    'rapid keystrokes',
    'maximum velocity',
    'ultimate power',
    'system override',
    'full stack dev',
    'code review time',
    'deploy to cloud',
    'merge conflicts',
    'pull request ok',
    'database backup',
    'server response',
    'async functions',
    'type safe guard',
    'error boundary',
    'state management',
    'virtual machine',
    'neural network',
    'machine learning',
    'quantum computer',
  ],
} as const;
