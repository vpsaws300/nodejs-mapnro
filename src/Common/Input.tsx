import React from "react";

type Props = {
    onChange: (e: any) => void;
    full?: boolean;
    type: "number" | "text" | "file";
    value: any;
    placeholder: string;
};

const Input = ({ onChange, value, type, full, placeholder }: Props) => {
    return (
        <input
            className={`shadow appearance-none border rounded ${
                full ? "w-full" : "w-24"
            } py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline mb-1`}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={(e) => onChange(e)}
        />
    );
};

export default Input;
