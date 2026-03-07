import React, { useState, useRef, useEffect } from "react";

import { menuItems } from "@/icons/icons";
import { DragState, Position } from "@/types/button";

export const AIButton = () => {
    const [open, setOpen] = useState<boolean>(false);
    const [pos, setPos] = useState<Position>({ x: null, y: null });
    const [dragging, setDragging] = useState<boolean>(false);
    const [hasMoved, setHasMoved] = useState<boolean>(false);
    const [activeItem, setActiveItem] = useState<number | null>(null);
    const [pulse, setPulse] = useState<boolean>(true);

    const btnRef = useRef<HTMLDivElement>(null);
    const dragStart = useRef<DragState | null>(null);
    const posRef = useRef<Position>(pos);

    // Sync ref to avoid closure staleness in event listeners
    posRef.current = pos;

    useEffect(() => {
        const timer = setTimeout(() => setPulse(false), 4000);
        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        if (pos.x === null) {
            const w = window.innerWidth;
            const h = window.innerHeight;
            setPos({ x: w - 80, y: h - 160 });
        }
    }, [pos.x]);

    const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
        // Check for nulls to satisfy TypeScript
        if (posRef.current.x === null || posRef.current.y === null) return;

        dragStart.current = {
            px: e.clientX,
            py: e.clientY,
            ox: posRef.current.x,
            oy: posRef.current.y,
        };
        setDragging(true);
        setHasMoved(false);
    };

    useEffect(() => {
        if (!dragging || !dragStart.current) return;

        const onMove = (e: PointerEvent) => {
            if (!dragStart.current) return;

            const dx = e.clientX - dragStart.current.px;
            const dy = e.clientY - dragStart.current.py;

            if (Math.abs(dx) > 4 || Math.abs(dy) > 4) setHasMoved(true);

            const newX = Math.max(28, Math.min(window.innerWidth - 28, dragStart.current.ox + dx));
            const newY = Math.max(28, Math.min(window.innerHeight - 28, dragStart.current.oy + dy));

            setPos({ x: newX, y: newY });
            if (open) setOpen(false);
        };

        const onUp = () => setDragging(false);

        window.addEventListener("pointermove", onMove);
        window.addEventListener("pointerup", onUp);

        return () => {
            window.removeEventListener("pointermove", onMove);
            window.removeEventListener("pointerup", onUp);
        };
    }, [dragging, open]);

    const handleClick = () => {
        if (!hasMoved) setOpen((v) => !v);
    };

    const handleItemClick = (id: number) => {
        setActiveItem(id);
        setTimeout(() => {
            setActiveItem(null);
            setOpen(false);
        }, 600);
    };

    if (pos.x === null || pos.y === null) return null;

    const isLeft = pos.x < window.innerWidth / 2;

    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none w-full" >

            {open && (
                <div
                    className={`absolute pointer-events-auto z-40`}
                    style={{
                        left: isLeft ? pos.x + 28 : "auto",
                        right: isLeft ? "auto" : window.innerWidth - pos.x + 28,
                        bottom: window.innerHeight - pos.y + 8,
                        minWidth: 260,
                    }}
                >
                    <div
                        className="rounded-2xl overflow-hidden shadow-2xl border border-white/60"
                        style={{
                            background: "rgba(255,255,255,0.96)",
                            backdropFilter: "blur(20px)",
                            animation: "popIn 0.25s cubic-bezier(0.34,1.56,0.64,1)",
                        }}
                    >
                        {/* Header */}
                        <div className="px-4 pt-4 pb-3 flex items-center gap-2" style={{ background: "linear-gradient(135deg, #009f4f, #128C7E)" }}>
                            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                                <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z" /></svg>
                            </div>
                            <div>
                                <p className="text-white font-semibold text-sm">Meta AI</p>
                                <p className="text-green-200 text-xs">What can I help you with?</p>
                            </div>
                            <button onClick={() => setOpen(false)} className="ml-auto w-7 h-7 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors">
                                <svg viewBox="0 0 24 24" className="w-3.5 h-3.5 fill-white"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
                            </button>
                        </div>

                        {/* Options */}
                        <div className="p-2">
                            {menuItems.map((item, i) => (
                                <button
                                    key={item.id}
                                    onClick={() => handleItemClick(item.id)}
                                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200 text-left group ${activeItem === item.id ? item.bg + " scale-95" : "hover:bg-gray-50"}`}
                                    style={{ animation: `slideIn 0.2s ease ${i * 0.04}s both` } as React.CSSProperties}
                                >
                                    <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${item.color} flex items-center justify-center text-white shadow-sm group-hover:scale-110 transition-transform`}>
                                        {item.icon}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className={`text-sm font-semibold ${activeItem === item.id ? item.text : "text-gray-800"}`}>{item.label}</p>
                                        <p className="text-xs text-gray-400 truncate">{item.desc}</p>
                                    </div>
                                    {activeItem === item.id && (
                                        <svg viewBox="0 0 24 24" className={`w-4 h-4 ${item.text} flex-shrink-0`} fill="none" stroke="currentColor" strokeWidth="3"><path d="M5 12l5 5L20 7" /></svg>
                                    )}
                                </button>
                            ))}
                        </div>
                        <div className="px-4 py-2.5 border-t border-gray-100">
                            <p className="text-center text-xs text-gray-400">Powered by <span className="font-semibold text-gray-500">Meta AI</span></p>
                        </div>
                    </div>
                    {/* Arrow */}
                    <div
                        className="absolute w-3 h-3 bg-white border-b border-r border-gray-100 rotate-45"
                        style={{
                            bottom: -6,
                            left: isLeft ? 20 : "auto",
                            right: isLeft ? "auto" : 20,
                            boxShadow: "2px 2px 4px rgba(0,0,0,0.08)",
                        }}
                    />
                </div>
            )}

            <div
                ref={btnRef}
                onPointerDown={onPointerDown}
                onClick={handleClick}
                className="absolute pointer-events-auto z-50 select-none"
                style={{
                    left: pos.x - 28,
                    top: pos.y - 28,
                    width: 56,
                    height: 56,
                    cursor: dragging ? "grabbing" : "grab",
                    touchAction: "none",
                }}
            >
                {pulse && !open && (
                    <div className="absolute inset-0 rounded-full animate-ping" style={{ background: "rgba(7,94,84,0.3)" }} />
                )}
                {open && (
                    <div className="absolute -inset-2 rounded-full animate-pulse" style={{ background: "rgba(7,94,84,0.15)" }} />
                )}
                <div
                    className="w-14 h-14 rounded-full flex items-center justify-center shadow-2xl transition-transform duration-200"
                    style={{
                        background: "linear-gradient(135deg, #25D366, #128C7E)",
                        transform: open ? "scale(0.92) rotate(45deg)" : "scale(1) rotate(0deg)",
                        boxShadow: open ? "0 8px 30px rgba(7,94,84,0.5)" : "0 6px 24px rgba(37,211,102,0.45)",
                    }}
                >
                    {open ? (
                        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z" /></svg>
                    ) : (
                        <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
                            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 15v-4H7l5-8v4h4l-5 8z" />
                        </svg>
                    )}
                </div>
            </div>

            <style>{`
        @keyframes popIn {
          from { opacity: 0; transform: scale(0.85) translateY(8px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-8px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
        </div>
    );
}