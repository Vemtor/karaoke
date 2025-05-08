import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import SongText from "@/types/SongText"; // Adjust the import path as necessary
import SongTextContextType from "@/types/SongTextContextType";

const SongTextContext = createContext<SongTextContextType | undefined>(undefined);

export const SongTextProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [songText, setSongText] = useState<SongText | null>(null);

    // No need to fetch initial data here.  The context is now designed to be updated
    // externally, presumably by songManager.ts.

    const contextValue = {
        songText,
        setSongText,
    };

    return (
        <SongTextContext.Provider value={contextValue}>
            {children}
        </SongTextContext.Provider>
    );
};

export const useSongText = (): SongTextContextType => {
    const context = useContext(SongTextContext);
    if (!context) {
        throw new Error("useSongText must be used within a SongTextProvider");
    }
    return context;
};
