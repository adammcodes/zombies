import React, { useState } from "react";
import { sceneEvents } from "../phaser/utils/SceneEvents";

import "./Options.css";
interface OptionsProps {
  remoteOpen: () => void;
}

interface GameOptions {
  disabled: boolean;
  avatar: "player-m" | "player-f";
  gameMode: "easy" | "normal" | "hard";
}

export default function Options({ remoteOpen }: OptionsProps) {
  const [sound, setSound] = useState(false);
  const [options, setOptions] = useState<GameOptions>({
    disabled: false,
    avatar: "player-m",
    gameMode: "normal",
  });

  const toggleSound = () => {
    setSound(!sound);
    sceneEvents.emit("toggle-sound");
  };

  // select onChange handler for avatar selection
  const selectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setOptions({
      ...options,
      avatar: event.target.value as GameOptions["avatar"],
    });
  };

  /* --- Phaser <-> React event listeners and emitters --- */

  // open/close <Options/> container
  // when <Options> is clicked from the Phaser startMenu.js scene
  sceneEvents.on("toggle-options", () => {
    remoteOpen();
  });

  sceneEvents.on("toggle-enable-options", () => {
    // Disable save, avatar, and mode elements if not on startMenu screen
    setOptions({
      ...options,
      disabled: !options.disabled,
    });
  });

  // Emit save-options event on Save button click
  const saveOptions = () => {
    sceneEvents.emit("save-options", options);
  };

  return (
    <div className="options-grid">
      {/* Sound Option */}
      <div className="option-row">
        <label className="option-label">Sound</label>
        <div className="option-input">
          <input
            type="checkbox"
            name="sound"
            onClick={toggleSound}
            defaultChecked={sound}
          />
        </div>
      </div>

      {/* Avatar Option */}
      <div className="option-row">
        <label className="option-label">Avatar</label>
        <div className="option-input">
          <select
            className="option-select"
            name="avatar"
            onChange={selectChange}
            value={options.avatar}
            disabled={options.disabled}
          >
            <option id="male" value="player-m">
              Boy
            </option>
            <option id="female" value="player-f">
              Girl
            </option>
          </select>
        </div>
      </div>

      {/* Mode Option */}
      <div className="option-row">
        <label className="option-label">Mode</label>
        <div className="option-input">
          <select
            className="option-select"
            name="gameMode"
            defaultValue="normal"
            disabled
          >
            <option id="easy" value="easy">
              Easy
            </option>
            <option id="normal" value="normal">
              Normal
            </option>
            <option id="hard" value="hard">
              Hard
            </option>
          </select>
        </div>
      </div>

      <div className="option-footer">
        <div className="divider">--------------------------------</div>
        <button
          onClick={saveOptions}
          disabled={options.disabled}
          style={{
            backgroundColor: options.disabled ? "gray" : "green",
            color: "white",
          }}
        >
          Save
        </button>
      </div>
    </div>
  );
}
