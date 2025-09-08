import { VisaRequirement } from '@/types';

export const visaRequirements: VisaRequirement[] = [
  {
    country: 'United States',
    width: 35,
    height: 45,
    backgroundColor: 'white',
    headHeight: 70,
    notes: 'Head must be between 25-35mm from chin to top of head'
  },
  {
    country: 'United Kingdom',
    width: 35,
    height: 45,
    backgroundColor: 'white',
    headHeight: 70,
    notes: 'Must be taken against a plain light grey or cream background'
  },
  {
    country: 'Canada',
    width: 35,
    height: 45,
    backgroundColor: 'white',
    headHeight: 70,
    notes: 'Head must measure 31-36mm from chin to crown'
  },
  {
    country: 'Australia',
    width: 35,
    height: 45,
    backgroundColor: 'white',
    headHeight: 70,
    notes: 'Head must be 32-36mm from bottom of chin to top of head'
  },
  {
    country: 'Germany',
    width: 35,
    height: 45,
    backgroundColor: 'white',
    headHeight: 70,
    notes: 'Biometric passport photo requirements'
  },
  {
    country: 'France',
    width: 35,
    height: 45,
    backgroundColor: 'white',
    headHeight: 70,
    notes: 'Must comply with ICAO standards'
  },
  {
    country: 'Japan',
    width: 35,
    height: 45,
    backgroundColor: 'white',
    headHeight: 70,
    notes: 'Photo must be taken within 6 months'
  },
  {
    country: 'China',
    width: 33,
    height: 48,
    backgroundColor: 'white',
    headHeight: 70,
    notes: 'Specific size requirements for Chinese visa'
  },
  {
    country: 'India',
    width: 35,
    height: 45,
    backgroundColor: 'white',
    headHeight: 70,
    notes: 'Must be recent and show full face'
  },
  {
    country: 'Singapore',
    width: 35,
    height: 45,
    backgroundColor: 'white',
    headHeight: 70,
    notes: 'Standard passport photo size'
  }
];

export const getVisaRequirement = (country: string): VisaRequirement | undefined => {
  return visaRequirements.find(req => req.country === country);
};