export type DraggableEndEvent = CustomEvent & {
    to: Element;
    from: Element;
    item: Element;
    clone: Element;

    oldIndex: number;
    newIndex: number;

    oldDraggableIndex: number;
    newDraggableIndex: number;

    originalEvent: DragEvent;

    pullMode?: boolean;

    [key: string]: unknown;
};
