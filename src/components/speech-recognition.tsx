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
    const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder>();

    const [chunks, setChunks] = useState<Blob[]>([]);
    const [audio, setAudio] = useState<string>();
    const [stream, setStream] = useState<MediaStream>();

    const beginRecording = async () => {
        if (recognition !== null) {
            recognition.start();


            const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            const mediaRecorder = new MediaRecorder(stream);

            mediaRecorder.ondataavailable = (e) => chunks.push(e.data);
            mediaRecorder.onstop = (e) => {
                const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' })
                setChunks([])
                setAudio(URL.createObjectURL(blob))

                console.log("Reached here");
            };

            setStream(stream);
            setMediaRecorder(mediaRecorder);

            mediaRecorder?.start();
        }
    };

    const stopRecording = async () => {
        if (recognition !== null) {
            recognition.stop();
            mediaRecorder?.stop();

            stream?.getTracks().forEach(track => track.stop());
        }
    };
    const changeLanguage = async (lang: string) => {
        if (recognition !== null) {
            recognition.lang = lang;
        }
    }

    useEffect(() => {

        async function runner() {
            if (window !== undefined) {

                const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
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
        runner();

    }, []);

    return { text, status, beginRecording, stopRecording, changeLanguage, audio, chunks };
}