import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { format, differenceInDays } from 'date-fns'

// Tailwind class merger
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Format trip dates: "25–27 Apr" or "25 Apr – 2 May"
export function formatTripDates(startDate: string, endDate: string): string {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const sameMonth = start.getMonth() === end.getMonth()

  if (sameMonth) {
    return `${format(start, 'd')}–${format(end, 'd MMM')}`
  }
  return `${format(start, 'd MMM')} – ${format(end, 'd MMM')}`
}

// Trip duration in nights
export function tripNights(startDate: string, endDate: string): number {
  return differenceInDays(new Date(endDate), new Date(startDate))
}

// Spots left label
export function spotsLabel(spotsTotal: number, spotsTaken: number): string {
  const left = spotsTotal - spotsTaken
  if (left === 0) return 'Full'
  if (left === 1) return '1 spot left'
  return `${left} spots left`
}

// Avatar initials from name
export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}

// Australian states list
export const AU_STATES = [
  { value: 'VIC', label: 'Victoria' },
  { value: 'NSW', label: 'New South Wales' },
  { value: 'QLD', label: 'Queensland' },
  { value: 'WA',  label: 'Western Australia' },
  { value: 'SA',  label: 'South Australia' },
  { value: 'TAS', label: 'Tasmania' },
  { value: 'ACT', label: 'ACT' },
  { value: 'NT',  label: 'Northern Territory' },
]

// Vibe colour map
export const VIBE_STYLES: Record<string, { bg: string; text: string; dot: string }> = {
  Chill:           { bg: 'bg-green-100',  text: 'text-green-800',  dot: 'bg-green-500' },
  Adventure:       { bg: 'bg-orange-100', text: 'text-orange-800', dot: 'bg-orange-500' },
  Family:          { bg: 'bg-blue-100',   text: 'text-blue-800',   dot: 'bg-blue-500' },
  'Solo-friendly': { bg: 'bg-purple-100', text: 'text-purple-800', dot: 'bg-purple-500' },
}
