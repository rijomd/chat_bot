import { ReactNode } from "react";

export type MenuItem = {
    id: number;
    icon: ReactNode;
    label: string;
    desc: string;
    color: string;
    bg: string;
    text: string;
}

export type Position = {
    x: number | null;
    y: number | null;
}

export type DragState = {
    px: number;
    py: number;
    ox: number;
    oy: number;
}