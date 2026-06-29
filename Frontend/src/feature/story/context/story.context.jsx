import { createContext, useState } from "react";

export const StoryContext = createContext();

export const StoryProvider = ({ children }) => {

    const [stories, setStories] = useState([]);
    const [selectedStory, setSelectedStory] = useState(null);

    return (
        <StoryContext.Provider
            value={{
                stories,
                setStories,
                selectedStory,
                setSelectedStory
            }}
        >
            {children}
        </StoryContext.Provider>
    );
};