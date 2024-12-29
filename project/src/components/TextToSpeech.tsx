import React, { useState, useEffect } from 'react';
import { Volume2, Play, Pause, Settings, Globe } from 'lucide-react';

interface Voice {
  name: string;
  lang: string;
}

export default function TextToSpeech() {
  const [text, setText] = useState('');
  const [voices, setVoices] = useState<Voice[]>([]);
  const [selectedVoice, setSelectedVoice] = useState<string>('');
  const [rate, setRate] = useState(1);
  const [pitch, setPitch] = useState(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [synth] = useState(window.speechSynthesis);

  useEffect(() => {
    const loadVoices = () => {
      const availableVoices = synth.getVoices().map(voice => ({
        name: voice.name,
        lang: voice.lang
      }));
      setVoices(availableVoices);
      setSelectedVoice(availableVoices[0]?.name || '');
    };

    loadVoices();
    if (speechSynthesis.onvoiceschanged !== undefined) {
      speechSynthesis.onvoiceschanged = loadVoices;
    }
  }, [synth]);

  const handleSpeak = () => {
    if (synth.speaking) {
      synth.cancel();
      setIsPlaying(false);
      return;
    }

    if (text) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.voice = synth.getVoices().find(voice => voice.name === selectedVoice) || null;
      utterance.rate = rate;
      utterance.pitch = pitch;

      utterance.onend = () => setIsPlaying(false);
      utterance.onerror = () => setIsPlaying(false);

      synth.speak(utterance);
      setIsPlaying(true);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-800 flex items-center justify-center gap-3">
          <Volume2 className="w-8 h-8" />
          Text to Speech
        </h1>
        <p className="text-gray-600 mt-2">Convert your text into natural-sounding speech</p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6">
        <textarea
          className="w-full h-40 p-4 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          placeholder="Enter your text here..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="space-y-4">
            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Globe className="w-4 h-4" /> Voice Selection
              </label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                value={selectedVoice}
                onChange={(e) => setSelectedVoice(e.target.value)}
              >
                {voices.map((voice) => (
                  <option key={voice.name} value={voice.name}>
                    {voice.name} ({voice.lang})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Settings className="w-4 h-4" /> Speech Rate: {rate}x
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={rate}
                onChange={(e) => setRate(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>

            <div>
              <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                <Settings className="w-4 h-4" /> Pitch: {pitch}
              </label>
              <input
                type="range"
                min="0.5"
                max="2"
                step="0.1"
                value={pitch}
                onChange={(e) => setPitch(Number(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>

          <div className="flex items-center justify-center">
            <button
              onClick={handleSpeak}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-5 h-5 mr-2" /> Stop
                </>
              ) : (
                <>
                  <Play className="w-5 h-5 mr-2" /> Speak
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}