import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export enum FileMimeType {
  "image/png" = "PNG",
  "image/jpeg" = "JPEG",
  "image/jpg" = "JPG",
  "image/gif" = "GIF",
  "image/svg+xml" = "SVG",
  "image/webp" = "WEBP",
  "application/pdf" = "PDF",
  "application/msword" = "DOC",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document" = "DOCX",
  "application/vnd.ms-excel" = "XLS",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" = "XLSX",
  "application/vnd.ms-powerpoint" = "PPT",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation" = "PPTX",
  "text/csv" = "CSV",
  "text/plain" = "TXT",
  "text/markdown" = "MD",
}

export enum ContentType {
  "document" = "DOCUMENT",
  "webpage" = "WEBPAGE",
  "video" = "VIDEO",
  "link" = "LINK",
  "qanda" = "Q&A",
  "content" = "CONTENT"
}

export const getRandomInt = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export const getAvatar = (index: number) => {
  // eğer index 0 ile 9 arasında ise
  if (index >= 0 && index <= 8) {
    return `/images/avatars/0${index + 1}.webp`;
  }
  // eğer index 10 ile 19 arasında ise
  else if (index >= 9 && index <= 19) {
    return `/images/avatars/${index + 1}.webp`;
  }
};