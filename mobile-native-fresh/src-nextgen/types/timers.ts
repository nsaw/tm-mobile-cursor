export type TimerHandle = ReturnType<typeof setTimeout>;
export const delay = (ms: number)=> new Promise(res=>setTimeout(res,ms)); 