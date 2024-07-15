"use client"
import { useEffect, useRef, useState } from "react";

export enum RecordingStatus {
    RECORDING = "RECORDING",
    STOPPED = "STOPPED",
}

export function useSpeechRecognition() {
    const [text, setText] = useState("");
    const [status, setStatus] = useState(RecordingStatus.STOPPED);
    const [recognition, setRecognition] = useState<any>();

    const beginRecording = async () => {
        if (recognition !== null) {
            recognition.start();
        }
    };
    const stopRecording = async () => {
        if (recognition !== null) {
            recognition.stop();
        }
    };
    const changeLanguage = async (lang: string) => {
        if (recognition !== null) {
            recognition.lang = lang;
        }
    }

    useEffect(() => {
        if (window !== undefined && recognition === null) {

            const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
            if (typeof SpeechRecognition !== "undefined" && recognition === null) {
                const recognition = new SpeechRecognition();
                recognition.onresult = (event: any) => {

                    var _text = "";
                    for (const res of event.results) {
                        _text += "\n" + res[0].transcript.trim();
                    }

                    setText(_text.trim());

                };
                recognition.continuous = true;
                recognition.interimResults = true;
                recognition.onstart = () => { setStatus(RecordingStatus.RECORDING); };
                recognition.onend = () => { setStatus(RecordingStatus.STOPPED); };
                setRecognition(recognition);
            }
        }
    }, [recognition]);



    return { text, status, beginRecording, stopRecording, changeLanguage };
}