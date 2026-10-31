export interface PlateState {
  /** Displayable URL (signed URL, local object URL, or /samples path) */
  photoUrl: string;
  /** Storage path inside `plates` bucket, if uploaded */
  photoPath?: string;
  ageMonths: number;
  groups: string[];
  source: 'live' | 'demo';
  tomorrowUrl?: string | null;
  /** Short food list for tomorrow-plate prompt, e.g. "rice, dal, potato" */
  photoDescription?: string;
  /** Foods the AI saw (names) — matched to static nutrition data in code */
  foods?: { name: string; group: string }[];
}

const KEY = 'pushtiplate:plate';

export function setPlate(state: PlateState) {
  sessionStorage.setItem(KEY, JSON.stringify(state));
}
export function getPlate(): PlateState | null {
  try {
    const raw = sessionStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as PlateState) : null;
  } catch {
    return null;
  }
}

const AGE_KEY = 'pushtiplate:age';
export function getAge(): number {
  return Number(localStorage.getItem(AGE_KEY) ?? 12) || 12;
}
export function setAge(age: number) {
  localStorage.setItem(AGE_KEY, String(age));
}

const DEMO_KEY = 'pushtiplate:demo';
export function isDemo() {
  return localStorage.getItem(DEMO_KEY) === '1';
}
export function setDemo(on: boolean) {
  localStorage.setItem(DEMO_KEY, on ? '1' : '0');
}
