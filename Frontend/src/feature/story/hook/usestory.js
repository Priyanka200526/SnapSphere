import { useContext } from "react";
import { StoryContext } from "../context/story.context.jsx";
import {
    uploadStoryApi,
    getStoriesFeedApi,
    viewStoryApi,
    getStoryViewersApi
} from "../service/story.api.js";

export const useStory = () => {

    const {
        stories, setStories,
        selectedStory, setSelectedStory
    } = useContext(StoryContext);

    async function handleUploadStory(file) {
        try {
            const data = await uploadStoryApi(file);

            setStories(prev => [data.story, ...prev]);

            return data.story;

        } catch (err) {
            console.log(err);
        }
    }

    async function handleGetStoriesFeed() {
        try {
            const data = await getStoriesFeedApi();
            setStories(data.stories);
            return data.stories;
            console.log(data);
            
        } catch (err) {
            console.log(err);
        }
    }

    async function handleViewStory(storyId) {
        try {

            await viewStoryApi(storyId);

        } catch (err) {
            console.log(err);
        }
    }

    async function handleGetStoryViewers(storyId) {
        try {

            const data = await getStoryViewersApi(storyId);
            console.log(data);
            

            return data.views;

        } catch (err) {
            console.log(err);
        }
    }

    return {
        stories,
        setStories,
        selectedStory,
        setSelectedStory,
        handleUploadStory,
        handleGetStoriesFeed,
        handleViewStory,
        handleGetStoryViewers
    };
};