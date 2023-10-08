"use client";

import React, { useEffect } from "react";
// @ts-ignore
import { experimental_useFormState as useFormState } from "react-dom";
import { youtubeVideoDownloadAction } from "../actions";
import { SubmitButton } from "./common/SubmitButton";

interface DownloadVideoProps {
    format: {
        itag: number;
    };
    videoLink: string;
    title: string
}
export default function DownloadVideo({
    format,
    videoLink,
    title
}: DownloadVideoProps) {
    const [state, formAction] = useFormState(youtubeVideoDownloadAction, {});

    useEffect(() => {
        if (state.videoDownloadPath) {
            console.log(state.videoDownloadPath);
            const link = document.createElement("a");
            link.href = state.videoDownloadPath;
            link.download = title;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }, [title, state.videoDownloadPath]);

    console.log(state);
    

    return (
        <form action={formAction}>
            <input type="text" name="itag" hidden value={format.itag} readOnly />
            <input type="text" name="videoLink" hidden value={videoLink} readOnly />
            <SubmitButton className="px-2 bg-red-600" text="Download" />
        </form>
    );
}
