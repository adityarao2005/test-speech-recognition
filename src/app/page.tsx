"use client"
import { useState } from "react";
import { RecordingStatus, useSpeechRecognition } from "@/components/speech-recognition";

enum Language {
	ENGLISH = "en-US",
	CHINESE = "cmn-Hans-CN"
}

function getEnumKeys<
	T extends string,
	TEnumValue extends string | number,
>(enumVariable: { [key in T]: TEnumValue }) {
	return Object.keys(enumVariable) as Array<T>;
}

export default function Home() {
	const { text, status, beginRecording, stopRecording, changeLanguage, audio } = useSpeechRecognition();
	const [lang, setLang] = useState(Language.ENGLISH);

	const onClick = async () => {
		if (status === RecordingStatus.STOPPED) {
			beginRecording();
		} else {
			stopRecording();
		}
	};

	const changLang = async (lang: string) => {
		setLang(lang as Language);
		changeLanguage(lang);
	};

	return (
		<div className='flex flex-row w-full h-screen py-10'>
			<div className="basis-1/6"></div>
			<div className='flex flex-col basis-2/3 space-y-5'>
				<h1 className="text-2xl font-bold">Test Speech Recognition API</h1>
				<div className="flex-1"></div>
				<p>Language: {lang}</p>
				<select className="border-2 rounded border-black" value={lang} onChange={e => changLang(e.target.value)}>
					{getEnumKeys(Language).map((key, index) => (
						<option key={index} value={Language[key]}>
							{key}
						</option>
					))}
				</select>
				<p>Status: {status.toString()}</p>

				<div>Audio:
					<audio controls={true} src={audio}></audio>
				</div>

				<button onClick={onClick} className="rounded border-black border-2">
					{status == RecordingStatus.STOPPED ? "Click Me to Record" : "Click Me to Stop Recording"}
				</button>
				<textarea readOnly={true} value={text} className="border-black border rounded basis-1/2"></textarea>
			</div>
			<div className="basis-1/6"></div>
		</div >

	);
}
