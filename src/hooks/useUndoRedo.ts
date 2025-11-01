/**
 * Undo/Redo Hook for Resume State Management
 * 
 * Features:
 * - Maintains history stack (last 50 changes)
 * - Keyboard shortcuts (Ctrl/Cmd+Z for undo, Ctrl/Cmd+Shift+Z for redo)
 * - Debounced state tracking to avoid storing every keystroke
 * - Clear history on template switch
 * 
 * @module useUndoRedo
 */

import { useEffect, useRef, useCallback } from 'react';
import { Resume } from '../types/resume.types';

const MAX_HISTORY_SIZE = 50;
const DEBOUNCE_DELAY = 500; // ms

interface UndoRedoState {
    past: Resume[];
    present: Resume;
    future: Resume[];
}

interface UseUndoRedoReturn {
    canUndo: boolean;
    canRedo: boolean;
    undo: () => void;
    redo: () => void;
    clearHistory: () => void;
    recordState: (state: Resume) => void;
}

/**
 * Custom hook for undo/redo functionality
 */
export const useUndoRedo = (
    currentState: Resume,
    setState: (state: Resume) => void
): UseUndoRedoReturn => {
    const historyRef = useRef<UndoRedoState>({
        past: [],
        present: currentState,
        future: [],
    });

    const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const isUndoRedoActionRef = useRef(false);
    const lastTemplateRef = useRef(currentState.template);

    // Update present state when current state changes (but not during undo/redo)
    useEffect(() => {
        if (isUndoRedoActionRef.current) {
            isUndoRedoActionRef.current = false;
            return;
        }

        // Clear history if template changed
        if (lastTemplateRef.current !== currentState.template) {
            lastTemplateRef.current = currentState.template;
            historyRef.current = {
                past: [],
                present: currentState,
                future: [],
            };
            return;
        }

        // Debounce state recording to avoid storing every keystroke
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            recordState(currentState);
        }, DEBOUNCE_DELAY);

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [currentState]);

    // Record a new state in history
    const recordState = useCallback((state: Resume) => {
        const { past, present } = historyRef.current;

        // Don't record if state hasn't actually changed
        if (JSON.stringify(present) === JSON.stringify(state)) {
            return;
        }

        const newPast = [...past, present];

        // Limit history size
        if (newPast.length > MAX_HISTORY_SIZE) {
            newPast.shift();
        }

        historyRef.current = {
            past: newPast,
            present: state,
            future: [], // Clear future when new state is recorded
        };
    }, []);

    // Undo action
    const undo = useCallback(() => {
        const { past, present, future } = historyRef.current;

        if (past.length === 0) {
            return;
        }

        const previous = past[past.length - 1];
        const newPast = past.slice(0, past.length - 1);

        historyRef.current = {
            past: newPast,
            present: previous,
            future: [present, ...future],
        };

        isUndoRedoActionRef.current = true;
        setState(previous);
    }, [setState]);

    // Redo action
    const redo = useCallback(() => {
        const { past, present, future } = historyRef.current;

        if (future.length === 0) {
            return;
        }

        const next = future[0];
        const newFuture = future.slice(1);

        historyRef.current = {
            past: [...past, present],
            present: next,
            future: newFuture,
        };

        isUndoRedoActionRef.current = true;
        setState(next);
    }, [setState]);

    // Clear history
    const clearHistory = useCallback(() => {
        historyRef.current = {
            past: [],
            present: currentState,
            future: [],
        };
    }, [currentState]);

    // Keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
            const ctrlKey = isMac ? e.metaKey : e.ctrlKey;

            // Undo: Ctrl/Cmd+Z
            if (ctrlKey && e.key === 'z' && !e.shiftKey) {
                e.preventDefault();
                undo();
            }

            // Redo: Ctrl/Cmd+Shift+Z
            if (ctrlKey && e.key === 'z' && e.shiftKey) {
                e.preventDefault();
                redo();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [undo, redo]);

    const canUndo = historyRef.current.past.length > 0;
    const canRedo = historyRef.current.future.length > 0;

    return {
        canUndo,
        canRedo,
        undo,
        redo,
        clearHistory,
        recordState,
    };
};
