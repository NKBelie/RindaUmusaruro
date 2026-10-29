export type Role = "farmer" | "officer" | "admin";
export interface Farm {
  id: string;
  name: string;
  crop: string;
  area: number;
  district: string;
  province: string;
  sector: string;
  village: string;
  planted: string;
  harvest: string;
  soil: string;
  irrigation: string;
  gps: string;
  stage: string;
  image: string;
}
export interface Report {
  id: string;
  farmId: string;
  crop: string;
  issue: string;
  date: string;
  status: string;
  note: string;
  advice?: string;
  image?: string;
}
export interface Notice {
  id: string;
  title: string;
  body: string;
  category: string;
  read: boolean;
}
export interface Harvest {
  id: string;
  farmId: string;
  area: number;
  yield: number;
  actual: number;
  date: string;
}
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: Role;
  district: string;
  province?: string;
  sector?: string;
  village?: string;
  language?: string;
}
export interface Visit {
  id: string;
  farmer: string;
  date: string;
  note: string;
}
export interface Store {
  farms: Farm[];
  reports: Report[];
  notices: Notice[];
  harvests: Harvest[];
  users: User[];
  visits: Visit[];
  observations: { id: string; farmId: string; note: string; date: string }[];
}
