export interface VisaRequirement {
  country: string;
  width: number; // in mm
  height: number; // in mm
  backgroundColor: string;
  headHeight?: number; // percentage of photo height
  notes?: string;
}

export interface PhotoState {
  originalPhoto: string | null;
  processedPhoto: string | null;
  croppedPhoto: string | null;
  finalLayout: string | null;
  selectedCountry: VisaRequirement | null;
}

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}