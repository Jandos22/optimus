export interface Exemption {
  Title: string;
  Details: string;
  Exemption_Number: string;
  Exemption_ID: number;
  ValidTo: string;
  Groups: string;
  Location: string;
}

export interface ExemptionGroup {
  Title: string;
  Location: string;
}

export interface ExemptionsGrouped {
  group: string;
  exemptions: Exemption[];
}

export interface ExemptionsRaw {
  Title: string;
  Details: string;
  Exemption_Number: string;
  Exemption_ID: number;
  ValidTo: Date;
  Groups: string;
  Location: string;
}
