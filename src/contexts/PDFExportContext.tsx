import React, { createContext, useContext, useRef } from 'react';

interface PDFExportContextType {
    previewRef: React.RefObject<HTMLDivElement>;
}

const PDFExportContext = createContext<PDFExportContextType | undefined>(undefined);

export const PDFExportProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const previewRef = useRef<HTMLDivElement>(null);

    return (
        <PDFExportContext.Provider value={{ previewRef }}>
            {children}
        </PDFExportContext.Provider>
    );
};

export const usePDFExportContext = () => {
    const context = useContext(PDFExportContext);
    if (!context) {
        throw new Error('usePDFExportContext must be used within PDFExportProvider');
    }
    return context;
};
