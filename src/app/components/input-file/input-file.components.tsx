import React, { useRef } from "react"
import { Fab } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";

interface InputFileProps {
    onChange: (file: File) => void;
    label: string;
}

const InputFile: React.FC<InputFileProps> = ({ onChange, label }) => {
    const inputRef = useRef<HTMLInputElement | null> (null);

    const handleClick = () => {
        if(inputRef && inputRef.current) {
            inputRef.current.click();
        }
    }

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        if(event.target.files && event.target.files.length) {
            onChange(event.target.files[0]);
        }
    }

    return (
        <label htmlFor="input-file">
            <input
                ref={inputRef}
                style={{ display: 'none' }}
                id="input-file"
                name="input-file"
                type="file"
                onChange={handleChange}
            />
            <Fab
                color="primary"
                size="large"
                component="span"
                aria-label="add"
                variant="extended"
                onClick={handleClick}
            >
                <AddIcon /> {label}
            </Fab>
        </label>);
}

export default InputFile;