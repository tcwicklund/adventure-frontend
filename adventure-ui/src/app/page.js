"use client";

import { useState } from "react";
import axios from "axios";

export default function Home() {
  const [genre, setGenre] = useState("");
  const [title, setTitle] = useState("");
  const [story, setStory] = useState("");
  const [choice, setChoice] = useState("");
  const [nextChoices, setNextChoices] = useState([]);

  const base_api_url = "https://super-waffle-x5prrjrg7rv3rr-8000.app.github.dev/"
  const genres = ["Fantasy", "Sci-Fi", "Mystery", "Adventure", "Romance"];
  const titles = {
    Fantasy: ["The Enchanted Vale", "Dragonheart", "Whispers of Elara"],
    "Sci-Fi": ["Stars Beyond Tomorrow", "Galactic Drift", "Neon Horizon"],
    Mystery: ["Shadows in the Fog", "The Vanishing Note", "Whispered Secrets"],
    Adventure: ["Jungle Quest", "Lost Temple", "Island of Fire"],
    Romance: ["Letters to Skye", "Autumn Kisses", "The Paris Secret"]
  };

  const handleStart = async (selectedTitle) => {
    setTitle(selectedTitle);
    const res = await axios.get(base_api_url + "/generate/first-section", {
      params: { title: selectedTitle }
    });
    const storyText = res.data.story;
    setStory(storyText);
    extractChoices(storyText);
  };

  const handleNext = async () => {
    const res = await axios.post(base_api_url + "/generate/next-section", {
      previous_story: story,
      selected_option: choice
    });
    const nextStory = res.data.story;
    setStory(nextStory);
    extractChoices(nextStory);
    setChoice("");
  };

  const extractChoices = (text) => {
    const lines = text.split("\n").filter(line => line.trim().startsWith("1."));
    setNextChoices(lines);
  };

  return (
    <main className="p-6 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Choose Your Own Adventure</h1>

      {!title && (
        <div>
          <h2 className="text-xl font-semibold">Pick a Genre:</h2>
          <div className="flex gap-2 flex-wrap my-4">
            {genres.map((g) => (
              <button key={g} onClick={() => setGenre(g)} className="px-4 py-2 bg-blue-500 text-white rounded-xl">
                {g}
              </button>
            ))}
          </div>
          {genre && (
            <div>
              <h3 className="text-lg font-semibold">Pick a Title:</h3>
              <div className="flex gap-2 flex-wrap my-4">
                {titles[genre].map((t) => (
                  <button key={t} onClick={() => handleStart(t)} className="px-4 py-2 bg-green-500 text-white rounded-xl">
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {story && (
        <div>
          <h2 className="text-xl font-semibold mb-2">{title}</h2>
          <div className="bg-gray-100 p-4 rounded-xl whitespace-pre-wrap mb-4">
            {story}
          </div>
          <div className="mb-4">
            <h3 className="font-semibold">Choose Your Path:</h3>
            {nextChoices.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => setChoice(opt)}
                className={`block my-2 px-4 py-2 border rounded-xl w-full text-left ${choice === opt ? "bg-blue-200" : "bg-white"}`}
              >
                {opt}
              </button>
            ))}
          </div>
          {choice && (
            <button onClick={handleNext} className="px-4 py-2 bg-purple-600 text-white rounded-xl">
              Continue the Story
            </button>
          )}
        </div>
      )}
    </main>
  );
}
