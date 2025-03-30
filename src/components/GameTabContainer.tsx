import { useState } from "react";
// Child Components
import Controls from "./Controls.jsx";
import Highscores from "./Highscores.jsx";
import Options from "./Options.jsx";
import UserForm from "./UserForm.jsx";

/* Container component for each sidetab */

export default function GameTabContainer({
  captionText,
  scores,
}: //fetchHighscores,
{
  captionText: string;
  scores?: any[];
  //fetchHighscores: () => void;
}) {
  const [open, setOpen] = useState(false);

  // Click handler to toggle open state on box caption
  const openBox = () => setOpen(!open);

  // gameTabs object will point to appropriate content
  // based on captionText string as key
  const gameTabs = {
    Controls: <Controls />,
    Highscores: <Highscores scores={scores || []} />,
    Options: <Options remoteOpen={openBox} />,
    "Log In": <UserForm />,
  };
  // Add to gameTabs object with title of component as key

  const mainClassNames = `sidetab ${open ? "open" : "closed"}`;

  return (
    <main className={mainClassNames}>
      <h3 className="box-title" onClick={openBox}>
        {captionText}
      </h3>
      {gameTabs[captionText as keyof typeof gameTabs]}
    </main>
  );
}
