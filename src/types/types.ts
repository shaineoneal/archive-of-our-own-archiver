

/**
 * The `PropsWithChildren` type is used to define a component's props that include children elements.
 * @property {JSX.Element | JSX.Element[]} children - The `children` property is a special prop in
 * React that allows you to pass components or elements as children to a parent component. It can
 * accept a single JSX element or an array of JSX elements. This is commonly used to create reusable
 * and flexible components that can render different content based on their children.
 */
export type PropsWithChildren = {
    children: JSX.Element | JSX.Element[];
};
