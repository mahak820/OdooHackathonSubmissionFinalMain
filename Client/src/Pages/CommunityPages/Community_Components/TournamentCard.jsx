// app/components/reusable/TournamentCard.jsx

export default function TournamentCard({ tournament, onApplyClick, isApplied }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl text-center flex flex-col justify-between transition-transform duration-200 hover:scale-[1.02]">
      <div>
        {/* The tournament name uses the vibrant orange color for an energetic feel */}
        <h2 className="text-2xl font-bold text-[#FF6B35]">{tournament.name}</h2>
        {/* Category tags or other highlights can use the teal color */}
        <p className="mt-2 text-gray-700"><strong>Sport:</strong> <span className="font-semibold text-[#4ECDC4]">{tournament.sport}</span></p>
        <p className="text-gray-700"><strong>Dates:</strong> {tournament.startDate} to {tournament.endDate}</p>
        <p className="mt-4 text-gray-600">{tournament.description}</p>
      </div>
      <div className="mt-6">
        <button
          onClick={onApplyClick}
          disabled={isApplied}
          className={`font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg transform active:scale-95 ${
            isApplied
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-[#FF6B35] text-white hover:bg-[#e65a2d]' // Updated vibrant orange button color
          }`}
        >
          {isApplied ? 'Applied' : 'Apply Now'}
        </button>
      </div>
    </div>
  );
}
