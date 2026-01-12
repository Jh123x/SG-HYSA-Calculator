import Profile from "../types/profile";

export interface InputArg<Type> {
  label: Readonly<string>;
  tooltip: Readonly<string>;
  fn: (profile: Profile, value: Type) => Profile;
  getStateFromProfile: (profile: Profile) => Type;
}

export interface Field<Type> {
  label: string;
  onChange: (v: Type | "") => void;
  value: Type | "";
  tooltip?: string;
  key: string;
}
