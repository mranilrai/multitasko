"use client";

// @ts-ignore
import { experimental_useFormState as useFormState } from "react-dom";
import {youtubeVideoFormatsAction} from "../actions";
import { SubmitButton } from "./common/SubmitButton";
import DownloadVideo from "./DownloadVideo";

const initialState = {
  message: null,
  title: "",
  embed: null,
  formats: [],
};

export default function YTVideoInfo() {
  const [state, formAction] = useFormState(
    youtubeVideoFormatsAction,
    initialState
  );

  return (
    <div className="max-w-2xl w-full mx-auto">
      <div className="px-4">
        <label
          className="w-full text-center block font-medium text-3xl mb-6"
          htmlFor=""
        >
          <h1>Download Youtube Video</h1>
        </label>

        <form className="sm:flex" action={formAction}>
          <input
            className="w-full text-gray-700 focus:outline-none focus:ring focus:border-purple p-4 rounded-xl"
            placeholder="Enter Youtube Video Link"
            type="text"
            name="videoLink"
            required
          />
          <SubmitButton
            className="mt-4 w-full text-center sm:mt-0 sm:w-56 sm:ml-2 outline-none focus:outline-none focus:ring focus:border-purple bg-red-600 py-4 px-4 rounded-xl xs"
            text="Download"
          />
          {state?.message && (
            <p className="text-red-500 mt-4">{state?.message}</p>
          )}
          <p aria-live="polite" className="sr-only">
            {state?.message}
          </p>
        </form>
      </div>

      {(state?.embed || state?.title || state?.formats?.length > 0) && (
        <div className="sm:flex mt-10 p-2 border border-gray-800">
          {state?.embed && (
            <iframe
              src={state.embed.iframeUrl}
              width={state.embed.width / 3}
              height={state.embed.height / 3}
              className="w-full sm:w-auto border border-gray-800"
            ></iframe>
          )}
          <div className="sm:pl-2 flex-1">
            {state?.title && (
              <h2 className="mt-4 text-lg font-semibold sm:mt-0">
                {state.title}
              </h2>
            )}
            {state?.formats?.length > 0 ? (
              <ul className="w-full mt-5 border-gray-800">
                {state?.formats?.map((format: any) => (
                  <li
                    key={format.itag}
                    className="flex w-full border border-gray-800"
                  >
                    <a
                      className="p-2 flex justify-between w-full"
                      href={format.url}
                    >
                      {format.qualityLabel.split("p")[0]}.
                      {String(format.mimeType.split(";")[0]).split("/")[1]}
                      <DownloadVideo title={state.title} format={format} videoLink={state.videoLink} />
                    </a>
                  </li>
                ))}
              </ul>
            ) : (
              <p>No download options available for this video</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
