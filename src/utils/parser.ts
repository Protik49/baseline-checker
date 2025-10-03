import { BaselineFeature, AnalysisResult } from '../types';
import { realBaselineData } from '../data/baseline';

export const analyzeCode = async (code: string): Promise<any> => {
  const features = parseCode(code, realBaselineData);

  // Determine language based on detected features
  let language = 'Mixed';
  const hasCSS = features.some(f => f.feature.startsWith('css-') || ['grid', 'flexbox', 'aspect-ratio'].includes(f.feature));
  const hasJS = features.some(f =>
    f.feature.startsWith('es') ||
    f.feature.includes('promise') ||
    f.feature.includes('async') ||
    ['fetch', 'map-set', 'array-methods'].includes(f.feature)
  );
  const hasHTML = features.some(f =>
    f.feature.startsWith('html') ||
    ['dialog', 'details', 'picture', 'canvas', 'svg'].includes(f.feature)
  );

  if (hasCSS && !hasJS && !hasHTML) language = 'CSS';
  else if (hasJS && !hasCSS && !hasHTML) language = 'JavaScript';
  else if (hasHTML && !hasCSS && !hasJS) language = 'HTML';
  else if (hasCSS && hasHTML && !hasJS) language = 'HTML + CSS';
  else if (hasJS && hasHTML && !hasCSS) language = 'HTML + JavaScript';

  return {
    language,
    features,
    summary: {
      total: features.length,
      baseline: features.filter(f => f.status === 'baseline').length,
      needsFallback: features.filter(f => f.status === 'needs-fallback').length,
      unknown: features.filter(f => f.status === 'unknown').length
    }
  };
};

