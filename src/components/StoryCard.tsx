import React, { useState, useEffect } from 'react';
import { useStoryStore } from '../store/useStoryStore';
import ShareMenu from './ShareMenu';
import { ChartNoAxesColumn, MessageSquare } from 'lucide-react';
import { useInView } from '../hooks/useInView';
import clsx from 'clsx'; //A utility for dynamically combining class names based on conditions, arrays, or objects

interface StoryProps {
    id: string;
    category: string;
    subCategory: string;
    insider: string;
    location: string;
    timeAgo: string;
    title: string;
    content: string;
    views: number; // for counting views
    comments?: number;
    selectedReaction: string | null;
    onReactionSelect: (storyId: string, reaction: string) => void;
    reactions?: { [key: string]: number };
}

const defaultReactions = {
    'Relatable': 0,
    'I also feel this': 0,
    'Brave': 0,
    'Thought-Provoking': 0,
    'Support': 0,
};

export default function StoryCard({
    id,
    category,
    subCategory,
    insider,
    location,
    timeAgo,
    title,
    content,
    views = 0, //initial views is 0
    comments = 0,
    reactions = defaultReactions,
}: StoryProps) {
    const [isExpanded, setIsExpanded] = useState(false);
    const contentRef = React.useRef<HTMLDivElement>(null);
    const [shouldShowReadMore, setShouldShowReadMore] = useState(false);
    const [contentHeight, setContentHeight] = useState(0);
    const [maxCharacters, setMaxCharacters] = useState(window.innerWidth > 769 ? 300 : 150);
    const toggleReaction = useStoryStore(state => state.toggleReaction);
    const incrementViews = useStoryStore(state => state.incrementViews);

    // Use intersection observer to track when story is in view
    const { elementRef, hasBeenViewed } = useInView({
        threshold: 0.5, // Element is considered visible when 50% is in view
    });

    // Only increment views once when the story comes into view
    useEffect(() => {
        if (hasBeenViewed) {
            incrementViews(id);
        }
    }, [hasBeenViewed, id]);

    const handleReactionClick = async (reaction: string) => {
        try {
            await toggleReaction(id, reaction);
        } catch (error) {
            console.error('Error toggling reaction:', error);
        }
    };

    // Calculate content height to determine if we need the Read More button

    useEffect(() => {
        if (contentRef.current) {
            const height = contentRef.current.scrollHeight;
            setContentHeight(height);
            setShouldShowReadMore(height > 100);
        }
    }, [content]);

    const stripHTML = (data: String) => {
        // replace p, br and li tags with \n
        const newLineRegex = /<p\s*[\/]?>|<br\s*[\/]?>|<li\s*[\/]?>/gi;
        data = data.replace(newLineRegex, '\n');

        // remove data from a tags (embed preview data)
        const linkDataRegex = /<a([^>]*?)>(.*?)[\s\S]*?<\/a>/gi;
        data = data.replace(linkDataRegex, '');

        // strip all remaining tags, links
        const htmlTagsRegex = /(<([^>]+)>)/gi;
        const linksRegex =
            /^(((https)?(http)?(ftp)?:\/\/))?([A-Za-z0-9-]{1,}[.])?[A-Za-z0-9-]{1,}[.][A-Za-z]{2,}([\/][A-Za-z0-9\/]{1,}(.[A-Za-z%0-9-=+&()]{1,})?)?([?][A-Za-z0-9=\/&_\()\-%+.]{1,})?(.[a-zA-Z0-9]{1,})?(\/{1})?/gim;
        data = data.replace(htmlTagsRegex, '').replace(linksRegex, '').trim();

        // check for multiple line breaks and replace with \n
        const multipleLineBreaksRegex = /[\n]{2,}/gi;
        data = data.replace(multipleLineBreaksRegex, '\n');

        // check for multiple spaces and replace with single space
        const spaceRegex = /&nbsp;|&ensp;|&emsp;/gi;
        const multipleSpaceRegex = /\s{2,}/g;
        data = data.replace(spaceRegex, ' ').replace(multipleSpaceRegex, ' ');

        return data;
    };

    const renderDescription = () => {
        if (shouldShowReadMore) {
            let strippedContent = stripHTML(content);
            let description = strippedContent.length > maxCharacters ? strippedContent.substring(0, maxCharacters) : strippedContent;

            return (
                <p
                    className="break-words"
                    onClick={() => {
                        setShouldShowReadMore(false);
                        setIsExpanded(true);
                    }}
                >
                    {description}

                    {
                        strippedContent.length > maxCharacters &&
                        <span
                            className="text-gray-500 text-sm mt-1 underline font-bold cursor-pointer"
                        >
                            ...more
                        </span>
                    }
                </p>
            )
        }
        else {
            return (
                <div
                    ref={contentRef}
                    className={clsx(
                        "prose max-w-none transition-all duration-300",
                        !isExpanded && "line-clamp-3"
                    )}
                    dangerouslySetInnerHTML={{ __html: content }}
                />
            )
        }
    }

    return (
        <article className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 sm:p-6 mb-4 sm:mb-6 max-w-full" ref={elementRef}>
            <div className="flex flex-row sm:flex-row sm:justify-between items-start mb-4">
                <div className="flex-1 min-w-0">
                    <div className="text-sm text-gray-600 font-medium break-words ">
                        {category} · {subCategory}
                    </div>
                    <div className="text-sm text-gray-500 break-words">
                        Insider: {insider} · {location}
                    </div>
                </div>
                <div className="flex items-center gap-2 mt-2 sm:mt-0">
                    <span className="text-sm text-gray-500">{timeAgo}</span>
                    {/* <ShareMenu storyId={id} title={title} content={content} /> */}
                </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-semibold mb-4 break-words">{title}</h2>

            {renderDescription()}

            <div className="mt-6 space-y-4">
                <div className="flex flex-wrap gap-2">
                    {Object.entries(defaultReactions).map(([reactionType]) => (
                        <button
                            key={reactionType}
                            onClick={() => handleReactionClick(reactionType)}
                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                        >
                            {reactionType}
                            <span className="ml-2">{reactions[reactionType] || 0}</span>
                        </button>
                    ))}
                </div>
                {/* The down part buttons of the story card */}
                <div className="grid grid-cols-3 border-t pt-4 text-gray-600">
                    <div className="flex items-center justify-center gap-1.5 hover:text-gray-900">
                        <ChartNoAxesColumn className="w-4 h-4" />
                        <span className="text-sm font-medium">{views.toLocaleString()} views</span>
                    </div>

                    <button className="flex items-center justify-center gap-1.5 hover:text-gray-900 font-medium">
                        <MessageSquare className="w-4 h-4" />
                        <span className="text-sm"> {comments} Comments</span>
                    </button>

                    <div className="relative flex items-center justify-center">
                        <ShareMenu storyId={id} title={title} content={content} />
                    </div>

                </div>
            </div>
        </article>
    );
}
