import React from "react";

type Props = {
    children: string;
};

const Divider = ({ children }: Props) => {
    return (
        <div className="relative flex py-3 items-center">
            <div className="flex-grow border-t border-gray-400" />
            <span className="flex-shrink mx-4 text-gray-400">{children}</span>
            <div className="flex-grow border-t border-gray-400" />
        </div>
    );
};

export default Divider;
