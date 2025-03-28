import "./Highscores.css";

interface Game {
  game_id: string;
  username: string;
  score: number;
}

export default function Highscores({ scores }: { scores: Game[] }) {
  // Show loading indicator here until highscores have been retrieved ...

  // parse scores data into grid items
  const scoreRows = scores.map((game) => {
    return (
      <div className="score-row" key={game.game_id}>
        <div className="score-username">{game.username}</div>
        <div className="score-value">{game.score}</div>
      </div>
    );
  });

  return <div className="highscores-grid">{scoreRows}</div>;
}
