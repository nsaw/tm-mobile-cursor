declare global {
  var global: any;
  var window: any;
  var performance: any;
  type NodeTimeout = ReturnType<typeof setTimeout>;
}

export {}; 