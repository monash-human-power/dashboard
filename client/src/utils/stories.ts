export type StoryTemplate<T> = ((a: T) => JSX.Element) & { args: T };

<<<<<<< HEAD
export const addArgs = <T>(f: ((a: T) => JSX.Element)): StoryTemplate<T> =>
    Object.assign(f, { args: {} as T });

export const createStory = <T>(templateFunc: StoryTemplate<T>, args: T) => {
    const story = templateFunc.bind({});
    story.args = args;
    return story;
=======
export const addArgs = <T>(f: (a: T) => JSX.Element): StoryTemplate<T> =>
  Object.assign(f, { args: {} as T });

export const createStory = <T>(templateFunc: StoryTemplate<T>, args: T) => {
  const story = templateFunc.bind({});
  story.args = args;
  return story;
>>>>>>> master
};
