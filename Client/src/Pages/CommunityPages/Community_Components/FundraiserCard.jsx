// app/components/reusable/FundraiserCard.jsx

export default function FundraiserCard({ campaign }) {
  // Calculates the progress percentage, ensuring it doesn't exceed 100%
  const progressPercentage = Math.min((campaign.currentAmount / campaign.goalAmount) * 100, 100).toFixed(0);

  return (
    <div className="bg-white rounded-2xl p-6 shadow-xl flex flex-col justify-between transition-transform duration-200 hover:scale-[1.02]">
      <div>
        {/* The campaign title uses the vibrant orange color */}
        <h2 className="text-2xl font-bold text-[#FF6B35] text-center">{campaign.title}</h2>
        <p className="mt-4 text-gray-600">{campaign.story}</p>
        <div className="my-4">
          {/* Progress bar with the vibrant teal color */}
          <div className="w-full bg-gray-200 rounded-full h-5">
            <div
              className="bg-[#4ECDC4] h-5 rounded-full text-xs flex items-center justify-center text-white font-bold transition-all duration-500"
              style={{ width: `${progressPercentage}%` }}
            >
              {progressPercentage}%
            </div>
          </div>
          <p className="text-center mt-2 text-sm text-gray-500">
            <strong>Goal:</strong> ${campaign.goalAmount} (Raised: ${campaign.currentAmount})
          </p>
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gray-800">Items Needed:</h3>
        <ul className="list-disc list-inside text-left space-y-1">
          {campaign.itemsNeeded.map((item, index) => (
            // The checkmark and list items are colored with the vibrant teal
            <li key={index} className="text-gray-700">
              <span className="text-[#4ECDC4] font-bold">✔️</span> {item}
            </li>
          ))}
        </ul>
      </div>
      <div className="mt-6 text-center">
        <button className="bg-[#FF6B35] text-white font-bold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg transform active:scale-95 hover:bg-[#e65a2d]">
          Donate Now
        </button>
      </div>
    </div>
  );
}
