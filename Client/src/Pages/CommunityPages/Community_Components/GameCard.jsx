import Link from 'next/link';

export default function GameCard({ game, onApplyClick, onChatClick }) {
  // Format the date and time for better readability
  const gameDate = new Date(game.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  const gameTime = new Date(game.date).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    // Main card container with rounded corners, a subtle shadow, and a clean white background
    <div className="bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-shadow duration-300 transform hover:-translate-y-1 flex flex-col justify-between border border-gray-100">
      <div className="text-center">
        {/* Sport title with bold font */}
        <h2 className="text-3xl font-extrabold text-gray-900 mb-2">{game.sport}</h2>
        <p className="mt-2 text-gray-700 font-medium">
          <strong>Location:</strong> {game.location}
        </p>
        <p className="text-gray-700 font-medium">
          <strong>Date:</strong> {gameDate} at {gameTime}
        </p>
        {/* Highlight the spots available with a teal-colored badge */}
        <div className="inline-block mt-4 px-4 py-2 bg-[#4ECDC4]/20 text-[#4ECDC4] font-bold rounded-full text-sm">
          Spots Open: {game.spotsAvailable}
        </div>
      </div>
      
      {/* Container for the action buttons with responsive spacing */}
      <div className="mt-6 flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
        {/* Main call-to-action button with a bright orange background */}
        <button
          onClick={onApplyClick}
          className="w-full bg-[#FF6B35] text-white font-bold py-3 px-6 rounded-full shadow-md hover:bg-[#E05C2B] transition-all duration-300"
        >
          Request to Join
        </button>

        {/* Admin button for a secondary action, styled with a less dominant look */}
        <Link 
          href={`/game-admin/${game._id}`} 
          className="w-full text-center bg-gray-100 text-gray-800 font-bold py-3 px-6 rounded-full shadow-md hover:bg-gray-200 transition-all duration-300"
        >
          Admin
        </Link>
        
        {/* Chat button with a refreshing teal background */}
        <button
          onClick={onChatClick}
          className="w-full bg-[#4ECDC4] text-white font-bold py-3 px-6 rounded-full shadow-md hover:bg-[#43B8B0] transition-all duration-300"
        >
          Let's Chat
        </button>
      </div>
    </div>
  );
}