export const parseCode = (code: string, baselineData: BaselineFeature): AnalysisResult[] => {
  const results: AnalysisResult[] = [];
  const foundFeatures = new Set<string>();

  // Enhanced CSS Features Detection
  const cssFeatures = {
    // Layout
    'grid': [/display\s*:\s*grid/gi, /grid-template/gi, /grid-area/gi, /grid-column/gi, /grid-row/gi, /grid-gap/gi, /gap\s*:/gi],
    'css-grid': [/display\s*:\s*grid/gi, /grid-template/gi, /grid-area/gi],
    'flexbox': [/display\s*:\s*flex/gi, /flex-direction/gi, /flex-wrap/gi, /justify-content/gi, /align-items/gi, /flex\s*:/gi],
    'css-flexbox': [/display\s*:\s*flex/gi, /flex-direction/gi, /justify-content/gi],
    'subgrid': [/grid-template.*subgrid/gi, /subgrid/gi],
    'css-subgrid': [/subgrid/gi],
    
    // Modern CSS Properties
    'aspect-ratio': [/aspect-ratio\s*:/gi],
    'backdrop-filter': [/backdrop-filter\s*:/gi],
    'css-backdrop-filter': [/backdrop-filter\s*:/gi],
    'css-custom-properties': [/--[\w-]+\s*:/gi, /var\s*\(/gi],
    'css-variables': [/--[\w-]+\s*:/gi, /var\s*\(/gi],
    'css-calc': [/calc\s*\(/gi],
    'css-transforms': [/transform\s*:/gi, /rotate\s*\(/gi, /scale\s*\(/gi, /translate\s*\(/gi],
    'css-transitions': [/transition\s*:/gi, /transition-property/gi, /transition-duration/gi],
    'css-animations': [/@keyframes/gi, /animation\s*:/gi, /animation-name/gi],
    'css-gradients': [/linear-gradient/gi, /radial-gradient/gi, /conic-gradient/gi],
    'css-filter': [/filter\s*:/gi, /blur\s*\(/gi, /brightness\s*\(/gi, /contrast\s*\(/gi],
    'css-clip-path': [/clip-path\s*:/gi],
    'css-object-fit': [/object-fit\s*:/gi],
    'css-object-position': [/object-position\s*:/gi],
    
    // Layout and Positioning
    'css-sticky': [/position\s*:\s*sticky/gi],
    'css-position-sticky': [/position\s*:\s*sticky/gi],
    'css-logical-properties': [/margin-inline/gi, /padding-block/gi, /border-inline/gi, /inset-inline/gi],
    'css-writing-mode': [/writing-mode\s*:/gi],
    'css-text-orientation': [/text-orientation\s*:/gi],
    
    // Modern CSS Features (Limited Baseline)
    'css-cascade-layers': [/@layer/gi, /layer\s*\(/gi],
    'css-container-queries': [/@container/gi, /container-type/gi, /container-name/gi, /container\s*:/gi],
    'css-has': [/:has\s*\(/gi],
    'css-nesting': [/&\s*[.:#\[]/gi, /&\s*{/gi],
    'css-color-mix': [/color-mix\s*\(/gi],
    'css-relative-color-syntax': [/from\s+\w+/gi],
    'css-wide-gamut-colors': [/color\s*\(\s*display-p3/gi, /color\s*\(\s*rec2020/gi],
    
    // Scroll and Interaction
    'css-scroll-behavior': [/scroll-behavior\s*:/gi],
    'css-overscroll-behavior': [/overscroll-behavior/gi],
    'css-scroll-snap': [/scroll-snap/gi],
    'css-scroll-timeline': [/scroll-timeline/gi, /@scroll-timeline/gi],
    'css-view-timeline': [/view-timeline/gi, /@view-timeline/gi],
    'css-animation-timeline': [/animation-timeline/gi],
    
    // Typography
    'css-font-display': [/font-display\s*:/gi],
    'css-font-feature-settings': [/font-feature-settings/gi],
    'css-font-variation-settings': [/font-variation-settings/gi],
    
    // Color and Appearance
    'css-color-scheme': [/color-scheme\s*:/gi],
    'css-forced-color-adjust': [/forced-color-adjust/gi],
    'css-light-dark': [/light-dark\s*\(/gi],
    
    // Media Queries
    'prefers-color-scheme': [/@media.*prefers-color-scheme/gi],
    'prefers-reduced-motion': [/@media.*prefers-reduced-motion/gi],
    'prefers-contrast': [/@media.*prefers-contrast/gi],
    'prefers-reduced-transparency': [/@media.*prefers-reduced-transparency/gi],
    
    // Units and Functions
    'css-viewport-units': [/\d+vh/gi, /\d+vw/gi, /\d+vmin/gi, /\d+vmax/gi, /\d+vi/gi, /\d+vb/gi],
    'css-rem-units': [/\d+rem/gi],
    'css-ch-units': [/\d+ch/gi],
    'css-ex-units': [/\d+ex/gi],
    
    // Selectors
    'css-nth-child': [/:nth-child\s*\(/gi, /:nth-last-child\s*\(/gi, /:nth-of-type\s*\(/gi],
    'css-not-selector': [/:not\s*\(/gi],
    'css-attribute-selectors': [/\[[\w-]+[\*\^\$\|~]?=/gi],
    'css-pseudo-elements': [/::before/gi, /::after/gi, /::first-line/gi, /::first-letter/gi],
    'css-pseudo-classes': [/:hover/gi, /:focus/gi, /:active/gi, /:visited/gi, /:target/gi],
    
    // Advanced Features
    'css-anchor-positioning': [/anchor\s*\(/gi, /position-anchor/gi],
    'css-view-transitions': [/view-transition/gi, /::view-transition/gi],
    'css-scope': [/@scope/gi],
    'css-starting-style': [/@starting-style/gi],
    'css-field-sizing': [/field-sizing\s*:/gi],
  };

  // Enhanced HTML Features Detection
  const htmlFeatures = {
    'dialog': [/<dialog/gi, /HTMLDialogElement/gi, /showModal\s*\(/gi, /\.close\s*\(/gi],
    'details': [/<details/gi, /<summary/gi],
    'summary': [/<summary/gi],
    'picture': [/<picture/gi, /<source/gi],
    'track': [/<track/gi],
    'progress': [/<progress/gi],
    'meter': [/<meter/gi],
    'output': [/<output/gi],
    'datalist': [/<datalist/gi, /list\s*=/gi],
    'web-components': [/customElements/gi, /attachShadow/gi, /custom-element/gi, /customElements\.define/gi, /<[\w-]+-[\w-]+/gi],
    'shadow-dom': [/attachShadow/gi, /shadowRoot/gi],
    'custom-elements': [/customElements\.define/gi, /HTMLElement/gi],
    'template': [/<template/gi],
    'slot': [/<slot/gi, /slot\s*=/gi],
    'canvas': [/<canvas/gi, /getContext\s*\(/gi],
    'svg': [/<svg/gi, /<path/gi, /<circle/gi, /<rect/gi],
    'video': [/<video/gi],
    'audio': [/<audio/gi],
    'source': [/<source/gi],
    'srcset': [/srcset\s*=/gi],
    'sizes': [/sizes\s*=/gi],
    'loading': [/loading\s*=\s*["']lazy["']/gi],
    'lazy-loading': [/loading\s*=\s*["']lazy["']/gi],
    'preload': [/rel\s*=\s*["']preload["']/gi],
    'prefetch': [/rel\s*=\s*["']prefetch["']/gi],
    'preconnect': [/rel\s*=\s*["']preconnect["']/gi],
    'dns-prefetch': [/rel\s*=\s*["']dns-prefetch["']/gi],
    'modulepreload': [/rel\s*=\s*["']modulepreload["']/gi],
  };

  // Enhanced JavaScript Features Detection
  const jsFeatures = {
    // Network APIs
    'fetch': [/fetch\s*\(/gi, /new\s+Request/gi, /new\s+Response/gi],
    'websockets': [/new\s+WebSocket/gi, /WebSocket\s*\(/gi],
    'eventsource': [/new\s+EventSource/gi, /EventSource\s*\(/gi],
    'server-sent-events': [/new\s+EventSource/gi],
    'xhr': [/new\s+XMLHttpRequest/gi, /XMLHttpRequest\s*\(/gi],
    
    // Modern JavaScript Syntax
    'es-modules': [/import\s+/gi, /export\s+/gi, /from\s+['"]/gi],
    'dynamic-import': [/import\s*\(/gi],
    'import-meta': [/import\.meta/gi],
    'top-level-await': [/await\s+(?!.*function)/gi],
    'async-await': [/async\s+function/gi, /async\s*\(/gi, /await\s+/gi],
    'arrow-functions': [/=>\s*{/gi, /=>\s*[^{]/gi],
    'template-literals': [/`[^`]*\${[^}]*}[^`]*`/gi, /`[^`]*`/gi],
    'destructuring': [/{\s*[\w,\s]+}\s*=/gi, /\[\s*[\w,\s]+\]\s*=/gi],
    'spread-operator': [/\.\.\./gi],
    'rest-parameters': [/\.\.\.\w+\s*[,\)]/gi],
    'default-parameters': [/\w+\s*=\s*[^,\)]+\s*[,\)]/gi],
    'const-let': [/\bconst\s+/gi, /\blet\s+/gi],
    'classes': [/\bclass\s+\w+/gi, /extends\s+\w+/gi],
    'for-of': [/for\s*\(\s*[\w\s]+\s+of\s+/gi],
    
    // Objects and Collections
    'map-set': [/new\s+Map/gi, /new\s+Set/gi, /Map\s*\(/gi, /Set\s*\(/gi],
    'weak-map-set': [/new\s+WeakMap/gi, /new\s+WeakSet/gi],
    'symbols': [/Symbol\s*\(/gi, /Symbol\./gi],
    'proxy': [/new\s+Proxy/gi, /Proxy\s*\(/gi],
    'reflect': [/Reflect\./gi],
    'object-assign': [/Object\.assign/gi],
    'object-entries': [/Object\.entries/gi],
    'object-values': [/Object\.values/gi],
    'object-keys': [/Object\.keys/gi],
    'object-hasown': [/Object\.hasOwn/gi],
    
    // Arrays and Iteration
    'array-methods': [/\.map\s*\(/gi, /\.filter\s*\(/gi, /\.reduce\s*\(/gi, /\.find\s*\(/gi, /\.forEach\s*\(/gi],
    'array-flat': [/\.flat\s*\(/gi, /\.flatMap\s*\(/gi],
    'array-at': [/\.at\s*\(/gi],
    'generators': [/function\s*\*/gi, /yield\s+/gi],
    'iterators': [/Symbol\.iterator/gi, /\[Symbol\.iterator\]/gi],

    // Promises and Async
    'promise': [/new\s+Promise/gi, /Promise\./gi, /\.then\s*\(/gi, /\.catch\s*\(/gi, /\.finally\s*\(/gi],
    'promise-allsettled': [/Promise\.allSettled/gi],
    'promise-any': [/Promise\.any/gi],
    'abort-controller': [/new\s+AbortController/gi, /AbortController\s*\(/gi],
    'abort-signal': [/AbortSignal/gi, /signal\s*:/gi],
    
    // Modern APIs
    'intersection-observer': [/new\s+IntersectionObserver/gi, /IntersectionObserver\s*\(/gi],
    'resize-observer': [/new\s+ResizeObserver/gi, /ResizeObserver\s*\(/gi],
    'mutation-observer': [/new\s+MutationObserver/gi, /MutationObserver\s*\(/gi],
    'performance-observer': [/new\s+PerformanceObserver/gi, /PerformanceObserver\s*\(/gi],
    'broadcast-channel': [/new\s+BroadcastChannel/gi, /BroadcastChannel\s*\(/gi],
    'message-channel': [/new\s+MessageChannel/gi, /MessageChannel\s*\(/gi],
    
    // Storage APIs
    'indexeddb': [/indexedDB/gi, /IDBDatabase/gi, /IDBTransaction/gi],
    'localstorage': [/localStorage/gi],
    'sessionstorage': [/sessionStorage/gi],
    
    // Web Workers and Service Workers
    'web-workers': [/new\s+Worker/gi, /Worker\s*\(/gi],
    'shared-worker': [/new\s+SharedWorker/gi, /SharedWorker\s*\(/gi],
    'service-worker': [/navigator\.serviceWorker/gi, /ServiceWorker/gi],
    
    // Graphics and Media
    'canvas': [/getContext\s*\(\s*['"]2d['"]|getContext\s*\(\s*['"]webgl['"]|getContext\s*\(\s*['"]webgl2['"]]/gi],
    'webgl': [/getContext\s*\(\s*['"]webgl['"]|getContext\s*\(\s*['"]experimental-webgl['"]]/gi],
    'webgl2': [/getContext\s*\(\s*['"]webgl2['"]]/gi],
    'web-audio': [/new\s+AudioContext/gi, /AudioContext\s*\(/gi, /webkitAudioContext/gi],
    
    // Device APIs
    'geolocation': [/navigator\.geolocation/gi, /getCurrentPosition/gi],
    'device-orientation': [/DeviceOrientationEvent/gi, /deviceorientation/gi],
    'device-motion': [/DeviceMotionEvent/gi, /devicemotion/gi],
    'vibration': [/navigator\.vibrate/gi],
    'battery-status': [/navigator\.getBattery/gi, /BatteryManager/gi],
    'network-information': [/navigator\.connection/gi, /NetworkInformation/gi],
    
    // Permissions and Security
    'permissions': [/navigator\.permissions/gi, /Permissions/gi],
    'notifications': [/new\s+Notification/gi, /Notification\./gi],
    'push-notifications': [/PushManager/gi, /PushSubscription/gi],
    'credential-management': [/navigator\.credentials/gi, /CredentialsContainer/gi],
    'web-authn': [/navigator\.credentials\.create/gi, /PublicKeyCredential/gi],
    
    // File and Data APIs
    'file-api': [/new\s+File/gi, /File\s*\(/gi, /FileList/gi],
    'filereader': [/new\s+FileReader/gi, /FileReader\s*\(/gi],
    'blob': [/new\s+Blob/gi, /Blob\s*\(/gi],
    'formdata': [/new\s+FormData/gi, /FormData\s*\(/gi],
    'url-api': [/new\s+URL/gi, /URL\s*\(/gi],
    'urlsearchparams': [/new\s+URLSearchParams/gi, /URLSearchParams\s*\(/gi],
    
    // Streams
    'streams': [/ReadableStream/gi, /WritableStream/gi, /TransformStream/gi],
    'readable-stream': [/new\s+ReadableStream/gi, /ReadableStream\s*\(/gi],
    'writable-stream': [/new\s+WritableStream/gi, /WritableStream\s*\(/gi],
    'transform-stream': [/new\s+TransformStream/gi, /TransformStream\s*\(/gi],
    
    // Encoding and Crypto
    'text-encoder': [/new\s+TextEncoder/gi, /TextEncoder\s*\(/gi],
    'text-decoder': [/new\s+TextDecoder/gi, /TextDecoder\s*\(/gi],
    'crypto-api': [/crypto\./gi, /window\.crypto/gi],
    'crypto-subtle': [/crypto\.subtle/gi, /SubtleCrypto/gi],
    
    // Internationalization
    'intl': [/Intl\./gi],
    'intl-collator': [/Intl\.Collator/gi],
    'intl-datetimeformat': [/Intl\.DateTimeFormat/gi],
    'intl-numberformat': [/Intl\.NumberFormat/gi],
    'intl-pluralrules': [/Intl\.PluralRules/gi],
    'intl-relativetimeformat': [/Intl\.RelativeTimeFormat/gi],
    'intl-listformat': [/Intl\.ListFormat/gi],
    'intl-locale': [/Intl\.Locale/gi],
    'intl-displaynames': [/Intl\.DisplayNames/gi],
    'intl-segmenter': [/Intl\.Segmenter/gi],

    // ES2015+ Features
    'weak-refs': [/new\s+WeakRef/gi, /WeakRef\s*\(/gi],
    'finalization-registry': [/new\s+FinalizationRegistry/gi, /FinalizationRegistry\s*\(/gi],
    
    // Recent JavaScript Features
    'bigint': [/\d+n\b/gi, /BigInt\s*\(/gi],
    'nullish-coalescing': [/\?\?/gi],
    'optional-chaining': [/\?\./gi],
    'logical-assignment': [/\|\|=/gi, /&&=/gi, /\?\?=/gi],
    'numeric-separators': [/\d+_\d+/gi],
    'private-fields': [/#\w+/gi],
    'private-methods': [/#\w+\s*\(/gi],
    'static-blocks': [/static\s*{/gi],
    'class-static-initialization-blocks': [/static\s*{/gi],
    
    // Import Features
    'import-maps': [/importmap/gi, /"imports"\s*:/gi],
    'import-assertions': [/import\s+.*assert\s*{/gi],
    'import-attributes': [/import\s+.*with\s*{/gi],
    'json-modules': [/import\s+.*\.json/gi],
    
    // Web Platform APIs
    'page-visibility': [/document\.visibilityState/gi, /visibilitychange/gi],
    'fullscreen': [/requestFullscreen/gi, /exitFullscreen/gi, /fullscreenElement/gi],
    'pointer-lock': [/requestPointerLock/gi, /exitPointerLock/gi],
    'screen-orientation': [/screen\.orientation/gi, /orientationchange/gi],
    'history-api': [/history\.pushState/gi, /history\.replaceState/gi, /popstate/gi],
    'structured-clone': [/structuredClone\s*\(/gi],
  };

  // HTML Input Types and Form Features
  const formFeatures = {
    'input-email': [/type\s*=\s*["']email["']/gi],
    'input-url': [/type\s*=\s*["']url["']/gi],
    'input-tel': [/type\s*=\s*["']tel["']/gi],
    'input-search': [/type\s*=\s*["']search["']/gi],
    'input-number': [/type\s*=\s*["']number["']/gi],
    'input-range': [/type\s*=\s*["']range["']/gi],
    'input-color': [/type\s*=\s*["']color["']/gi],
    'input-date': [/type\s*=\s*["']date["']/gi],
    'input-datetime-local': [/type\s*=\s*["']datetime-local["']/gi],
    'input-month': [/type\s*=\s*["']month["']/gi],
    'input-week': [/type\s*=\s*["']week["']/gi],
    'input-time': [/type\s*=\s*["']time["']/gi],
    'input-file': [/type\s*=\s*["']file["']/gi],
    'input-multiple': [/multiple/gi],
    'input-pattern': [/pattern\s*=/gi],
    'input-placeholder': [/placeholder\s*=/gi],
    'input-required': [/required/gi],
    'input-autofocus': [/autofocus/gi],
    'input-autocomplete': [/autocomplete\s*=/gi],
    'form-validation': [/checkValidity\s*\(/gi, /reportValidity\s*\(/gi, /setCustomValidity\s*\(/gi],
  };

  const allFeatures = { ...cssFeatures, ...htmlFeatures, ...jsFeatures, ...formFeatures };

  // Check each feature against the code
  Object.entries(allFeatures).forEach(([feature, patterns]) => {
    const found = patterns.some(pattern => pattern.test(code));
    if (found && !foundFeatures.has(feature)) {
      foundFeatures.add(feature);
      const baselineStatus = baselineData[feature];
      let status: 'baseline' | 'needs-fallback' | 'unknown';
      
      if (baselineStatus === true) {
        status = 'baseline';
      } else if (baselineStatus === false) {
        status = 'needs-fallback';
      } else {
        status = 'unknown';
      }
      
      results.push({
        feature,
        status,
        found: true
      });
    }
  });

  // Sort results by status priority and then alphabetically
  return results.sort((a, b) => {
    const statusOrder = { 'baseline': 0, 'needs-fallback': 1, 'unknown': 2 };
    const statusDiff = statusOrder[a.status] - statusOrder[b.status];
    if (statusDiff !== 0) return statusDiff;
    return a.feature.localeCompare(b.feature);
  });
};

export const exportToJSON = (analysisResponse: any): string => {
  const exportData = {
    timestamp: new Date().toISOString(),
    language: analysisResponse.language,
    summary: analysisResponse.summary,
    features: analysisResponse.features.map((r: AnalysisResult) => ({
      feature: r.feature,
      status: r.status,
      found: r.found
    }))
  };
  return JSON.stringify(exportData, null, 2);
};

export const exportToMarkdown = (analysisResponse: any): string => {
  let markdown = '# Baseline Report\n\n';
  markdown += `*Generated on ${new Date().toLocaleString()}*\n\n`;
  markdown += `**Language:** ${analysisResponse.language}\n\n`;

  const results = analysisResponse.features;

  if (results.length === 0) {
    markdown += 'No features detected in the provided code.\n';
    return markdown;
  }

  const statusEmoji = {
    'baseline': '✅',
    'needs-fallback': '⚠️',
    'unknown': '❓'
  };

  const statusText = {
    'baseline': 'Baseline',
    'needs-fallback': 'Needs Fallback',
    'unknown': 'Unknown'
  };

  // Summary
  const baselineCount = results.filter(r => r.status === 'baseline').length;
  const fallbackCount = results.filter(r => r.status === 'needs-fallback').length;
  const unknownCount = results.filter(r => r.status === 'unknown').length;

  markdown += `## Summary\n\n`;
  markdown += `- **Total Features Detected:** ${results.length}\n`;
  markdown += `- **✅ Baseline:** ${baselineCount}\n`;
  markdown += `- **⚠️ Needs Fallback:** ${fallbackCount}\n`;
  markdown += `- **❓ Unknown:** ${unknownCount}\n\n`;

  // Detailed Results
  markdown += `## Detailed Results\n\n`;
  
  const groupedResults = {
    'baseline': results.filter(r => r.status === 'baseline'),
    'needs-fallback': results.filter(r => r.status === 'needs-fallback'),
    'unknown': results.filter(r => r.status === 'unknown')
  };

  Object.entries(groupedResults).forEach(([status, features]) => {
    if (features.length > 0) {
      const emoji = statusEmoji[status as keyof typeof statusEmoji];
      const text = statusText[status as keyof typeof statusText];
      markdown += `### ${emoji} ${text} (${features.length})\n\n`;
      
      features.forEach(result => {
        markdown += `- **${result.feature}**\n`;
      });
      markdown += '\n';
    }
  });

  markdown += `---\n\n`;
  markdown += `*Report generated by Baseline Paste & Check*\n`;
  markdown += `*Made for Baseline Tooling Hackathon 2025*\n`;
  
  return markdown;
};