// Documentation URL mapping for web platform features
export const getDocumentationUrl = (feature: string): string | null => {
  // MDN Web Docs base URL
  const mdnBase = 'https://developer.mozilla.org/en-US/docs/Web/';
  
  // Can I Use base URL
  const caniuseBase = 'https://caniuse.com/';
  
  // Feature to documentation URL mapping
  const featureMap: Record<string, string> = {
    // CSS Features
    'grid': `${mdnBase}CSS/CSS_Grid_Layout`,
    'css-grid': `${mdnBase}CSS/CSS_Grid_Layout`,
    'flexbox': `${mdnBase}CSS/CSS_Flexible_Box_Layout`,
    'css-flexbox': `${mdnBase}CSS/CSS_Flexible_Box_Layout`,
    'css-custom-properties': `${mdnBase}CSS/--*`,
    'css-variables': `${mdnBase}CSS/var()`,
    'css-transforms': `${mdnBase}CSS/transform`,
    'css-transitions': `${mdnBase}CSS/CSS_Transitions`,
    'css-animations': `${mdnBase}CSS/CSS_Animations`,
    'css-gradients': `${mdnBase}CSS/CSS_Images/Using_CSS_gradients`,
    'css-calc': `${mdnBase}CSS/calc()`,
    'css-filter': `${mdnBase}CSS/filter`,
    'css-backdrop-filter': `${mdnBase}CSS/backdrop-filter`,
    'css-clip-path': `${mdnBase}CSS/clip-path`,
    'css-object-fit': `${mdnBase}CSS/object-fit`,
    'css-object-position': `${mdnBase}CSS/object-position`,
    'css-sticky': `${mdnBase}CSS/position#sticky`,
    'css-position-sticky': `${mdnBase}CSS/position#sticky`,
    'css-logical-properties': `${mdnBase}CSS/CSS_Logical_Properties`,
    'css-writing-mode': `${mdnBase}CSS/writing-mode`,
    'css-text-orientation': `${mdnBase}CSS/text-orientation`,
    'css-font-display': `${mdnBase}CSS/@font-face/font-display`,
    'css-font-feature-settings': `${mdnBase}CSS/font-feature-settings`,
    'css-font-variation-settings': `${mdnBase}CSS/font-variation-settings`,
    'css-color-mix': `${mdnBase}CSS/color_value/color-mix()`,
    'css-color-scheme': `${mdnBase}CSS/color-scheme`,
    'css-cascade-layers': `${mdnBase}CSS/@layer`,
    'css-container-queries': `${mdnBase}CSS/CSS_Container_Queries`,
    'css-has': `${mdnBase}CSS/:has`,
    'css-nesting': `${mdnBase}CSS/CSS_Nesting`,
    'css-subgrid': `${mdnBase}CSS/CSS_Grid_Layout/Subgrid`,
    'css-scroll-behavior': `${mdnBase}CSS/scroll-behavior`,
    'css-overscroll-behavior': `${mdnBase}CSS/overscroll-behavior`,
    'css-scroll-snap': `${mdnBase}CSS/CSS_Scroll_Snap`,
    'css-viewport-units': `${mdnBase}CSS/length#viewport-percentage_lengths`,
    'css-rem-units': `${mdnBase}CSS/length#rem`,
    'css-nth-child': `${mdnBase}CSS/:nth-child`,
    'css-not-selector': `${mdnBase}CSS/:not`,
    'css-attribute-selectors': `${mdnBase}CSS/Attribute_selectors`,
    'css-pseudo-elements': `${mdnBase}CSS/Pseudo-elements`,
    'css-pseudo-classes': `${mdnBase}CSS/Pseudo-classes`,
    'aspect-ratio': `${mdnBase}CSS/aspect-ratio`,
    'prefers-color-scheme': `${mdnBase}CSS/@media/prefers-color-scheme`,
    'prefers-reduced-motion': `${mdnBase}CSS/@media/prefers-reduced-motion`,
    'prefers-contrast': `${mdnBase}CSS/@media/prefers-contrast`,
    
    // HTML Features
    'dialog': `${mdnBase}HTML/Element/dialog`,
    'details': `${mdnBase}HTML/Element/details`,
    'summary': `${mdnBase}HTML/Element/summary`,
    'picture': `${mdnBase}HTML/Element/picture`,
    'track': `${mdnBase}HTML/Element/track`,
    'progress': `${mdnBase}HTML/Element/progress`,
    'meter': `${mdnBase}HTML/Element/meter`,
    'output': `${mdnBase}HTML/Element/output`,
    'datalist': `${mdnBase}HTML/Element/datalist`,
    'web-components': `${mdnBase}Web_Components`,
    'shadow-dom': `${mdnBase}Web_Components/Using_shadow_DOM`,
    'custom-elements': `${mdnBase}Web_Components/Using_custom_elements`,
    'template': `${mdnBase}HTML/Element/template`,
    'slot': `${mdnBase}HTML/Element/slot`,
    'canvas': `${mdnBase}HTML/Element/canvas`,
    'svg': `${mdnBase}SVG`,
    'video': `${mdnBase}HTML/Element/video`,
    'audio': `${mdnBase}HTML/Element/audio`,
    'source': `${mdnBase}HTML/Element/source`,
    'srcset': `${mdnBase}HTML/Element/img#attr-srcset`,
    'sizes': `${mdnBase}HTML/Element/img#attr-sizes`,
    'loading': `${mdnBase}HTML/Element/img#attr-loading`,
    'lazy-loading': `${mdnBase}HTML/Element/img#attr-loading`,
    
    // Form Features
    'input-email': `${mdnBase}HTML/Element/input/email`,
    'input-url': `${mdnBase}HTML/Element/input/url`,
    'input-tel': `${mdnBase}HTML/Element/input/tel`,
    'input-search': `${mdnBase}HTML/Element/input/search`,
    'input-number': `${mdnBase}HTML/Element/input/number`,
    'input-range': `${mdnBase}HTML/Element/input/range`,
    'input-color': `${mdnBase}HTML/Element/input/color`,
    'input-date': `${mdnBase}HTML/Element/input/date`,
    'input-datetime-local': `${mdnBase}HTML/Element/input/datetime-local`,
    'input-month': `${mdnBase}HTML/Element/input/month`,
    'input-week': `${mdnBase}HTML/Element/input/week`,
    'input-time': `${mdnBase}HTML/Element/input/time`,
    'input-file': `${mdnBase}HTML/Element/input/file`,
    'input-multiple': `${mdnBase}HTML/Element/input#attr-multiple`,
    'input-pattern': `${mdnBase}HTML/Element/input#attr-pattern`,
    'input-placeholder': `${mdnBase}HTML/Element/input#attr-placeholder`,
    'input-required': `${mdnBase}HTML/Element/input#attr-required`,
    'input-autofocus': `${mdnBase}HTML/Element/input#attr-autofocus`,
    'input-autocomplete': `${mdnBase}HTML/Element/input#attr-autocomplete`,
    'form-validation': `${mdnBase}API/Constraint_validation`,
    
    // JavaScript Features
    'fetch': `${mdnBase}API/Fetch_API`,
    'websockets': `${mdnBase}API/WebSockets_API`,
    'eventsource': `${mdnBase}API/EventSource`,
    'server-sent-events': `${mdnBase}API/Server-sent_events`,
    'xhr': `${mdnBase}API/XMLHttpRequest`,
    'es-modules': `${mdnBase}JavaScript/Guide/Modules`,
    'dynamic-import': `${mdnBase}JavaScript/Reference/Operators/import`,
    'import-meta': `${mdnBase}JavaScript/Reference/Operators/import.meta`,
    'top-level-await': `${mdnBase}JavaScript/Reference/Operators/await#top_level_await`,
    'async-await': `${mdnBase}JavaScript/Reference/Statements/async_function`,
    'arrow-functions': `${mdnBase}JavaScript/Reference/Functions/Arrow_functions`,
    'template-literals': `${mdnBase}JavaScript/Reference/Template_literals`,
    'destructuring': `${mdnBase}JavaScript/Reference/Operators/Destructuring_assignment`,
    'spread-operator': `${mdnBase}JavaScript/Reference/Operators/Spread_syntax`,
    'rest-parameters': `${mdnBase}JavaScript/Reference/Functions/rest_parameters`,
    'default-parameters': `${mdnBase}JavaScript/Reference/Functions/Default_parameters`,
    'const-let': `${mdnBase}JavaScript/Reference/Statements/const`,
    'classes': `${mdnBase}JavaScript/Reference/Classes`,
    'for-of': `${mdnBase}JavaScript/Reference/Statements/for...of`,
    'map-set': `${mdnBase}JavaScript/Reference/Global_Objects/Map`,
    'weak-map-set': `${mdnBase}JavaScript/Reference/Global_Objects/WeakMap`,
    'symbols': `${mdnBase}JavaScript/Reference/Global_Objects/Symbol`,
    'proxy': `${mdnBase}JavaScript/Reference/Global_Objects/Proxy`,
    'reflect': `${mdnBase}JavaScript/Reference/Global_Objects/Reflect`,
    'object-assign': `${mdnBase}JavaScript/Reference/Global_Objects/Object/assign`,
    'object-entries': `${mdnBase}JavaScript/Reference/Global_Objects/Object/entries`,
    'object-values': `${mdnBase}JavaScript/Reference/Global_Objects/Object/values`,
    'object-keys': `${mdnBase}JavaScript/Reference/Global_Objects/Object/keys`,
    'object-hasown': `${mdnBase}JavaScript/Reference/Global_Objects/Object/hasOwn`,
    'array-methods': `${mdnBase}JavaScript/Reference/Global_Objects/Array`,
    'array-flat': `${mdnBase}JavaScript/Reference/Global_Objects/Array/flat`,
    'array-at': `${mdnBase}JavaScript/Reference/Global_Objects/Array/at`,
    'generators': `${mdnBase}JavaScript/Reference/Global_Objects/Generator`,
    'iterators': `${mdnBase}JavaScript/Reference/Iteration_protocols`,
    'promise': `${mdnBase}JavaScript/Reference/Global_Objects/Promise`,
    'promise-allsettled': `${mdnBase}JavaScript/Reference/Global_Objects/Promise/allSettled`,
    'promise-any': `${mdnBase}JavaScript/Reference/Global_Objects/Promise/any`,
    'abort-controller': `${mdnBase}API/AbortController`,
    'abort-signal': `${mdnBase}API/AbortSignal`,
    'intersection-observer': `${mdnBase}API/Intersection_Observer_API`,
    'resize-observer': `${mdnBase}API/Resize_Observer_API`,
    'mutation-observer': `${mdnBase}API/MutationObserver`,
    'performance-observer': `${mdnBase}API/PerformanceObserver`,
    'broadcast-channel': `${mdnBase}API/Broadcast_Channel_API`,
    'message-channel': `${mdnBase}API/Channel_Messaging_API`,
    'indexeddb': `${mdnBase}API/IndexedDB_API`,
    'localstorage': `${mdnBase}API/Window/localStorage`,
    'sessionstorage': `${mdnBase}API/Window/sessionStorage`,
    'web-workers': `${mdnBase}API/Web_Workers_API`,
    'shared-worker': `${mdnBase}API/SharedWorker`,
    'service-worker': `${mdnBase}API/Service_Worker_API`,
    'webgl': `${mdnBase}API/WebGL_API`,
    'webgl2': `${mdnBase}API/WebGL2RenderingContext`,
    'web-audio': `${mdnBase}API/Web_Audio_API`,
    'geolocation': `${mdnBase}API/Geolocation_API`,
    'device-orientation': `${mdnBase}API/Device_orientation_events`,
    'device-motion': `${mdnBase}API/DeviceMotionEvent`,
    'vibration': `${mdnBase}API/Vibration_API`,
    'battery-status': `${mdnBase}API/Battery_Status_API`,
    'network-information': `${mdnBase}API/Network_Information_API`,
    'permissions': `${mdnBase}API/Permissions_API`,
    'notifications': `${mdnBase}API/Notifications_API`,
    'push-notifications': `${mdnBase}API/Push_API`,
    'credential-management': `${mdnBase}API/Credential_Management_API`,
    'web-authn': `${mdnBase}API/Web_Authentication_API`,
    'file-api': `${mdnBase}API/File_API`,
    'filereader': `${mdnBase}API/FileReader`,
    'blob': `${mdnBase}API/Blob`,
    'formdata': `${mdnBase}API/FormData`,
    'url-api': `${mdnBase}API/URL`,
    'urlsearchparams': `${mdnBase}API/URLSearchParams`,
    'streams': `${mdnBase}API/Streams_API`,
    'readable-stream': `${mdnBase}API/ReadableStream`,
    'writable-stream': `${mdnBase}API/WritableStream`,
    'transform-stream': `${mdnBase}API/TransformStream`,
    'text-encoder': `${mdnBase}API/TextEncoder`,
    'text-decoder': `${mdnBase}API/TextDecoder`,
    'crypto-api': `${mdnBase}API/Web_Crypto_API`,
    'crypto-subtle': `${mdnBase}API/SubtleCrypto`,
    'intl': `${mdnBase}JavaScript/Reference/Global_Objects/Intl`,
    'intl-collator': `${mdnBase}JavaScript/Reference/Global_Objects/Intl/Collator`,
    'intl-datetimeformat': `${mdnBase}JavaScript/Reference/Global_Objects/Intl/DateTimeFormat`,
    'intl-numberformat': `${mdnBase}JavaScript/Reference/Global_Objects/Intl/NumberFormat`,
    'intl-pluralrules': `${mdnBase}JavaScript/Reference/Global_Objects/Intl/PluralRules`,
    'intl-relativetimeformat': `${mdnBase}JavaScript/Reference/Global_Objects/Intl/RelativeTimeFormat`,
    'intl-listformat': `${mdnBase}JavaScript/Reference/Global_Objects/Intl/ListFormat`,
    'intl-locale': `${mdnBase}JavaScript/Reference/Global_Objects/Intl/Locale`,
    'intl-displaynames': `${mdnBase}JavaScript/Reference/Global_Objects/Intl/DisplayNames`,
    'intl-segmenter': `${mdnBase}JavaScript/Reference/Global_Objects/Intl/Segmenter`,
    'bigint': `${mdnBase}JavaScript/Reference/Global_Objects/BigInt`,
    'nullish-coalescing': `${mdnBase}JavaScript/Reference/Operators/Nullish_coalescing`,
    'optional-chaining': `${mdnBase}JavaScript/Reference/Operators/Optional_chaining`,
    'logical-assignment': `${mdnBase}JavaScript/Reference/Operators/Logical_AND_assignment`,
    'numeric-separators': `${mdnBase}JavaScript/Reference/Lexical_grammar#numeric_separators`,
    'private-fields': `${mdnBase}JavaScript/Reference/Classes/Private_class_fields`,
    'private-methods': `${mdnBase}JavaScript/Reference/Classes/Private_class_fields#private_methods`,
    'static-blocks': `${mdnBase}JavaScript/Reference/Classes/Static_initialization_blocks`,
    'class-static-initialization-blocks': `${mdnBase}JavaScript/Reference/Classes/Static_initialization_blocks`,
    'page-visibility': `${mdnBase}API/Page_Visibility_API`,
    'fullscreen': `${mdnBase}API/Fullscreen_API`,
    'pointer-lock': `${mdnBase}API/Pointer_Lock_API`,
    'screen-orientation': `${mdnBase}API/Screen_Orientation_API`,
    'history-api': `${mdnBase}API/History_API`,
    'structured-clone': `${mdnBase}API/structuredClone`,
  };

  // Check if we have a direct mapping
  if (featureMap[feature]) {
    return featureMap[feature];
  }

  // Try to generate Can I Use URL for common patterns
  const caniuseFeatures = [
    'css-grid', 'flexbox', 'css-variables', 'css-custom-properties',
    'css-backdrop-filter', 'css-container-queries', 'css-has',
    'css-nesting', 'css-subgrid', 'dialog', 'web-components',
    'shadow-dom', 'custom-elements', 'fetch', 'websockets',
    'service-worker', 'web-workers', 'indexeddb', 'webgl',
    'web-audio', 'geolocation', 'notifications'
  ];

  if (caniuseFeatures.includes(feature)) {
    return `${caniuseBase}${feature}`;
  }

  // For CSS features, try MDN CSS reference
  if (feature.startsWith('css-')) {
    const cssProperty = feature.replace('css-', '').replace(/-/g, '_');
    return `${mdnBase}CSS/${cssProperty}`;
  }

  // For HTML input types
  if (feature.startsWith('input-')) {
    const inputType = feature.replace('input-', '');
    return `${mdnBase}HTML/Element/input/${inputType}`;
  }

  // For ES features
  if (feature.startsWith('es') && (feature.includes('2015') || feature.includes('2016') || feature.includes('2017') || feature.includes('2018') || feature.includes('2019') || feature.includes('2020') || feature.includes('2021') || feature.includes('2022') || feature.includes('2023') || feature.includes('2024'))) {
    return `${mdnBase}JavaScript/New_in_JavaScript`;
  }

  // Default fallback - return null if no mapping found
  return null;
};

export const getFeatureDisplayName = (feature: string): string => {
  // Convert kebab-case to Title Case for better display
  return feature
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};