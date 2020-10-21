export type StoryTemplate<T> = ((a: T) => JSX.Element) & { args: T };

export const createStory = <T>(templateFunc: StoryTemplate<T>, args: T) => {
    const story = templateFunc.bind({});
    story.args = args;
    return story;
};
